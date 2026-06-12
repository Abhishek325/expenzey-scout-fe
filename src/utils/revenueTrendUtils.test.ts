import {
  aggregateRevenuePoints,
  formatRevenueChartAxisLabel,
  generateMockRevenueDailyPoints,
} from "@/utils/revenueTrendUtils";
import { MOCK_TODAY } from "@/utils/dateRangeUtils";

describe("aggregateRevenuePoints", () => {
  const samplePoints = [
    { date: "2024-05-20", revenue: 100 },
    { date: "2024-05-21", revenue: 200 },
    { date: "2024-05-27", revenue: 50 },
  ];

  it("sorts daily points without aggregating", () => {
    const unsorted = [
      { date: "2024-05-21", revenue: 200 },
      { date: "2024-05-20", revenue: 100 },
    ];

    expect(aggregateRevenuePoints(unsorted, "daily")).toEqual([
      { date: "2024-05-20", revenue: 100 },
      { date: "2024-05-21", revenue: 200 },
    ]);
  });

  it("sums revenue by ISO week", () => {
    expect(aggregateRevenuePoints(samplePoints, "weekly")).toEqual([
      { date: "2024-05-20", revenue: 300 },
      { date: "2024-05-27", revenue: 50 },
    ]);
  });

  it("sums revenue by calendar month", () => {
    const points = [
      { date: "2024-05-01", revenue: 100 },
      { date: "2024-05-15", revenue: 250 },
      { date: "2024-06-01", revenue: 75 },
    ];

    expect(aggregateRevenuePoints(points, "monthly")).toEqual([
      { date: "2024-05-01", revenue: 350 },
      { date: "2024-06-01", revenue: 75 },
    ]);
  });
});

describe("generateMockRevenueDailyPoints", () => {
  it("returns 365 deterministic daily points ending on MOCK_TODAY", () => {
    const firstRun = generateMockRevenueDailyPoints();
    const secondRun = generateMockRevenueDailyPoints();

    expect(firstRun).toHaveLength(365);
    expect(firstRun[0]?.date).toBe(MOCK_TODAY.subtract(364, "day").format("YYYY-MM-DD"));
    expect(firstRun[firstRun.length - 1]?.date).toBe(MOCK_TODAY.format("YYYY-MM-DD"));
    expect(secondRun).toEqual(firstRun);
    expect(firstRun.every((point) => point.revenue > 0)).toBe(true);
  });
});

describe("formatRevenueChartAxisLabel", () => {
  it("formats monthly labels with month and year", () => {
    expect(formatRevenueChartAxisLabel("2024-05-01", "monthly")).toBe("May 2024");
  });

  it("formats weekly labels with month and day", () => {
    expect(formatRevenueChartAxisLabel("2024-05-20", "weekly")).toBe("May 20");
  });

  it("formats daily labels with month and day", () => {
    expect(formatRevenueChartAxisLabel("2024-05-20", "daily")).toBe("May 20");
  });
});
