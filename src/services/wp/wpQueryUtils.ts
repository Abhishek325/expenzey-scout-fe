import type { DateRangeSelection } from "@/types/metrics";

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
