import {
  filterByDateRange,
  filterByPresetDates,
  scaleValueForPreset,
  scaleValueForRange,
} from "@/services/metrics/dateRangeFilter";

describe("filterByDateRange", () => {
  const rows = [
    { date: "2024-05-18", value: 1 },
    { date: "2024-05-20", value: 2 },
    { date: "2024-05-25", value: 3 },
    { date: "2024-05-26", value: 4 },
  ];

  it("keeps rows whose date falls within the inclusive range", () => {
    const start = new Date("2024-05-19");
    const end = new Date("2024-05-25");

    expect(filterByDateRange(rows, start, end)).toEqual([
      { date: "2024-05-20", value: 2 },
      { date: "2024-05-25", value: 3 },
    ]);
  });
});

describe("filterByPresetDates", () => {
  it("returns the last N days relative to the newest row", () => {
    const rows = [
      { date: "2024-05-01" },
      { date: "2024-05-10" },
      { date: "2024-05-20" },
      { date: "2024-05-25" },
    ];

    expect(filterByPresetDates(rows, "7d")).toEqual([
      { date: "2024-05-20" },
      { date: "2024-05-25" },
    ]);
  });

  it("returns an empty array unchanged", () => {
    expect(filterByPresetDates([], "30d")).toEqual([]);
  });
});

describe("scaleValueForRange", () => {
  it("scales a weekly baseline value by range length", () => {
    const start = new Date("2024-05-19");
    const end = new Date("2024-05-25");

    expect(scaleValueForRange(100, start, end)).toBe(100);
  });
});

describe("scaleValueForPreset", () => {
  it("scales a weekly baseline value using preset length", () => {
    expect(scaleValueForPreset(100, "7d")).toBe(100);
    expect(scaleValueForPreset(100, "30d")).toBe(428.57);
  });
});
