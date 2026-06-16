import { describe, expect, it } from "vitest";
import {
  buildThemePercentages,
  countPositiveThemes,
  extractPositiveThemesWithCounts,
  extractThemesWithCounts,
  POSITIVE_KEYWORDS,
} from "../../../supabase/functions/_shared/review-themes.ts";
import { buildTrendBucketSeries } from "../../../supabase/functions/_shared/date-buckets.ts";

describe("extractThemesWithCounts", () => {
  it("counts positive themes for high-rated reviews only", () => {
    const themes = extractThemesWithCounts(
      [
        { rating: 5, content: "Great quality and fast delivery" },
        { rating: 4, content: "Love the product" },
        { rating: 2, content: "Great quality but faded" },
      ],
      POSITIVE_KEYWORDS,
      undefined,
      4,
    );

    expect(themes).toEqual([
      { theme: "quality", count: 2 },
      { theme: "delivery", count: 1 },
    ]);
  });
});

describe("buildThemePercentages", () => {
  it("computes category percentages", () => {
    const result = buildThemePercentages(
      [
        { theme: "quality", count: 2 },
        { theme: "delivery", count: 1 },
      ],
      4,
    );

    expect(result).toEqual([
      { theme: "quality", count: 2, percentOfCategory: 50 },
      { theme: "delivery", count: 1, percentOfCategory: 25 },
    ]);
  });
});

describe("extractPositiveThemesWithCounts", () => {
  it("adds overall theme for positive reviews without keyword matches", () => {
    const themes = extractPositiveThemesWithCounts([
      { rating: 5, content: "Looks fine" },
      { rating: 4, content: "Works as expected" },
      { rating: 2, content: "Poor colors" },
    ]);

    expect(themes).toEqual([{ theme: "overall", count: 2 }]);
  });

  it("keeps keyword themes and adds overall for unmatched positive reviews", () => {
    const themes = extractPositiveThemesWithCounts([
      { rating: 5, content: "Great quality" },
      { rating: 4, content: "Looks fine" },
    ]);

    expect(themes).toEqual([
      { theme: "quality", count: 1 },
      { theme: "overall", count: 1 },
    ]);
  });
});

describe("countPositiveThemes", () => {
  it("ignores reviews below 4 stars", () => {
    const counts = countPositiveThemes([
      { rating: 5, content: "Great" },
      { rating: 3, content: "Great" },
    ]);

    expect(counts.quality).toBe(1);
  });
});

describe("buildTrendBucketSeries", () => {
  it("returns four weekly buckets ending at the selected end date", () => {
    const buckets = buildTrendBucketSeries("2026-06-13T23:59:59.999Z", "weekly", 4);

    expect(buckets).toHaveLength(4);
    expect(buckets[buckets.length - 1]?.periodEnd).toBe("2026-06-13");
  });
});
