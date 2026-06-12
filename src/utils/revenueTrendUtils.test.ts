import {
  aggregateRevenuePoints,
  fillRevenueSeries,
  formatRevenueChartAxisLabel,
} from "@/utils/revenueTrendUtils";

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

  it("sums revenue by calendar week (Sunday start)", () => {
    expect(aggregateRevenuePoints(samplePoints, "weekly")).toEqual([
      { date: "2024-05-19", revenue: 300 },
      { date: "2024-05-26", revenue: 50 },
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

describe("fillRevenueSeries", () => {
  it("fills every day in the range with zero for missing buckets", () => {
    const start = new Date("2026-03-08T00:00:00");
    const end = new Date("2026-03-14T23:59:59");
    const sparse = [{ date: "2026-03-10", revenue: 500 }];

    const filled = fillRevenueSeries(start, end, "daily", sparse);

    expect(filled).toHaveLength(7);
    expect(filled.map((point) => point.date)).toEqual([
      "2026-03-08",
      "2026-03-09",
      "2026-03-10",
      "2026-03-11",
      "2026-03-12",
      "2026-03-13",
      "2026-03-14",
    ]);
    expect(filled.find((point) => point.date === "2026-03-10")?.revenue).toBe(500);
    expect(filled.filter((point) => point.revenue === 0)).toHaveLength(6);
  });

  it("fills weekly buckets across a multi-week range", () => {
    const start = new Date("2026-03-08T00:00:00");
    const end = new Date("2026-03-21T23:59:59");
    const sparse = [{ date: "2026-03-10", revenue: 900 }];

    const filled = fillRevenueSeries(start, end, "weekly", sparse);

    expect(filled).toEqual([
      { date: "2026-03-08", revenue: 900 },
      { date: "2026-03-15", revenue: 0 },
    ]);
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
