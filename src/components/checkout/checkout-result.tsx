"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Clock3,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";
import styles from "./checkout.module.css";

type CheckoutResultProps = {
  active: boolean;
  planId: string | null;
  sessionStatus: "open" | "complete" | "expired";
};

const MAX_REFRESHES = 8;

export function CheckoutResult({
  active,
  planId,
  sessionStatus,
}: CheckoutResultProps) {
  const router = useRouter();
  const refreshes = useRef(0);
  const [takingLonger, setTakingLonger] = useState(false);

  useEffect(() => {
    if (active || sessionStatus !== "complete" || takingLonger) return;

    const timer = window.setInterval(() => {
      refreshes.current += 1;
      if (refreshes.current >= MAX_REFRESHES) {
        window.clearInterval(timer);
        setTakingLonger(true);
        return;
      }
      router.refresh();
    }, 2_000);

    return () => window.clearInterval(timer);
  }, [active, router, sessionStatus, takingLonger]);

  const retryHref = planId
    ? `/checkout?plan=${encodeURIComponent(planId)}`
    : "/pricing";

  if (active) {
    return (
      <section className={styles.result}>
        <span className={styles.resultIcon}>
          <Check className="size-6" />
        </span>
        <p className={`${styles.step} mt-5`}>Subscription active</p>
        <h1 className={styles.resultTitle}>You&apos;re in.</h1>
        <p className={styles.resultCopy}>
          Payment confirmed and your Zorro access is active. The latest Windows
          build is ready in your account.
        </p>
        <div className={styles.resultActions}>
          <Link href="/account/download" className={styles.primaryAction}>
            Go to download <ArrowRight className="size-3.5" />
          </Link>
          <Link href="/account" className={styles.secondaryAction}>
            View account
          </Link>
        </div>
      </section>
    );
  }

  if (sessionStatus === "open") {
    return (
      <section className={styles.result}>
        <span className={styles.resultIcon}>
          <RotateCcw className="size-5" />
        </span>
        <p className={`${styles.step} mt-5`}>Payment incomplete</p>
        <h1 className={styles.resultTitle}>Let&apos;s finish that.</h1>
        <p className={styles.resultCopy}>
          The payment wasn&apos;t completed. Your checkout is still available, so
          you can return without losing the selected plan.
        </p>
        <div className={styles.resultActions}>
          <Link href={retryHref} className={styles.primaryAction}>
            Return to payment <ArrowRight className="size-3.5" />
          </Link>
          <Link href="/pricing" className={styles.secondaryAction}>
            Change plan
          </Link>
        </div>
      </section>
    );
  }

  if (sessionStatus === "expired") {
    return (
      <section className={styles.result}>
        <span className={styles.resultIcon}>
          <Clock3 className="size-5" />
        </span>
        <p className={`${styles.step} mt-5`}>Session expired</p>
        <h1 className={styles.resultTitle}>Start a fresh checkout.</h1>
        <p className={styles.resultCopy}>
          No payment was taken. Start again and we&apos;ll prepare a new secure
          payment session for the same plan.
        </p>
        <div className={styles.resultActions}>
          <Link href={retryHref} className={styles.primaryAction}>
            Start again <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.result} aria-live="polite">
      <span className={styles.resultIcon}>
        {takingLonger ? (
          <Clock3 className="size-5" />
        ) : (
          <LoaderCircle className="size-5 animate-spin" />
        )}
      </span>
      <p className={`${styles.step} mt-5`}>Finalizing access</p>
      <h1 className={styles.resultTitle}>
        {takingLonger ? "Payment is still processing." : "Payment received."}
      </h1>
      <p className={styles.resultCopy}>
        {takingLonger
          ? "Some bank and wallet payments take longer to settle. You can safely leave this page—we'll update your account automatically when Stripe confirms it."
          : "Stripe confirmed the checkout. We're syncing your subscription now; this normally takes only a few seconds."}
      </p>
      {takingLonger && (
        <div className={styles.resultActions}>
          <Link href="/account" className={styles.primaryAction}>
            Check account <ArrowRight className="size-3.5" />
          </Link>
          <button
            type="button"
            className={styles.secondaryAction}
            onClick={() => {
              refreshes.current = 0;
              setTakingLonger(false);
              router.refresh();
            }}
          >
            Check again
          </button>
        </div>
      )}
    </section>
  );
}
