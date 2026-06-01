// Current entitlement for a user, read from the `subscriptions` table that the
// Stripe webhook keeps in sync. RLS lets a user read only their own row, so the
// regular (cookie-scoped) server client is enough here.
import { createClient } from "@/lib/supabase/server";

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
