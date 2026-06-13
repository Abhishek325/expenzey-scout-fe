import { computed, inject, onMounted, ref } from "vue";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import type { WeeklyReportContent } from "@/types/ai";

interface ReportSection {
  label: string;
  value: string;
  icon: string;
  iconClass: string;
}

interface WeeklyReportLabels {
  recentPeriod: string;
  overview: string;
  revenue: string;
  customers: string;
  products: string;
  mainRisk: string;
}

function formatPeriod(start: string | null, end: string | null, recentPeriodLabel: string): string {
  if (!start || !end) return recentPeriodLabel;
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `Week of ${fmt(start)} – ${fmt(end)}`;
}

function toStringList(value: string[] | string | undefined): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

function joinList(value: string[] | string | undefined): string {
  const items = toStringList(value);
  return items.length > 0 ? items.join(" · ") : "";
}

function buildSections(content: WeeklyReportContent | null, labels: WeeklyReportLabels): ReportSection[] {
  if (!content) return [];

  const sections: ReportSection[] = [
    {
      label: labels.overview,
      value: content.overview,
      icon: "fa-arrows-rotate",
      iconClass: "bg-sky-100 text-sky-600",
    },
    {
      label: labels.revenue,
      value: content.revenueAnalysis,
      icon: "fa-chart-line",
      iconClass: "bg-violet-100 text-violet-600",
    },
  ];

  if (content.customerAnalysis) {
    sections.push({
      label: labels.customers,
      value: content.customerAnalysis,
      icon: "fa-user-group",
      iconClass: "bg-emerald-100 text-emerald-600",
    });
  }

  sections.push({
    label: labels.products,
    value: content.productAnalysis,
    icon: "fa-box",
    iconClass: "bg-indigo-100 text-indigo-600",
  });

  const risks = joinList(content.risks);
  if (risks) {
    sections.push({
      label: labels.mainRisk,
      value: risks,
      icon: "fa-triangle-exclamation",
      iconClass: "bg-rose-100 text-rose-600",
    });
  }

  return sections;
}

export function useWeeklyReport() {
  const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;
  const loading = ref(true);
  const generating = ref(false);
  const error = ref<string | null>(null);
  const reportPeriod = ref("");
  const sections = ref<ReportSection[]>([]);
  const recommendedAction = ref("");
  const labelRecord = useReactiveLocaleStringRecord("dashboard", [
    "aiInsights.weeklyReport.recentPeriod",
    "aiInsights.weeklyReport.sections.overview",
    "aiInsights.weeklyReport.sections.revenue",
    "aiInsights.weeklyReport.sections.customers",
    "aiInsights.weeklyReport.sections.products",
    "aiInsights.weeklyReport.sections.mainRisk",
  ] as const);

  const sectionLabels = computed<WeeklyReportLabels>(() => {
    const l = labelRecord.value;
    return {
      recentPeriod: l["aiInsights.weeklyReport.recentPeriod"],
      overview: l["aiInsights.weeklyReport.sections.overview"],
      revenue: l["aiInsights.weeklyReport.sections.revenue"],
      customers: l["aiInsights.weeklyReport.sections.customers"],
      products: l["aiInsights.weeklyReport.sections.products"],
      mainRisk: l["aiInsights.weeklyReport.sections.mainRisk"],
    };
  });

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      const detail = await reportsService.getWeeklyReportDetail();
      if (!detail.content) {
        reportPeriod.value = "";
        sections.value = [];
        recommendedAction.value = "";
        return;
      }
      reportPeriod.value = formatPeriod(
        detail.periodStart,
        detail.periodEnd,
        sectionLabels.value.recentPeriod,
      );
      sections.value = buildSections(detail.content, sectionLabels.value);
      const actions = detail.content.recommendedActions ?? [];
      const opportunities = toStringList(detail.content.opportunities);
      recommendedAction.value = actions[0] ?? opportunities[0] ?? "";
    } catch (e) {
      error.value = e instanceof Error ? e.message : "error";
    } finally {
      loading.value = false;
    }
  }

  async function generate() {
    generating.value = true;
    error.value = null;
    try {
      await reportsService.generateWeeklyReport();
      await load();
    } catch (e) {
      error.value = e instanceof Error ? e.message : "error";
    } finally {
      generating.value = false;
    }
  }

  const hasContent = computed(() => sections.value.length > 0);

  onMounted(() => {
    void load();
  });

  return { loading, generating, error, reportPeriod, sections, recommendedAction, hasContent, reload: load, generate };
}
