// Read-only view of a user's current device (HWID/IP) binding for the account
// page. Reads the live `license_activations` row with the service-role client
// (RLS-restricted table). This is presentation-only for now — the actual reset
// + auto-bind-on-purchase lands when key activation moves to subscription auth.
import { createAdminClient } from "@/lib/supabase/admin";

export type DeviceBinding = {
  bound: boolean;
  lastSeenAt: string | null;
  activatedAt: string | null;
  country: string | null;
  asn: string | null;
};

export async function getDeviceBinding(
  userId: string,
): Promise<DeviceBinding | null> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("license_activations")
      .select("fingerprint_hash, first_asn, first_country, activated_at, last_seen_at")
      .eq("user_id", userId)
      .is("revoked_at", null)
      .order("activated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // license_activations isn't in the generated DB types, so the row comes
    // back untyped — narrow it here.
    const row = data as {
      fingerprint_hash: string | null;
      first_asn: string | null;
      first_country: string | null;
      activated_at: string | null;
      last_seen_at: string | null;
    } | null;
    if (!row) return null;

    return {
      bound: Boolean(row.fingerprint_hash),
      lastSeenAt: row.last_seen_at,
      activatedAt: row.activated_at,
      country: row.first_country,
      asn: row.first_asn,
    };
  } catch {
    return null;
  }
}
