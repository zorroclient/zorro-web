import { Atmosphere } from "@/components/site/atmosphere";
import { ScrollMotion } from "@/components/site/scroll-motion";
import styles from "@/components/site/hud.module.css";

// Marketing shell: full HUD atmosphere (circuit + CRT) and scroll motion, on a
// dark surface that bleeds up under the translucent sticky header. Route groups
// don't change URLs — these pages stay at `/`, `/pricing`, etc.
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.surface} ${styles.bleedTop}`} data-hud-root>
      <Atmosphere intensity="full" />
      <ScrollMotion />
      {children}
    </div>
  );
}
