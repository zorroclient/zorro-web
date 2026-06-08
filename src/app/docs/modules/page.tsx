import Link from "next/link";
import type { Metadata } from "next";
import { Crosshair, Move, Eye, Boxes, Wrench, ArrowLeft } from "lucide-react";
import { DocsToc } from "@/components/docs/docs-toc";

export const metadata: Metadata = {
  title: "Modules reference",
  description:
    "Every Zorro module explained in detail, with the settings you can tune on each.",
};

type Module = {
  name: string;
  summary: string;
  settings: { name: string; detail: string }[];
};

type Category = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  blurb: string;
  modules: Module[];
};

const categories: Category[] = [
  {
    id: "combat",
    label: "Combat",
    icon: Crosshair,
    blurb: "Everything around hitting harder, faster, and more consistently.",
    modules: [
      {
        name: "Reach",
        summary:
          "Extends your effective attack range beyond the vanilla hit distance.",
        settings: [
          { name: "Range", detail: "Target reach distance, in blocks." },
          {
            name: "Combat only",
            detail: "Only apply the extra reach while actively attacking.",
          },
        ],
      },
      {
        name: "Velocity",
        summary:
          "Reduces or cancels the knockback you take when you get hit.",
        settings: [
          {
            name: "Horizontal %",
            detail: "How much horizontal knockback to keep (0 = none).",
          },
          {
            name: "Vertical %",
            detail: "How much vertical knockback to keep.",
          },
        ],
      },
      {
        name: "Aim Assist",
        summary: "Nudges your crosshair toward the nearest valid target.",
        settings: [
          { name: "FOV", detail: "Cone, in degrees, the assist will engage within." },
          { name: "Speed", detail: "How quickly the aim moves toward target." },
          { name: "Smoothing", detail: "Higher values look more human." },
        ],
      },
      {
        name: "Kill Aura",
        summary: "Automatically attacks targets that enter range.",
        settings: [
          { name: "Range", detail: "Distance at which targets are engaged." },
          { name: "CPS", detail: "Attacks per second." },
          { name: "Targets", detail: "Players, mobs, or both." },
        ],
      },
      {
        name: "Autoclicker",
        summary: "Clicks for you at a configurable, randomized rate.",
        settings: [
          { name: "CPS range", detail: "Min/max clicks per second." },
          { name: "Button", detail: "Left, right, or both." },
        ],
      },
      {
        name: "AutoPot",
        summary: "Throws splash potions at the right moment automatically.",
        settings: [
          { name: "Health threshold", detail: "Health level that triggers a pot." },
          { name: "Potion type", detail: "Which potion to prioritize." },
        ],
      },
      {
        name: "RightClicker",
        summary: "Automates right-click actions (e.g. blocking, using items).",
        settings: [{ name: "CPS", detail: "Right-clicks per second." }],
      },
      {
        name: "WTap",
        summary: "Taps W on hit to reset sprint and boost knockback.",
        settings: [
          { name: "Mode", detail: "When to trigger the tap (on hit / on attack)." },
        ],
      },
    ],
  },
  {
    id: "movement",
    label: "Movement",
    icon: Move,
    blurb: "Move further, faster, or in ways the server doesn't expect.",
    modules: [
      {
        name: "Timer",
        summary: "Speeds up or slows down the game's tick rate for you.",
        settings: [{ name: "Speed", detail: "Tick multiplier (1.0 = normal)." }],
      },
      {
        name: "Flight",
        summary: "Lets you fly freely, with configurable speed and mode.",
        settings: [
          { name: "Speed", detail: "Horizontal/vertical fly speed." },
          { name: "Mode", detail: "Creative-style, glide, or bounce." },
        ],
      },
      {
        name: "FastBridge",
        summary: "Assists with quick, stable bridging (e.g. god-bridge motion).",
        settings: [{ name: "Mode", detail: "Bridging style to assist." }],
      },
      {
        name: "Keep Sprint",
        summary: "Keeps you sprinting through hits and actions that normally stop it.",
        settings: [],
      },
    ],
  },
  {
    id: "visual",
    label: "Visual",
    icon: Eye,
    blurb:
      "On-screen rendering. Note: these are drawn into your frame — they show up on stream.",
    modules: [
      {
        name: "Fullbright",
        summary: "Lights the world to maximum brightness regardless of gamma.",
        settings: [{ name: "Mode", detail: "Gamma boost or night-vision style." }],
      },
      {
        name: "ESP",
        summary: "Draws boxes/outlines around entities through walls.",
        settings: [
          { name: "Targets", detail: "Players, mobs, items." },
          { name: "Style", detail: "Box, outline, or filled." },
          { name: "Color", detail: "Render color." },
        ],
      },
      {
        name: "Tracers",
        summary: "Draws lines from you to nearby entities.",
        settings: [
          { name: "Targets", detail: "Which entities to trace." },
          { name: "Color", detail: "Line color." },
        ],
      },
      {
        name: "NameTags",
        summary: "Enhanced, always-readable nametags above players.",
        settings: [
          { name: "Scale", detail: "Tag size." },
          { name: "Show health", detail: "Display target health on the tag." },
        ],
      },
    ],
  },
  {
    id: "world",
    label: "World",
    icon: Boxes,
    blurb: "Find and highlight things in the world around you.",
    modules: [
      {
        name: "Block Search",
        summary: "Highlights specific block types within range.",
        settings: [
          { name: "Blocks", detail: "Which block IDs to search for." },
          { name: "Range", detail: "Search radius." },
        ],
      },
      {
        name: "Chest ESP",
        summary: "Highlights chests and other containers through walls.",
        settings: [{ name: "Color", detail: "Highlight color." }],
      },
      {
        name: "Spawner ESP",
        summary: "Highlights mob spawners through walls.",
        settings: [{ name: "Color", detail: "Highlight color." }],
      },
      {
        name: "Container ESP",
        summary: "Highlights all container blocks (chests, barrels, shulkers).",
        settings: [{ name: "Types", detail: "Which container types to show." }],
      },
    ],
  },
  {
    id: "utility",
    label: "Utility",
    icon: Wrench,
    blurb: "Quality-of-life and safety tools.",
    modules: [
      {
        name: "AutoFish",
        summary: "Automatically reels in and recasts when you get a bite.",
        settings: [
          { name: "Recast delay", detail: "Pause before casting again." },
        ],
      },
      {
        name: "Drop Blocker",
        summary: "Prevents accidental item drops.",
        settings: [{ name: "Mode", detail: "Block Q, block inventory drops, or both." }],
      },
      {
        name: "Panic",
        summary:
          "Instantly disables everything and tears the client down — your fast bail-out.",
        settings: [
          { name: "Hotkey", detail: "Key that triggers the panic action." },
          {
            name: "Action",
            detail: "Disable all modules, soft-unload, or full self-destruct.",
          },
        ],
      },
    ],
  },
];

