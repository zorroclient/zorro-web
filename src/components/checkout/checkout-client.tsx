"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckoutElementsProvider,
  ExpressCheckoutElement,
  PaymentElement,
  useCheckoutElements,
} from "@stripe/react-stripe-js/checkout";
import { loadStripe } from "@stripe/stripe-js";
import { Check, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import type { Plan } from "@/lib/pricing";
import { zorroStripeAppearance } from "@/lib/stripe-appearance";
import styles from "./checkout.module.css";

type CheckoutClientProps = {
  plan: Plan;
  publishableKey: string;
};

type ClientSecretResponse = {
  clientSecret?: string;
  error?: string;
  redirectTo?: string;
};

type SessionState = {
  planId: string;
  clientSecret?: string;
  error?: string;
};

async function fetchClientSecret(
  planId: string,
  signal: AbortSignal,
): Promise<string> {
  const response = await fetch("/api/stripe/checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    cache: "no-store",
    body: JSON.stringify({ plan: planId }),
    signal,
  });
  const payload = (await response.json()) as ClientSecretResponse;

  if (!response.ok || !payload.clientSecret) {
    if (payload.redirectTo) window.location.assign(payload.redirectTo);
    throw new Error(payload.error ?? "Checkout could not be started.");
  }

  return payload.clientSecret;
}

export function CheckoutClient({ plan, publishableKey }: CheckoutClientProps) {
  const stripe = useMemo(() => loadStripe(publishableKey), [publishableKey]);
  const [session, setSession] = useState<SessionState | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    void fetchClientSecret(plan.id, controller.signal)
      .then((clientSecret) =>
        setSession({ planId: plan.id, clientSecret }),
      )
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setSession({
          planId: plan.id,
          error:
            error instanceof Error
              ? error.message
              : "Checkout could not be started.",
        });
      });

    return () => controller.abort();
  }, [plan.id]);

  const currentSession = session?.planId === plan.id ? session : null;
  const clientSecret = currentSession?.clientSecret ?? null;

  const options = useMemo(
    () =>
      clientSecret
        ? {
            clientSecret,
            elementsOptions: {
              appearance: zorroStripeAppearance,
              loader: "auto" as const,
            },
          }
        : null,
    [clientSecret],
  );

  if (currentSession?.error) {
    return <CheckoutUnavailable plan={plan} message={currentSession.error} />;
  }

  if (!options) {
    return <CheckoutSkeleton plan={plan} />;
  }

  return (
    <CheckoutElementsProvider stripe={stripe} options={options}>
      <CheckoutContent plan={plan} />
    </CheckoutElementsProvider>
  );
}

function CheckoutContent({ plan }: { plan: Plan }) {
  const state = useCheckoutElements();

  if (state.type === "loading") {
    return <CheckoutSkeleton plan={plan} />;
  }

  if (state.type === "error") {
    return <CheckoutUnavailable plan={plan} message={state.error.message} />;
  }

  return <CheckoutForm plan={plan} checkout={state.checkout} />;
}

function CheckoutUnavailable({ plan, message }: { plan: Plan; message: string }) {
  return (
    <div className={styles.grid}>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.step}>Checkout unavailable</span>
          <LockKeyhole className="size-4 text-brand" />
        </div>
        <div className={styles.error} role="alert">
          {message}
        </div>
        <p className="mt-5 text-sm text-muted-foreground">
          Refresh the page to try again, or return to pricing and choose a
          different plan.
        </p>
        <Link
          href="/pricing"
          className="mt-6 inline-flex font-mono text-xs uppercase tracking-[0.12em] text-brand hover:underline"
        >
          Back to pricing
        </Link>
      </section>
      <CheckoutSummary plan={plan} />
    </div>
  );
}

type Checkout = Extract<
  ReturnType<typeof useCheckoutElements>,
  { type: "success" }
>["checkout"];

