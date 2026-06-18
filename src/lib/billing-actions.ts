"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { priceIdForPlan } from "@/lib/billing";
import { getSubscription } from "@/lib/subscription";

async function originUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

// Starts Stripe Checkout for the given plan. Bound to a plan id and used as a
// <form action>. Redirects unauthenticated visitors to sign up first.
export async function createCheckoutSession(planId: string) {
  const priceId = priceIdForPlan(planId);
  if (!priceId) throw new Error(`Unknown plan: ${planId}`);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/signup?plan=${planId}`);

  // One subscription per user: if they already have an active plan, don't let
  // them start a second checkout. Stripe has no such toggle — this guard is
  // authoritative (covers the UI being bypassed, e.g. a direct form POST).
  // They manage/switch plans through the Stripe billing portal instead.
  const existingSub = await getSubscription(user.id);
  if (existingSub) redirect("/account?error=already-subscribed");

  const stripe = getStripe();

  // One STABLE Stripe customer per user — this is what lets Stripe's
  // "no multiple subscriptions" setting actually enforce no duplicates (it
  // dedupes within a customer, so a new customer per checkout defeats it).
  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  let customerId = existing?.stripe_customer_id as string | undefined;

  // Fall back to a customer we already created for this user (e.g. the webhook
  // hasn't written a row yet) before making a new one.
  if (!customerId) {
    const found = await stripe.customers.search({
      query: `metadata['supabase_user_id']:'${user.id}'`,
      limit: 1,
    });
    customerId = found.data[0]?.id;
  }
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
  }

  // Persist the mapping immediately so a rapid second checkout reuses this same
  // customer even before any webhook lands. (status defaults to 'incomplete',
  // which getSubscription treats as "no access" — so this can't falsely unlock.)
  await admin
    .from("subscriptions")
    .upsert(
      { user_id: user.id, stripe_customer_id: customerId },
      { onConflict: "user_id" },
    );

  const origin = await originUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: user.id,
    metadata: { supabase_user_id: user.id, plan: planId },
    subscription_data: {
      metadata: { supabase_user_id: user.id, plan: planId },
    },
    allow_promotion_codes: true,
    success_url: `${origin}/account/download?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  redirect(session.url);
}

// Opens the Stripe Billing Portal so the user can manage/cancel.
export async function createPortalSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: row } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const customerId = row?.stripe_customer_id as string | undefined;
  if (!customerId) redirect("/pricing");

  const origin = await originUrl();
  const portal = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/account`,
  });
  redirect(portal.url);
}
