import { computed, inject, ref, watch } from "vue";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import { useDateRangeStore } from "@/stores/dateRange";

const THEME_LABELS: Record<string, string> = {
  delivery: "Fast delivery",
  quality: "Product quality",
  price: "Good value",
  support: "Great customer service",
  value: "Good value",
};

const COMPLAINT_LABELS: Record<string, string> = {
  delivery: "Delivery delays",
  quality: "Packaging damage",
  price: "Pricing concerns",
  support: "Support issues",
};

export function useReviewIntelligence() {
  const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;
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
      positiveMentions.value = data.positiveMentions.map((t) => THEME_LABELS[t] ?? t);
      complaints.value = data.complaintThemes.map((t) => COMPLAINT_LABELS[t] ?? t);
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
