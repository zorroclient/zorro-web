import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/billing-actions", () => ({
  scheduleSubscriptionCancellation: vi.fn(),
}));

describe("CancelSubscriptionDialog", () => {
  beforeAll(() => {
    HTMLElement.prototype.hasPointerCapture ??= () => false;
    HTMLElement.prototype.setPointerCapture ??= () => undefined;
    HTMLElement.prototype.releasePointerCapture ??= () => undefined;
  });

  it("requires confirmation and explains when access ends", async () => {
    const { CancelSubscriptionDialog } = await import(
      "@/components/account/cancel-subscription-dialog"
    );
    const user = userEvent.setup();

    render(<CancelSubscriptionDialog accessUntil="17 July 2027" />);
    await user.click(
      screen.getByRole("button", { name: "Cancel subscription" }),
    );

    expect(
      screen.getByRole("heading", { name: "Cancel your subscription?" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/through 17 July 2027/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancel at period end" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Keep subscription" }),
    ).toBeInTheDocument();
  });
});
