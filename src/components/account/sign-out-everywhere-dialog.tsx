"use client";

import { useFormStatus } from "react-dom";
import { AlertDialog } from "radix-ui";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutEverywhere } from "@/lib/device-actions";

function SignOutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? "Signing out…" : "Sign out everywhere"}
    </Button>
  );
}

export function SignOutEverywhereDialog() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="destructive">Sign out everywhere</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 border border-white/15 bg-[#090a0d] p-6 shadow-2xl outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex size-10 items-center justify-center border border-destructive/40 bg-destructive/10 text-destructive">
            <LogOut aria-hidden="true" className="size-5" />
          </div>
          <AlertDialog.Title className="mt-4 font-heading text-lg font-semibold text-foreground">
            Sign out of every device?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
            This revokes all saved account logins and ends active Zorro desktop
            sessions. You will also be signed out of this browser. Your linked
            PC will stay linked.
          </AlertDialog.Description>
          <p className="mt-4 border-l-2 border-brand/60 pl-3 text-xs leading-5 text-muted-foreground">
            If you think someone stole your account, reset your password before
            signing in again. Existing web access tokens can remain valid until
            they expire.
          </p>
          <form action={signOutEverywhere} className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <SignOutSubmitButton />
          </form>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
