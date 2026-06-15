import { computed, inject, onMounted, ref } from "vue";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";
import type { WeeklyReportContent, WeeklyReportDetail } from "@/types/ai";
import type { GenerateWeeklyReportResult, WeeklyReportListItem } from "@/types/reports";
import {
  buildWeeklyReportListItem,
  formatRelativeDate,
  formatReportPeriodShort,
  formatUpcomingDate,
  getPriorWeekRange,
} from "@/utils/reportFormatters";

export function useReportsPage() {
  const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;
  const stringService = inject(STRING_SERVICE_KEY) as IStringService;

  const loading = ref(true);
  const generating = ref(false);
  const error = ref<string | null>(null);
  const reports = ref<WeeklyReportListItem[]>([]);
  const priorWeekDetail = ref<WeeklyReportDetail | null>(null);

  const priorWeekReportExists = computed(
    () =>
      priorWeekDetail.value?.meta?.priorWeekReportExists
      ?? Boolean(priorWeekDetail.value?.content),
  );

  const canGenerate = computed(() => !priorWeekReportExists.value);

  const latestPriorWeekContent = computed<WeeklyReportContent | null>(
    () => priorWeekDetail.value?.content ?? null,
  );

  const latestPriorWeekReportId = computed(
    () => priorWeekDetail.value?.id ?? priorWeekDetail.value?.meta?.priorWeekReportId ?? null,
  );

  const latestPriorWeekPeriodStart = computed(() => priorWeekDetail.value?.periodStart ?? null);
  const latestPriorWeekPeriodEnd = computed(() => priorWeekDetail.value?.periodEnd ?? null);

  const priorWeekPeriod = computed(() => {
    const meta = priorWeekDetail.value?.meta?.priorWeek;
    if (meta) {
      return formatReportPeriodShort(meta.periodStart, meta.periodEnd);
    }
    const range = getPriorWeekRange();
    return formatReportPeriodShort(range.periodStart, range.periodEnd);
  });

  const dateLabels = computed(() => ({
    today: stringService.getStrings("reports", "dates.today"),
    yesterday: stringService.getStrings("reports", "dates.yesterday"),
    daysAgo: stringService.getStrings("reports", "dates.daysAgo"),
    tomorrow: stringService.getStrings("reports", "dates.tomorrow"),
    inDays: stringService.getStrings("reports", "dates.inDays"),
  }));

  const lastReportRelative = computed(() => {
    const meta = priorWeekDetail.value?.meta;
    if (!meta?.lastReportGeneratedAt) return undefined;
    return formatRelativeDate(meta.lastReportGeneratedAt, dateLabels.value);
  });

  const lastReportPeriod = computed(() => {
    const meta = priorWeekDetail.value?.meta;
    if (!meta?.lastReportPeriodStart || !meta?.lastReportPeriodEnd) return undefined;
    return formatReportPeriodShort(meta.lastReportPeriodStart, meta.lastReportPeriodEnd);
  });

  const nextScheduledRelative = computed(() => {
    const next = priorWeekDetail.value?.meta?.nextScheduledAt;
    if (!next) return undefined;
    return formatUpcomingDate(next, dateLabels.value);
  });

  const nextScheduledNote = computed(() =>
    stringService.getStrings("reports", "status.weeklyOnMonday"),
  );

  function applyGenerateResult(result: GenerateWeeklyReportResult) {
    const priorWeek = priorWeekDetail.value?.meta?.priorWeek ?? getPriorWeekRange();
    priorWeekDetail.value = {
      id: result.id,
      title: result.title,
      periodStart: result.periodStart,
      periodEnd: result.periodEnd,
      generatedAt: result.generatedAt,
      status: result.status,
      content: result.content ?? null,
      meta: {
        priorWeekReportExists: true,
        priorWeekReportId: result.id,
        priorWeek,
        lastReportGeneratedAt: result.generatedAt,
        lastReportPeriodStart: result.periodStart,
        lastReportPeriodEnd: result.periodEnd,
        nextScheduledAt: priorWeekDetail.value?.meta?.nextScheduledAt ?? "",
      },
    };

    const listItem = buildWeeklyReportListItem(result);
    const idx = reports.value.findIndex((r) => r.id === result.id);
    if (idx >= 0) {
      reports.value = [
        ...reports.value.slice(0, idx),
        listItem,
        ...reports.value.slice(idx + 1),
      ];
    } else {
      reports.value = [listItem, ...reports.value];
    }
  }

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      const [list, detail] = await Promise.all([
        reportsService.listWeeklyReports(),
        reportsService.getWeeklyReportDetail(),
      ]);
      reports.value = list;
      priorWeekDetail.value = detail;
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

  onMounted(() => {
    void load();
  });

  return {
    loading,
    generating,
    error,
    reports,
    priorWeekReportExists,
    canGenerate,
    latestPriorWeekContent,
    latestPriorWeekReportId,
    latestPriorWeekPeriodStart,
    latestPriorWeekPeriodEnd,
    priorWeekPeriod,
    lastReportRelative,
    lastReportPeriod,
    nextScheduledRelative,
    nextScheduledNote,
    reload: load,
    generate,
  };
}
