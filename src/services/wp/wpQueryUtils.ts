import type { DateRangeSelection, RevenueChartGranularity } from "@/types/metrics";

export interface ReviewIntelligenceDetailQuery {
  granularity?: RevenueChartGranularity;
  trendBuckets?: number;
}

export function dateRangeQuery(range: DateRangeSelection): string {
  const params = new URLSearchParams({
    start: range.start.toISOString(),
    end: range.end.toISOString(),
  });
  return params.toString();
}

export function withDateRange(path: string, range: DateRangeSelection): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${dateRangeQuery(range)}`;
}

export function withReviewIntelligenceDetailQuery(
  path: string,
  range: DateRangeSelection,
  options: ReviewIntelligenceDetailQuery = {},
): string {
  const params = new URLSearchParams(dateRangeQuery(range));
  params.set("detail", "true");
  params.set("granularity", options.granularity ?? "weekly");
  params.set("trendBuckets", String(options.trendBuckets ?? 4));
  return `${path}?${params.toString()}`;
}
