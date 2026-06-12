import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import type { RevenueChartGranularity, RevenueTrendPoint } from "@/types/metrics";
import { MOCK_TODAY } from "@/utils/dateRangeUtils";

dayjs.extend(isoWeek);

function bucketKey(date: string, granularity: RevenueChartGranularity): string {
  const d = dayjs(date.slice(0, 10));
  if (granularity === "weekly") {
    return d.startOf("isoWeek").format("YYYY-MM-DD");
  }
  if (granularity === "monthly") {
    return d.startOf("month").format("YYYY-MM-DD");
  }
  return d.format("YYYY-MM-DD");
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
    const key = bucketKey(point.date, granularity);
    buckets.set(key, (buckets.get(key) ?? 0) + point.revenue);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({ date, revenue }));
}

/** Deterministic mock daily revenue for demo charts (12 months ending MOCK_TODAY). */
export function generateMockRevenueDailyPoints(): RevenueTrendPoint[] {
  const end = MOCK_TODAY.startOf("day");
  const start = end.subtract(364, "day");
  const points: RevenueTrendPoint[] = [];
  let current = start;
  let index = 0;

  while (!current.isAfter(end)) {
    const seasonal = Math.sin(index / 14) * 700;
    const weekly = Math.sin(index / 7) * 400;
    const trend = index * 3.5;
    const revenue = Math.round(1800 + seasonal + weekly + trend + ((index * 47) % 350));

    points.push({
      date: current.format("YYYY-MM-DD"),
      revenue,
    });

    current = current.add(1, "day");
    index += 1;
  }

  return points;
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
