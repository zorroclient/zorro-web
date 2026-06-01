import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/subscription";
import { createPortalSession } from "@/lib/billing-actions";
import { plans } from "@/lib/pricing";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const subscription = await getSubscription(user.id);
  const planName = subscription
    ? (plans.find((p) => p.id === subscription.plan)?.name ?? subscription.plan)
    : null;
  const renewsOn = subscription?.renewsAt
    ? new Date(subscription.renewsAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Signed in as</p>
        <p className="font-medium">{user.email}</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/40 p-7">
        <h2 className="font-heading text-lg font-semibold">Subscription</h2>
        {subscription ? (
          <div className="mt-3">
            <p className="text-sm">
              <span className="font-medium text-foreground">{planName}</span>
              {renewsOn && (
                <span className="text-muted-foreground"> · renews {renewsOn}</span>
              )}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/account/download">Download Zorro</Link>
              </Button>
              <form action={createPortalSession}>
                <Button type="submit" variant="outline">
                  Manage subscription
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">
              You don&apos;t have an active subscription yet.
            </p>
            <Button asChild className="mt-5">
              <Link href="/pricing">View plans</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
