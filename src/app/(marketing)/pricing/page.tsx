import Link from "next/link";
import type { Metadata } from "next";
import { Check, Zap, ShieldCheck, RefreshCw } from "lucide-react";
import { PricingPlans } from "@/components/pricing-plans";
import { Faq } from "@/components/site/faq";
import { SectionHeader } from "@/components/site/section-header";
import { Panel } from "@/components/site/panel";
import { pricingFaqs } from "@/lib/faq";
import { included } from "@/lib/pricing";
import { siteConfig } from "@/lib/nav";
import styles from "@/components/site/hud.module.css";

const trust = [
  { icon: Zap, label: "Instant access", detail: "Live the moment you check out." },
  { icon: RefreshCw, label: "Cancel anytime", detail: "No lock-in, no hassle." },
  { icon: ShieldCheck, label: "Secure checkout", detail: "Payments handled by Stripe." },
];

export const metadata: Metadata = {
  title: "Pricing",
  description: `Get ${siteConfig.name} — pick the plan that fits. One subscription works on every client and server.`,
};

export default function PricingPage() {
  return (
    <section className={styles.section} style={{ paddingTop: "7rem" }}>
      <div className={styles.wrap}>
        <SectionHeader
          kicker="Access tiers"
          title="One license. Everything unlocked."
          sub={`Every plan unlocks all of ${siteConfig.name} — pick how long you want it. Longer plans cost less per month.`}
        />

        <PricingPlans />

        {/* what's included — once */}
        <div className={styles.includes} data-hud-reveal style={{ marginTop: 24 }}>
          <span className={styles.includesTitle}>Every plan includes</span>
          <ul className={styles.includesList}>
            {included.map((item) => (
              <li key={item}>
                <Check /> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* trust strip */}
        <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
          {trust.map((t) => (
            <Panel key={t.label} className="flex items-center gap-3">
              <span className={styles.cellIcon}>
                <t.icon />
              </span>
              <span>
                <span className="block text-sm font-medium">{t.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {t.detail}
                </span>
              </span>
            </Panel>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 72 }}>
          <SectionHeader kicker="Billing" title="Pricing &amp; billing" />
          <div data-hud-reveal style={{ marginTop: 24 }}>
            <Faq items={pricingFaqs} />
          </div>
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Still unsure?{" "}
          <Link href="/#features" style={{ color: "var(--color-brand)" }}>
            See what&apos;s inside the client
          </Link>{" "}
          or{" "}
          <Link href="/signup" style={{ color: "var(--color-brand)" }}>
            create an account
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
