import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Lock, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/subscription";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Download",
};

export default async function DownloadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const subscription = await getSubscription(user.id);

  if (!subscription) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground">
          <Lock className="h-5 w-5" />
        </div>
        <h2 className="mt-4 font-heading text-lg font-semibold">
          Subscription required
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Downloads unlock with an active subscription. Pick a plan to get the
          latest build.
        </p>
        <Button asChild className="mt-6">
          <Link href="/pricing">View plans</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-brand/30 bg-gradient-to-br from-brand/10 to-transparent p-8">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-brand/40 bg-brand/15 text-brand">
        <Download className="h-5 w-5" />
      </div>
      <h2 className="mt-4 font-heading text-lg font-semibold">Download Zorro</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        You&apos;re all set. Grab the latest build for Windows.
      </p>
      <Button className="mt-6" disabled>
        Download for Windows (coming soon)
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">
        Wiring to the real release artifact is next.
      </p>
    </div>
  );
}
