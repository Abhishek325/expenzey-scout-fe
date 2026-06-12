import { inject, ref, toValue, watch, type MaybeRefOrGetter } from "vue";
import { METRICS_SERVICE_KEY, type IMetricsService } from "@/services/metrics/IMetricsService";
import { useDateRangeStore } from "@/stores/dateRange";
import type { RevenueChartGranularity, RevenueTrend } from "@/types/metrics";

export function useRevenueTrend(granularity: MaybeRefOrGetter<RevenueChartGranularity> = "daily") {
  const metricsService = inject(METRICS_SERVICE_KEY) as IMetricsService;
  const dateRange = useDateRangeStore();
  const loading = ref(true);
  const trend = ref<RevenueTrend | null>(null);

  async function load() {
    loading.value = true;
    try {
      trend.value = await metricsService.getRevenueTrend(
        dateRange.selection,
        toValue(granularity)
      );
    } finally {
      loading.value = false;
    }
  }

  watch([() => dateRange.rangeKey, () => toValue(granularity)], load, { immediate: true });

  return { loading, trend, reload: load };
}
