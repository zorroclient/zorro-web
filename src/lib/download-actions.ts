"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSubscription } from "@/lib/subscription";

// How long a minted download URL stays valid. Short on purpose: the link is
// single-use in spirit and must not be shareable.
const SIGNED_URL_TTL_SECONDS = 60;
const RELEASES_BUCKET = "releases";

// The Storage object path lives in `windows_path`; older rows only have a full
// public `windows_url`. Derive the path from the URL as a fallback so this works
// before the release pipeline starts writing `windows_path`.
function objectPathFromUrl(url: string): string | null {
  // …/storage/v1/object/public/releases/windows/<ver>/<file>
  const marker = `/object/public/${RELEASES_BUCKET}/`;
  const i = url.indexOf(marker);
  if (i !== -1) return url.slice(i + marker.length);
  // Fall back to anything after the bucket name.
  const j = url.indexOf(`/${RELEASES_BUCKET}/`);
  return j !== -1 ? url.slice(j + RELEASES_BUCKET.length + 2) : null;
}

// Mints a short-lived signed download URL for the latest active release, gated
// on an active subscription, and records a download_events row. Used as a
// <form action>; redirects the browser straight to the signed URL.
export async function startDownload() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const subscription = await getSubscription(user.id);
  if (!subscription) redirect("/pricing");

  const admin = createAdminClient();

  // Latest active release. (Single channel for now; order by published_at.)
  const { data: release, error: releaseError } = await admin
    .from("app_releases")
    .select("version, channel, windows_path, windows_url")
    .eq("active", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (releaseError) throw releaseError;
  if (!release) throw new Error("No active release is available.");

  const path =
    release.windows_path ??
    (release.windows_url ? objectPathFromUrl(release.windows_url) : null);
  if (!path) {
    throw new Error(`Release ${release.version} has no resolvable storage path.`);
  }

  const { data: signed, error: signError } = await admin.storage
    .from(RELEASES_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS, { download: true });

  if (signError || !signed?.signedUrl) {
    throw signError ?? new Error("Could not create a download link.");
  }

  // Audit the download. Best-effort: a logging failure must not block the user.
  const h = await headers();
  const { error: logError } = await admin.from("download_events").insert({
    user_id: user.id,
    version: release.version,
    channel: release.channel,
    ip:
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("x-real-ip") ??
      null,
    user_agent: h.get("user-agent"),
  });
  if (logError) console.error("download_events insert failed:", logError);

  redirect(signed.signedUrl);
}
