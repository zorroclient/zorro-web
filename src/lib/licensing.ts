import "server-only";

// Read-only, presentation-safe view of the subscription device binding. The
// fingerprint itself never leaves the server; the account page only needs to
// know whether a device is bound and when rebinding is available.
import { createClient } from "@/lib/supabase/server";

const REBIND_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

export type DeviceBinding = {
  bound: boolean;
  boundAt: string | null;
  lastRebindAt: string | null;
  nextRebindAt: string | null;
  canRebind: boolean;
};

export async function getDeviceBinding(
  userId: string,
): Promise<DeviceBinding | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("subscriptions")
      .select(
        "bound_fingerprint_hash, device_bound_at, last_rebind_at",
      )
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;

    const row = data as {
      bound_fingerprint_hash: string | null;
      device_bound_at: string | null;
      last_rebind_at: string | null;
    } | null;
    if (!row) return null;

    const lastRebindTime = row.last_rebind_at
      ? Date.parse(row.last_rebind_at)
      : Number.NaN;
    const nextRebindTime = Number.isFinite(lastRebindTime)
      ? lastRebindTime + REBIND_COOLDOWN_MS
      : null;
    const bound = Boolean(row.bound_fingerprint_hash);

    return {
      bound,
      boundAt: row.device_bound_at,
      lastRebindAt: row.last_rebind_at,
      nextRebindAt:
        nextRebindTime === null
          ? null
          : new Date(nextRebindTime).toISOString(),
      canRebind:
        bound && (nextRebindTime === null || nextRebindTime <= Date.now()),
    };
  } catch (error) {
    console.error("getDeviceBinding failed:", error);
    return null;
  }
}
