import type { IMetricsService } from "@/services/metrics/IMetricsService";
import { wpRestFetch } from "@/services/wp/wpRestClient";
import { withDateRange } from "@/services/wp/wpQueryUtils";
import type {
  DashboardMetrics,
  DateRangeSelection,
  RevenueChartGranularity,
  RevenueTrend,
} from "@/types/metrics";

export class WpMetricsService implements IMetricsService {
  async getDashboardMetrics(range: DateRangeSelection): Promise<DashboardMetrics> {
    return wpRestFetch<DashboardMetrics>(withDateRange("/dashboard/metrics", range));
  }

  async getRevenueTrend(
    range: DateRangeSelection,
    granularity: RevenueChartGranularity = "daily"
  ): Promise<RevenueTrend> {
    const path = withDateRange("/dashboard/revenue", range);
    const url = `${path}&granularity=${granularity}`;
    return wpRestFetch<RevenueTrend>(url);
  }
}
