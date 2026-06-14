import { describe, expect, it } from "vitest";
import {
  parseNeedsAttention,
  parseOpportunity,
  parseOverview,
  parseTopPerformer,
} from "./parseBusinessSummary";

const labels = {
  overview: "Overview",
  topPerformer: "Top Performer",
  needsAttention: "Needs Attention",
  opportunity: "Top Opportunity",
  revenueIncreased: "Revenue increased",
  revenueDecreased: "Revenue decreased",
  vsLastPeriod: "vs last week",
  salesDown: "Sales ↓ {percent}%",
  bundleHeadline: "Bundle with top products",
  coPurchaseRate: "{percent}% co-purchase rate",
};

describe("parseBusinessSummary", () => {
  it("parses revenue overview", () => {
    const result = parseOverview("Revenue increased 12% this period to ₹89.91.", labels);
    expect(result.label).toBe("Revenue increased");
    expect(result.headline).toBe("12%");
    expect(result.subtext).toBe("vs last week");
    expect(result.headlineLarge).toBe(true);
  });

  it("parses top performer", () => {
    const result = parseTopPerformer(
      "Brand Buttons generated ₹89.91 (12.5% growth).",
      labels
    );
    expect(result.headline).toBe("Brand Buttons");
    expect(result.subtext).toBe("₹89.91 • ↑ 12.5%");
  });

  it("parses needs attention with ref-like locale labels", () => {
    const result = parseNeedsAttention("Mens Divi Hoodie sales declined 10%.", {
      ...labels,
      salesDown: { value: "Sales ↓ {percent}%" },
    });
    expect(result.headline).toBe("Mens Divi Hoodie");
    expect(result.subtext).toBe("Sales ↓ 10%");
  });

  it("parses bundle opportunity", () => {
    const result = parseOpportunity(
      "Bundle Brand Buttons with Mens Divi Hoodie (18% co-purchase rate).",
      labels
    );
    expect(result.headline).toBe("Bundle with top products");
    expect(result.subtext).toBe("18% co-purchase rate");
  });
});
