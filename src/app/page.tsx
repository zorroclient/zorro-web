import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/nav";

const features = [
  {
    title: "Built for performance",
    description:
      "Lightweight, fast, and engineered to stay out of your way while it works.",
  },
  {
    title: "Always up to date",
    description:
      "Auto-updating builds keep you current the moment something changes.",
  },
  {
    title: "Simple to run",
    description: "Download, launch, done. No convoluted setup, no babysitting.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgb(255_122_24/0.15),transparent)]"
        />
        <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            Now available
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            {siteConfig.tagline}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            {siteConfig.name} gives you a serious advantage — fast, reliable, and
            kept current automatically. One subscription, instant access.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">Get {siteConfig.name}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/60 bg-card/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-muted/40 to-transparent px-6 py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to get the edge?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Create an account and start in minutes.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/signup">Get {siteConfig.name}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
