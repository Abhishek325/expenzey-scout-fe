import { describe, expect, it } from "vitest";
import { isActionDisabled } from "@/types/dashboardWidget";

describe("isActionDisabled", () => {
  it("disables while loading", () => {
    expect(isActionDisabled(true, null, true)).toBe(true);
  });

  it("disables on error", () => {
    expect(isActionDisabled(false, "error", true)).toBe(true);
  });

  it("disables when there is no data", () => {
    expect(isActionDisabled(false, null, false)).toBe(true);
  });

  it("enables when loaded with data and no error", () => {
    expect(isActionDisabled(false, null, true)).toBe(false);
  });
});
