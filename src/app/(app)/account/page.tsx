import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscription, getPendingChange } from "@/lib/subscription";
import { plans } from "@/lib/pricing";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const subscription = await getSubscription(user.id);
  const planName = subscription
    ? (plans.find((p) => p.id === subscription.plan)?.name ?? subscription.plan)
    : null;
  const fmtDate = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;
  const renewsOn = fmtDate(subscription?.renewsAt ?? null);

  // Pending cancellation or scheduled downgrade, read live from Stripe.
  const pending = subscription ? await getPendingChange(user.id) : null;
  const pendingPlanName = pending?.kind === "switch"
    ? (plans.find((p) => p.id === pending.plan)?.name ?? pending.plan)
    : null;
  const pendingOn = fmtDate(pending?.at ?? null);

  return (
    <div className="space-y-5">
      {error === "already-subscribed" && (
        <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-foreground">
          You already have an active subscription, so there&apos;s no need to buy
          another. Use{" "}
          <span className="font-medium">Manage subscription</span> below to change
          or cancel your plan.
        </div>
      )}
      <div className="border border-white/10 bg-white/[0.025] p-6">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Signed in as
        </p>
        <p className="mt-1 font-medium">{user.email}</p>
      </div>

      <div className="border border-white/10 bg-white/[0.025] p-7">
        <h2 className="font-heading text-lg font-semibold">Subscription</h2>
        {subscription ? (
          <div className="mt-3">
            <p className="text-sm">
              <span className="font-medium text-foreground">{planName}</span>
              {renewsOn && (
                <span className="text-muted-foreground">
                  {" · "}
                  {pending?.kind === "cancel"
                    ? `access until ${renewsOn}`
                    : `renews ${renewsOn}`}
                </span>
              )}
            </p>
            {pending?.kind === "cancel" && (
              <p className="mt-3 border-l-2 border-brand/60 pl-3 text-sm text-muted-foreground">
                Your plan is set to cancel
                {pendingOn ? ` on ${pendingOn}` : " at the end of the period"}.
                You keep access until then.
              </p>
            )}
            {pending?.kind === "switch" && (
              <p className="mt-3 border-l-2 border-brand/60 pl-3 text-sm text-muted-foreground">
                Switching to{" "}
                <span className="text-foreground">{pendingPlanName}</span>
                {pendingOn ? ` on ${pendingOn}` : " at the end of the period"}.
                You stay on {planName} until then.
              </p>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/account/download">Download Zorro</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/account/billing">
                  Manage subscription
                </Link>
              </Button>
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
