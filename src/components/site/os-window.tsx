"use client";

import { useSyncExternalStore } from "react";
import { Boxes, Minus, Square, X } from "lucide-react";
import styles from "./hud.module.css";

// Renders the modules list inside a mock desktop-app window whose chrome
// matches the visitor's OS — macOS traffic lights, Windows title-bar controls,
// or GNOME-style round controls on Linux. Reinforces that Zorro is a separate
// program you run (you click to inject), not an in-game/CLI thing.
//
// Resolves to Windows on the server + during hydration, then to the real OS on
// the client (read via useSyncExternalStore — no cascading setState, no
// hydration mismatch). Builds are Windows-only for now, so the server default
// also matches what actually ships.
type OS = "windows" | "mac" | "linux";

const subscribe = () => () => {}; // OS never changes within a session
const getServerSnapshot = (): OS => "windows";
function getSnapshot(): OS {
  if (typeof navigator === "undefined") return "windows";
  const ua = navigator.userAgent.toLowerCase();
  // userAgentData.platform is the non-deprecated signal where available
  const uaData = (
    navigator as Navigator & { userAgentData?: { platform?: string } }
  ).userAgentData;
  const hay = (uaData?.platform || "").toLowerCase() || ua;
  if (/mac/.test(hay) && !/iphone|ipad|ipod/.test(ua)) return "mac";
  if (/win/.test(hay)) return "windows";
  if (/linux|x11|ubuntu|fedora|cros/.test(hay) && !/android/.test(ua))
    return "linux";
  return "windows";
}

export function OsWindow({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const os = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className={styles.win} data-os={os}>
      <div className={styles.winBar} aria-hidden>
        {os === "mac" && (
          <>
            <span className={styles.winDots}>
              <span className={`${styles.tdot} ${styles.r}`} />
              <span className={`${styles.tdot} ${styles.y}`} />
              <span className={`${styles.tdot} ${styles.g}`} />
            </span>
            <span className={styles.winTitleCenter}>{title}</span>
            <span className={styles.winDotsBalance} />
          </>
        )}

        {os === "windows" && (
          <>
            <span className={styles.winApp}>
              <Boxes /> {title}
            </span>
            <span className={styles.winCtl}>
              <span className={styles.winCtlBtn}>
                <Minus />
              </span>
              <span className={styles.winCtlBtn}>
                <Square />
              </span>
              <span className={`${styles.winCtlBtn} ${styles.winCtlClose}`}>
                <X />
              </span>
            </span>
          </>
        )}

        {os === "linux" && (
          <>
            <span className={styles.winLinuxTitle}>{title}</span>
            <span className={styles.winGnome}>
              <span className={styles.winRound}>
                <Minus />
              </span>
              <span className={styles.winRound}>
                <Square />
              </span>
              <span className={`${styles.winRound} ${styles.winRoundClose}`}>
                <X />
              </span>
            </span>
          </>
        )}
      </div>
      {children}
    </div>
  );
}
