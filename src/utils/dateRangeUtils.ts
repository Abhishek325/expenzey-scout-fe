import dayjs from "dayjs";
import type { DateRangePreset } from "@/types/metrics";

/** Demo anchor — matches mock dashboard data (May 2024). */
export const MOCK_TODAY = dayjs("2024-05-25");

export function presetToDays(preset: DateRangePreset): number {
  switch (preset) {
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "90d":
      return 90;
    case "12mo":
      return 365;
    default:
      return 7;
  }
}

export function formatDashboardDateRangeLabel(start: Date, end: Date): string {
  const s = dayjs(start);
  const e = dayjs(end);
  const startPart = s.format("MMM D");
  const endPart = e.format("MMM D, YYYY");
  if (s.isSame(e, "day")) {
    return e.format("MMM D, YYYY");
  }
  return `${startPart} – ${endPart}`;
}

export function getRangeForPreset(preset: DateRangePreset): { start: Date; end: Date } {
  const end = MOCK_TODAY.endOf("day");
  const days = presetToDays(preset);
  const start = end.subtract(days - 1, "day").startOf("day");
  return { start: start.toDate(), end: end.toDate() };
}

export function dayCountInRange(start: Date, end: Date): number {
  return dayjs(end).startOf("day").diff(dayjs(start).startOf("day"), "day") + 1;
}

export function comparisonPeriodLabel(start: Date, end: Date): string {
  const days = dayCountInRange(start, end);
  const compareEnd = dayjs(start).subtract(1, "day");
  const compareStart = compareEnd.subtract(days - 1, "day");
  return formatDashboardDateRangeLabel(compareStart.toDate(), compareEnd.toDate());
}

export function isDateInRange(isoDate: string, start: Date, end: Date): boolean {
  const d = dayjs(isoDate.slice(0, 10));
  return (
    !d.isBefore(dayjs(start).startOf("day")) && !d.isAfter(dayjs(end).endOf("day"))
  );
}
