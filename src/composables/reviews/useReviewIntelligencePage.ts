import { computed, inject, ref, watch } from "vue";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";
import { useDateRangeStore } from "@/stores/dateRange";
import type { ReviewIntelligenceDetail } from "@/types/ai";
import { mapReviewThemeDetails } from "@/utils/reviewThemeLabels";
import { normalizeReviewIntelligenceDetail } from "@/utils/normalizeReviewIntelligenceDetail";

const REVIEW_TREND_GRANULARITY = "weekly" as const;

export function useReviewIntelligencePage() {
  const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;
  const stringService = inject(STRING_SERVICE_KEY) as IStringService;
  const dateRange = useDateRangeStore();

  const loading = ref(true);
  const error = ref<string | null>(null);
  const data = ref<ReviewIntelligenceDetail | null>(null);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      data.value = normalizeReviewIntelligenceDetail(
        await reportsService.getReviewIntelligenceDetail(dateRange.selection, {
          granularity: REVIEW_TREND_GRANULARITY,
          trendBuckets: 4,
        }),
      );
    } catch (e) {
      error.value = e instanceof Error ? e.message : "error";
      data.value = null;
    } finally {
      loading.value = false;
    }
  }

  watch(
    () => dateRange.rangeKey,
    () => {
      void load();
    },
    { immediate: true },
  );

  const positiveThemes = computed(() => {
    if (!data.value) return [];
    return mapReviewThemeDetails(
      data.value.positiveThemes,
      stringService,
      "dashboard.aiInsights.reviewIntelligence.themes.positive",
    );
  });

  const complaintThemes = computed(() => {
    if (!data.value) return [];
    return mapReviewThemeDetails(
      data.value.complaintThemes,
      stringService,
      "dashboard.aiInsights.reviewIntelligence.themes.complaint",
    );
  });

  const hasData = computed(() => (data.value?.totalReviews ?? 0) > 0);

  return {
    loading,
    error,
    data,
    hasData,
    positiveThemes,
    complaintThemes,
    reload: load,
  };
}
