// Maps our plan ids (see lib/pricing.ts) to Stripe Price ids and back.
//
// Defaults are the sandbox/test prices for the "Zorro" product. Override per
// environment (e.g. live mode) with STRIPE_PRICE_* env vars.
const PRICE_IDS: Record<string, string> = {
  monthly: process.env.STRIPE_PRICE_MONTHLY ?? "price_1TdUk0QVYUgJ2xZIpvw4q4pn",
  biannual:
    process.env.STRIPE_PRICE_BIANNUAL ?? "price_1TdUk0QVYUgJ2xZIVfst6Bdc",
  annual: process.env.STRIPE_PRICE_ANNUAL ?? "price_1TdUk0QVYUgJ2xZIVbYPLDWK",
};

export function priceIdForPlan(planId: string): string | null {
  return PRICE_IDS[planId] ?? null;
}

export function planForPriceId(priceId: string): string | null {
  const match = Object.entries(PRICE_IDS).find(([, id]) => id === priceId);
  return match ? match[0] : null;
}
