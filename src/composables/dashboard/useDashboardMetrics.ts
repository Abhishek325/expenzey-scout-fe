import { computed, inject, ref, watch } from "vue";
import { METRICS_SERVICE_KEY, type IMetricsService } from "@/services/metrics/IMetricsService";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";
import { useFormatCurrency } from "@/composables/useFormatCurrency";
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
  const { formatCurrency } = useFormatCurrency();
  const loading = ref(true);
  const error = ref<string | null>(null);
  const comparisonPeriod = ref("");
  const kpis = ref<LocalizedMetricCard[]>([]);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      const data = await metricsService.getDashboardMetrics(dateRange.selection);
      comparisonPeriod.value = data.comparisonPeriod;
      kpis.value = data.kpis.map((card) => ({
        ...card,
        label: resolveStringKey(stringService, card.labelKey),
        formattedValue: formatMetricDisplayValue(card, formatCurrency),
      }));
    } catch (e) {
      error.value = e instanceof Error ? e.message : "error";
    } finally {
      loading.value = false;
    }
  }

  watch(() => dateRange.rangeKey, load, { immediate: true });

  return {
    loading,
    error,
    comparisonPeriod,
    kpis: computed(() => kpis.value),
    reload: load,
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
