import Link from "next/link";
import { Globe, SlidersHorizontal, RefreshCw, Gauge, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ZorroMockup } from "@/components/zorro-mockup";
import { siteConfig } from "@/lib/nav";

const compatibility = ["Lunar", "Vanilla", "Cosmic", "+ more"];

const features = [
  {
    icon: Globe,
    title: "Runs anywhere",
    description:
      "Lunar, vanilla, Cosmic or any server you play on. One subscription, every setup.",
  },
  {
    icon: SlidersHorizontal,
    title: "Dialed-in control",
    description:
      "Dozens of modules across combat, movement, and visuals — each tunable down to the detail.",
  },
  {
    icon: RefreshCw,
    title: "Always current",
    description:
      "Auto-updating builds keep you ahead the moment anything changes.",
  },
  {
    icon: Gauge,
    title: "Clean & lightweight",
    description:
      "Engineered to stay smooth and out of your way — no frame drops, no babysitting.",
  },
];

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

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 px-6 py-16 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_120%_at_50%_0%,rgb(255_122_24/0.15),transparent)]"
          />
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to get the edge?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Create an account and be in-game in minutes.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/signup">Get {siteConfig.name}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
