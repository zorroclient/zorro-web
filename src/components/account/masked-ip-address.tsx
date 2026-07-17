"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function MaskedIpAddress({ ip }: { ip: string | null }) {
  const [revealed, setRevealed] = useState(false);

  if (!ip) {
    return (
      <p className="mt-5 font-mono text-sm text-muted-foreground">
        Unavailable for this connection
      </p>
    );
  }

  return (
    <div className="mt-5 flex items-center justify-between gap-4 border border-white/10 bg-black/20 px-4 py-3">
      <span
        className="font-mono text-sm tracking-[0.08em] text-foreground"
        aria-live="polite"
      >
        {revealed ? ip : "************"}
      </span>
      <button
        type="button"
        onClick={() => setRevealed((current) => !current)}
        aria-label={
          revealed ? "Hide current IP address" : "Reveal current IP address"
        }
        aria-pressed={revealed}
        className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {revealed ? (
          <EyeOff aria-hidden="true" className="size-4" />
        ) : (
          <Eye aria-hidden="true" className="size-4" />
        )}
      </button>
    </div>
  );
}
