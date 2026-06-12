import { inject, onMounted, ref } from "vue";
import mockSummary from "@/data/dashboard/mock-ai-summary.json";
function formatRevenueUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";
import { resolveStringKey } from "@/composables/dashboard/resolveStringKey";

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

function formatRevenueInsightLine(revenue: number, growthPercent: number): string {
  const arrow = growthPercent >= 0 ? "↑" : "↓";
  const magnitude = Math.abs(growthPercent);
  return `${formatRevenueUsd(revenue)} revenue (${arrow} ${magnitude}%)`;
}

export function useAISummary() {
  const stringService = inject(STRING_SERVICE_KEY) as IStringService;
  const insights = ref<AIInsightViewModel[]>([]);
  const loading = ref(true);

  function buildInsights() {
    const top = mockSummary.topPerformer;
    const attention = mockSummary.needsAttention;
    const items: AIInsightViewModel[] = [
      {
        id: "top-performer",
        variant: "success",
        icon: "trophy",
        title: resolveStringKey(stringService, "aiSummary.topPerformer.label"),
        productName: top.productName,
        detail: formatRevenueInsightLine(top.revenue, top.growthPercent),
      },
      {
        id: "needs-attention",
        variant: "danger",
        icon: "warning",
        title: resolveStringKey(stringService, "aiSummary.needsAttention.label"),
        productName: attention.productName,
        detail: formatRevenueInsightLine(attention.revenue, attention.growthPercent),
      },
      {
        id: "growth",
        variant: "info",
        icon: "lightbulb",
        title: resolveStringKey(stringService, "aiSummary.growthOpportunity.label"),
        detail: resolveStringKey(stringService, mockSummary.growthOpportunity.textKey),
      },
    ];
    insights.value = items;
    loading.value = false;
  }

  onMounted(buildInsights);

  return { insights, loading, refresh: buildInsights };
}
