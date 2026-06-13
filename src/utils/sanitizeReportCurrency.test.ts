import { sanitizeMonetaryText } from "@/utils/sanitizeReportCurrency";

describe("sanitizeMonetaryText", () => {
  it("returns text unchanged when currency is USD", () => {
    expect(sanitizeMonetaryText("Revenue hit $1,200 this week.", "USD", "en-us")).toBe(
      "Revenue hit $1,200 this week.",
    );
  });

  it("returns text unchanged when currency is empty", () => {
    expect(sanitizeMonetaryText("Revenue hit $1,200 this week.", "", "en-us")).toBe(
      "Revenue hit $1,200 this week.",
    );
  });

  it("returns empty text unchanged", () => {
    expect(sanitizeMonetaryText("  ", "EUR", "en-us")).toBe("  ");
  });

  it("rewrites dollar amounts to the store currency", () => {
    expect(sanitizeMonetaryText("Revenue reached $1,234.", "EUR", "en-us")).toBe(
      "Revenue reached €1,234.",
    );
  });

  it("rewrites USD-prefixed amounts", () => {
    expect(sanitizeMonetaryText("Total USD 500 in sales.", "EUR", "en-us")).toBe(
      "Total €500 in sales.",
    );
  });

  it("replaces standalone USD tokens with the store currency code", () => {
    expect(sanitizeMonetaryText("Priced in US$ and USD.", "GBP", "en-us")).toBe(
      "Priced in GBP and GBP.",
    );
  });

  it("does not replace the word dollars when only currency codes are sanitized", () => {
    expect(sanitizeMonetaryText("Saved 10 dollars on bundles.", "INR", "en-us")).toBe(
      "Saved 10 dollars on bundles.",
    );
  });
});
