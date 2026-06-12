import dayjs from "dayjs";
import {
  comparisonPeriodLabel,
  dayCountInRange,
  formatDashboardDateRangeLabel,
  getRangeForPreset,
  getCurrentWeekRange,
  isDateInRange,
  presetToDays,
} from "@/utils/dateRangeUtils";

const MOCK_TODAY = dayjs("2024-05-25");

describe("presetToDays", () => {
  it.each([
    ["7d", 7],
    ["30d", 30],
    ["90d", 90],
    ["12mo", 365],
  ] as const)("maps %s to %i days", (preset, expected) => {
    expect(presetToDays(preset)).toBe(expected);
  });
});

describe("formatDashboardDateRangeLabel", () => {
  it("formats a single day", () => {
    const date = new Date("2024-05-25T12:00:00");
    expect(formatDashboardDateRangeLabel(date, date)).toBe("May 25, 2024");
  });

  it("formats a date range", () => {
    const start = new Date("2024-05-19T00:00:00");
    const end = new Date("2024-05-25T23:59:59");
    expect(formatDashboardDateRangeLabel(start, end)).toBe("May 19 – May 25, 2024");
  });
});

describe("getRangeForPreset", () => {
  it("returns an inclusive range ending on the reference day", () => {
    const { start, end } = getRangeForPreset("7d", MOCK_TODAY);

    expect(dayjs(end).format("YYYY-MM-DD")).toBe(MOCK_TODAY.format("YYYY-MM-DD"));
    expect(dayCountInRange(start, end)).toBe(7);
  });

  it("spans 30 days for the 30d preset", () => {
    const { start, end } = getRangeForPreset("30d", MOCK_TODAY);
    expect(dayCountInRange(start, end)).toBe(30);
  });
});

describe("getCurrentWeekRange", () => {
  it("returns Sunday through Saturday for the reference week", () => {
    // 2024-05-22 is a Wednesday
    const reference = dayjs("2024-05-22");
    const { start, end } = getCurrentWeekRange(reference);

    expect(dayjs(start).format("YYYY-MM-DD")).toBe("2024-05-19"); // Sunday
    expect(dayjs(end).format("YYYY-MM-DD")).toBe("2024-05-25"); // Saturday
  });
});

describe("dayCountInRange", () => {
  it("counts inclusive calendar days", () => {
    const start = new Date("2024-05-19");
    const end = new Date("2024-05-25");
    expect(dayCountInRange(start, end)).toBe(7);
  });
});

describe("comparisonPeriodLabel", () => {
  it("labels the immediately preceding period of equal length", () => {
    const start = new Date("2024-05-19");
    const end = new Date("2024-05-25");
    expect(comparisonPeriodLabel(start, end)).toBe("May 12 – May 18, 2024");
  });
});

describe("isDateInRange", () => {
  const start = new Date("2024-05-19T00:00:00");
  const end = new Date("2024-05-25T23:59:59");

  it("includes dates on range boundaries", () => {
    expect(isDateInRange("2024-05-19", start, end)).toBe(true);
    expect(isDateInRange("2024-05-25", start, end)).toBe(true);
  });

  it("includes ISO timestamps using the date portion only", () => {
    expect(isDateInRange("2024-05-22T15:30:00Z", start, end)).toBe(true);
  });

  it("excludes dates outside the range", () => {
    expect(isDateInRange("2024-05-18", start, end)).toBe(false);
    expect(isDateInRange("2024-05-26", start, end)).toBe(false);
  });
});
