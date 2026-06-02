# Full-Control Checkout — Spec

> Status: spec / not yet implemented. Goal: replace the hosted Stripe Checkout
> redirect with an on-site checkout we fully own and style.
> Author handoff: 2026-06-02. Branch context: `stripe-billing`.

## Goal

Today "Get Zorro" calls `createCheckoutSession()` which redirects to Stripe's
**hosted** Checkout page. We want the payment step to live **on our own page**,
styled to match the site (orange `#ff7a18` / dark theme), instead of bouncing to
a Stripe-branded URL.

"Full control" caveat: with the **Payment Element** we own the entire checkout
*page* (layout, copy, summary, theming) and theme the payment widget via the
**Appearance API**. The card-input fields themselves stay inside Stripe's secure
iframe (PCI) — we can theme them (colors, fonts, radius, spacing) but not
restyle their internal DOM. That's the ceiling of "full control" without taking
on PCI scope.

## Current state (reuse, don't rebuild)

- `src/lib/stripe.ts` — server Stripe client (`getStripe()`).
- `src/lib/billing.ts` — `priceIdForPlan()` / `planForPriceId()`.
- `src/lib/billing-actions.ts` — `createCheckoutSession()` (hosted, to be
  replaced) + `createPortalSession()` (keep).
- `src/app/api/stripe/webhook/route.ts` — already provisions the `subscriptions`
  table on `checkout.session.completed` + `customer.subscription.*`.
- `src/lib/subscription.ts` — `getSubscription()` reads entitlement.
- Pricing buttons in `src/components/pricing-plans.tsx` post to the server action.

The webhook + entitlement layer **does not change** — it already keys off the
subscription, regardless of how the payment was collected.

## Target architecture

### Dependencies & env
- Add `@stripe/stripe-js` + `@stripe/react-stripe-js`.
- Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (publishable `pk_…`) to `.env.local`.

### Server — create an incomplete subscription
New server action `createSubscriptionIntent(planId)` (replaces the redirect):
1. Auth + find/create Stripe customer (same logic as `createCheckoutSession`).
2. `stripe.subscriptions.create({ customer, items:[{price}], payment_behavior:
   'default_incomplete', payment_settings:{ save_default_payment_method:
   'on_subscription' }, expand:['latest_invoice.payment_intent'], metadata:{
   supabase_user_id, plan } })`.
3. Return `{ subscriptionId, clientSecret }` (the PaymentIntent client secret).
   No redirect.

### Client — `/checkout?plan=<id>` page
- Client component: `loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)`.
- Fetch the client secret from the server action on mount (or pass via RSC).
- `<Elements stripe={stripe} options={{ clientSecret, appearance }}>` →
  `<PaymentElement />` + an order summary (plan, price, cadence) we render
  ourselves.
- Submit → `stripe.confirmPayment({ elements, confirmParams: { return_url:
  `${origin}/account/download?checkout=success` } })`.

### Appearance (theming)
Build an `appearance` object from our design tokens: `theme:'night'`, brand
orange as `colorPrimary`, card/border/muted backgrounds, Inter/Space Grotesk
fonts, matching border radius. Lives in one helper so it stays in sync with
`globals.css`.

### Return / post-payment
- `return_url` lands on `/account/download` (already gated by `getSubscription`).
- Provisioning is done by the **webhook**, not the return page — handle the
  brief race (webhook lag) with a "finalizing…" state that polls
  `getSubscription` or the PaymentIntent status before showing the unlocked UI.

### Webhook additions
Current handlers are enough for the hosted flow; for the Elements flow also
handle **`invoice.paid` / `invoice.payment_succeeded`** (first-invoice
activation) and confirm `customer.subscription.created/updated` flips status to
`active`. (`checkout.session.completed` will no longer fire — that's fine.)

## Payment flow
1. User clicks Get Zorro → `/checkout?plan=biannual`.
2. Page calls `createSubscriptionIntent` → gets `clientSecret`.
3. PaymentElement renders (themed), user pays (handles 3DS/SCA inline).
4. `confirmPayment` → redirect to `return_url`.
5. Stripe fires `invoice.paid` + `subscription.updated` → webhook upserts
   `subscriptions` row `active`.
6. `/account/download` shows unlocked (after the finalizing poll resolves).

## States & edge cases
- **SCA/3DS**: handled by `confirmPayment` (may redirect & return).
- **Declined / failed**: show inline error, stay on page, allow retry.
- **Processing**: PaymentIntent `processing` → show pending, rely on webhook.
- **Abandoned**: incomplete subscription auto-expires (Stripe default ~23h);
  no entitlement written.
- **Webhook lag race**: finalizing state on the return page (don't assume
  instant).
- **Idempotency**: reuse the customer (DB `stripe_customer_id`); don't create a
  new incomplete sub on every page load — cache/return the existing one.

## What stays the same
`subscriptions` table, `getSubscription()`, download/account gating,
`createPortalSession()` (manage/cancel). Only the *collection* step changes.

## Rollout
1. Build `/checkout` behind the existing pricing buttons (repoint them from the
   server-action redirect to `/checkout?plan=`).
2. Keep `createCheckoutSession` until `/checkout` is validated, then remove.
3. Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in all envs.

## Open decisions
- Dedicated `/checkout` page vs. a modal/drawer over pricing.
- **Promotion codes**: hosted Checkout's `allow_promotion_codes` is gone with
  Elements — if we want promos, add a code field and apply a coupon/discount to
  the subscription server-side.
- Tax / billing address collection (Stripe Tax vs. none).

## Effort
~1 day. New: `/checkout` page + client component, `appearance` helper,
`createSubscriptionIntent` action, 2 webhook cases, deps + env. Reuses customer
logic, webhook, entitlement, gating.

## Out of scope (future)
PayPal and crypto don't do recurring via Stripe (see chat 2026-06-02). When
added, their buttons would sit **on this `/checkout` page alongside** the Stripe
PaymentElement (each routing to its own backend), not inside the Element. The
`subscriptions` table already unifies entitlement across processors.
