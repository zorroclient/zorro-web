"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const DEVICES_PATH = "/account/devices";

export async function rebindDevice() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("rebind_subscription_device", {
    p_user_id: user.id,
  });

  if (error) {
    console.error("Device rebind failed:", error);
    redirect(`${DEVICES_PATH}?device=error`);
  }

  const outcome = data?.[0]?.result;
  revalidatePath(DEVICES_PATH);

  switch (outcome) {
    case "rebound":
      redirect(`${DEVICES_PATH}?device=rebound`);
    case "cooldown":
      redirect(`${DEVICES_PATH}?device=cooldown`);
    case "not_bound":
      redirect(`${DEVICES_PATH}?device=not-bound`);
    case "inactive":
    case "not_found":
      redirect(`${DEVICES_PATH}?device=inactive`);
    default:
      redirect(`${DEVICES_PATH}?device=error`);
  }
}

export async function signOutEverywhere() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login");

  const now = new Date().toISOString();
  const admin = createAdminClient();
  const { error: revokeError } = await admin
    .from("desktop_sessions")
    .update({
      revoked_at: now,
      revoke_reason: "account_security_logout",
      updated_at: now,
    })
    .eq("user_id", user.id)
    .is("revoked_at", null)
    .gt("expires_at", now);

  if (revokeError) {
    console.error("Desktop session revocation failed:", revokeError);
    redirect(`${DEVICES_PATH}?device=security-error`);
  }

  const { error: signOutError } = await supabase.auth.signOut({
    scope: "global",
  });
  if (signOutError) {
    console.error("Global account sign-out failed:", signOutError);
    redirect(`${DEVICES_PATH}?device=security-error`);
  }

  revalidatePath("/", "layout");
  redirect("/login?security=signed-out");
}
