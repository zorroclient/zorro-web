import "server-only";

// Read-only, presentation-safe view of the subscription device binding. The
// fingerprint itself never leaves the server; the account page only receives
// binding dates and a human-readable system label.
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const REBIND_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

export type DeviceBinding = {
  bound: boolean;
  boundAt: string | null;
  lastRebindAt: string | null;
  nextRebindAt: string | null;
  canRebind: boolean;
  system: string | null;
};

function formatSystem(platform: string, architecture: string) {
  const normalizedPlatform = platform.trim().toLowerCase();
  const normalizedArchitecture = architecture.trim().toLowerCase();

  const platformLabel =
    normalizedPlatform === "windows"
      ? "Windows"
      : normalizedPlatform === "macos" || normalizedPlatform === "darwin"
        ? "macOS"
        : normalizedPlatform === "linux"
          ? "Linux"
          : platform.trim();
  const architectureLabel =
    normalizedArchitecture === "x86_64" || normalizedArchitecture === "amd64"
      ? "64-bit"
      : normalizedArchitecture === "aarch64" || normalizedArchitecture === "arm64"
        ? "ARM64"
        : architecture.trim();

  return [platformLabel, architectureLabel].filter(Boolean).join(" · ") || null;
}

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
    let system: string | null = null;

    if (row.bound_fingerprint_hash) {
      try {
        const admin = createAdminClient();
        const { data: session, error: sessionError } = await admin
          .from("desktop_sessions")
          .select("platform, architecture")
          .eq("user_id", userId)
          .eq("fingerprint_hash", row.bound_fingerprint_hash)
          .order("last_heartbeat_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (sessionError) throw sessionError;
        if (session) {
          system = formatSystem(session.platform, session.architecture);
        }
      } catch (error) {
        console.error("getDeviceBinding system lookup failed:", error);
      }
    }

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
      system,
    };
  } catch (error) {
    console.error("getDeviceBinding failed:", error);
    return null;
  }
}
