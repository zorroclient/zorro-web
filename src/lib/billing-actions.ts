"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { getOrCreateStripeCustomer } from "@/lib/stripe-customer";
import { priceIdForPlan } from "@/lib/billing";
import { getSubscription } from "@/lib/subscription";
import { getOwnedStripeSubscription } from "@/lib/stripe-subscription";
import { getResumeSubscriptionOperation } from "@/lib/subscription-cancellation";

const BILLING_PATH = "/account/billing";

async function originUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

// Starts Stripe Checkout for the given plan. Bound to a plan id and used as a
// <form action>. Redirects unauthenticated visitors to sign up first.
export async function createCheckoutSession(planId: string) {
  const priceId = priceIdForPlan(planId);
  if (!priceId) throw new Error(`Unknown plan: ${planId}`);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/signup?plan=${planId}`);

  // One subscription per user: if they already have an active plan, don't let
  // them start a second checkout. Stripe has no such toggle — this guard is
  // authoritative (covers the UI being bypassed, e.g. a direct form POST).
  // They manage the existing subscription from the account billing page.
  const existingSub = await getSubscription(user.id);
  if (existingSub) redirect("/account?error=already-subscribed");

  const stripe = getStripe();
  const customerId = await getOrCreateStripeCustomer(user);

  const origin = await originUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: user.id,
    metadata: { supabase_user_id: user.id, plan: planId },
    subscription_data: {
      metadata: { supabase_user_id: user.id, plan: planId },
    },
    allow_promotion_codes: true,
    success_url: `${origin}/account/download?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  redirect(session.url);
}

async function authenticatedSubscription() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  try {
    return await getOwnedStripeSubscription(user.id);
  } catch (error) {
    console.error("Could not load the owned Stripe subscription:", error);
    redirect(`${BILLING_PATH}?billing=error`);
  }
}

export async function scheduleSubscriptionCancellation() {
  const owned = await authenticatedSubscription();
  if (!owned) redirect(`${BILLING_PATH}?billing=no-subscription`);

  const { subscription } = owned;
  if (
    subscription.status === "canceled" ||
    subscription.status === "incomplete_expired"
  ) {
    redirect(`${BILLING_PATH}?billing=unavailable`);
  }

  if (subscription.cancel_at_period_end || subscription.cancel_at) {
    redirect(`${BILLING_PATH}?billing=cancellation-scheduled`);
  }

  try {
    await getStripe().subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });
  } catch (error) {
    console.error("Scheduling Stripe subscription cancellation failed:", error);
    redirect(`${BILLING_PATH}?billing=error`);
  }

  revalidatePath("/account");
  revalidatePath(BILLING_PATH);
  redirect(`${BILLING_PATH}?billing=cancellation-scheduled`);
}

export async function resumeSubscriptionRenewal() {
  const owned = await authenticatedSubscription();
  if (!owned) redirect(`${BILLING_PATH}?billing=no-subscription`);

  const { subscription } = owned;
  if (
    subscription.status === "canceled" ||
    subscription.status === "incomplete_expired"
  ) {
    redirect(`${BILLING_PATH}?billing=unavailable`);
  }

  if (!subscription.cancel_at_period_end && !subscription.cancel_at) {
    redirect(`${BILLING_PATH}?billing=resumed`);
  }

  try {
    const operation = getResumeSubscriptionOperation({
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelAt: subscription.cancel_at,
      scheduleId:
        typeof subscription.schedule === "string"
          ? subscription.schedule
          : (subscription.schedule?.id ?? null),
    });

    if (operation.kind === "subscription") {
      await getStripe().subscriptions.update(subscription.id, operation.params);
    } else if (operation.kind === "schedule") {
      await getStripe().subscriptionSchedules.update(
        operation.scheduleId,
        operation.params,
      );
    }
  } catch (error) {
    console.error("Resuming Stripe subscription renewal failed:", error);
    redirect(`${BILLING_PATH}?billing=error`);
  }

  revalidatePath("/account");
  revalidatePath(BILLING_PATH);
  redirect(`${BILLING_PATH}?billing=resumed`);
}
