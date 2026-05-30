import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <h1 className="text-3xl font-bold">Account</h1>
      <p className="mt-2 text-muted-foreground">Signed in as {user.email}</p>

      <div className="mt-10 rounded-2xl border border-border/60 bg-card/40 p-7">
        <h2 className="font-heading text-lg font-semibold">Your subscription</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No active subscription yet. Checkout and gated downloads come next.
        </p>
        <Button asChild className="mt-5">
          <Link href="/pricing">View plans</Link>
        </Button>
      </div>

      <form action={signOut} className="mt-8">
        <Button type="submit" variant="outline">
          Log out
        </Button>
      </form>
    </div>
  );
}
