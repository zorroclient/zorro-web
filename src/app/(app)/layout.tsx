import { Atmosphere } from "@/components/site/atmosphere";
import styles from "@/components/site/hud.module.css";

// Calm shell for functional pages (auth, account, docs): same dark surface and
// faint atmosphere as marketing, but dialed back for readability — static,
// fainter scanlines, sparser circuit, no parallax/scroll-motion.
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.surface}>
      <Atmosphere intensity="calm" />
      {children}
    </div>
  );
}
