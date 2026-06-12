<script setup lang="ts">
import { onMounted, ref } from "vue";
import { inject } from "vue";
import GenerateReportButton from "@/components/dashboard/GenerateReportButton.vue";
import AIInsightItem from "@/components/dashboard/AIInsightItem.vue";
import UsageQuotaFooter from "@/components/shared/UsageQuotaFooter.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import type { AISummary, WeeklyReport } from "@/types/reports";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";

const title = useLocalizedString("reports", "title");
const subtitle = useLocalizedString("reports", "subtitle");
const historyTitle = useLocalizedString("reports", "history.title");

const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;
const stringService = inject(STRING_SERVICE_KEY) as IStringService;

const reports = ref<WeeklyReport[]>([]);
const summary = ref<AISummary | null>(null);
const expandedId = ref<string | null>(null);
const loading = ref(true);

function toggleExpanded(id: string) {
  expandedId.value = expandedId.value === id ? null : id;
}

function reportSummaryText(report: WeeklyReport): string {
  const match = report.summaryKey.match(/^reports\.history\.(.+)$/);
  if (match) {
    const history = stringService.getRaw("reports", "history") as Record<string, string> | undefined;
    return history?.[match[1]] ?? report.title;
  }
  return stringService.getStrings("reports", report.summaryKey);
}

async function loadReports() {
  loading.value = true;
  try {
    const [list, aiSummary] = await Promise.all([
      reportsService.listWeeklyReports(),
      reportsService.getAISummary(),
    ]);
    reports.value = list;
    summary.value = aiSummary;
  } finally {
    loading.value = false;
  }
}

async function onGenerate() {
  await reportsService.generateWeeklyReport();
  await loadReports();
}

onMounted(() => {
  void loadReports();
});
</script>

<template>
  <div class="flex min-h-full flex-col gap-6 pb-10">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">{{ title }}</h1>
        <p class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
      </div>
      <GenerateReportButton @generate="onGenerate" />
    </header>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500">{{ historyTitle }}</h2>
      <p v-if="loading" class="text-sm text-gray-500">{{ stringService.getStrings("common", "loading") }}</p>
      <div v-else class="flex flex-col gap-3">
        <article
          v-for="report in reports"
          :key="report.id"
          class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-gray-50"
            @click="toggleExpanded(report.id)"
          >
            <div>
              <h3 class="font-medium text-gray-900">{{ report.title }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ reportSummaryText(report) }}</p>
            </div>
            <span
              class="shrink-0 text-indigo-600 transition"
              :class="expandedId === report.id ? 'rotate-180' : ''"
              aria-hidden="true"
            >▼</span>
          </button>
          <div v-if="expandedId === report.id && summary" class="space-y-3 border-t border-gray-100 px-5 py-4">
            <AIInsightItem
              variant="success"
              :label-key="'aiSummary.topPerformer.label'"
              :detail-key="'aiSummary.topPerformer.detail'"
              :product-name="summary.topPerformer.productName"
            />
            <AIInsightItem
              variant="danger"
              :label-key="'aiSummary.needsAttention.label'"
              :detail-key="'aiSummary.needsAttention.detail'"
              :product-name="summary.needsAttention.productName"
            />
            <AIInsightItem
              variant="info"
              :label-key="'aiSummary.growthOpportunity.label'"
              :detail-key="'aiSummary.growthOpportunity.detail'"
              :text-key="summary.growthOpportunity.textKey"
            />
          </div>
        </article>
      </div>
    </section>

    <UsageQuotaFooter feature="reports" class="mt-auto" />
  </div>
</template>
