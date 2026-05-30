import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PricingPlans } from "@/components/pricing-plans";
import { FaqSection } from "@/components/faq-section";
import { pricingFaqs } from "@/lib/faq";
import { included } from "@/lib/pricing";
import { siteConfig } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Get ${siteConfig.name} — pick the plan that fits. One subscription works on every client and server.`,
};

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_-5%,rgb(255_122_24/0.15),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-[0.15] mix-blend-soft-light"
      />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        {/* heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            One subscription, every advantage
          </div>
          <h1 className="text-4xl font-bold sm:text-5xl">
            Pick your <span className="text-brand">plan</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Every plan unlocks all of {siteConfig.name} — pick how long you want
            it for. Longer plans cost less per month.
          </p>
        </div>

        {/* plans */}
        <PricingPlans className="mt-14" />

        {/* what's included */}
        <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-border/60 bg-card/40 p-7">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Every plan includes
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span className="text-foreground/85">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <FaqSection
          items={pricingFaqs}
          heading="Pricing & billing"
          className="mt-20"
        />

        {/* reassurance */}
        <p className="mx-auto mt-12 max-w-md text-center text-sm text-muted-foreground">
          Still unsure?{" "}
          <Link href="/#features" className="text-brand hover:underline">
            See what&apos;s inside the client
          </Link>{" "}
          or{" "}
          <Link href="/signup" className="text-brand hover:underline">
            create an account
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
