import styles from "./hud.module.css";

// Full-screen brand "slide": a sticky, scroll-scaled ZORRO over the circuit
// background. The scale tween is driven by ScrollMotion via the data-attrs.
export function BrandSlide({
  word = "ZORRO",
  sub,
}: {
  word?: string;
  sub?: string;
}) {
  return (
    <section className={styles.brandSlide} data-hud-brand-slide>
      <div className={styles.brandSticky}>
        <span className={styles.brandWord} data-hud-brand>
          {word}
        </span>
        {sub && <span className={styles.brandSub}>{sub}</span>}
      </div>
    </section>
  );
}
