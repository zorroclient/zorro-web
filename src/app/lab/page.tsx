import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Swords, Ghost, ArrowRight } from "lucide-react";
import { HeroMotion } from "@/components/lab/hero-motion";
import { ClientMarquee } from "@/components/client-marquee";
import { PricingPlans } from "@/components/pricing-plans";
import { FaqSection } from "@/components/faq-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { productFaqs } from "@/lib/faq";
import { siteConfig } from "@/lib/nav";
import { features } from "@/lib/features";
import { moduleCategories } from "@/lib/modules";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Lab — full page concept",
};

const compatibility = ["Lunar", "Vanilla", "Cosmic", "+ more"];

// Full-page concept (new-ui). Ink hero + dark editorial sections on shadcn
// primitives (Button/Card); bespoke CSS only for the ink hero visuals.
export default async function LabPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // logged-in users go straight to their download; everyone else signs up
  const getHref = user ? "/account/download" : "/signup";

  return (
    <div className="lab">
      <HeroMotion />
      <div aria-hidden className="lab-grain bg-grain" />
      <div aria-hidden className="lab-figure-glow-2" />

      {/* Hero */}
      <section className="lab-hero" id="lab-hero">
        <div className="lab-figure-wrap" aria-hidden>
          <div className="lab-figure-beam" />
          <div className="lab-figure">
            <Image
              src="/brand/figure-trimmed.png"
              alt=""
              width={914}
              height={623}
              priority
            />
          </div>
          <div className="lab-figure-rim">
            <Image
              src="/brand/figure-trimmed.png"
              alt=""
              width={914}
              height={623}
              priority
            />
          </div>
        </div>

        <div className="lab-copy">
          <span className="lab-eyebrow lab-reveal">
            <span className="" /> • Ghost client for Minecraft •
          </span>
          <h1 className="lab-display">
            <span className="lab-line">
              <span>One client.</span>
            </span>
            <span className="lab-line">
              <span className="lab-blade">Every advantage.</span>
            </span>
          </h1>
          <div className="lab-slash" aria-hidden />
          <p className="lab-lead lab-reveal">
            One client that runs clean on Lunar, vanilla, Cosmic — or any server
            you play. Lightweight, always current, and gone without a trace.
          </p>
          <div className="lab-actions lab-reveal">
            <Button asChild size="lg" className="h-11 px-6 text-[15px]">
              <Link href={getHref}>
                <Swords />
                Get Zorro
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 px-6 text-[15px]"
            >
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
          <div className="mt-10">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Works with
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                {compatibility.map((c) => (
                  <span
                    key={c}
                    className="font-heading text-sm font-medium text-foreground/80"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* Supported clients */}
      <ClientMarquee />

      <div className="lab-cut-wrap">
        <div className="lab-slash-cut" aria-hidden />
        <div className="lab-dark">
          {/* Features */}
          <section className="lab-section">
            <div className="lab-wrap">
              <p className="lab-kicker2 lab-s-reveal">Why Zorro</p>
              <h2 className="lab-h2 lab-s-reveal">Every edge, in one client</h2>
              <p className="lab-sub lab-s-reveal">
                Combat, movement, and visuals — fully configurable, tuned to
                stay smooth.
              </p>
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((f) => (
                  <Card
                    key={f.title}
                    className="lab-s-reveal gap-3 bg-card/40 p-6"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand/30 bg-brand/10 text-brand">
                      <f.icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-heading font-semibold">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {f.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Modules */}
          <section className="lab-section" id="lab-teaser">
            <div className="lab-wrap">
              <p className="lab-kicker2 lab-s-reveal">Inside the client</p>
              <h2 className="lab-h2 lab-s-reveal">Every edge, in one blade.</h2>
              <p className="lab-sub lab-s-reveal">
                Five categories, 20+ modules — each tuned down to the detail and
                included on every plan.
              </p>
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {moduleCategories.map((g) => (
                  <Card
                    key={g.id}
                    className="lab-s-reveal gap-2 bg-card/40 p-5"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand/30 bg-brand/10 text-brand">
                      <g.icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-heading font-semibold">{g.label}</h3>
                    <p className="text-sm text-muted-foreground">{g.teaser}</p>
                  </Card>
                ))}
              </div>
              <p className="mt-8 text-sm text-muted-foreground">
                <Link href="/docs/modules" className="text-brand hover:underline">
                  See the full modules reference →
                </Link>
              </p>
            </div>
          </section>

          {/* Pricing */}
          <section className="lab-section">
            <div className="lab-wrap">
              <p className="lab-kicker2 lab-s-reveal">Pricing</p>
              <h2 className="lab-h2 lab-s-reveal">Simple, honest pricing</h2>
              <p className="lab-sub lab-s-reveal">
                One subscription unlocks everything. Pick how long you want it —
                longer plans cost less per month.
              </p>
              <div className="lab-s-reveal">
                <PricingPlans className="mt-12" />
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="lab-section">
            <div className="lab-wrap">
              <FaqSection items={productFaqs} />
            </div>
          </section>

          {/* CTA */}
          <section className="lab-section pt-0">
            <div className="lab-wrap">
              <div className="lab-cta lab-s-reveal">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-brand/40 bg-brand/15 text-brand">
                  <Ghost className="h-7 w-7" />
                </span>
                <h2 className="lab-h2 mt-6">Your edge is one download away</h2>
                <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                  Create an account, pick a plan, and be in-game in minutes — on
                  whatever client you run.
                </p>
                <Button asChild size="lg" className="mt-8 h-11 px-6 text-[15px]">
                  <Link href={getHref}>
                    <Swords />
                    Get {siteConfig.name}
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
