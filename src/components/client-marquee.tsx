import Image from "next/image";

// Infinite, seamless rail of supported clients. Pure CSS (track holds the list
// twice and slides -50%); pauses on hover, respects prefers-reduced-motion.
// Drop real logos at the paths below; until then it falls back to the name.
type Client = { name: string; logo?: string };

const clients: Client[] = [
  { name: "Lunar", logo: "/brand/lunar-logo-norm.png" },
  { name: "Vanilla", logo: "/brand/minecraft.svg" },
  { name: "Cosmic", logo: "/brand/cosmic-logo-norm.png" },
  { name: "Badlion", logo: "/brand/badlion-logo-norm.png" },
  { name: "Forge", logo: "/brand/forge-logo.svg" },
  { name: "Orbit", logo: "/brand/orbit-logo-norm.png" },
];

export function ClientMarquee() {
  // 4x so one set always fills any viewport; animation moves -25% (= one set)
  const items = [...clients, ...clients, ...clients, ...clients];
  return (
    <div className="lab-clients">
      <p className="lab-clients-label">Supported clients</p>
      <div className="lab-marquee" aria-label="Supported clients">
        <div className="lab-marquee-track">
          {items.map((c, i) => (
            <span
              key={i}
              className="lab-marquee-item"
              aria-hidden={i >= clients.length}
            >
              {c.logo ? (
                <Image
                  src={c.logo}
                  alt={c.name}
                  width={160}
                  height={48}
                  className="h-8 w-auto opacity-70"
                />
              ) : (
                c.name
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