export default function ModulesDocsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-32 sm:px-6 lg:pb-24 lg:pt-40">
      <div className="max-w-2xl">
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to docs
        </Link>
        <p className="mt-6 text-xs uppercase tracking-widest text-brand">
          Reference
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Modules reference</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Every module, grouped by category, with the settings you can tune on
          each. All modules are included on every plan.
        </p>
      </div>

      <div className="mt-14 gap-12 lg:grid lg:grid-cols-[200px_1fr]">
        {/* sticky scroll-spy TOC */}
        <aside className="hidden lg:block">
          <DocsToc
            title="Categories"
            items={categories.map((c) => ({ id: c.id, label: c.label }))}
          />
        </aside>

        <div className="space-y-16">
          {categories.map((cat) => (
            <section key={cat.id} id={cat.id} className="scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-brand/30 bg-brand/10 text-brand">
                  <cat.icon className="h-5 w-5" />
                </span>
                <h2 className="text-2xl font-bold">{cat.label}</h2>
              </div>
              <p className="mt-3 text-muted-foreground">{cat.blurb}</p>

              <div className="mt-6 space-y-4">
                {cat.modules.map((mod) => (
                  <div
                    key={mod.name}
                    className="rounded-xl border border-border/60 bg-card/40 p-5"
                  >
                    <h3 className="font-heading text-lg font-semibold">
                      {mod.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {mod.summary}
                    </p>
                    {mod.settings.length > 0 && (
                      <dl className="mt-4 space-y-2 border-t border-border/60 pt-4">
                        {mod.settings.map((s) => (
                          <div
                            key={s.name}
                            className="grid grid-cols-1 gap-1 sm:grid-cols-[160px_1fr] sm:gap-4"
                          >
                            <dt className="font-mono text-xs text-foreground/80">
                              {s.name}
                            </dt>
                            <dd className="text-sm text-muted-foreground">
                              {s.detail}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
