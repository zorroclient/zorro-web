import type { Metadata } from "next";
import { Cpu, Globe, ShieldCheck, BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ResetBindingButton } from "@/components/lab/reset-binding-button";

export const metadata: Metadata = {
  title: "Lab — account / device binding",
};

// Mock only — static data to explore the HWID/IP binding + 30-day reset UX.
const mock = {
  plan: "6 Months",
  status: "Active",
  renews: "Dec 8, 2026",
  device: {
    os: "Windows 11",
    hwid: "A1B2-••••-••••-9F3C",
    bound: "Bound 12 days ago",
  },
  network: {
    ip: "82.41.•••.•••",
    region: "Amsterdam, NL",
    seen: "Last seen 2 hours ago",
  },
  resetAvailable: true,
  nextResetLabel: "in 30 days",
};

export default function LabAccountPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold sm:text-4xl">Device &amp; license</h1>
        <span className="rounded-full border border-brand/40 bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
          Mock
        </span>
      </div>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Your subscription is tied to one machine at a time. You can move it to a
        new device yourself once every 30 days.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {/* Subscription */}
        <Card className="gap-4 p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <BadgeCheck className="h-4 w-4 text-brand" />
            Subscription
          </div>
          <div>
            <p className="font-heading text-lg font-semibold">{mock.plan}</p>
            <p className="text-sm text-muted-foreground">
              {mock.status} · renews {mock.renews}
            </p>
          </div>
        </Card>

        {/* Device (HWID) */}
        <Card className="gap-4 p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Cpu className="h-4 w-4 text-brand" />
            Bound device
          </div>
          <div>
            <p className="font-heading text-lg font-semibold">
              {mock.device.os}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              HWID {mock.device.hwid}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {mock.device.bound}
            </p>
          </div>
        </Card>

        {/* Network (IP) */}
        <Card className="gap-4 p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Globe className="h-4 w-4 text-brand" />
            Network
          </div>
          <div>
            <p className="font-heading text-lg font-semibold">
              {mock.network.region}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              IP {mock.network.ip}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {mock.network.seen} · for security only, never blocked on
            </p>
          </div>
        </Card>

        {/* Reset */}
        <Card className="gap-4 p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-brand" />
            Move to a new device
          </div>
          <p className="text-sm text-muted-foreground">
            Resetting unbinds your current machine so Zorro re-binds wherever you
            next launch it. Allowed once every 30 days.
          </p>
          <ResetBindingButton
            available={mock.resetAvailable}
            nextResetLabel={mock.nextResetLabel}
          />
        </Card>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Mock UI for planning the HWID/IP binding flow — not wired to a backend.
      </p>
    </div>
  );
}
