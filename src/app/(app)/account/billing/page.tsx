import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CalendarDays, CreditCard, ShieldCheck } from "lucide-react";
import { CancelSubscriptionDialog } from "@/components/account/cancel-subscription-dialog";
import { ResumeSubscriptionButton } from "@/components/account/resume-subscription-button";
import { Button } from "@/components/ui/button";
import { getPlan } from "@/lib/pricing";
import { getBillingSubscription } from "@/lib/subscription";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Billing",
};

const TERMINAL_STATUSES = new Set(["canceled", "incomplete_expired"]);

function formatDate(iso: string | null) {
  if (!iso) return null;

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

function formatAmount(amount: number | null, currency: string | null) {
  if (amount === null || !currency) return null;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatCadence(interval: string | null, count: number | null) {
  if (!interval) return null;
  const intervalCount = count ?? 1;
  if (intervalCount === 1) return `per ${interval}`;
  return `every ${intervalCount} ${interval}s`;
}

function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ billing?: string }>;
}) {
  const { billing: result } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let billing = null;
  let loadFailed = false;
  try {
    billing = await getBillingSubscription(user.id);
  } catch (error) {
    loadFailed = true;
    console.error("Loading account billing details failed:", error);
  }

  const ended = billing ? TERMINAL_STATUSES.has(billing.status) : false;
  const plan = billing ? getPlan(billing.plan) : null;
  const periodEnd = formatDate(billing?.currentPeriodEnd ?? null);
  const cancellationScheduled = billing?.pendingChange?.kind === "cancel";
  const cancelsOn = formatDate(billing?.cancelsAt ?? null) ?? periodEnd;
  const price = billing
    ? (formatAmount(billing.amount, billing.currency) ?? plan?.price ?? null)
    : null;
  const cadence = billing
    ? (formatCadence(billing.interval, billing.intervalCount) ??
      plan?.cadence ??
      null)
    : null;
  const activeStatus = billing
    ? ["active", "trialing"].includes(billing.status)
    : false;

  return (
    <div className="space-y-5">
      {result === "cancellation-scheduled" && (
        <div
          role="status"
          className="border border-brand/40 bg-brand/10 p-4 text-sm text-foreground"
        >
          Renewal stopped. Your access stays active through the date shown
          below.
        </div>
      )}
      {result === "resumed" && (
        <div
          role="status"
          className="border border-emerald-400/35 bg-emerald-400/10 p-4 text-sm text-emerald-100"
        >
          Your subscription will continue renewing normally.
        </div>
      )}
      {["error", "unavailable"].includes(result ?? "") && (
        <div
          role="alert"
          className="border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
        >
          We couldn&apos;t update this subscription. Refresh the page and try
          again shortly.
        </div>
      )}

      {loadFailed ? (
        <section className="border border-destructive/35 bg-destructive/10 p-7">
          <h2 className="font-heading text-lg font-semibold">
            Billing is temporarily unavailable
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            We couldn&apos;t load your live Stripe subscription. Refresh this page
            or try again shortly.
          </p>
        </section>
      ) : !billing || ended ? (
        <section className="border border-white/10 bg-white/[0.025] p-7">
          <div className="flex size-10 items-center justify-center border border-white/15 bg-white/[0.04] text-muted-foreground">
            <CreditCard aria-hidden="true" className="size-5" />
          </div>
          <h2 className="mt-5 font-heading text-lg font-semibold">
            No active subscription
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
            Pick a Zorro plan to unlock downloads and link your PC. Checkout is
            handled securely by Stripe.
          </p>
          <Button asChild className="mt-5">
            <Link href="/pricing">View plans</Link>
          </Button>
        </section>
      ) : (
        <>
          <section className="border border-white/10 bg-white/[0.025] p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Current plan
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold">
                  {plan?.name ?? billing.plan}
                </h2>
                {price && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{price}</span>
                    {cadence ? ` ${cadence}` : ""}
                  </p>
                )}
              </div>
              <span
                className={
                  activeStatus
                    ? "border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-200"
                    : "border border-brand/35 bg-brand/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-brand"
                }
              >
                {statusLabel(billing.status)}
              </span>
            </div>

            <dl className="mt-7 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays aria-hidden="true" className="size-3.5" />
                  {cancellationScheduled ? "Access until" : "Next renewal"}
                </dt>
                <dd className="mt-1 font-medium text-foreground">
                  {cancellationScheduled
                    ? (cancelsOn ?? "End of paid period")
                    : (periodEnd ?? "Unavailable")}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck aria-hidden="true" className="size-3.5" />
                  Payment processing
                </dt>
                <dd className="mt-1 font-medium text-foreground">Stripe</dd>
              </div>
            </dl>
          </section>

          {cancellationScheduled ? (
            <section className="border border-brand/35 bg-brand/10 p-7">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-brand">
                Cancellation scheduled
              </p>
              <h2 className="mt-2 font-heading text-lg font-semibold">
                Your access remains active
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                You will not be charged for another period. Zorro keeps working
                {cancelsOn
                  ? ` through ${cancelsOn}`
                  : " until this paid period ends"}
                . You can resume renewal any time before then.
              </p>
              <div className="mt-5">
                <ResumeSubscriptionButton />
              </div>
            </section>
          ) : (
            <section className="border border-white/10 bg-white/[0.025] p-7">
              <h2 className="font-heading text-lg font-semibold">
                Cancel subscription
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Stop the next renewal without losing time you already paid for.
                Your access stays active through the end of the current period.
              </p>
              <div className="mt-5">
                <CancelSubscriptionDialog accessUntil={periodEnd} />
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
