<template>
  <div class="flex min-h-full flex-col gap-6 pb-10">
    <p v-if="loading" class="text-sm text-gray-500">{{ loadingLabel }}</p>
    <p v-else-if="error" class="text-sm text-rose-600">{{ error }}</p>

    <div
      v-else-if="content"
      id="weekly-report-print"
      class="weekly-report-print flex flex-col gap-6"
    >
      <ReportDetailHeader
        :title="reportTitle"
        :period-label="periodLabelText"
        :can-download="true"
        @download-pdf="printReport"
      />
      <WeeklyReportView :content="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import ReportDetailHeader from "@/components/reports/ReportDetailHeader.vue";
import WeeklyReportView from "@/components/reports/WeeklyReportView.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import type { WeeklyReportContent } from "@/types/ai";
import { formatReportPeriodShort } from "@/utils/reportFormatters";
import { printWeeklyReport } from "@/utils/printWeeklyReport";

const route = useRoute();
const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;

const loading = ref(true);
const error = ref<string | null>(null);
const title = ref<string | null>(null);
const periodStart = ref<string | null>(null);
const periodEnd = ref<string | null>(null);
const content = ref<WeeklyReportContent | null>(null);

const loadingLabel = useLocalizedString("common", "loading");
const periodLabel = useLocalizedString("reports", "detail.periodLabel");
const defaultReportTitle = useLocalizedString("reports", "latest.title");
const printFallbackTitle = useLocalizedString("reports", "formats.printFallbackTitle");

const reportTitle = computed(() => title.value ?? defaultReportTitle.value);

const periodLabelText = computed(() => {
  if (!periodStart.value || !periodEnd.value) return undefined;
  return `${periodLabel.value}: ${formatReportPeriodShort(periodStart.value, periodEnd.value)}`;
});

function printReport() {
  printWeeklyReport(printFallbackTitle.value);
}

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const id = String(route.params.id);
    const detail = await reportsService.getWeeklyReportDetail(id);
    title.value = detail.title;
    periodStart.value = detail.periodStart;
    periodEnd.value = detail.periodEnd;
    content.value = detail.content;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "error";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void load();
});
</script>
