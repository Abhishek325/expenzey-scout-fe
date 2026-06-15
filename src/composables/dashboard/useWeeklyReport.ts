import { computed, inject, onMounted, ref } from "vue";
import { useFormatCurrency } from "@/composables/useFormatCurrency";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";
import type { GenerateWeeklyReportResult } from "@/types/reports";
import type { WeeklyReportContent, WeeklyReportDetail } from "@/types/ai";
import { formatReportPeriod, formatReportPeriodShort, getPriorWeekRange } from "@/utils/reportFormatters";
import { buildWeeklyReportWidgetRows } from "@/utils/weeklyReportWidget";

export function useWeeklyReport() {
  const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;
  const stringService = inject(STRING_SERVICE_KEY) as IStringService;
  const { formatCurrency } = useFormatCurrency();

  const loading = ref(true);
  const generating = ref(false);
  const error = ref<string | null>(null);
  const reportId = ref<string | null>(null);
  const periodStart = ref<string | null>(null);
  const periodEnd = ref<string | null>(null);
  const reportPeriod = ref("");
  const priorWeekPeriod = ref("");
  const content = ref<WeeklyReportContent | null>(null);
  const canGenerate = ref(false);

  function applyDetail(detail: WeeklyReportDetail) {
    const exists = detail.meta?.priorWeekReportExists ?? Boolean(detail.content);
    canGenerate.value = !exists;

    const range = detail.meta?.priorWeek ?? getPriorWeekRange();
    priorWeekPeriod.value = formatReportPeriodShort(range.periodStart, range.periodEnd);
    periodStart.value = detail.periodStart ?? range.periodStart;
    periodEnd.value = detail.periodEnd ?? range.periodEnd;

    if (!detail.content) {
      reportId.value = detail.meta?.priorWeekReportId ?? detail.id;
      reportPeriod.value = priorWeekPeriod.value;
      content.value = null;
      return;
    }

    reportId.value = detail.id ?? detail.meta?.priorWeekReportId ?? null;
    reportPeriod.value = detail.periodStart && detail.periodEnd
      ? formatReportPeriodShort(detail.periodStart, detail.periodEnd)
      : priorWeekPeriod.value;
    content.value = detail.content;
  }

  function applyGenerateResult(result: GenerateWeeklyReportResult) {
    canGenerate.value = false;
    reportId.value = result.id;
    periodStart.value = result.periodStart;
    periodEnd.value = result.periodEnd;
    reportPeriod.value = formatReportPeriodShort(result.periodStart, result.periodEnd);
    priorWeekPeriod.value = reportPeriod.value;
    content.value = result.content ?? null;
  }

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      const detail = await reportsService.getWeeklyReportDetail();
      applyDetail(detail);
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
      const result = await reportsService.generateWeeklyReport();
      applyGenerateResult(result);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "error";
    } finally {
      generating.value = false;
    }
  }

  const hasContent = computed(() => Boolean(content.value));
  const weekOfLabel = computed(() => {
    if (periodStart.value && periodEnd.value) {
      return stringService.getStrings("dashboard", "aiInsights.weeklyReport.weekOf")
        .replace("{period}", formatReportPeriod(periodStart.value, periodEnd.value));
    }
    return priorWeekPeriod.value || "—";
  });

  const widgetRows = computed(() => {
    if (!content.value) return [];
    return buildWeeklyReportWidgetRows(content.value, formatCurrency, {
      revenue: stringService.getStrings("dashboard", "aiInsights.weeklyReport.sections.revenue"),
      orders: stringService.getStrings("dashboard", "aiInsights.weeklyReport.sections.orders"),
      topProduct: stringService.getStrings("dashboard", "aiInsights.weeklyReport.sections.topProduct"),
      customerTrend: stringService.getStrings("dashboard", "aiInsights.weeklyReport.sections.customerTrend"),
      returningCustomers: stringService.getStrings("reports", "customerKpi.returningCustomers"),
      mainRisk: stringService.getStrings("dashboard", "aiInsights.weeklyReport.sections.mainRisk"),
      recommendedAction: stringService.getStrings("dashboard", "aiInsights.weeklyReport.recommendedAction"),
      ofRevenue: stringService.getStrings("dashboard", "aiInsights.weeklyReport.ofRevenue"),
    });
  });

  onMounted(() => {
    void load();
  });

  return {
    loading,
    generating,
    error,
    reportId,
    reportPeriod,
    priorWeekPeriod,
    weekOfLabel,
    widgetRows,
    canGenerate,
    hasContent,
    reload: load,
    generate,
  };
}
