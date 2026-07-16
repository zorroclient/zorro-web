// Current entitlement for a user, read from the `subscriptions` table that the
// Stripe webhook keeps in sync. RLS lets a user read only their own row, so the
// regular (cookie-scoped) server client is enough here.
import type Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { planForPriceId } from "@/lib/billing";

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

// A change the user has queued in the Stripe billing portal that hasn't taken
// effect yet — a pending cancellation, or an interval downgrade scheduled for
// period end (a Stripe "subscription schedule"). Read live from Stripe so it's
// always accurate without storing schedule state ourselves.
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

export async function getPendingChange(userId: string): Promise<PendingChange> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("subscriptions")
      .select("stripe_subscription_id")
      .eq("user_id", userId)
      .maybeSingle();

    const subId = data?.stripe_subscription_id as string | undefined;
    if (!subId) return null;

    const stripe = getStripe();
    const sub = await stripe.subscriptions.retrieve(subId);

    // Pending cancellation takes priority over a scheduled switch. The portal
    // may express it as cancel_at_period_end OR a concrete cancel_at timestamp.
    if (sub.cancel_at_period_end || sub.cancel_at) {
      return { kind: "cancel", at: toIso(sub.cancel_at ?? subPeriodEnd(sub)) };
    }

    // Scheduled interval downgrade → find the upcoming phase and its price.
    const scheduleId =
      typeof sub.schedule === "string" ? sub.schedule : sub.schedule?.id;
    if (scheduleId) {
      const schedule = await stripe.subscriptionSchedules.retrieve(scheduleId);
      const now = Math.floor(Date.now() / 1000);
      const next = schedule.phases.find((p) => p.start_date > now);
      const nextPrice = next?.items?.[0]?.price;
      const priceId =
        typeof nextPrice === "string" ? nextPrice : nextPrice?.id;
      if (next && priceId) {
        return {
          kind: "switch",
          plan: planForPriceId(priceId),
          at: toIso(next.start_date),
        };
      }
    }

    return null;
  } catch (err) {
    // Never let a Stripe hiccup break the account page — but log it so a
    // misconfiguration doesn't fail silently.
    console.error("getPendingChange failed:", err);
    return null;
  }
}
