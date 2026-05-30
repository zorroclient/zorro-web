import { siteConfig } from "@/lib/nav";

export type Faq = { q: string; a: string };

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
    a: "Zorro is built to stay quiet — it loads without a trace and can soft-unload or fully self-destruct on command. No client can promise total safety, but keeping your footprint minimal is a core design goal.",
  },
  {
    q: "Is it safe to stream or screen-share?",
    a: `Yes. You can close the ${siteConfig.name} window completely and it keeps running in the background — no visible window, nothing on screen to give it away. Your stream or screen-share looks clean while everything stays active in-game.`,
  },
  {
    q: "Will it slow down my game?",
    a: `No — ${siteConfig.name} is built to stay light. It runs without frame drops or stutter, so your game feels exactly the way it does without it.`,
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
