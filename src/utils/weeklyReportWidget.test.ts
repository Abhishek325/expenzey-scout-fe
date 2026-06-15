import { describe, expect, it } from "vitest";
import type { WeeklyReportContent } from "@/types/ai";
import { buildWeeklyReportWidgetRows } from "@/utils/weeklyReportWidget";

const sampleContent: WeeklyReportContent = {
  executiveSummary: "Revenue increased 12% compared to last week.",
  keyWins: ["Revenue up 12%"],
  needsAttention: ["Mens Divi Hoodie sales declined 10%"],
  topProducts: [
    { productName: "Brand Buttons", revenue: 89.91, growthPercent: 20.8 },
    { productName: "Mens Divi Hoodie", revenue: 40, growthPercent: -10 },
  ],
  customerInsights: {
    newCustomers: 3,
    returningCustomers: 5,
    returningGrowthPercent: 8,
    averageOrderValue: 47.97,
    averageOrderValueGrowthPercent: 100,
    repeatRevenue: 0,
    repeatRevenueGrowthPercent: 0,
  },
  periodMetrics: {
    revenue: 432,
    revenueGrowthPercent: 12,
    orders: 9,
    ordersGrowthPercent: 12,
  },
  opportunities: [],
  recommendedActions: ["Create a bundle with Brand Buttons & Divi Tee"],
};

const labels = {
  revenue: "Revenue",
  orders: "Orders",
  topProduct: "Top Product",
  customerTrend: "Customer Trend",
  returningCustomers: "Returning customers",
  mainRisk: "Main Risk",
  recommendedAction: "Recommended Action",
  ofRevenue: "of revenue",
};

describe("buildWeeklyReportWidgetRows", () => {
  it("builds six widget rows from report content", () => {
    const rows = buildWeeklyReportWidgetRows(
      sampleContent,
      (n) => `$${n.toFixed(2)}`,
      labels,
    );

    expect(rows).toHaveLength(6);
    expect(rows[0]).toMatchObject({ key: "revenue", value: "$432.00", trendPercent: 12, trendDirection: "up" });
    expect(rows[1]).toMatchObject({ key: "orders", value: "9", trendPercent: 12, trendDirection: "up" });
    expect(rows[2]).toMatchObject({ key: "topProduct", value: "Brand Buttons", detail: "$89.91 (20.8% of revenue)" });
    expect(rows[3]).toMatchObject({ key: "customerTrend", trendDirection: "up" });
    expect(rows[4]?.key).toBe("mainRisk");
    expect(rows[5]).toMatchObject({ key: "recommendedAction" });
  });
});
