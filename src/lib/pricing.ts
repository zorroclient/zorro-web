// Single source of truth for plans — used by /pricing and the home page section.
// Adjust numbers / add tiers (e.g. a 2-year) here and both places update.

export type Plan = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  note?: string;
  badge?: string;
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$25",
    cadence: "per month",
    note: "Billed monthly. Cancel anytime.",
  },
  {
    id: "biannual",
    name: "6 Months",
    price: "$120",
    cadence: "per 6 months",
    note: "≈ $20/mo — save 20%.",
    badge: "Most popular",
    featured: true,
  },
  {
    id: "annual",
    name: "1 Year",
    price: "$210",
    cadence: "per year",
    note: "≈ $17.50/mo — save 30%.",
  },
];

// Every plan unlocks the full product — duration is the only difference.
export const included = [
  "Every module — combat, movement, visuals",
  "Works on Lunar, vanilla, Cosmic & more",
  "Auto-updating builds",
  "Stealth load & self-destruct",
  "Instant access after checkout",
];
