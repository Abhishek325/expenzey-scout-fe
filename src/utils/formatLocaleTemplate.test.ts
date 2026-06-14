import { describe, expect, it } from "vitest";
import { ensureLocaleString, formatLocaleTemplate } from "./formatLocaleTemplate";

describe("formatLocaleTemplate", () => {
  it("replaces placeholders in locale strings", () => {
    expect(formatLocaleTemplate("Sales ↓ {percent}%", { percent: 10 })).toBe("Sales ↓ 10%");
  });

  it("unwraps ref-like locale values before formatting", () => {
    const refLike = { value: "Sales ↓ {percent}%" };
    expect(formatLocaleTemplate(refLike, { percent: 10 })).toBe("Sales ↓ 10%");
  });

  it("coerces non-string templates safely", () => {
    expect(ensureLocaleString(undefined)).toBe("");
    expect(formatLocaleTemplate(undefined, { percent: 5 })).toBe("");
  });
});
