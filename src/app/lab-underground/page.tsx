import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Bangers } from "next/font/google";
import { Swords, ArrowRight, Check, Skull } from "lucide-react";
import { FaqSection } from "@/components/faq-section";
import { features } from "@/lib/features";
import { moduleCategories } from "@/lib/modules";
import { plans, included } from "@/lib/pricing";
import { productFaqs } from "@/lib/faq";
import { siteConfig } from "@/lib/nav";
import styles from "./underground.module.css";

// Graffiti accent face — scoped to this page via the CSS variable below.
const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bangers",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lab — Underground direction",
};

// Throwaway design direction #2: "Underground / graffiti". Anti-corporate,
// hand-slapped, rebellious. Self-contained (scoped CSS module); links go to
// /signup so nothing here touches billing.
const clients = [
  { name: "Lunar", logo: "/brand/lunar-logo-norm.png" },
  { name: "Vanilla", logo: "/brand/minecraft.svg" },
  { name: "Cosmic", logo: "/brand/cosmic-logo-norm.png" },
  { name: "Badlion", logo: "/brand/badlion-logo-norm.png" },
  { name: "Forge", logo: "/brand/forge-logo.svg" },
  { name: "Orbit", logo: "/brand/orbit-logo-norm.png" },
];

function MaskMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 60" fill="none" aria-hidden>
      <path
        d="M6 22 C6 10 28 6 60 8 C92 6 114 10 114 22 C114 40 96 52 80 50 C70 49 66 40 60 40 C54 40 50 49 40 50 C24 52 6 40 6 22 Z"
        fill="currentColor"
      />
      <ellipse cx="40" cy="26" rx="11" ry="7" fill="#0c0a09" />
      <ellipse cx="80" cy="26" rx="11" ry="7" fill="#0c0a09" />
    </svg>
  );
}

export default function LabUndergroundPage() {
  return (
    <div className={`${styles.ug} ${bangers.variable}`}>
      <div aria-hidden className={styles.halftone} />
      <div aria-hidden className={styles.paper} />

      {/* hero */}
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kick}>
            <MaskMark className={styles.kickMask} /> Ghost client for Minecraft
          </span>
          <h1 className={styles.shout}>
            <span className="o">One client.</span>
            <span className="f">Every advantage.</span>
          </h1>
          <p className={styles.heroSub}>
            Runs clean on Lunar, vanilla, Cosmic — or any server you play.{" "}
            <b>Loads silent. Leaves no trace.</b> Built for people who play to
            win.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/signup" className={styles.sprayBtn}>
              <Swords /> Get Zorro
            </Link>
            <Link href="/pricing" className={styles.ghostBtn}>
              See the damage →
            </Link>
          </div>
        </div>

        <div className={styles.figureWrap}>
          <Image
            className={styles.figure}
            src="/brand/figure-trimmed.png"
            alt=""
            width={914}
            height={623}
            priority
          />
          <MaskMark className={styles.maskMark} />
        </div>

        {/* slapped-on stickers */}
        <span className={`${styles.sticker} ${styles.stickerAccent} ${styles.s1}`}>
          Undetected*
        </span>
        <span className={`${styles.sticker} ${styles.s2}`}>No Trace</span>
        <span className={`${styles.sticker} ${styles.stickerOutline} ${styles.s3}`}>
          {"v2.4 // live"}
        </span>
        <span className={`${styles.sticker} ${styles.s4}`}>GG EZ</span>
      </section>

      <div aria-hidden className={styles.slash} />

      {/* clients tape */}
      <div className={styles.clients}>
        <div className={styles.clientsInner}>
          <span className={styles.clientsLabel}>Seen on →</span>
          <div className={styles.clientsRow}>
            {clients.map((c) => (
              <Image key={c.name} src={c.logo} alt={c.name} width={150} height={28} />
            ))}
          </div>
        </div>
      </div>

      {/* features as taped cards */}
      <section className={styles.section}>
        <div className={styles.wrap}>
          <span className={styles.tag}>Why bother</span>
          <h2 className={styles.h2}>Every edge, one client</h2>
          <p className={styles.sub}>
            Combat, movement, visuals — fully loaded, dialed in, and out of your
            way. No bloat, no babysitting.
          </p>
          <div className={styles.cards}>
            {features.map((f) => (
              <article key={f.title} className={styles.card}>
                <span aria-hidden className={styles.tape} />
                <span className={styles.cardIcon}>
                  <f.icon />
                </span>
                <h3 className={styles.cardTitle}>{f.title}</h3>
                <p className={styles.cardDesc}>{f.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* modules tag wall */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className={styles.wrap}>
          <span className={styles.tag}>The arsenal</span>
          <h2 className={styles.h2}>Five categories. 20+ modules.</h2>
          <p className={styles.sub}>
            Every one tuned to the detail — and every one included, on every
            plan. No paywalled cheats.
          </p>
          <div className={styles.tagwall}>
            {moduleCategories.map((g) => (
              <div key={g.id} className={styles.modTag}>
                <div className={styles.modHead}>
                  <g.icon /> {g.label}
                </div>
                <p className={styles.modTeaser}>{g.teaser}</p>
              </div>
            ))}
          </div>
          <p className={styles.modMore}>
            <Link href="/docs/modules">Full arsenal →</Link>
          </p>
        </div>
      </section>

      {/* pricing tickets */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className={styles.wrap}>
          <span className={styles.tag}>The damage</span>
          <h2 className={styles.h2}>One price. Everything in.</h2>
          <p className={styles.sub}>
            Every plan unlocks the whole client — length is the only call you
            make. Go longer, pay less.
          </p>
          <div className={styles.tickets}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`${styles.ticket} ${plan.featured ? styles.ticketFeatured : ""}`}
              >
                {plan.badge && (
                  <span className={styles.ticketBadge}>{plan.badge}</span>
                )}
                <div className={styles.ticketName}>{plan.name}</div>
                <div className={styles.ticketPrice}>
                  <b>{plan.price}</b>
                  <span className={styles.ticketCadence}>{plan.cadence}</span>
                </div>
                {plan.note && (
                  <div className={styles.ticketNote}>{plan.note}</div>
                )}
                <hr className={styles.ticketDash} />
                <ul className={styles.ticketList}>
                  {included.map((item) => (
                    <li key={item}>
                      <Check /> {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`${styles.ticketBtn} ${plan.featured ? styles.ticketBtnDark : ""}`}
                >
                  Get {siteConfig.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* faq */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className={styles.wrap}>
          <span className={styles.tag}>Real talk</span>
          <div className={styles.faqWrap} style={{ marginTop: 10 }}>
            <FaqSection items={productFaqs} heading="No BS, answered" />
          </div>
        </div>
      </section>

      {/* spray CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaShout}>
          Your edge is <span className={styles.hl}>one download</span> away
        </h2>
        <p className={styles.ctaSub}>
          Make an account, grab a plan, and be in-game in minutes — on whatever
          client you run.
        </p>
        <Link href="/signup" className={styles.ctaBtn}>
          <Skull /> Join the ghosts <ArrowRight />
        </Link>
      </section>
    </div>
  );
}