function CheckoutForm({ plan, checkout }: { plan: Plan; checkout: Checkout }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expressAvailable, setExpressAvailable] = useState<boolean | null>(null);
  const paymentButtonState = submitting
    ? "submitting"
    : checkout.canConfirm
      ? "ready"
      : "waiting";

  function finish(sessionId: string) {
    router.push(`/checkout/return?session_id=${encodeURIComponent(sessionId)}`);
    router.refresh();
  }

  async function confirmPayment() {
    setSubmitting(true);
    setError(null);
    const result = await checkout.confirm({ redirect: "if_required" });

    if (result.type === "error") {
      setError(result.error.message);
      setSubmitting(false);
      return;
    }

    finish(result.session.id);
  }

  return (
    <div className={styles.grid}>
      <section className={styles.panel} aria-labelledby="payment-heading">
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.step}>Step 02 / Payment</span>
            <h2 id="payment-heading" className="mt-1 font-heading text-xl font-semibold">
              Choose how you pay
            </h2>
          </div>
          <span className={styles.secure}>
            <LockKeyhole className="size-3.5 text-brand" /> Encrypted
          </span>
        </div>

        <div
          className={`${styles.express} ${expressAvailable === false ? styles.expressHidden : ""}`}
          aria-hidden={expressAvailable === false}
        >
          <p className={styles.expressLabel}>Fast checkout</p>
          <ExpressCheckoutElement
            options={{
              buttonHeight: 48,
              buttonTheme: {
                applePay: "white-outline",
                googlePay: "black",
                paypal: "gold",
              },
              buttonType: {
                applePay: "subscribe",
                googlePay: "subscribe",
                paypal: "paypal",
              },
              layout: { maxColumns: 2, maxRows: 2, overflow: "auto" },
              paymentMethodOrder: [
                "paypal",
                "amazon_pay",
                "apple_pay",
                "google_pay",
                "link",
              ],
              paymentMethods: {
                paypal: "auto",
                applePay: "auto",
                googlePay: "auto",
                link: "auto",
                amazonPay: "auto",
                klarna: "never",
              },
            }}
            onReady={(event) =>
              setExpressAvailable(
                event.availablePaymentMethods
                  ? Object.values(event.availablePaymentMethods).some(Boolean)
                  : false,
              )
            }
            onAvailablePaymentMethodsChange={(event) =>
              setExpressAvailable(
                event.paymentMethods
                  ? Object.values(event.paymentMethods).some(
                      (method) => method.available,
                    )
                  : false,
              )
            }
            onConfirm={async (event) => {
              setSubmitting(true);
              setError(null);
              const result = await checkout.confirm({
                redirect: "if_required",
                expressCheckoutConfirmEvent: event,
              });

              if (result.type === "error") {
                event.paymentFailed({
                  reason: "fail",
                  message: result.error.message,
                });
                setError(result.error.message);
                setSubmitting(false);
                return;
              }

              finish(result.session.id);
            }}
          />
        </div>

        {expressAvailable !== false && (
          <div className={styles.divider}>Or pay another way</div>
        )}

        <PaymentElement
          options={{
            layout: {
              type: "accordion",
              defaultCollapsed: false,
              radios: "always",
              spacedAccordionItems: true,
            },
            wallets: { applePay: "never", googlePay: "never" },
          }}
          onLoadError={(event) =>
            setError(event.error.message ?? "The payment form failed to load.")
          }
        />

        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        <button
          type="button"
          className={styles.payButton}
          disabled={!checkout.canConfirm || submitting}
          data-state={paymentButtonState}
          onClick={() => void confirmPayment()}
        >
          {submitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" /> Securing payment…
            </>
          ) : checkout.canConfirm ? (
            <>Subscribe · {checkout.total.total.amount}</>
          ) : (
            <>Complete payment details</>
          )}
        </button>

        <p className={styles.terms}>
          Your subscription renews automatically until cancelled. By continuing,
          you agree to the <Link href="/terms">Terms</Link> and acknowledge the{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </section>

      <CheckoutSummary plan={plan} checkout={checkout} />
    </div>
  );
}

