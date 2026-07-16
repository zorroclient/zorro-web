import type { NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { planForPriceId } from "@/lib/billing";

// Signature verification needs the raw body + Node crypto, so force the Node
// runtime and never cache/prerender this handler.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const stripe = getStripe();
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    return new Response(`Invalid signature: ${(err as Error).message}`, {
      status: 400,
    });
  }

  try {
    await handleEvent(stripe, event);
  } catch (err) {
    console.error("Stripe webhook handler failed:", err);
    return new Response("Handler error", { status: 500 });
  }

  return Response.json({ received: true });
}

async function handleEvent(stripe: Stripe, event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription" || !session.subscription) break;
      const subId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id;
      const sub = await stripe.subscriptions.retrieve(subId);
      await upsertSubscription(sub, session.client_reference_id ?? undefined);
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      await upsertSubscription(event.data.object as Stripe.Subscription);
      break;
    }
    default:
      break;
  }
}

// `current_period_end` lives on the subscription item in newer Stripe API
// versions and at the top level in older ones — read whichever is present.
function periodEnd(sub: Stripe.Subscription): string | null {
  const item = sub.items?.data?.[0] as { current_period_end?: number } | undefined;
  const ts =
    item?.current_period_end ??
    (sub as unknown as { current_period_end?: number }).current_period_end;
  return ts ? new Date(ts * 1000).toISOString() : null;
}

async function upsertSubscription(
  sub: Stripe.Subscription,
  fallbackUserId?: string,
) {
  const userId =
    (sub.metadata?.supabase_user_id as string | undefined) ?? fallbackUserId;
  if (!userId) {
    console.warn(`Subscription ${sub.id} has no supabase_user_id; skipping.`);
    return;
  }

  const priceId = sub.items.data[0]?.price.id ?? null;
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  const admin = createAdminClient();
  const { error } = await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id,
      plan: priceId ? planForPriceId(priceId) : null,
      status: sub.status,
      current_period_end: periodEnd(sub),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) throw error;
}
