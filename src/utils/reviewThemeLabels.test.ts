import { describe, expect, it } from "vitest";
import { mapReviewThemeLabels, resolveReviewThemeLabel } from "@/utils/reviewThemeLabels";
import type { IStringService } from "@/services/stringService";

function createStringService(labels: Record<string, string>): IStringService {
  const getStrings = ((context: string, keyOrKeys: string | readonly string[]) => {
    if (Array.isArray(keyOrKeys)) {
      return keyOrKeys.map((key) => labels[`${context}.${key}`] ?? `${context}/${key}`);
    }
    return labels[`${context}.${keyOrKeys}`] ?? `${context}/${keyOrKeys}`;
  }) as IStringService["getStrings"];

  return { getStrings } as IStringService;
}

describe("reviewThemeLabels", () => {
  const service = createStringService({
    "dashboard.aiInsights.reviewIntelligence.themes.positive.delivery": "Fast delivery",
    "dashboard.aiInsights.reviewIntelligence.themes.complaint.quality": "Product quality",
  });

  it("resolves known theme keys", () => {
    expect(
      resolveReviewThemeLabel(
        service,
        "delivery",
        "dashboard.aiInsights.reviewIntelligence.themes.positive",
      ),
    ).toBe("Fast delivery");
  });

  it("falls back to raw theme key when label is missing", () => {
    expect(
      resolveReviewThemeLabel(
        service,
        "unknown",
        "dashboard.aiInsights.reviewIntelligence.themes.positive",
      ),
    ).toBe("dashboard.aiInsights.reviewIntelligence.themes.positive.unknown");
  });

  it("maps arrays of theme keys", () => {
    expect(
      mapReviewThemeLabels(
        ["delivery", "unknown"],
        service,
        "dashboard.aiInsights.reviewIntelligence.themes.positive",
      ),
    ).toEqual(["Fast delivery", "dashboard.aiInsights.reviewIntelligence.themes.positive.unknown"]);
  });
});
