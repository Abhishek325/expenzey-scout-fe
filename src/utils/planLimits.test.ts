import { describe, expect, it } from "vitest";
import {
  FREE_LIMITS,
  hasQuotaRemaining,
  isPro,
  resolveLimits,
} from "../../../supabase/functions/_shared/plan-limits.ts";

describe("plan-limits", () => {
  it("uses expected free limits", () => {
    expect(FREE_LIMITS.chat).toBe(5);
    expect(FREE_LIMITS.reportHistory).toBe(4);
    expect(FREE_LIMITS.opportunitiesVisible).toBe(3);
  });

  it("treats pro as unlimited", () => {
    const limits = resolveLimits("pro");
    expect(limits.chat).toBeLessThan(0);
    expect(isPro("pro")).toBe(true);
    expect(hasQuotaRemaining(1000, limits.chat)).toBe(true);
  });
});
