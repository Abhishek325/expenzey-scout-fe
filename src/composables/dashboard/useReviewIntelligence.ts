import { computed, inject, type ComputedRef } from "vue";
import { useDashboardWidget } from "@/composables/dashboard/useDashboardWidget";
import { resolveStringKey } from "@/composables/dashboard/resolveStringKey";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import { useDateRangeStore } from "@/stores/dateRange";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";
import type { DashboardWidgetState } from "@/types/dashboardWidget";

function mapThemeLabels(
  themes: string[],
  stringService: IStringService,
  prefix: "dashboard.aiInsights.reviewIntelligence.themes.positive" | "dashboard.aiInsights.reviewIntelligence.themes.complaint",
): string[] {
  return themes.map((theme) => {
    const key = `${prefix}.${theme}`;
    const resolved = resolveStringKey(stringService, key);
    return resolved === key ? theme : resolved;
  });
}

interface ReviewIntelligenceState extends DashboardWidgetState {
  positivePercent: ComputedRef<number>;
  reviewCount: ComputedRef<number>;
  positiveMentions: ComputedRef<string[]>;
  complaints: ComputedRef<string[]>;
}

export function useReviewIntelligence(): ReviewIntelligenceState {
  const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;
  const stringService = inject(STRING_SERVICE_KEY) as IStringService;
  const dateRange = useDateRangeStore();

  const widget = useDashboardWidget(
    () => reportsService.getReviewIntelligence(dateRange.selection),
    { hasData: (data) => (data?.totalReviews ?? 0) > 0 }
  );

  const positivePercent = computed(() => widget.data.value?.sentiment.positive ?? 0);
  const reviewCount = computed(() => widget.data.value?.totalReviews ?? 0);
  const positiveMentions = computed(() => {
    const data = widget.data.value;
    if (!data) return [];
    return mapThemeLabels(
      data.positiveMentions,
      stringService,
      "dashboard.aiInsights.reviewIntelligence.themes.positive",
    );
  });
  const complaints = computed(() => {
    const data = widget.data.value;
    if (!data) return [];
    return mapThemeLabels(
      data.complaintThemes,
      stringService,
      "dashboard.aiInsights.reviewIntelligence.themes.complaint",
    );
  });

  return {
    loading: widget.loading,
    error: widget.error,
    hasData: widget.hasData,
    reload: widget.reload,
    positivePercent,
    reviewCount,
    positiveMentions,
    complaints,
  };
}
