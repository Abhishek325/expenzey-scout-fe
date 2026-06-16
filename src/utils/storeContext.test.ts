import { describe, expect, it } from "vitest";
import {
  buildChatAIContext,
  extractChatLinks,
  type ChatContextInput,
} from "../../../supabase/functions/_shared/chat-context.ts";

function fixtureContext(): ChatContextInput {
  return {
    currency: "USD",
    revenue: { current: 1200, previous: 1000, growthPercent: 20 },
    orders: { current: 40, previous: 35, growthPercent: 14.3 },
    customers: { new: 10, returning: 20, returningGrowthPercent: 5, newGrowthPercent: 8 },
    aov: { current: 30, growthPercent: 5.3 },
    repeatRevenue: { current: 500, growthPercent: 11.1 },
    products: {
      top: [{
        wcProductId: 101,
        name: "Brand Buttons",
        revenue: 300,
        growthPercent: 20,
        revenueSharePercent: 25,
      }],
      declining: [{
        wcProductId: 202,
        name: "Mens Hoodie",
        revenue: 80,
        growthPercent: -33.3,
      }],
    },
    reviews: {
      averageRating: 4.2,
      totalReviews: 12,
      complaintThemes: [{ theme: "delivery", count: 3 }],
    },
    opportunities: [{
      id: "bundle-Brand Buttons-Divi Tee",
      type: "bundle_opportunity",
      title: "Bundle Opportunity",
      recommendation: "Create a bundle offer",
    }],
    reports: {
      executiveSummary: "Revenue increased 20%.",
      keyWins: ["Orders up"],
    },
  };
}

describe("buildChatAIContext", () => {
  it("maps compact analyst payload from store context", () => {
    const context = buildChatAIContext(fixtureContext());

    expect(context.summaryMetrics.revenue.growthPercent).toBe(20);
    expect(context.topProducts[0]).toMatchObject({ id: 101, name: "Brand Buttons" });
    expect(context.decliningProducts[0].name).toBe("Mens Hoodie");
    expect(context.opportunities[0].title).toBe("Bundle Opportunity");
    expect(context.latestReportSummary).toContain("Revenue increased");
  });
});

describe("extractChatLinks", () => {
  it("extracts product and opportunity links mentioned in answer text", () => {
    const links = extractChatLinks(
      "Brand Buttons drove growth. Consider the Bundle Opportunity next.",
      fixtureContext(),
    );

    expect(links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "product", wcProductId: 101, label: "Brand Buttons" }),
        expect.objectContaining({ type: "opportunity", id: "bundle-Brand Buttons-Divi Tee" }),
      ]),
    );
  });
});
