import { computed, inject, ref, watch } from "vue";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import { resolveStringKey } from "@/composables/dashboard/resolveStringKey";
import { useDateRangeStore } from "@/stores/dateRange";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";

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

export function useReviewIntelligence() {
  const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;
  const stringService = inject(STRING_SERVICE_KEY) as IStringService;
  const dateRange = useDateRangeStore();
  const loading = ref(true);
  const error = ref<string | null>(null);
  const positivePercent = ref(0);
  const reviewCount = ref(0);
  const positiveMentions = ref<string[]>([]);
  const complaints = ref<string[]>([]);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      const data = await reportsService.getReviewIntelligence(dateRange.selection);
      positivePercent.value = data.sentiment.positive;
      reviewCount.value = data.totalReviews;
      positiveMentions.value = mapThemeLabels(
        data.positiveMentions,
        stringService,
        "dashboard.aiInsights.reviewIntelligence.themes.positive",
      );
      complaints.value = mapThemeLabels(
        data.complaintThemes,
        stringService,
        "dashboard.aiInsights.reviewIntelligence.themes.complaint",
      );
    } catch (e) {
      error.value = e instanceof Error ? e.message : "error";
    } finally {
      loading.value = false;
    }
  }

  const hasData = computed(() => reviewCount.value > 0);

  watch(() => dateRange.rangeKey, load, { immediate: true });

  return { loading, error, positivePercent, reviewCount, positiveMentions, complaints, hasData, reload: load };
}
