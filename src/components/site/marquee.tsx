import Image from "next/image";
import styles from "./hud.module.css";

export type MarqueeLogo = { name: string; logo: string; w: number; h: number };

// Infinite, seamless logo rail. Holds the list 4× and the track slides -25%
// (one copy) so it always fills the viewport and loops without a gap. Pauses on
// hover; logos keep their intrinsic aspect ratio (scaled to a uniform height).
export function Marquee({
  items,
  label,
}: {
  items: MarqueeLogo[];
  label?: string;
}) {
  const copies = [...items, ...items, ...items, ...items];
  return (
    <div className={styles.marqueeWrap}>
      {label && <p className={styles.marqueeLabel}>{label}</p>}
      <div className={styles.marqueeRail}>
        <div className={styles.marquee} aria-label={label}>
          <div className={styles.marqueeTrack}>
            {copies.map((c, i) => (
              <span
                key={i}
                className={styles.marqueeItem}
                aria-hidden={i >= items.length}
              >
                <Image src={c.logo} alt={c.name} width={c.w} height={c.h} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
