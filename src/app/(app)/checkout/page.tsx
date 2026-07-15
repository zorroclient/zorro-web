import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import styles from "@/components/checkout/checkout.module.css";
import { getPlan } from "@/lib/pricing";
import { getSubscription } from "@/lib/subscription";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Secure checkout",
  description: "Choose a plan and complete your Zorro subscription securely.",
};

type CheckoutPageProps = {
  searchParams: Promise<{ plan?: string | string[] }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const rawPlan = (await searchParams).plan;
  const plan = getPlan(Array.isArray(rawPlan) ? rawPlan[0] : rawPlan);
  if (!plan) redirect("/pricing");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const checkoutPath = `/checkout?plan=${encodeURIComponent(plan.id)}`;
  if (!user) {
    redirect(`/signup?next=${encodeURIComponent(checkoutPath)}`);
  }

  if (await getSubscription(user.id)) {
    redirect("/account?error=already-subscribed");
  }

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured.");
  }

  return (
    <div className={styles.shell}>
      <Link href="/pricing" className={styles.back}>
        <ArrowLeft className="size-3.5" /> Change plan
      </Link>

      <header className={styles.heading}>
        <p className={styles.eyebrow}>Secure checkout</p>
        <h1 className={styles.title}>Complete your access.</h1>
        <p className={styles.intro}>
          One last step. Choose the payment method that works for you and your
          Zorro access unlocks as soon as Stripe confirms the subscription.
        </p>
      </header>

      <CheckoutClient plan={plan} publishableKey={publishableKey} />
    </div>
  );
}