function CheckoutSummary({ plan, checkout }: { plan: Plan; checkout?: Checkout }) {
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoPending, setPromoPending] = useState(false);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const discount = checkout?.discountAmounts?.[0];

  async function applyPromo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = promoCode.trim();
    if (!checkout || !code) return;

    setPromoPending(true);
    setPromoMessage(null);
    const result = await checkout.applyPromotionCode(code);
    if (result.type === "error") {
      setPromoMessage(result.error.message);
    } else {
      setPromoMessage("Promotion code applied.");
      setPromoCode("");
    }
    setPromoPending(false);
  }

  async function removePromo() {
    if (!checkout) return;
    setPromoPending(true);
    const result = await checkout.removePromotionCode();
    setPromoMessage(
      result.type === "success"
        ? "Promotion code removed."
        : result.error.message,
    );
    setPromoPending(false);
  }

  const subtotal = checkout?.total.subtotal.amount ?? plan.price;
  const total = checkout?.total.total.amount ?? plan.price;

  return (
    <aside className={styles.summary} aria-label="Order summary">
      <div className={styles.summaryHeader}>
        <div>
          <span className={styles.step}>Order summary</span>
          <h2 className={styles.planName}>{plan.name} access</h2>
        </div>
        {plan.badge && <span className={styles.planBadge}>{plan.badge}</span>}
      </div>

      <div className={styles.priceRow}>
        <span>
          <strong className={styles.price}>{subtotal}</strong>
          <span className={styles.cadence}> {plan.cadence}</span>
        </span>
      </div>

      <div className={styles.details}>
        <div className={styles.detailRow}>
          <span>License</span>
          <strong>Full Zorro access</strong>
        </div>
        <div className={styles.detailRow}>
          <span>Renewal</span>
          <strong>Automatic</strong>
        </div>
        <div className={styles.detailRow}>
          <span>Cancellation</span>
          <strong>Anytime</strong>
        </div>
        {discount && (
          <div className={styles.detailRow}>
            <span>{discount.displayName}</span>
            <strong className={styles.discount}>−{discount.amount}</strong>
          </div>
        )}
      </div>

      <div className={styles.totalRow}>
        <span>Due today</span>
        <strong>{total}</strong>
      </div>

      {checkout && (
        <div className={styles.promo}>
          {discount ? (
            <button
              type="button"
              className={styles.promoToggle}
              onClick={() => void removePromo()}
              disabled={promoPending}
            >
              Remove promotion code
            </button>
          ) : (
            <button
              type="button"
              className={styles.promoToggle}
              onClick={() => setPromoOpen((open) => !open)}
              aria-expanded={promoOpen}
            >
              {promoOpen ? "Hide promotion code" : "Have a promotion code?"}
            </button>
          )}

          {promoOpen && !discount && (
            <form className={styles.promoForm} onSubmit={applyPromo}>
              <input
                className={styles.promoInput}
                value={promoCode}
                onChange={(event) => setPromoCode(event.target.value)}
                placeholder="CODE"
                aria-label="Promotion code"
                autoComplete="off"
                disabled={promoPending}
              />
              <button
                type="submit"
                className={styles.promoApply}
                disabled={promoPending || !promoCode.trim()}
              >
                {promoPending ? "…" : "Apply"}
              </button>
            </form>
          )}
          {promoMessage && (
            <p className={styles.promoStatus} role="status">
              {promoMessage}
            </p>
          )}
        </div>
      )}

      <div className={styles.trust}>
        <div className={styles.trustItem}>
          <ShieldCheck /> Payment details never touch our servers
        </div>
        <div className={styles.trustItem}>
          <Check /> Instant access after confirmation
        </div>
        <div className={styles.trustItem}>
          <LockKeyhole /> Payments securely processed by Stripe
        </div>
      </div>
    </aside>
  );
}

function CheckoutSkeleton({ plan }: { plan: Plan }) {
  return (
    <div className={styles.grid} aria-busy="true" aria-label="Loading checkout">
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.step}>Preparing secure checkout</span>
          <LoaderCircle className="size-4 animate-spin text-brand" />
        </div>
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonBlock} />
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonBlock} />
        <div className={styles.skeletonBlock} />
      </section>
      <CheckoutSummary plan={plan} />
    </div>
  );
}
