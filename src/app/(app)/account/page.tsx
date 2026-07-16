import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscription, getPendingChange } from "@/lib/subscription";
import { getDeviceBinding } from "@/lib/licensing";
import { createPortalSession } from "@/lib/billing-actions";
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

  // Pending portal-initiated change (cancellation or scheduled downgrade).
  const pending = subscription ? await getPendingChange(user.id) : null;
  const pendingPlanName = pending?.kind === "switch"
    ? (plans.find((p) => p.id === pending.plan)?.name ?? pending.plan)
    : null;
  const pendingOn = fmtDate(pending?.at ?? null);

  // Device (HWID/IP) binding — display only for now.
  const device = subscription ? await getDeviceBinding(user.id) : null;

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

      {/* Device binding (HWID / IP) — read-only preview; reset wires up with the
          move to subscription-based activation. */}
      {subscription && (
        <div className="border border-white/10 bg-white/[0.025] p-7">
          <h2 className="font-heading text-lg font-semibold">Device</h2>
          {device?.bound ? (
            <div className="mt-3 space-y-1 text-sm">
              <p>
                <span className="font-medium text-foreground">
                  One device linked
                </span>
                {device.country && (
                  <span className="text-muted-foreground">
                    {" · "}
                    {device.country}
                    {device.asn ? ` (${device.asn})` : ""}
                  </span>
                )}
              </p>
              {fmtDate(device.lastSeenAt) && (
                <p className="text-muted-foreground">
                  Last active {fmtDate(device.lastSeenAt)}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              No device linked yet — Zorro links to your PC automatically the
              first time you run it.
            </p>
          )}

          <div className="mt-5 flex items-center gap-3">
            <Button variant="outline" disabled>
              Reset device binding
            </Button>
            <span className="text-xs text-muted-foreground">
              Unlinks your PC so you can move to a new one · once every 30 days ·
              coming soon
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
