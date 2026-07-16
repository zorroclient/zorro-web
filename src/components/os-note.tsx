"use client";

import { useSyncExternalStore } from "react";

type Os = "windows" | "mac" | "linux" | "other" | "unknown";

function detectOs(): Os {
  if (typeof navigator === "undefined") return "unknown";
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const raw = (
    nav.userAgentData?.platform ||
    nav.platform ||
    nav.userAgent ||
    ""
  ).toLowerCase();
  if (raw.includes("win")) return "windows";
  if (raw.includes("mac") || raw.includes("darwin")) return "mac";
  if (raw.includes("linux") || raw.includes("x11") || raw.includes("android")) {
    return "linux";
  }
  return "other";
}

const LABELS: Record<Exclude<Os, "windows" | "unknown">, string> = {
  mac: "macOS",
  linux: "Linux",
  other: "your operating system",
};

// OS never changes within a session, so there's nothing to subscribe to.
const noopSubscribe = () => () => {};

/**
 * Shows a Windows-only heads-up when the visitor clearly isn't on Windows.
 * Zorro ships a single Windows build, so this nudges (rather than blocks) —
 * a Mac/Linux user provisioning a Windows PC can still grab the installer.
 */
export function OsNote() {
  // Server (and first hydration) snapshot is "unknown" → renders nothing, so no
  // hydration mismatch; the client then resolves the real OS.
  const os = useSyncExternalStore<Os>(noopSubscribe, detectOs, () => "unknown");

  if (os === "unknown" || os === "windows") return null;

  return (
    <p className="mt-3 max-w-md rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
      You appear to be on {LABELS[os]}. Zorro runs on{" "}
      <span className="text-foreground">Windows only</span> — this download is
      the Windows build, so install it on a Windows PC.
    </p>
  );
}
