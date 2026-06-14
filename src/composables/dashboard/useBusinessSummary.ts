import { computed, inject, ref, watch } from "vue";
import { useLocalizedString } from "@/composables/useLocalizedString";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import { useDateRangeStore } from "@/stores/dateRange";
import type { BusinessSummary } from "@/types/ai";
import { ensureLocaleString } from "@/utils/formatLocaleTemplate";
import {
  parseNeedsAttention,
  parseOpportunity,
  parseOverview,
  parseTopPerformer,
} from "@/utils/parseBusinessSummary";

export interface BusinessSummaryHighlight {
  id: string;
  label: string;
  headline: string;
  subtext: string;
  headlineLarge?: boolean;
  icon: string;
  iconClass: string;
  iconBgClass: string;
}

export function useBusinessSummary() {
  const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;
  const dateRange = useDateRangeStore();
  const loading = ref(true);
  const error = ref<string | null>(null);
  const summary = ref<BusinessSummary | null>(null);

  const overviewLabel = useLocalizedString("dashboard", "aiInsights.businessSummary.overview");
  const topPerformerLabel = useLocalizedString("dashboard", "aiInsights.businessSummary.topPerformer");
  const needsAttentionLabel = useLocalizedString("dashboard", "aiInsights.businessSummary.needsAttention");
  const opportunityLabel = useLocalizedString("dashboard", "aiInsights.businessSummary.opportunity");
  const revenueIncreasedLabel = useLocalizedString(
    "dashboard",
    "aiInsights.businessSummary.revenueIncreased"
  );
  const revenueDecreasedLabel = useLocalizedString(
    "dashboard",
    "aiInsights.businessSummary.revenueDecreased"
  );
  const vsLastPeriodLabel = useLocalizedString("dashboard", "aiInsights.businessSummary.vsLastPeriod");
  const salesDownLabel = useLocalizedString("dashboard", "aiInsights.businessSummary.salesDown");
  const bundleHeadlineLabel = useLocalizedString(
    "dashboard",
    "aiInsights.businessSummary.bundleHeadline"
  );
  const coPurchaseRateLabel = useLocalizedString(
    "dashboard",
    "aiInsights.businessSummary.coPurchaseRate"
  );

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
    const summaryLabels = {
      overview: ensureLocaleString(overviewLabel.value),
      topPerformer: ensureLocaleString(topPerformerLabel.value),
      needsAttention: ensureLocaleString(needsAttentionLabel.value),
      opportunity: ensureLocaleString(opportunityLabel.value),
      revenueIncreased: ensureLocaleString(revenueIncreasedLabel.value),
      revenueDecreased: ensureLocaleString(revenueDecreasedLabel.value),
      vsLastPeriod: ensureLocaleString(vsLastPeriodLabel.value),
      salesDown: ensureLocaleString(salesDownLabel.value),
      bundleHeadline: ensureLocaleString(bundleHeadlineLabel.value),
      coPurchaseRate: ensureLocaleString(coPurchaseRateLabel.value),
    };

    const overview = parseOverview(s.overview, summaryLabels);
    const topPerformer = parseTopPerformer(s.topPerformer, summaryLabels);
    const needsAttention = parseNeedsAttention(s.needsAttention, summaryLabels);
    const opportunity = parseOpportunity(s.opportunity, summaryLabels);

    return [
      {
        id: "overview",
        ...overview,
        icon: "fa-arrow-trend-up",
        iconClass: "text-emerald-600",
        iconBgClass: "bg-emerald-100",
      },
      {
        id: "top-performer",
        ...topPerformer,
        icon: "fa-trophy",
        iconClass: "text-amber-600",
        iconBgClass: "bg-amber-100",
      },
      {
        id: "needs-attention",
        ...needsAttention,
        icon: "fa-triangle-exclamation",
        iconClass: "text-rose-600",
        iconBgClass: "bg-rose-100",
      },
      {
        id: "opportunity",
        ...opportunity,
        icon: "fa-lightbulb",
        iconClass: "text-yellow-600",
        iconBgClass: "bg-yellow-100",
      },
    ];
  });

  watch(() => dateRange.rangeKey, load, { immediate: true });

  return { loading, error, highlights, reload: load };
}
