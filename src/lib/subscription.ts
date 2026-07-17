import "server-only";

// Current entitlement for a user, read from the `subscriptions` table that the
// Stripe webhook keeps in sync. RLS lets a user read only their own row, so the
// regular (cookie-scoped) server client is enough here.
import type Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { planForPriceId } from "@/lib/billing";
import { getOwnedStripeSubscription } from "@/lib/stripe-subscription";

export type Subscription = {
  plan: string;
  status: string;
  renewsAt: string | null;
} | null;

// Statuses that count as "has access". `past_due` is intentionally excluded.
const ACTIVE_STATUSES = ["active", "trialing"];

export async function getSubscription(userId: string): Promise<Subscription> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  if (!ACTIVE_STATUSES.includes(data.status as string)) return null;

  return {
    plan: (data.plan as string) ?? "unknown",
    status: data.status as string,
    renewsAt: (data.current_period_end as string) ?? null,
  };
}

// A change that hasn't taken effect yet — a pending cancellation, or an
// interval downgrade scheduled for period end (a Stripe subscription
// schedule). Read live from Stripe so it stays accurate without storing
// schedule state ourselves.
export type PendingChange =
  | { kind: "cancel"; at: string | null }
  | { kind: "switch"; plan: string | null; at: string | null }
  | null;

// `current_period_end` lives on the subscription item in newer API versions and
// at the top level in older ones — read whichever is present.
function subPeriodEnd(sub: Stripe.Subscription): number | null {
  const item = sub.items?.data?.[0] as { current_period_end?: number } | undefined;
  return (
    item?.current_period_end ??
    (sub as unknown as { current_period_end?: number }).current_period_end ??
    null
  );
}

const toIso = (ts: number | null) =>
  ts ? new Date(ts * 1000).toISOString() : null;

async function pendingChangeForSubscription(
  sub: Stripe.Subscription,
): Promise<PendingChange> {
  // Pending cancellation takes priority over a scheduled switch. Stripe can
  // express it as cancel_at_period_end or a concrete cancel_at timestamp.
  if (sub.cancel_at_period_end || sub.cancel_at) {
    return { kind: "cancel", at: toIso(sub.cancel_at ?? subPeriodEnd(sub)) };
  }

  const scheduleId =
    typeof sub.schedule === "string" ? sub.schedule : sub.schedule?.id;
  if (!scheduleId) return null;

  const schedule = await getStripe().subscriptionSchedules.retrieve(scheduleId);
  const now = Math.floor(Date.now() / 1000);
  const next = schedule.phases.find((phase) => phase.start_date > now);
  const nextPrice = next?.items?.[0]?.price;
  const priceId = typeof nextPrice === "string" ? nextPrice : nextPrice?.id;

  return next && priceId
    ? {
        kind: "switch",
        plan: planForPriceId(priceId),
        at: toIso(next.start_date),
      }
    : null;
}

export async function getPendingChange(userId: string): Promise<PendingChange> {
  try {
    const owned = await getOwnedStripeSubscription(userId);
    return owned
      ? await pendingChangeForSubscription(owned.subscription)
      : null;
  } catch (err) {
    // Never let a Stripe hiccup break the account page — but log it so a
    // misconfiguration doesn't fail silently.
    console.error("getPendingChange failed:", err);
    return null;
  }
}

export type BillingSubscription = {
  plan: string;
  status: Stripe.Subscription.Status;
  currentPeriodEnd: string | null;
  cancelsAt: string | null;
  pendingChange: PendingChange;
  amount: number | null;
  currency: string | null;
  interval: Stripe.Price.Recurring.Interval | null;
  intervalCount: number | null;
};

// Presentation-safe billing data. Stripe customer/subscription identifiers and
// the full Stripe response never cross the Server Component boundary.
export async function getBillingSubscription(
  userId: string,
): Promise<BillingSubscription | null> {
  const owned = await getOwnedStripeSubscription(userId);
  if (!owned) return null;

  const { record, subscription } = owned;
  const item = subscription.items.data[0];
  let pendingChange: PendingChange = null;
  try {
    pendingChange = await pendingChangeForSubscription(subscription);
  } catch (error) {
    // A schedule lookup should not hide the subscription's core billing data.
    console.error("Loading the pending Stripe change failed:", error);
  }

  return {
    plan:
      (item?.price.id ? planForPriceId(item.price.id) : null) ??
      subscription.metadata?.plan ??
      record.plan ??
      "unknown",
    status: subscription.status,
    currentPeriodEnd: toIso(subPeriodEnd(subscription)),
    cancelsAt:
      pendingChange?.kind === "cancel" ? pendingChange.at : null,
    pendingChange,
    amount: item?.price.unit_amount ?? null,
    currency: item?.price.currency ?? null,
    interval: item?.price.recurring?.interval ?? null,
    intervalCount: item?.price.recurring?.interval_count ?? null,
  };
}
