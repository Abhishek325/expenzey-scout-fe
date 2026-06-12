import { inject, ref, toValue, watch, type MaybeRefOrGetter } from "vue";
import { METRICS_SERVICE_KEY, type IMetricsService } from "@/services/metrics/IMetricsService";
import { useAppStore } from "@/stores/appStore";
import { useDateRangeStore } from "@/stores/dateRange";
import type { RevenueChartGranularity, RevenueTrend } from "@/types/metrics";
import { fillRevenueSeries } from "@/utils/revenueTrendUtils";

export function useRevenueTrend(granularity: MaybeRefOrGetter<RevenueChartGranularity> = "daily") {
  const metricsService = inject(METRICS_SERVICE_KEY) as IMetricsService;
  const dateRange = useDateRangeStore();
  const appStore = useAppStore();
  const loading = ref(true);
  const trend = ref<RevenueTrend | null>(null);

  async function load() {
    loading.value = true;
    try {
      const chartGranularity = toValue(granularity);
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
      loading.value = false;
    }
  }

  watch([() => dateRange.rangeKey, () => toValue(granularity)], load, { immediate: true });

  return { loading, trend, reload: load };
}
