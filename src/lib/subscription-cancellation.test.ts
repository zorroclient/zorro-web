import { describe, expect, it } from "vitest";
import { getResumeSubscriptionOperation } from "@/lib/subscription-cancellation";

describe("getResumeSubscriptionOperation", () => {
  it("reverses an end-of-period cancellation without also clearing cancel_at", () => {
    expect(
      getResumeSubscriptionOperation({
        cancelAtPeriodEnd: true,
        cancelAt: 1_815_837_195,
        scheduleId: null,
      }),
    ).toEqual({
      kind: "subscription",
      params: { cancel_at_period_end: false },
    });
  });

  it("clears a standalone custom cancellation date", () => {
    expect(
      getResumeSubscriptionOperation({
        cancelAtPeriodEnd: false,
        cancelAt: 1_815_837_195,
        scheduleId: null,
      }),
    ).toEqual({
      kind: "subscription",
      params: { cancel_at: null },
    });
  });

  it("releases a schedule that owns the cancellation date", () => {
    expect(
      getResumeSubscriptionOperation({
        cancelAtPeriodEnd: false,
        cancelAt: 1_815_837_195,
        scheduleId: "sub_sched_test",
      }),
    ).toEqual({
      kind: "schedule",
      scheduleId: "sub_sched_test",
      params: { end_behavior: "release" },
    });
  });

  it("does nothing when renewal is already active", () => {
    expect(
      getResumeSubscriptionOperation({
        cancelAtPeriodEnd: false,
        cancelAt: null,
        scheduleId: null,
      }),
    ).toEqual({ kind: "none" });
  });
});
