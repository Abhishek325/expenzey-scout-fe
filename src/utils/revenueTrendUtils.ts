import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { RevenueChartGranularity, RevenueTrendPoint } from "@/types/metrics";

function bucketStart(date: Dayjs, granularity: RevenueChartGranularity): Dayjs {
  const day = date.startOf("day");
  if (granularity === "monthly") {
    return day.startOf("month");
  }
  if (granularity === "weekly") {
    return day.day(0);
  }
  return day;
}

function bucketKey(date: Dayjs, granularity: RevenueChartGranularity): string {
  return bucketStart(date, granularity).format("YYYY-MM-DD");
}

function advanceBucket(date: Dayjs, granularity: RevenueChartGranularity): Dayjs {
  if (granularity === "monthly") {
    return date.add(1, "month").startOf("month");
  }
  if (granularity === "weekly") {
    return date.add(7, "day");
  }
  return date.add(1, "day");
}

export function aggregateRevenuePoints(
  points: RevenueTrendPoint[],
  granularity: RevenueChartGranularity
): RevenueTrendPoint[] {
  if (granularity === "daily") {
    return [...points].sort((a, b) => a.date.localeCompare(b.date));
  }

  const buckets = new Map<string, number>();
  for (const point of points) {
    const key = bucketKey(dayjs(point.date.slice(0, 10)), granularity);
    buckets.set(key, (buckets.get(key) ?? 0) + point.revenue);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({ date, revenue }));
}

/** Fill every bucket in [start, end] so daily charts show the full selected period. */
export function fillRevenueSeries(
  start: Date,
  end: Date,
  granularity: RevenueChartGranularity,
  points: RevenueTrendPoint[]
): RevenueTrendPoint[] {
  const revenueByBucket = new Map<string, number>();
  for (const point of points) {
    const key = bucketKey(dayjs(point.date.slice(0, 10)), granularity);
    revenueByBucket.set(key, (revenueByBucket.get(key) ?? 0) + point.revenue);
  }

  const rangeStart = bucketStart(dayjs(start).startOf("day"), granularity);
  const rangeEnd = dayjs(end).startOf("day");
  const result: RevenueTrendPoint[] = [];

  let cursor = rangeStart;
  while (!cursor.isAfter(rangeEnd)) {
    const key = bucketKey(cursor, granularity);
    result.push({
      date: key,
      revenue: revenueByBucket.get(key) ?? 0,
    });
    cursor = advanceBucket(cursor, granularity);
  }

  return result;
}

export function formatRevenueChartAxisLabel(
  isoDate: string,
  granularity: RevenueChartGranularity
): string {
  const date = dayjs(isoDate.slice(0, 10));
  if (granularity === "monthly") {
    return date.format("MMM YYYY");
  }
  if (granularity === "weekly") {
    return date.format("MMM D");
  }
  return date.format("MMM D");
}
