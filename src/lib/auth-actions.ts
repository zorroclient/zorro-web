"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  // 'local' so logging out of the website only ends this browser session — the
  // default 'global' scope revokes ALL of the user's sessions, including the
  // Zorro program on their machine.
  await supabase.auth.signOut({ scope: "local" });
  revalidatePath("/", "layout");
  redirect("/");
}
