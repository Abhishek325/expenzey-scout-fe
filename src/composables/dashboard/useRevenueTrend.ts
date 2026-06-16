import { inject, ref, toValue, watch, type MaybeRefOrGetter } from "vue";
import { METRICS_SERVICE_KEY, type IMetricsService } from "@/services/metrics/IMetricsService";
import { useAppStore } from "@/stores/appStore";
import { useDashboardOverviewStore } from "@/stores/dashboardOverviewStore";
import { useDateRangeStore } from "@/stores/dateRange";
import type { RevenueChartGranularity, RevenueTrend } from "@/types/metrics";
import { fillRevenueSeries } from "@/utils/revenueTrendUtils";

export function useRevenueTrend(granularity: MaybeRefOrGetter<RevenueChartGranularity> = "daily") {
  const metricsService = inject(METRICS_SERVICE_KEY) as IMetricsService;
  const dateRange = useDateRangeStore();
  const appStore = useAppStore();
  const overviewStore = useDashboardOverviewStore();
  const loading = ref(true);
  const trend = ref<RevenueTrend | null>(null);

  async function load() {
    loading.value = true;
    let stillWaiting = false;
    try {
      const chartGranularity = toValue(granularity);

      const inOverviewRange =
        overviewStore.loadedRangeKey === dateRange.rangeKey &&
        overviewStore.loadedGranularity === chartGranularity;
      if (inOverviewRange && overviewStore.revenue) {
        trend.value = {
          ...overviewStore.revenue,
          currency: appStore.currency,
          dataPoints: fillRevenueSeries(
            dateRange.start,
            dateRange.end,
            chartGranularity,
            overviewStore.revenue.dataPoints
          ),
        };
        return;
      }

      const waitingForOverview =
        overviewStore.loading &&
        overviewStore.requestedRangeKey === dateRange.rangeKey &&
        overviewStore.requestedGranularity === chartGranularity;
      if (waitingForOverview) {
        stillWaiting = true;
        return;
      }

      const result = await metricsService.getRevenueTrend(
        dateRange.selection,
        chartGranularity
      );
      trend.value = {
        ...result,
        currency: appStore.currency,
        dataPoints: fillRevenueSeries(
          dateRange.start,
          dateRange.end,
          chartGranularity,
          result.dataPoints
        ),
      };
    } finally {
      if (!stillWaiting) {
        loading.value = false;
      }
    }
  }

  watch(
    [
      () => dateRange.rangeKey,
      () => toValue(granularity),
      () => overviewStore.revenue,
      () => overviewStore.loading,
      () => overviewStore.loadedRangeKey,
      () => overviewStore.requestedRangeKey,
    ],
    load,
    { immediate: true }
  );

  return { loading, trend, reload: load };
}
