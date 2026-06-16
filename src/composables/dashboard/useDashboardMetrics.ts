import { computed, inject, ref, watch } from "vue";
import { METRICS_SERVICE_KEY, type IMetricsService } from "@/services/metrics/IMetricsService";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";
import { useFormatCurrency } from "@/composables/useFormatCurrency";
import { useDashboardOverviewStore } from "@/stores/dashboardOverviewStore";
import { useDateRangeStore } from "@/stores/dateRange";
import type { MetricCard } from "@/types/metrics";
import { resolveStringKey } from "@/composables/dashboard/resolveStringKey";

const CURRENCY_METRIC_IDS = new Set(["total-revenue", "aov"]);

export interface LocalizedMetricCard extends MetricCard {
  label: string;
}

export function useDashboardMetrics() {
  const metricsService = inject(METRICS_SERVICE_KEY) as IMetricsService;
  const stringService = inject(STRING_SERVICE_KEY) as IStringService;
  const dateRange = useDateRangeStore();
  const overviewStore = useDashboardOverviewStore();
  const { formatCurrency } = useFormatCurrency();
  const loading = ref(true);
  const error = ref<string | null>(null);
  const comparisonPeriod = ref("");
  const kpis = ref<LocalizedMetricCard[]>([]);

  function apply(data: { comparisonPeriod: string; kpis: MetricCard[] }) {
    comparisonPeriod.value = data.comparisonPeriod;
    kpis.value = data.kpis.map((card) => ({
      ...card,
      label: resolveStringKey(stringService, card.labelKey),
      formattedValue: formatMetricDisplayValue(card, formatCurrency),
    }));
  }

  async function loadFallback() {
    loading.value = true;
    error.value = null;
    try {
      const data = await metricsService.getDashboardMetrics(dateRange.selection);
      apply(data);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "error";
    } finally {
      loading.value = false;
    }
  }

  watch(
    [() => dateRange.rangeKey, () => overviewStore.metrics, () => overviewStore.loading, () => overviewStore.error],
    async () => {
      const inRange = overviewStore.loadedRangeKey === dateRange.rangeKey;
      if (inRange && overviewStore.metrics) {
        loading.value = overviewStore.loading;
        error.value = overviewStore.error;
        apply(overviewStore.metrics);
        return;
      }

      const waitingForOverview =
        overviewStore.loading &&
        overviewStore.requestedRangeKey === dateRange.rangeKey;
      if (waitingForOverview) {
        loading.value = true;
        error.value = null;
        return;
      }

      await loadFallback();
    },
    { immediate: true }
  );

  return {
    loading,
    error,
    comparisonPeriod,
    kpis: computed(() => kpis.value),
    reload: () => overviewStore.fetch(dateRange.selection, dateRange.rangeKey, "daily", true),
  };
}

function formatMetricDisplayValue(
  card: MetricCard,
  formatCurrency: (amount: number, options?: { maximumFractionDigits?: number }) => string
): string {
  if (CURRENCY_METRIC_IDS.has(card.id)) {
    const fractionDigits = card.id === "aov" ? 2 : 0;
    return formatCurrency(card.value, { maximumFractionDigits: fractionDigits });
  }
  return card.formattedValue;
}
