// Current entitlement for a user.
//
// STUB: billing isn't wired yet (no Stripe), and the beta `license_keys` /
// `app_releases` tables aren't repurposed for web subscriptions yet. So this
// always reports "no subscription". Wire it to the real source later.

export type Subscription = {
  plan: string;
  renewsAt: string | null;
} | null;

export async function getSubscription(userId: string): Promise<Subscription> {
  void userId;
  // TODO: look up the user's active subscription/entitlement (Stripe + license).
  return null;
}
