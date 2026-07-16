import Link from "next/link";
import type { Metadata } from "next";
import {
  Download,
  Cpu,
  Layers,
  Ghost,
  RefreshCw,
  ShieldAlert,
  Monitor,
  Radio,
  ArrowRight,
} from "lucide-react";
import { siteConfig } from "@/lib/nav";
import { moduleCategories } from "@/lib/modules";
import { DocsToc } from "@/components/docs/docs-toc";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "How Zorro works — installation, the module system, stealth, updates, and what to expect.",
};

const sections = [
  { id: "overview", label: "Overview" },
  { id: "requirements", label: "Requirements" },
  { id: "getting-started", label: "Getting started" },
  { id: "how-it-works", label: "How it works" },
  { id: "modules", label: "Modules" },
  { id: "stealth", label: "Stealth & cleanup" },
  { id: "updates", label: "Updates" },
  { id: "safety", label: "Safety & bans" },
  { id: "streaming", label: "Streaming" },
] as const;


export default function DocsPage() {
  return (
    <div className="relative z-[1] mx-auto w-full max-w-[76rem] px-5 pb-16 pt-32 sm:px-8 lg:pb-24 lg:pt-40">
      {/* header */}
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-brand">
          Documentation
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          How {siteConfig.name} works
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to get running — installation, the module system,
          how it stays out of sight, and what to expect.
        </p>
      </div>

      <div className="mt-14 gap-12 lg:grid lg:grid-cols-[200px_1fr]">
        {/* sticky scroll-spy TOC */}
        <aside className="hidden lg:block">
          <DocsToc items={sections} />
        </aside>

        {/* content */}
        <div className="max-w-3xl space-y-16">
          <Link
            href="/docs/modules"
            className="flex items-center justify-between gap-4 rounded-none border border-brand/30 bg-brand/5 p-5 transition-colors hover:border-brand/50"
          >
            <span className="flex items-center gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-brand/30 bg-brand/10 text-brand">
                <Layers className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-heading font-semibold text-foreground">
                  Modules reference
                </span>
                <span className="block text-sm text-muted-foreground">
                  Every module and every setting, explained in detail.
                </span>
              </span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-brand" />
          </Link>

          <Doc id="overview" icon={Ghost} title="Overview">
            <p>
              {siteConfig.name} is a Minecraft <strong>ghost client</strong> — a
              standalone external program that runs alongside your game and adds
              a configurable set of modules (combat, movement, visuals, world,
              and utility). It isn&apos;t a mod you install into a launcher and
              it isn&apos;t a resource pack; it&apos;s its own application you
              run on your machine.
            </p>
            <p>
              It works on Lunar, vanilla, Cosmic, and effectively any client or
              server you play, because it attaches to the running game rather
              than shipping as a mod for one specific launcher.
            </p>
          </Doc>

          <Doc id="requirements" icon={Monitor} title="Requirements">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Windows</strong> — the current build is Windows-only.
                macOS and possibly Linux builds are planned but not available
                yet.
              </li>
              <li>An active {siteConfig.name} subscription.</li>
              <li>
                A working Minecraft installation (the client/launcher you
                normally play on).
              </li>
            </ul>
          </Doc>

          <Doc id="getting-started" icon={Download} title="Getting started">
            <ol className="list-decimal space-y-3 pl-5">
              <li>
                <strong>Create an account</strong> and{" "}
                <Link href="/pricing" className="text-brand hover:underline">
                  pick a plan
                </Link>
                . Every plan unlocks every module — longer plans just cost less
                per month.
              </li>
              <li>
                <strong>Download the build</strong> from your{" "}
                <Link
                  href="/account/download"
                  className="text-brand hover:underline"
                >
                  account
                </Link>
                . Downloads are gated behind an active subscription.
              </li>
              <li>
                <strong>Launch Minecraft</strong>, then run {siteConfig.name}.
              </li>
              <li>
                <strong>Configure your modules</strong> and play. The client
                stays current automatically — see{" "}
                <a href="#updates" className="text-brand hover:underline">
                  Updates
                </a>
                .
              </li>
            </ol>
          </Doc>

          <Doc id="how-it-works" icon={Cpu} title="How it works">
            <p>
              {siteConfig.name} runs as a separate program and attaches to the
              live Minecraft process. From there it reads game state and drives
              its modules in real time. Because it operates externally rather
              than being baked into a single launcher, the same build follows
              you across the clients and servers you play.
            </p>
            <p>
              All configuration lives in {siteConfig.name}&apos;s own interface
              — toggling modules, tuning their settings, and triggering cleanup
              all happen there, not inside an in-game menu.
            </p>
          </Doc>

          <Doc id="modules" icon={Layers} title="Modules">
            <p>
              Modules are grouped into five categories. Every module is included
              on every plan — there are no tiered feature gates. Each one is
              individually tunable. For a full breakdown of every module and its
              settings, see the{" "}
              <Link
                href="/docs/modules"
                className="text-brand hover:underline"
              >
                modules reference
              </Link>
              .
            </p>
            <div className="not-prose mt-6 grid gap-4 sm:grid-cols-2">
              {moduleCategories.map((group) => (
                <div
                  key={group.id}
                  className="rounded-none border border-border/60 bg-card/40 p-5"
                >
                  <h3 className="font-heading text-sm font-semibold">
                    {group.label}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.modules.map((m) => (
                      <span
                        key={m.name}
                        className="rounded-none border border-border/60 bg-muted/40 px-2.5 py-1 text-xs text-foreground/80"
                      >
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Doc>

          <Doc id="stealth" icon={Ghost} title="Stealth & cleanup">
            <p>
              {siteConfig.name} is built to leave as little behind as possible.
              You can <strong>soft-unload</strong> mid-session to detach
              cleanly, or trigger a full <strong>Panic</strong> self-destruct on
              demand — the client tears itself down and cleans up after itself,
              so nothing is left running.
            </p>
          </Doc>

          <Doc id="updates" icon={RefreshCw} title="Updates">
            <p>
              Builds are auto-updating, so you stay current the moment something
              changes. When Minecraft or a client updates, {siteConfig.name}{" "}
              follows — you don&apos;t need to manually re-download for routine
              updates.
            </p>
          </Doc>

          <Doc id="safety" icon={ShieldAlert} title="Safety & bans">
            <p>
              There is <strong>no guarantee</strong> against detection. Modern
              anti-cheats are genuinely good, and any client carries risk. Use
              your own judgment about where and how you play, and lean on
              utility modules like Panic if you need to bail out fast.
            </p>
            <p className="text-sm text-muted-foreground">
              Some antivirus software may flag {siteConfig.name}. Because it
              attaches to another process, that behavior can look suspicious to
              heuristic scanners even though it&apos;s expected — see the{" "}
              <Link href="/#faq" className="text-brand hover:underline">
                FAQ
              </Link>{" "}
              for details.
            </p>
          </Doc>

          <Doc id="streaming" icon={Radio} title="Streaming">
            <p>
              Be careful streaming with visual modules enabled. Anything that
              renders in your game — ESP, Tracers, NameTags and the like — also
              shows up to your viewers, since it&apos;s drawn into the same
              frame you&apos;re broadcasting. Disable visuals before going live
              if you don&apos;t want them on camera.
            </p>
          </Doc>

          <div className="rounded-none border border-brand/30 bg-linear-to-br from-brand/10 to-transparent p-6">
            <h2 className="font-heading text-lg font-semibold">
              Still have questions?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Check the{" "}
              <Link href="/#faq" className="text-brand hover:underline">
                FAQ
              </Link>{" "}
              on the homepage, or{" "}
              <Link href="/signup" className="text-brand hover:underline">
                get {siteConfig.name}
              </Link>{" "}
              and dive in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Doc({
  id,
  title,
  icon: Icon,
  children,
}: {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="flex items-center gap-3 text-2xl font-bold">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-none border border-brand/30 bg-brand/10 text-brand">
          <Icon className="h-5 w-5" />
        </span>
        {title}
      </h2>
      <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}
