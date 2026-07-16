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

function hasReturnOrigin(returnUrl: string | undefined, origin: string): boolean {
  if (!returnUrl) return false;

  try {
    return new URL(returnUrl).origin === new URL(origin).origin;
  } catch {
    return false;
  }
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
    const origin = requestOrigin(request);

    // Reuse an open session for this user and plan. This keeps React remounts,
    // refreshes, and impatient double-clicks from generating abandoned carts.
    // Never reuse a session created on another origin: its return URL might
    // otherwise send a production checkout back to localhost (or vice versa).
    // Include completed/expired sessions too so a new idempotency key can be
    // chained from the customer's most recent checkout attempt.
    const recentSessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 20,
    });
    const reusable = recentSessions.data.find(
      (session) =>
        session.status === "open" &&
        session.mode === "subscription" &&
        session.ui_mode === "elements" &&
        session.metadata?.supabase_user_id === user.id &&
        session.metadata?.plan === plan.id &&
        hasReturnOrigin(session.return_url, origin) &&
        session.client_secret,
    );

    if (reusable?.client_secret) {
      return response({ clientSecret: reusable.client_secret });
    }

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
        // Both sides of a simultaneous race see the same previous session and
        // therefore use the same key. Once a session completes or expires, its
        // ID becomes the predecessor for a genuinely fresh checkout.
        idempotencyKey: `zorro-elements-${user.id}-${plan.id}-after-${recentSessions.data[0]?.id ?? "first"}`,
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
