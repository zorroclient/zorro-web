import { type NextRequest } from "next/server";
import { priceIdForPlan } from "@/lib/billing";
import { getPlan } from "@/lib/pricing";
import { getSubscription } from "@/lib/subscription";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { getOrCreateStripeCustomer } from "@/lib/stripe-customer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutRequest = {
  plan?: unknown;
};

function response(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function requestOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0];
  const host = forwardedHost ?? request.headers.get("host");
  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0];

  if (!host) return request.nextUrl.origin;
  return `${forwardedProto ?? request.nextUrl.protocol.replace(":", "")}://${host}`;
}

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === new URL(requestOrigin(request)).host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return response({ error: "Invalid request origin." }, 403);
  }

  let body: CheckoutRequest;
  try {
    body = (await request.json()) as CheckoutRequest;
  } catch {
    return response({ error: "Invalid request body." }, 400);
  }

  const planId = typeof body.plan === "string" ? body.plan : null;
  const plan = getPlan(planId);
  const priceId = plan ? priceIdForPlan(plan.id) : null;
  if (!plan || !priceId) {
    return response({ error: "Unknown subscription plan." }, 400);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return response({ error: "You need to sign in before checking out." }, 401);
  }

  if (await getSubscription(user.id)) {
    return response(
      {
        error: "You already have an active subscription.",
        redirectTo: "/account",
      },
      409,
    );
  }

  try {
    const stripe = getStripe();
    const customerId = await getOrCreateStripeCustomer(user);

    // Reuse an open session for this user and plan. This keeps React remounts,
    // refreshes, and impatient double-clicks from generating abandoned carts.
    const openSessions = await stripe.checkout.sessions.list({
      customer: customerId,
      status: "open",
      limit: 20,
    });
    const reusable = openSessions.data.find(
      (session) =>
        session.mode === "subscription" &&
        session.ui_mode === "elements" &&
        session.metadata?.supabase_user_id === user.id &&
        session.metadata?.plan === plan.id &&
        session.client_secret,
    );

    if (reusable?.client_secret) {
      return response({ clientSecret: reusable.client_secret });
    }

    const origin = requestOrigin(request);
    const session = await stripe.checkout.sessions.create(
      {
        ui_mode: "elements",
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        client_reference_id: user.id,
        metadata: { supabase_user_id: user.id, plan: plan.id },
        subscription_data: {
          metadata: { supabase_user_id: user.id, plan: plan.id },
        },
        allow_promotion_codes: true,
        return_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      },
      {
        // One create per user/plan/hour at most. The open-session lookup above
        // normally handles reuse; this key also closes simultaneous races.
        idempotencyKey: `zorro-elements-${user.id}-${plan.id}-${Math.floor(Date.now() / 3_600_000)}`,
      },
    );

    if (!session.client_secret) {
      throw new Error("Stripe did not return a Checkout Session client secret.");
    }

    return response({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Unable to create custom Checkout Session:", error);
    return response(
      { error: "Checkout could not be started. Please try again." },
      500,
    );
  }
}
