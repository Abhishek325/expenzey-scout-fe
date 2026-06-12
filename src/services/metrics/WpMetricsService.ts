import type { IMetricsService } from "@/services/metrics/IMetricsService";
import type {
  DashboardMetrics,
  DateRangeSelection,
  RevenueChartGranularity,
  RevenueTrend,
} from "@/types/metrics";

export class WpMetricsService implements IMetricsService {
  async getDashboardMetrics(_range: DateRangeSelection): Promise<DashboardMetrics> {
    throw new Error("WpMetricsService not implemented");
  }

  async getRevenueTrend(
    _range: DateRangeSelection,
    _granularity: RevenueChartGranularity = "daily"
  ): Promise<RevenueTrend> {
    throw new Error("WpMetricsService not implemented");
  }
}
