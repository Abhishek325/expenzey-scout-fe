import { computed, inject, ref, watch } from "vue";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import { useDateRangeStore } from "@/stores/dateRange";
import type { BusinessSummary } from "@/types/ai";

interface BusinessSummaryHighlight {
  id: string;
  label: string;
  detail: string;
  icon: string;
  iconClass: string;
}

export function useBusinessSummary() {
  const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;
  const dateRange = useDateRangeStore();
  const loading = ref(true);
  const error = ref<string | null>(null);
  const summary = ref<BusinessSummary | null>(null);
  const labels = useReactiveLocaleStringRecord("dashboard", [
    "aiInsights.businessSummary.overview",
    "aiInsights.businessSummary.topPerformer",
    "aiInsights.businessSummary.needsAttention",
    "aiInsights.businessSummary.opportunity",
  ] as const);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      summary.value = await reportsService.getBusinessSummary(dateRange.selection);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "error";
    } finally {
      loading.value = false;
    }
  }

  const highlights = computed<BusinessSummaryHighlight[]>(() => {
    if (!summary.value) return [];
    const s = summary.value;
    const l = labels.value;
    return [
      {
        id: "overview",
        label: l["aiInsights.businessSummary.overview"],
        detail: s.overview,
        icon: "fa-arrow-trend-up",
        iconClass: "bg-emerald-100 text-emerald-600",
      },
      {
        id: "top-performer",
        label: l["aiInsights.businessSummary.topPerformer"],
        detail: s.topPerformer,
        icon: "fa-trophy",
        iconClass: "bg-amber-100 text-amber-600",
      },
      {
        id: "needs-attention",
        label: l["aiInsights.businessSummary.needsAttention"],
        detail: s.needsAttention,
        icon: "fa-triangle-exclamation",
        iconClass: "bg-rose-100 text-rose-600",
      },
      {
        id: "opportunity",
        label: l["aiInsights.businessSummary.opportunity"],
        detail: s.opportunity,
        icon: "fa-lightbulb",
        iconClass: "bg-yellow-100 text-yellow-600",
      },
    ];
  });

  watch(() => dateRange.rangeKey, load, { immediate: true });

  return { loading, error, highlights, reload: load };
}
