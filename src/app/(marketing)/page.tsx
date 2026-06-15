import Image from "next/image";
import Link from "next/link";
import { Swords, ArrowRight, Check, Ghost } from "lucide-react";
import { Marquee } from "@/components/site/marquee";
import { BrandSlide } from "@/components/site/brand-slide";
import { OsWindow } from "@/components/site/os-window";
import { Panel } from "@/components/site/panel";
import { SectionHeader } from "@/components/site/section-header";
import { Faq } from "@/components/site/faq";
import { ZorroMockup } from "@/components/zorro-mockup";
import { Button } from "@/components/ui/button";
import { features } from "@/lib/features";
import { moduleCategories } from "@/lib/modules";
import { plans, included } from "@/lib/pricing";
import { productFaqs } from "@/lib/faq";
import { siteConfig } from "@/lib/nav";
import { createAdminClient } from "@/lib/supabase/admin";
import styles from "@/components/site/hud.module.css";

const clients = [
  { name: "Lunar", logo: "/brand/lunar-logo-norm.png", w: 160, h: 48 },
  { name: "Vanilla", logo: "/brand/minecraft.svg", w: 300, h: 51 },
  { name: "Cosmic", logo: "/brand/cosmic-logo-norm.png", w: 160, h: 48 },
  { name: "Badlion", logo: "/brand/badlion-logo-norm.png", w: 160, h: 48 },
  { name: "Forge", logo: "/brand/forge-logo.svg", w: 316, h: 67 },
  { name: "Orbit", logo: "/brand/orbit-logo-norm.png", w: 160, h: 48 },
];

// app_releases isn't client-readable; read the live version with the service
// role client. Version strings are public; any failure falls back to "latest".
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

function Reticle() {
  return (
    <svg
      className={styles.reticle}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
      data-hud-parallax="-16"
    >
      <path
        d="M50 6 V22 M50 78 V94 M6 50 H22 M78 50 H94"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M8 8 H20 M8 8 V20 M92 8 H80 M92 8 V20 M8 92 H20 M8 92 V80 M92 92 H80 M92 92 V80"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="50" cy="50" r="2" fill="currentColor" />
    </svg>
  );
}

export default async function Home() {
  const version = await getLatestVersion();

  return (
    <>
      {/* status bar — true features + live build version */}
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
            {siteConfig.name} runs clean on Lunar, vanilla, Cosmic — or any
            server you load. Loads silent, leaves no trace, and self-destructs on
            command.
          </p>
          <div className={styles.ctaRow}>
            <Button asChild variant="hud" className="h-11 px-6">
              <Link href="/signup">
                <Swords /> Get {siteConfig.name}
              </Link>
            </Button>
            <Button asChild variant="hudOutline" className="h-11 px-6">
              <Link href="/pricing">View pricing</Link>
            </Button>
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
          <svg
            className={styles.reticleSpin}
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeDasharray="2 6"
            />
          </svg>
          <span className={`${styles.callout} ${styles.coTop}`} data-hud-parallax="12">
            <b>●</b> TARGET LOCKED
          </span>
          <span className={`${styles.callout} ${styles.coMid}`} data-hud-parallax="18">
            REACH <b>3.4m</b>
          </span>
          <span className={`${styles.callout} ${styles.coBot}`} data-hud-parallax="9">
            TRACE <b>none</b>
          </span>
        </div>
      </section>

      {/* brand slide */}
      <BrandSlide sub="Ghost client for Minecraft" />

      {/* supported clients */}
      <Marquee items={clients} label="Supported clients" />

      {/* features — asymmetric bento */}
      <section className={styles.section}>
        <div className={styles.wrap}>
          <SectionHeader
            kicker="System overview"
            title="Every edge, one process"
            sub="Combat, movement, and visuals — fully configurable, engineered to stay smooth under load."
          />
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

      {/* inside the client — program mock in an OS window */}
      <section className={`${styles.section} ${styles.sectionFlush}`}>
        <div className={styles.wrap}>
          <SectionHeader
            kicker="Inside the client"
            title="The whole thing, in one app"
            sub="Toggle modules and tune every detail from the desktop app — changes apply live in-game. Click to inject; no commands, no setup."
          />
          <div data-hud-reveal style={{ marginTop: 44 }}>
            <OsWindow title="Zorro">
              <ZorroMockup />
            </OsWindow>
          </div>
        </div>
      </section>

      {/* modules */}
      <section className={`${styles.section} ${styles.sectionFlush}`}>
        <div className={styles.wrap}>
          <SectionHeader
            kicker="The arsenal"
            title="Five categories. 20+ modules."
            sub="Each tuned down to the detail and included on every tier — no per-module paywalls."
          />
          <div className="mt-11 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {moduleCategories.map((g) => (
              <Panel key={g.id} data-hud-reveal>
                <span className={styles.cellIcon}>
                  <g.icon />
                </span>
                <h3 className={styles.cellTitle}>{g.label}</h3>
                <p className={styles.cellDesc}>{g.teaser}</p>
                <span className={styles.panelStatus}>
                  <span className={styles.statusDot} /> {g.modules.length} modules
                </span>
              </Panel>
            ))}
          </div>
          <p className="mt-8 font-mono text-sm" style={{ color: "var(--color-brand)" }}>
            <Link href="/docs/modules">Open full modules reference →</Link>
          </p>
        </div>
      </section>

      {/* pricing */}
      <section className={`${styles.section} ${styles.sectionFlush}`}>
        <div className={styles.wrap}>
          <SectionHeader
            kicker="Access tiers"
            title="One license. Everything unlocked."
            sub="Every tier ships the full client — duration is the only difference. Longer plans cost less per month."
          />
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
                <Button
                  asChild
                  variant={plan.featured ? "hud" : "hudOutline"}
                  className="mt-auto h-11"
                >
                  <Link href="/signup">Get {siteConfig.name}</Link>
                </Button>
              </div>
            ))}
          </div>
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
          <SectionHeader kicker="Intel" title="Questions, answered" />
          <div data-hud-reveal style={{ marginTop: 28 }}>
            <Faq items={productFaqs} />
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
    </>
  );
}
