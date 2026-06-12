import { inject, onMounted, ref } from "vue";
import { useFormatCurrency } from "@/composables/useFormatCurrency";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import { resolveStringKey } from "@/composables/dashboard/resolveStringKey";
import type { AISummary } from "@/types/reports";

export type InsightVariant = "success" | "danger" | "info";
export type InsightIcon = "trophy" | "warning" | "lightbulb";

export interface AIInsightViewModel {
  id: string;
  variant: InsightVariant;
  title: string;
  detail: string;
  productName?: string;
  icon?: InsightIcon;
}

export function useAISummary() {
  const stringService = inject(STRING_SERVICE_KEY) as IStringService;
  const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;
  const { formatCurrency } = useFormatCurrency();
  const insights = ref<AIInsightViewModel[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);

  function formatRevenueInsightLine(revenue: number, growthPercent: number): string {
    const arrow = growthPercent >= 0 ? "↑" : "↓";
    const magnitude = Math.abs(growthPercent);
    return `${formatCurrency(revenue, { maximumFractionDigits: 0 })} revenue (${arrow} ${magnitude}%)`;
  }

  function buildInsights(summary: AISummary) {
    const top = summary.topPerformer;
    const attention = summary.needsAttention;
    return [
      {
        id: "top-performer",
        variant: "success" as const,
        icon: "trophy" as const,
        title: resolveStringKey(stringService, "aiSummary.topPerformer.label"),
        productName: top.productName,
        detail: formatRevenueInsightLine(top.revenue, top.growthPercent),
      },
      {
        id: "needs-attention",
        variant: "danger" as const,
        icon: "warning" as const,
        title: resolveStringKey(stringService, "aiSummary.needsAttention.label"),
        productName: attention.productName,
        detail: formatRevenueInsightLine(attention.revenue, attention.growthPercent),
      },
      {
        id: "growth",
        variant: "info" as const,
        icon: "lightbulb" as const,
        title: resolveStringKey(stringService, "aiSummary.growthOpportunity.label"),
        detail: resolveStringKey(stringService, summary.growthOpportunity.textKey),
      },
    ];
  }

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      const summary = await reportsService.getAISummary();
      insights.value = buildInsights(summary);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load AI summary";
      insights.value = [];
    } finally {
      loading.value = false;
    }
  }

  onMounted(load);

  return { insights, loading, error, refresh: load };
}
