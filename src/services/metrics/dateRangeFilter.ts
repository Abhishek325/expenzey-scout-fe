import type { DateRangePreset } from "@/types/metrics";
import {
  dayCountInRange,
  isDateInRange,
  presetToDays,
} from "@/utils/dateRangeUtils";

export { presetToDays };

export function filterByDateRange<T extends { date: string }>(
  rows: T[],
  start: Date,
  end: Date
): T[] {
  return rows.filter((row) => isDateInRange(row.date, start, end));
}

export function filterByPresetDates<T extends { date: string }>(
  rows: T[],
  preset: DateRangePreset
): T[] {
  if (rows.length === 0) {
    return rows;
  }
  const sorted = [...rows].sort((a, b) => a.date.localeCompare(b.date));
  const lastDate = new Date(sorted[sorted.length - 1]!.date);
  const days = presetToDays(preset);
  const cutoff = new Date(lastDate);
  cutoff.setDate(cutoff.getDate() - (days - 1));
  return sorted.filter((row) => new Date(row.date) >= cutoff);
}

export function scaleValueForRange(value: number, start: Date, end: Date): number {
  const days = dayCountInRange(start, end);
  const factor = days / 7;
  return Math.round(value * factor * 100) / 100;
}

export function scaleValueForPreset(value: number, preset: DateRangePreset): number {
  const factor = presetToDays(preset) / 7;
  return Math.round(value * factor * 100) / 100;
}
