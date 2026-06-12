import type {
  DashboardMetrics,
  DateRangeSelection,
  RevenueChartGranularity,
  RevenueTrend,
} from "@/types/metrics";

export interface IMetricsService {
  getDashboardMetrics(range: DateRangeSelection): Promise<DashboardMetrics>;
  getRevenueTrend(
    range: DateRangeSelection,
    granularity?: RevenueChartGranularity
  ): Promise<RevenueTrend>;
}

export const METRICS_SERVICE_KEY = "metricsService";
