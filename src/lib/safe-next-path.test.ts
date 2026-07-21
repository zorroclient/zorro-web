import { describe, expect, it } from "vitest";
import { safeNextPath } from "@/lib/safe-next-path";

describe("safeNextPath", () => {
  it("accepts local application paths", () => {
    expect(safeNextPath("/account/billing?from=login")).toBe(
      "/account/billing?from=login",
    );
  });

  it.each(["https://attacker.example", "//attacker.example", "\\\\server"])(
    "rejects external redirect value %s",
    (value) => {
      expect(safeNextPath(value)).toBe("/account");
    },
  );
});
