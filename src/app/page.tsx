import Link from "next/link";
import { Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ZorroMockup } from "@/components/zorro-mockup";
import { PricingPlans } from "@/components/pricing-plans";
import { FaqSection } from "@/components/faq-section";
import { productFaqs } from "@/lib/faq";
import { siteConfig } from "@/lib/nav";
import { features } from "@/lib/features";
import { moduleCategories, totalModuleCount } from "@/lib/modules";

const compatibility = ["Lunar", "Vanilla", "Cosmic", "+ more"];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        {/* grain + glow backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_75%_-5%,rgb(255_122_24/0.20),transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-[0.18] mix-blend-soft-light"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:py-28">
          {/* copy */}
          <div className="animate-fade-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Ghost client for Minecraft
            </div>
            <h1 className="text-4xl font-bold leading-[1.05] sm:text-6xl">
              One client.
              <br />
              <span className="text-brand">Every advantage.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              {siteConfig.name} is a Minecraft ghost client that runs clean on
              Lunar, vanilla, Cosmic, or any server you play —
              lightweight, always updated, and ready in seconds.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/signup">Get {siteConfig.name}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
            {/* compatibility strip */}
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
          {/* product mockup */}
          <div className="flex justify-center lg:justify-end">
            <ZorroMockup />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Every edge, in one client
          </h2>
          <p className="mt-4 text-muted-foreground">
            Combat, movement, and visuals — fully configurable, tuned to stay
            smooth.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-xl border border-border/60 bg-card/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/50"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand/15 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand/30 bg-brand/10 text-brand">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* stealth highlight */}
        <div className="group relative mt-4 overflow-hidden rounded-xl border border-brand/30 bg-gradient-to-br from-brand/10 to-transparent p-6 sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/15 blur-3xl"
          />
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-brand/40 bg-brand/15 text-brand">
              <Ghost className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold">
                Leaves no trace
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Soft-unload mid-session or trigger a full self-destruct on
                demand — {siteConfig.name} &nbsp;cleanly tears itself down and wipes
                up after itself, so nothing&apos;s left behind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inside the client */}
      <section id="modules" className="border-y border-border/60 bg-card/20">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Inside the client
            </h2>
            <p className="mt-4 text-muted-foreground">
              {totalModuleCount} modules across five categories — each fully
              configurable and tuned to stay smooth.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-5">
            {moduleCategories.map((group) => (
              <div
                key={group.id}
                className="w-full rounded-xl border border-border/60 bg-card/40 p-6 transition-colors hover:border-brand/50 sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.84rem)]"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand/30 bg-brand/10 text-brand">
                    <group.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-heading font-semibold leading-tight">
                      {group.label}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {group.modules.length}{" "}
                      {group.modules.length === 1 ? "module" : "modules"}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.modules.map((m) => (
                    <span
                      key={m.name}
                      className="rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 text-xs text-foreground/80"
                    >
                      {m.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Every module is included on every plan — no tiered feature gates.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Simple, honest pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            One subscription unlocks everything. Pick how long you want it —
            longer plans cost less per month.
          </p>
        </div>
        <PricingPlans className="mt-12" />
        <p className="mt-8 text-center text-sm text-muted-foreground">
          <Link href="/pricing" className="text-brand hover:underline">
            See the full pricing page →
          </Link>
        </p>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 sm:px-6">
        <FaqSection items={productFaqs} />
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/15 via-card/40 to-background px-6 py-16 text-center sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-brand/25 blur-[120px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-[0.15] mix-blend-soft-light"
          />
          <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-brand/40 bg-brand/15 text-brand">
            <Ghost className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Your edge is one download away
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Create an account, pick a plan, and be in-game in minutes — on
            whatever client you run.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/signup">Get {siteConfig.name}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
