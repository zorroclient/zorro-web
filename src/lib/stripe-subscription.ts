import "server-only";

import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

type SubscriptionRecord = {
  plan: string | null;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
};

export type OwnedStripeSubscription = {
  record: SubscriptionRecord;
  subscription: Stripe.Subscription;
};

function customerId(subscription: Stripe.Subscription) {
  return typeof subscription.customer === "string"
    ? subscription.customer
    : subscription.customer.id;
}

// Loads the Stripe subscription through the signed-in user's RLS-scoped row,
// then verifies the Stripe customer and metadata before returning anything.
// Keep the full Stripe object in server-only code and project it to a safe DTO
// before sending data to a Client Component.
export async function getOwnedStripeSubscription(
  userId: string,
): Promise<OwnedStripeSubscription | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan, stripe_customer_id, stripe_subscription_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  const stripeCustomerId = data?.stripe_customer_id as string | undefined;
  const stripeSubscriptionId = data?.stripe_subscription_id as
    | string
    | undefined;
  if (!stripeCustomerId || !stripeSubscriptionId) return null;

  const subscription = await getStripe().subscriptions.retrieve(
    stripeSubscriptionId,
  );
  const metadataOwner = subscription.metadata?.supabase_user_id;

  if (
    customerId(subscription) !== stripeCustomerId ||
    (metadataOwner && metadataOwner !== userId)
  ) {
    throw new Error("Stripe subscription ownership check failed");
  }

  return {
    record: {
      plan: (data?.plan as string | null) ?? null,
      stripeCustomerId,
      stripeSubscriptionId,
    },
    subscription,
  };
}
