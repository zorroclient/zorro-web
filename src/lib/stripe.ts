import Stripe from "stripe";

// Server-only Stripe client. Constructed lazily so a missing key never blows up
// at build/prerender time — it only throws when code actually reaches for it.
let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    client = new Stripe(key);
  }
  return client;
}
