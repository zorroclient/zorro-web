import Image from "next/image";

// Infinite, seamless rail of supported clients. Pure CSS (track holds the list
// twice and slides -50%); pauses on hover, respects prefers-reduced-motion.
// Drop real logos at the paths below; until then it falls back to the name.
type Client = { name: string; logo?: string };

const clients: Client[] = [
  { name: "Lunar", logo: "/brand/clients/lunar.svg" },
  { name: "Vanilla", logo: "/brand/clients/vanilla.svg" },
  { name: "Cosmic", logo: "/brand/clients/cosmic.svg" },
  { name: "Badlion", logo: "/brand/clients/badlion.svg" },
  { name: "Feather", logo: "/brand/clients/feather.svg" },
];

export function ClientMarquee() {
  // duplicate so the -50% translate loops seamlessly
  const items = [...clients, ...clients];
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
                  width={132}
                  height={32}
                  className="h-7 w-auto opacity-70"
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
