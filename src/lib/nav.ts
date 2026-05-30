export const siteConfig = {
  name: "Zorro",
  tagline: "The edge you've been looking for.",
} as const;

export const mainNav = [
  { title: "Features", href: "/#features" },
  { title: "Pricing", href: "/pricing" },
  { title: "Docs", href: "/docs" },
] as const;

export const footerNav = [
  { title: "Pricing", href: "/pricing" },
  { title: "Docs", href: "/docs" },
  { title: "Terms", href: "/terms" },
  { title: "Privacy", href: "/privacy" },
] as const;
