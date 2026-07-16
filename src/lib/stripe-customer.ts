import "server-only";

import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

type StripeCustomerUser = Pick<User, "id" | "email">;

/**
 * Returns the single Stripe Customer associated with a Supabase user.
 *
 * The database mapping is the fast path. Metadata search recovers customers
 * created before a webhook/database write completed, and Stripe idempotency
 * closes the remaining race when two first checkouts start at once.
 */
export async function getOrCreateStripeCustomer(
  user: StripeCustomerUser,
): Promise<string> {
  const admin = createAdminClient();
  const { data: existing, error: lookupError } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (lookupError) throw lookupError;

  const stripe = getStripe();
  let customerId = existing?.stripe_customer_id as string | undefined;

  if (!customerId) {
    const found = await stripe.customers.search({
      query: `metadata['supabase_user_id']:'${user.id}'`,
      limit: 1,
    });
    customerId = found.data[0]?.id;
  }

  if (!customerId) {
    const customer = await stripe.customers.create(
      {
        email: user.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      },
      { idempotencyKey: `supabase-customer-${user.id}` },
    );
    customerId = customer.id;
  }

  // Persist immediately so every checkout and webhook converges on the same
  // customer even before the first subscription has completed.
  const { error: persistError } = await admin.from("subscriptions").upsert(
    { user_id: user.id, stripe_customer_id: customerId },
    { onConflict: "user_id" },
  );

  if (persistError) throw persistError;
  return customerId;
}
