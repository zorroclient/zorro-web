# Full-Control Checkout — Spec

> Status: implemented on `new-ui` (2026-07-15). The hosted Checkout helper is
> retained temporarily as a rollback path, but pricing now enters the on-site
> checkout. Original author handoff: 2026-06-02.

## Goal

"Get Zorro" now opens `/checkout?plan=<id>`. The payment step lives **on our own
page**, styled to match the site (orange `#ff7a18` / dark theme), instead of
bouncing to a Stripe-hosted URL.

"Full control" caveat: with the **Payment Element** we own the entire checkout
*page* (layout, copy, summary, theming) and theme the payment widget via the
**Appearance API**. The card-input fields themselves stay inside Stripe's secure
iframe (PCI) — we can theme them (colors, fonts, radius, spacing) but not
restyle their internal DOM. That's the ceiling of "full control" without taking
on PCI scope.

## Reused foundation

- `src/lib/stripe.ts` — server Stripe client (`getStripe()`).
- `src/lib/billing.ts` — `priceIdForPlan()` / `planForPriceId()`.
- `src/lib/billing-actions.ts` — hosted `createCheckoutSession()` retained as a
  temporary fallback + `createPortalSession()` (keep).
- `src/app/api/stripe/webhook/route.ts` — already provisions the `subscriptions`
  table on `checkout.session.completed` + `customer.subscription.*`.
- `src/lib/subscription.ts` — `getSubscription()` reads entitlement.
- Pricing buttons in `src/components/pricing-plans.tsx` post to the server action.

The webhook + entitlement layer **does not change** — it already keys off the
subscription, regardless of how the payment was collected.

## Implemented architecture

### Dependencies & env
- `@stripe/stripe-js` + `@stripe/react-stripe-js`.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (publishable `pk_…`) in `.env.local`.

### Server — custom Checkout Session
`POST /api/stripe/checkout-session`:
1. Validates same-origin POST, plan, Supabase user, and existing entitlement.
2. Finds/creates the user's stable Stripe customer via
   `src/lib/stripe-customer.ts`.
3. Reuses an open custom session for the same customer/plan where possible.
4. Creates `stripe.checkout.sessions.create({ ui_mode:'elements',
   mode:'subscription', customer, line_items, allow_promotion_codes:true,
   metadata, subscription_data, return_url })`.
5. Returns the Checkout Session `client_secret`; no hosted-page redirect.

Stripe now recommends Checkout Sessions with Elements for most custom
subscription flows. This supersedes the original handoff's lower-level
`default_incomplete` Payment Intent design and keeps Stripe's managed checkout
state, discounts, and subscription lifecycle.

### Client — `/checkout?plan=<id>` page
- `CheckoutElementsProvider` initializes Stripe's Checkout Elements SDK using
  the client-secret promise.
- `ExpressCheckoutElement` provides eligible PayPal, Apple Pay, Google Pay, and
  Link buttons.
- `PaymentElement` provides cards and other compatible, Dashboard-enabled
  payment methods.
- The order summary, promotion-code field, terms, submit button, loading/error
  states, and responsive page layout are owned by Zorro.
- Submit uses `checkout.confirm({ redirect:'if_required' })`.

### Appearance (theming)
Build an `appearance` object from our design tokens: `theme:'night'`, brand
orange as `colorPrimary`, card/border/muted backgrounds, Inter/Space Grotesk
fonts, matching border radius. Lives in one helper so it stays in sync with
`globals.css`.

### Return / post-payment
- `return_url` lands on `/checkout/return?session_id=...`.
- The return page verifies that the Checkout Session belongs to the signed-in
  Supabase user.
- Provisioning is done by the **webhook**, not the return page. The result UI
  refreshes briefly through webhook lag, then links to the gated download.

### Webhooks
Custom Checkout Sessions still emit `checkout.session.completed`. The existing
handler retrieves and upserts the subscription, while
`customer.subscription.created/updated/deleted` keeps later lifecycle changes
in sync.

## Payment flow
1. User clicks Get Zorro → `/checkout?plan=biannual`.
2. Page calls the checkout-session route → gets `clientSecret`.
3. Express Checkout and Payment Element render with Zorro theming.
4. `checkout.confirm` completes inline or redirects when the method requires it.
5. Stripe fires `checkout.session.completed` and subscription lifecycle events
   → webhook upserts the `subscriptions` row.
6. `/account/download` shows unlocked (after the finalizing poll resolves).

## States & edge cases
- **SCA/3DS**: handled by `checkout.confirm` (may redirect & return).
- **Declined / failed**: show inline error, stay on page, allow retry.
- **Processing**: PaymentIntent `processing` → show pending, rely on webhook.
- **Abandoned**: the open Checkout Session expires; no entitlement is written.
- **Webhook lag race**: finalizing state on the return page (don't assume
  instant).
- **Idempotency**: reuse the customer (DB `stripe_customer_id`) and an open
  Checkout Session for the same plan instead of creating one on every load.

## What stays the same
`subscriptions` table, `getSubscription()`, download/account gating,
`createPortalSession()` (manage/cancel). Only the *collection* step changes.

## Rollout
1. [x] Build `/checkout` and repoint pricing buttons.
2. [x] Preserve the chosen checkout path through signup/login/OAuth.
3. [x] Keep hosted `createCheckoutSession` temporarily for rollback.
4. [ ] Validate card, 3DS, promotion-code, PayPal, and webhook flows in Stripe
   sandbox, then remove the hosted helper.
5. [ ] Set/confirm `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in every deployed env.

## Open decisions
- Dedicated `/checkout` page chosen over a modal/drawer.
- Promotion codes implemented using Checkout Elements' `applyPromotionCode` /
  `removePromotionCode` actions.
- Tax / billing address collection (Stripe Tax vs. none).

## Implementation files
- `src/app/(app)/checkout/page.tsx`
- `src/app/(app)/checkout/return/page.tsx`
- `src/app/api/stripe/checkout-session/route.ts`
- `src/components/checkout/*`
- `src/lib/stripe-appearance.ts`
- `src/lib/stripe-customer.ts`

## Out of scope (future)
PayPal can now run through Stripe for eligible European accounts, including
subscriptions. The Netherlands is eligible, but PayPal must still be activated
and approved in the Stripe Dashboard; the Express Checkout slot will surface it
automatically when available.

Crypto remains future work. Stripe stablecoin subscriptions are currently a
private preview, so no separate processor or entitlement path is added in this
pass.
