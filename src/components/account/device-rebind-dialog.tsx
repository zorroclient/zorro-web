"use client";

import { useFormStatus } from "react-dom";
import { AlertDialog } from "radix-ui";
import { MonitorX } from "lucide-react";
import { rebindDevice } from "@/lib/device-actions";
import { Button } from "@/components/ui/button";

function RebindSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? "Resetting…" : "Reset device"}
    </Button>
  );
}

export function DeviceRebindDialog() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="outline">Reset device binding</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 border border-white/15 bg-[#090a0d] p-6 shadow-2xl outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex size-10 items-center justify-center border border-destructive/40 bg-destructive/10 text-destructive">
            <MonitorX aria-hidden="true" className="size-5" />
          </div>
          <AlertDialog.Title className="mt-4 font-heading text-lg font-semibold text-foreground">
            Move Zorro to another PC?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
            This unlinks the current PC and ends its active Zorro sessions. The
            next PC that starts Zorro will become the linked device. You can do
            this once every 30 days.
          </AlertDialog.Description>
          <form action={rebindDevice} className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <Button type="button" variant="ghost">
                Keep current PC
              </Button>
            </AlertDialog.Cancel>
            <RebindSubmitButton />
          </form>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
