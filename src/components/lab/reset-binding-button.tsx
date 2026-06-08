"use client";

import { useState } from "react";
import { RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock reset control for the device/IP binding. No backend — demonstrates the
// 30-day-cooldown UX only.
export function ResetBindingButton({
  available,
  nextResetLabel,
}: {
  available: boolean;
  nextResetLabel: string;
}) {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="flex items-center gap-2 text-sm text-brand">
        <Check className="h-4 w-4" />
        Binding reset — relaunch Zorro to bind this machine.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        disabled={!available}
        onClick={() => {
          if (
            window.confirm(
              "Reset your device & IP binding? You won't be able to reset again for 30 days.",
            )
          ) {
            setDone(true);
          }
        }}
      >
        <RotateCcw />
        Reset device &amp; IP
      </Button>
      {!available && (
        <p className="text-xs text-muted-foreground">
          Available again {nextResetLabel}.
        </p>
      )}
    </div>
  );
}
