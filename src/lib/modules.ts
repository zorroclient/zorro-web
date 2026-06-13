import { Crosshair, Move, Eye, Boxes, Wrench, type LucideIcon } from "lucide-react";

// Single source of truth for the module lineup — consumed by the home page,
// the /lab concept, the docs overview, and the full modules reference.
// Mirrors the mod registry in ghoster (src/dll/runtime/factories/mod_factory.cpp);
// keep in sync with the build.

export type ModuleSetting = { name: string; detail: string };

export type Module = {
  name: string;
  summary: string;
  settings: ModuleSetting[];
};

export type ModuleCategory = {
  id: string;
  label: string;
  icon: LucideIcon;
  // Descriptive sentence (docs reference).
  blurb: string;
  // Short marketing teaser (home/lab cards).
  teaser: string;
  modules: Module[];
};

export const moduleCategories: ModuleCategory[] = [
  {
    id: "combat",
    label: "Combat",
    icon: Crosshair,
    blurb: "Everything around hitting harder, faster, and more consistently.",
    teaser: "Reach, Aim Assist, Kill Aura, Velocity — dialed in.",
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
    teaser: "Flight, Timer, FastBridge, Keep Sprint.",
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
    teaser: "ESP, Tracers, Fullbright, NameTags.",
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
    teaser: "Chest ESP, Block Search, Spawner ESP.",
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
    teaser: "AutoFish, Drop Blocker, Panic.",
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

export const totalModuleCount = moduleCategories.reduce(
  (sum, c) => sum + c.modules.length,
  0,
);
