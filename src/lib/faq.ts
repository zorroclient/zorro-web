import { siteConfig } from "@/lib/nav";

export type Faq = { q: string; a: string; href?: string; hrefLabel?: string };

// About the client — shown on the home page.
export const productFaqs: Faq[] = [
  {
    q: "Which clients and servers does it work on?",
    a: `${siteConfig.name} runs on Lunar, vanilla, Cosmic, and most other clients and servers. One subscription covers every setup — there are no per-client add-ons.`,
  },
  {
    q: "Can I run it on multiple clients at once?",
    a: `Yes. ${siteConfig.name} detects every supported client you have open and injects into them when you click on them — one app manages them all, with nothing to set up per client.`,
  },
  {
    q: "Will it get me banned?",
    a: `There's no guarantee it won't. Modern anti-cheats are genuinely good these days, and no client — ${siteConfig.name} included — can promise you'll never get caught. What we focus on is keeping your footprint minimal: it loads without a trace and can soft-unload or fully self-destruct on command. Run it knowing there is a risk.`,
  },
  {
    q: "Is it safe to stream or screen-share?",
    a: `The app itself, yes — you can close the ${siteConfig.name} window completely and it keeps running in the background, so nothing from the client shows up on a stream or screen-share. Visual mods are the exception: anything that draws in your game, like ESP or Tracers, renders on screen just like the rest of the game, so viewers will see it. Keep visuals off if you need your capture to look completely clean.`,
  },
  {
    q: "Will my antivirus flag it?",
    a: `It can. Because ${siteConfig.name} loads into your game, Windows Defender and other antivirus tools sometimes flag it as a false positive — that's normal for anything that injects into another program. If it gets quarantined, allow it through your antivirus and you're good to go.`,
  },
  {
    q: "What happens when my game updates?",
    a: `Updates are handled for you. ${siteConfig.name}'s builds auto-update to keep pace with the games and clients it supports, so there's no reinstalling or patching by hand — when support for a new version lands, it rolls out automatically.`,
  },
  {
    q: "How do I control it?",
    a: `Everything runs from the ${siteConfig.name} app itself — it's a separate program, not an in-game overlay. You toggle modules and tune each one from the app window, and your changes apply live in-game. For setup, per-module options, and the full walkthrough, head to the docs.`,
    href: "/docs",
    hrefLabel: "Read the docs",
  },
];

// About buying — shown on the pricing page.
export const pricingFaqs: Faq[] = [
  {
    q: "How do I get the client after I pay?",
    a: "Access is tied to your account. The moment checkout completes you can log in from anywhere and download the latest build — no waiting, no manual delivery.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Secure card checkout. Your payment details never touch our servers — they're handled by our payment processor.",
  },
  {
    q: "Does my plan renew automatically?",
    a: "Recurring plans renew automatically so you never lose access mid-session. You can turn renewal off at any time from your account.",
  },
  {
    q: "Can I cancel?",
    a: "Anytime. Turn off renewal from your account and you keep access through the end of the period you've already paid for.",
  },
  {
    q: "Do I get updates?",
    a: "Yes. Builds auto-update for the length of your subscription, so you're always on the current version the moment anything changes.",
  },
];
