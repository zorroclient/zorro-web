import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Cpu, ShieldCheck } from "lucide-react";
import { DeviceRebindDialog } from "@/components/account/device-rebind-dialog";
import { Button } from "@/components/ui/button";
import { resetDeviceRebindCooldownForTesting } from "@/lib/device-actions";
import { canUseDeviceTestControls } from "@/lib/device-test-controls";
import { getDeviceBinding } from "@/lib/licensing";
import { getSubscription } from "@/lib/subscription";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Devices",
};

function formatDate(iso: string | null) {
  if (!iso) return null;

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

export default async function DevicesPage({
  searchParams,
}: {
  searchParams: Promise<{ device?: string }>;
}) {
  const { device: deviceStatus } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const subscription = await getSubscription(user.id);
  const device = subscription ? await getDeviceBinding(user.id) : null;
  const testControlsEnabled = canUseDeviceTestControls(user.id);
  const boundOn = formatDate(device?.boundAt ?? null);
  const nextRebindOn = formatDate(device?.nextRebindAt ?? null);

  return (
    <div className="space-y-5">
      {deviceStatus === "rebound" && (
        <div
          role="status"
          className="border border-emerald-400/35 bg-emerald-400/10 p-4 text-sm text-emerald-100"
        >
          Your previous PC is unlinked. Open Zorro on the new PC to link it to
          your subscription.
        </div>
      )}
      {deviceStatus === "cooldown" && (
        <div
          role="status"
          className="border border-brand/40 bg-brand/10 p-4 text-sm text-foreground"
        >
          This device was reset recently. The next available date is shown
          below.
        </div>
      )}
      {deviceStatus === "cooldown-reset" && (
        <div
          role="status"
          className="border border-emerald-400/35 bg-emerald-400/10 p-4 text-sm text-emerald-100"
        >
          Testing cooldown cleared. You can reset the linked device again.
        </div>
      )}
      {deviceStatus === "test-control-disabled" && (
        <div
          role="alert"
          className="border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
        >
          Device testing controls are not enabled for this account.
        </div>
      )}
      {deviceStatus === "not-bound" && (
        <div
          role="status"
          className="border border-white/15 bg-white/[0.04] p-4 text-sm text-foreground"
        >
          There is no linked PC to reset. Open Zorro to link this subscription.
        </div>
      )}
      {deviceStatus === "inactive" && (
        <div
          role="status"
          className="border border-brand/40 bg-brand/10 p-4 text-sm text-foreground"
        >
          Device rebinding requires an active subscription.
        </div>
      )}
      {deviceStatus === "error" && (
        <div
          role="alert"
          className="border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
        >
          We couldn&apos;t reset the device binding. Please try again shortly.
        </div>
      )}
      {!subscription ? (
        <div className="border border-white/10 bg-white/[0.025] p-6">
          <h2 className="font-heading text-lg font-semibold">
            No active subscription
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Choose a plan before linking a PC to your account.
          </p>
          <Button asChild className="mt-5">
            <Link href="/pricing">View plans</Link>
          </Button>
        </div>
      ) : device === null ? (
        <div className="border border-destructive/35 bg-destructive/10 p-7">
          <h2 className="font-heading text-lg font-semibold">
            Device status unavailable
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            We couldn&apos;t load the linked device right now. Refresh the page or
            try again shortly.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          <section className="border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-10 items-center justify-center border border-brand/35 bg-brand/10 text-brand">
                <Cpu aria-hidden="true" className="size-5" />
              </div>
              <span className="border border-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {device.bound ? "Linked" : "Ready to link"}
              </span>
            </div>
            <h2 className="mt-5 font-heading text-lg font-semibold">
              {device.bound ? "Your linked PC" : "No PC linked"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {device.bound
                ? "This subscription currently authorizes one computer."
                : "Start Zorro on your PC and it will link automatically."}
            </p>
            <dl className="mt-6 border-t border-white/10 pt-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Device allowance</dt>
                <dd className="font-medium text-foreground">1 PC</dd>
              </div>
              {device.bound && (
                <div className="mt-3 flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">System</dt>
                  <dd className="font-mono text-sm text-foreground">
                    {device.system ?? "Unavailable"}
                  </dd>
                </div>
              )}
              {device.bound && boundOn && (
                <div className="mt-3 flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Linked</dt>
                  <dd className="font-medium text-foreground">{boundOn}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="border border-white/10 bg-white/[0.025] p-6">
            <div className="flex size-10 items-center justify-center border border-white/15 bg-white/[0.04] text-foreground">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </div>
            <h2 className="mt-5 font-heading text-lg font-semibold">
              Move to another PC
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Unlinking ends active Zorro sessions on the current PC. The next
              PC that starts Zorro becomes your linked device.
            </p>
            <div className="mt-6">
              {device.canRebind ? (
                <DeviceRebindDialog />
              ) : (
                <Button variant="outline" disabled>
                  Reset device binding
                </Button>
              )}
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {!device.bound
                  ? "There is currently no device to unlink."
                  : nextRebindOn
                    ? `Available again ${nextRebindOn}.`
                    : "Device changes are limited to once every 30 days."}
              </p>
              {testControlsEnabled && device.bound && !device.canRebind && (
                <form
                  action={resetDeviceRebindCooldownForTesting}
                  className="mt-4 border-t border-white/10 pt-4"
                >
                  <Button type="submit" variant="ghost" className="h-8 px-2 text-xs">
                    Reset cooldown (testing)
                  </Button>
                  <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
                    Temporary test control. This does not unlink the current PC.
                  </p>
                </form>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
