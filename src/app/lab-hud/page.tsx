import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Swords, ArrowRight, Check, Ghost } from "lucide-react";
import { FaqSection } from "@/components/faq-section";
import { features } from "@/lib/features";
import { moduleCategories } from "@/lib/modules";
import { plans, included } from "@/lib/pricing";
import { productFaqs } from "@/lib/faq";
import { siteConfig } from "@/lib/nav";
import { createAdminClient } from "@/lib/supabase/admin";
import { HudMotion } from "./hud-motion";
import { HudBg } from "./hud-bg";
import { OsWindow } from "./os-window";
import styles from "./hud.module.css";

export const metadata: Metadata = {
  title: "Lab — HUD direction",
};

// Throwaway design direction #1 (iteration 2): "Stealth / HUD". Reads like the
// desktop client's overlay — no fake terminal commands (you click to inject).
// Self-contained scoped CSS module; links go to /signup, nothing touches billing.
// Intrinsic dimensions per logo so next/image keeps each aspect ratio; the
// marquee then scales them all to a uniform height in CSS.
const clients = [
  { name: "Lunar", logo: "/brand/lunar-logo-norm.png", w: 160, h: 48 },
  { name: "Vanilla", logo: "/brand/minecraft.svg", w: 300, h: 51 },
  { name: "Cosmic", logo: "/brand/cosmic-logo-norm.png", w: 160, h: 48 },
  { name: "Badlion", logo: "/brand/badlion-logo-norm.png", w: 160, h: 48 },
  { name: "Forge", logo: "/brand/forge-logo.svg", w: 316, h: 67 },
  { name: "Orbit", logo: "/brand/orbit-logo-norm.png", w: 160, h: 48 },
];

function Reticle() {
  return (
    <svg className={styles.reticle} viewBox="0 0 100 100" fill="none" aria-hidden data-hud-parallax="-16">
      <path d="M50 6 V22 M50 78 V94 M6 50 H22 M78 50 H94" stroke="currentColor" strokeWidth="1" />
      <path d="M8 8 H20 M8 8 V20 M92 8 H80 M92 8 V20 M8 92 H20 M8 92 V80 M92 92 H80 M92 92 V80" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="2" fill="currentColor" />
    </svg>
  );
}

// Latest published version for the status chip. app_releases isn't
// client-readable, so read it with the service-role client (server-only).
// Version strings are public; any failure falls back to "latest".
async function getLatestVersion(): Promise<string | null> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("app_releases")
      .select("version")
      .eq("active", true)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data?.version ?? null;
  } catch {
    return null;
  }
}

