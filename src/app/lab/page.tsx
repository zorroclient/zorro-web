import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Lab — hero concept",
};

// Experimental hero exploring the ink / brushstroke direction (new-ui branch).
// Monochrome ink world + orange as the "blade" accent. View at /lab.
export default function LabPage() {
  return (
    <section className="relative isolate flex min-h-[88svh] items-center overflow-hidden bg-background">
      {/* texture + depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-[0.2] mix-blend-soft-light"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(110%_70%_at_70%_-10%,rgb(255_122_24/0.12),transparent_55%)]"
      />
      {/* diagonal orange blade sweep */}
      <div
        aria-hidden
        className="lab-fade pointer-events-none absolute -left-1/4 top-1/2 -z-10 h-px w-[150%] -translate-y-1/2 -rotate-[8deg] bg-linear-to-r from-transparent via-brand/40 to-transparent"
        style={{ animationDelay: "0.6s" }}
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-24 md:grid-cols-[1.1fr_0.9fr]">
        {/* copy */}
        <div>
          <p
            className="lab-fade font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground"
            style={{ animationDelay: "0.05s" }}
          >
            · Ghost client · 
          </p>

          <h1
            className="lab-fade mt-6 font-heading text-6xl font-extrabold leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl"
            style={{ animationDelay: "0.18s" }}
          >
            Strike from
            <br />
            the{" "}
            <span className="relative inline-block italic text-brand">
              shadows
              <svg
                aria-hidden
                viewBox="0 0 320 24"
                className="absolute -bottom-4 left-0 w-full"
                height="24"
                fill="none"
              >
                <path
                  className="lab-slash"
                  pathLength={1}
                  d="M4 16 C 90 2, 170 22, 316 8"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p
            className="lab-fade mt-9 max-w-md text-lg text-muted-foreground"
            style={{ animationDelay: "0.32s" }}
          >
            One client, every server. Loads without a trace, vanishes on
            command — the edge nobody sees coming.
          </p>

          <div
            className="lab-fade mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "0.46s" }}
          >
            <Button asChild size="lg">
              <Link href="/signup">Get Zorro</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>

        {/* the mark — its black background drops out via screen blend, leaving
            just the white ink art floating on the dark hero */}
        <div className="lab-reveal relative flex justify-center md:justify-end">
          <Image
            src="/brand/logo-transparent.png"
            alt="Zorro"
            width={560}
            height={560}
            priority
            className="w-[78%] max-w-md md:w-full"
          />
        </div>
      </div>
    </section>
  );
}
