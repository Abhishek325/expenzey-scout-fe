import mockMetrics from "@/data/dashboard/mock-metrics.json";
import { simulateDelay } from "@/services/delay";
import type { IMetricsService } from "@/services/metrics/IMetricsService";
import {
  filterByDateRange,
  scaleValueForRange,
} from "@/services/metrics/dateRangeFilter";
import type {
  DashboardMetrics,
  DateRangeSelection,
  MetricCard,
  RevenueChartGranularity,
  RevenueTrend,
} from "@/types/metrics";
import {
  comparisonPeriodLabel,
  formatDashboardDateRangeLabel,
} from "@/utils/dateRangeUtils";
import {
  aggregateRevenuePoints,
  generateMockRevenueDailyPoints,
} from "@/utils/revenueTrendUtils";

const MOCK_DAILY_REVENUE = generateMockRevenueDailyPoints();

export class MockMetricsService implements IMetricsService {
  async getDashboardMetrics(range: DateRangeSelection): Promise<DashboardMetrics> {
    await simulateDelay();
    const kpis = (mockMetrics.kpis as MetricCard[]).map((card) => ({
      ...card,
      value: scaleValueForRange(card.value, range.start, range.end),
      formattedValue: card.formattedValue,
    }));

    return {
      comparisonPeriod: comparisonPeriodLabel(range.start, range.end),
      kpis,
    };
  }

  async getRevenueTrend(
    range: DateRangeSelection,
    granularity: RevenueChartGranularity = "daily"
  ): Promise<RevenueTrend> {
    await simulateDelay();
    const filtered = filterByDateRange(MOCK_DAILY_REVENUE, range.start, range.end);
    const dataPoints = aggregateRevenuePoints(filtered, granularity);
    return {
      currency: "USD",
      period: formatDashboardDateRangeLabel(range.start, range.end),
      granularity,
      dataPoints,
    };
  }
}
