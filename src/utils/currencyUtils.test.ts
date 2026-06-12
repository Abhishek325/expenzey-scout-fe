import {
  formatCompactCurrencyAxis,
  formatCurrencyAmount,
  resolveIntlLocale,
} from "@/utils/currencyUtils";

describe("resolveIntlLocale", () => {
  it("maps WordPress-style locales to BCP 47", () => {
    expect(resolveIntlLocale("en-us")).toBe("en-US");
    expect(resolveIntlLocale("fr_FR")).toBe("fr-fr");
  });
});

describe("formatCurrencyAmount", () => {
  it("formats using the provided currency code", () => {
    expect(formatCurrencyAmount(1234, "EUR", "en-US", 0)).toBe("€1,234");
  });
});

describe("formatCompactCurrencyAxis", () => {
  it("uses the store currency symbol for compact ticks", () => {
    expect(formatCompactCurrencyAxis(2500, "EUR", "en-US")).toBe("€3K");
  });
});
