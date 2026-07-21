import { describe, expect, it } from "vitest";
import {
  friendlyAuthError,
  validateEmail,
  validateNewPassword,
  validatePasswordConfirmation,
} from "@/lib/validation";

describe("authentication validation", () => {
  it("rejects malformed email addresses", () => {
    expect(validateEmail("not-an-email")).toBe("Enter a valid email address.");
    expect(validateEmail("person@example.com")).toBeNull();
  });

  it("enforces password length and matching confirmation", () => {
    expect(validateNewPassword("short")).toContain("at least 8 characters");
    expect(validateNewPassword("long-enough")).toBeNull();
    expect(validatePasswordConfirmation("long-enough", "different")).toBe(
      "Passwords do not match.",
    );
  });

  it("turns common Supabase errors into actionable copy", () => {
    expect(friendlyAuthError("Invalid login credentials")).toBe(
      "That email or password isn't right.",
    );
    expect(friendlyAuthError("Email not confirmed")).toContain(
      "Confirm your email",
    );
  });
});
