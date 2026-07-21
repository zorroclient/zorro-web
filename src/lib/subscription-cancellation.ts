export type ResumeSubscriptionOperation =
  | {
      kind: "subscription";
      params: { cancel_at_period_end: false };
    }
  | {
      kind: "subscription";
      params: { cancel_at: null };
    }
  | {
      kind: "schedule";
      scheduleId: string;
      params: { end_behavior: "release" };
    }
  | { kind: "none" };

export function getResumeSubscriptionOperation({
  cancelAtPeriodEnd,
  cancelAt,
  scheduleId,
}: {
  cancelAtPeriodEnd: boolean;
  cancelAt: number | null;
  scheduleId: string | null;
}): ResumeSubscriptionOperation {
  // Stripe also exposes a derived cancel_at timestamp for a subscription that
  // uses cancel_at_period_end. That mode must win so we send only its inverse.
  if (cancelAtPeriodEnd) {
    return {
      kind: "subscription",
      params: { cancel_at_period_end: false },
    };
  }

  if (!cancelAt) return { kind: "none" };

  if (scheduleId) {
    return {
      kind: "schedule",
      scheduleId,
      params: { end_behavior: "release" },
    };
  }

  return {
    kind: "subscription",
    params: { cancel_at: null },
  };
}
