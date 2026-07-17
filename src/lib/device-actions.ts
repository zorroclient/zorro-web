"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canUseDeviceTestControls } from "@/lib/device-test-controls";
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

export async function resetDeviceRebindCooldownForTesting() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (!canUseDeviceTestControls(user.id)) {
    redirect(`${DEVICES_PATH}?device=test-control-disabled`);
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("subscriptions")
    .update({
      last_rebind_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .select("user_id")
    .maybeSingle();

  if (error || !data) {
    console.error("Device cooldown test reset failed:", error);
    redirect(`${DEVICES_PATH}?device=error`);
  }

  revalidatePath(DEVICES_PATH);
  redirect(`${DEVICES_PATH}?device=cooldown-reset`);
}
