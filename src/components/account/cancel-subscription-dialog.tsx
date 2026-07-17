"use client";

import { useFormStatus } from "react-dom";
import { AlertDialog } from "radix-ui";
import { CalendarX2 } from "lucide-react";
import { scheduleSubscriptionCancellation } from "@/lib/billing-actions";
import { Button } from "@/components/ui/button";

function CancelSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? "Scheduling…" : "Cancel at period end"}
    </Button>
  );
}

export function CancelSubscriptionDialog({ accessUntil }: {
  accessUntil: string | null;
}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="outline">Cancel subscription</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 border border-white/15 bg-[#090a0d] p-6 shadow-2xl outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex size-10 items-center justify-center border border-destructive/40 bg-destructive/10 text-destructive">
            <CalendarX2 aria-hidden="true" className="size-5" />
          </div>
          <AlertDialog.Title className="mt-4 font-heading text-lg font-semibold text-foreground">
            Cancel your subscription?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
            Your renewal will be stopped. You keep full Zorro access
            {accessUntil ? ` through ${accessUntil}` : " through the paid period"},
            and you will not be charged for another period. This does not issue
            a refund for the current period.
          </AlertDialog.Description>
          <form
            action={scheduleSubscriptionCancellation}
            className="mt-6 flex justify-end gap-3"
          >
            <AlertDialog.Cancel asChild>
              <Button type="button" variant="ghost">
                Keep subscription
              </Button>
            </AlertDialog.Cancel>
            <CancelSubmitButton />
          </form>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
