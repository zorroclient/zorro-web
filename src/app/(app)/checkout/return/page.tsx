import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CheckoutResult } from "@/components/checkout/checkout-result";
import styles from "@/components/checkout/checkout.module.css";
import { getPlan } from "@/lib/pricing";
import { getStripe } from "@/lib/stripe";
import { getSubscription } from "@/lib/subscription";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Checkout status",
  description: "Your Zorro subscription status.",
};

export const dynamic = "force-dynamic";

export default async function CheckoutReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string | string[] }>;
}) {
  const rawSessionId = (await searchParams).session_id;
  const sessionId = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId;
  if (!sessionId) redirect("/pricing");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const next = `/checkout/return?session_id=${encodeURIComponent(sessionId)}`;
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  let session;
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId);
  } catch {
    redirect("/pricing");
  }

  const ownerId =
    session.client_reference_id ?? session.metadata?.supabase_user_id;
  if (ownerId !== user.id) redirect("/pricing");

  const subscription = await getSubscription(user.id);
  const planId = getPlan(session.metadata?.plan)?.id ?? null;

  return (
    <div className={styles.shell}>
      <Link href="/account" className={styles.back}>
        <ArrowLeft className="size-3.5" /> Account
      </Link>
      <CheckoutResult
        active={Boolean(subscription)}
        planId={planId}
        sessionStatus={session.status ?? "open"}
      />
    </div>
  );
}
