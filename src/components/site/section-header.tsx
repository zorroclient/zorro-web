import styles from "./hud.module.css";

// Mono kicker + display heading + sub. Carries the scroll-reveal hook by default
// (no-op on pages without ScrollMotion, since the reveal start-state is gated
// behind [data-motion="on"]).
export function SectionHeader({
  kicker,
  title,
  sub,
  reveal = true,
}: {
  kicker?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  reveal?: boolean;
}) {
  return (
    <div data-hud-reveal={reveal ? "" : undefined}>
      {kicker && <p className={styles.kicker}>{kicker}</p>}
      <h2 className={styles.h2}>{title}</h2>
      {sub && <p className={styles.sub}>{sub}</p>}
    </div>
  );
}