export default async function LabHudPage() {
  const version = await getLatestVersion();
  return (
    <div className={styles.hud} data-hud-root>
      <HudMotion />
      <HudBg />
      <div aria-hidden className={styles.grain} />
      <div aria-hidden className={styles.scan} />
      <div aria-hidden className={styles.vignette} />

      {/* status bar — true features, not network telemetry */}
      <div className={styles.statusbar}>
        <div className={styles.statusInner}>
          <span className={`${styles.chip} ${styles.live}`}>
            <span className={styles.dot} /> BUILD <b>{version ?? "latest"}</b>
          </span>
          <span className={`${styles.chip} ${styles.chipHide}`}>STEALTH LOAD</span>
          <span className={`${styles.chip} ${styles.chipHide}`}>AUTO-UPDATING</span>
          <span className={`${styles.chip} ${styles.chipHide}`}>SELF-DESTRUCT</span>
          <span className={styles.spacer} />
          <span className={styles.chip}>
            <b>5+</b> CLIENTS
          </span>
        </div>
      </div>

      {/* hero */}
      <section className={styles.hero} data-hud-hero>
        <div className={styles.heroCopy} data-hud-copy>
          <span className={styles.eyebrow}>
            <Ghost /> Built for the closet cheater
          </span>
          <h1 className={styles.display}>
            <span className={styles.l1}>One client.</span>
            <span className={styles.l2}>Every advantage.</span>
          </h1>
          <p className={styles.lead}>
            Runs clean on Lunar, vanilla, Cosmic — or any server you load. Loads
            silent, leaves no trace, and self-destructs on command.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/signup" className={`${styles.btn} ${styles.btnPrimary}`}>
              <Swords /> Get Zorro
            </Link>
            <Link href="/pricing" className={`${styles.btn} ${styles.btnGhost}`}>
              View access tiers
            </Link>
          </div>
          <div className={styles.readouts}>
            <div className={styles.readout}>
              <div className={styles.readoutVal}>20+</div>
              <div className={styles.readoutKey}>Modules</div>
            </div>
            <div className={styles.readout}>
              <div className={styles.readoutVal}>5+</div>
              <div className={styles.readoutKey}>Clients supported</div>
            </div>
            <div className={styles.readout}>
              <div className={styles.readoutVal}>Auto</div>
              <div className={styles.readoutKey}>Updating</div>
            </div>
          </div>
        </div>

        <div className={styles.figureWrap}>
          <div className={styles.figGlow} />
          <Image
            className={styles.figure}
            src="/brand/figure-trimmed.png"
            alt=""
            width={914}
            height={623}
            priority
            data-hud-parallax="-10"
          />
          <Reticle />
          <svg className={styles.reticleSpin} viewBox="0 0 100 100" fill="none" aria-hidden>
            <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 6" />
          </svg>
          <span className={`${styles.callout} ${styles.coTop}`} data-hud-parallax="12">
            <b>●</b> TARGET LOCKED
          </span>
          <span className={`${styles.callout} ${styles.coMid}`} data-hud-parallax="18">
            REACH <b>6.7m</b>
          </span>
          <span className={`${styles.callout} ${styles.coBot}`} data-hud-parallax="9">
            TRACE <b>none</b>
          </span>
        </div>
      </section>

      {/* big brand "slide" — a full-screen ZORRO you scroll through */}
      <section className={styles.brandSlide} data-hud-brand-slide>
        <div className={styles.brandSticky}>
          <span className={styles.brandWord} data-hud-brand>
            ZORRO
          </span>
          <span className={styles.brandSub}>Ghost client for Minecraft</span>
        </div>
      </section>

      {/* supported clients — infinite carousel */}
      <div className={styles.marqueeSection}>
        <p className={styles.marqueeLabel}>Supported clients</p>
        <div className={styles.marquee} aria-label="Supported clients">
          <div className={styles.marqueeTrack}>
            {[...clients, ...clients, ...clients, ...clients].map((c, i) => (
              <span key={i} className={styles.marqueeItem} aria-hidden={i >= clients.length}>
                <Image src={c.logo} alt={c.name} width={c.w} height={c.h} />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* features — asymmetric bento */}
      <section className={styles.section}>
        <div className={styles.wrap}>
          <div data-hud-reveal>
            <p className={styles.kicker}>System overview</p>
            <h2 className={styles.h2}>Every edge, one process</h2>
            <p className={styles.sub}>
              Combat, movement, and visuals — fully configurable, engineered to
              stay smooth under load.
            </p>
          </div>
          <div className={styles.bento}>
            {features.map((f, i) => {
              const cls =
                i === 0
                  ? `${styles.cell} ${styles.cellLead}`
                  : i === features.length - 1
                    ? `${styles.cell} ${styles.cellWide}`
                    : styles.cell;
              return (
                <article key={f.title} className={cls} data-hud-reveal>
                  {i === 0 && <span aria-hidden className={styles.radar} />}
                  <div>
                    <span className={styles.cellIcon}>
                      <f.icon />
                    </span>
                    <h3 className={styles.cellTitle}>{f.title}</h3>
                    <p className={styles.cellDesc}>{f.description}</p>
                  </div>
                  {i === 0 ? (
                    <span className={styles.leadTagline}>
                      <span className={styles.statusDot} /> one subscription, every setup
                    </span>
                  ) : (
                    <span className={styles.panelStatus}>
                      <span className={styles.statusDot} /> Active
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* modules — OS-detected app window */}
      <section className={`${styles.section} ${styles.sectionFlush}`}>
        <div className={styles.wrap}>
          <div data-hud-reveal>
            <p className={styles.kicker}>Loadout</p>
            <h2 className={styles.h2}>Five categories. 20+ modules.</h2>
            <p className={styles.sub}>
              Each tuned down to the detail and included on every tier — no
              per-module paywalls. All driven from the app you run.
            </p>
          </div>
          <div data-hud-reveal>
            <OsWindow title="Zorro — Modules">
              {moduleCategories.map((g, i) => (
                <div key={g.id} className={styles.loadoutRow}>
                  <span className={styles.loIdx}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.loCat}>
                    <g.icon /> {g.label}
                  </span>
                  <span className={styles.loTeaser}>{g.teaser}</span>
                  <span className={styles.loStat}>● READY</span>
                </div>
              ))}
              <div className={styles.winFoot}>
                <Link href="/docs/modules">Open full modules reference →</Link>
              </div>
            </OsWindow>
          </div>
        </div>
      </section>

      {/* access tiers + single shared includes panel */}
      <section className={`${styles.section} ${styles.sectionFlush}`}>
        <div className={styles.wrap}>
          <div data-hud-reveal>
            <p className={styles.kicker}>Access tiers</p>
            <h2 className={styles.h2}>One license. Everything unlocked.</h2>
            <p className={styles.sub}>
              Every tier ships the full client — duration is the only difference.
              Longer plans cost less per month.
            </p>
          </div>
          <div className={styles.tiers}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`${styles.tier} ${plan.featured ? styles.tierFeatured : ""}`}
                data-hud-reveal
              >
                {plan.badge && <span className={styles.badge}>{plan.badge}</span>}
                <div className={styles.tierName}>{plan.name}</div>
                <div className={styles.tierPrice}>
                  <b>{plan.price}</b>
                  <span className={styles.tierCadence}>{plan.cadence}</span>
                </div>
                {plan.note && <div className={styles.tierNote}>{plan.note}</div>}
                <Link
                  href="/signup"
                  className={`${styles.tierBtn} ${plan.featured ? styles.tierBtnPrimary : ""}`}
                >
                  Get {siteConfig.name}
                </Link>
              </div>
            ))}
          </div>
          {/* the included list, shown ONCE — every plan unlocks all of it */}
          <div className={styles.includes} data-hud-reveal>
            <span className={styles.includesTitle}>Every tier includes</span>
            <ul className={styles.includesList}>
              {included.map((item) => (
                <li key={item}>
                  <Check /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* faq */}
      <section className={`${styles.section} ${styles.sectionFlush}`}>
        <div className={styles.wrap}>
          <div data-hud-reveal>
            <p className={styles.kicker}>Intel</p>
            <div className={styles.faqWrap} style={{ marginTop: 8 }}>
              <FaqSection items={productFaqs} heading="Questions, answered" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${styles.section} ${styles.sectionFlush}`}>
        <div className={styles.wrap}>
          <div className={styles.cta} data-hud-reveal>
            <div aria-hidden className={styles.ctaGlow} />
            <h2 className={styles.ctaTitle}>
              Your edge is <span>one download</span> away
            </h2>
            <p className={styles.ctaSub}>
              Create an account, pick a tier, and be in-game in minutes — on
              whatever client you run.
            </p>
            <Link href="/signup" className={styles.ctaBtn}>
              <Swords /> Get {siteConfig.name} <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
