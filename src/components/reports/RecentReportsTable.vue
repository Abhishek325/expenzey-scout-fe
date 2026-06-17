<template>
  <section>
    <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{{ tableTitle }}</h2>
    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <DataTable :columns="columns" :rows="tableRows" row-key="id">
        <template #cell-period="{ row }">
          <div>
            <p class="font-medium text-slate-900">
              {{ formatReportPeriodShort(String(row.periodStart), String(row.periodEnd)) }}
            </p>
            <p class="mt-0.5 text-[11px] text-slate-400">
              {{ comparisonVsLabel }} {{ formatReportPeriodShort(String(row.comparisonPeriodStart), String(row.comparisonPeriodEnd)) }}
            </p>
          </div>
        </template>
        <template #cell-summary="{ row }">
          <p
            class="text-sm font-medium"
            :class="Number(row.revenueGrowthPercent) >= 0 ? 'text-emerald-600' : 'text-rose-600'"
          >
            {{ revenueTrendText(Number(row.revenueGrowthPercent)) }}
          </p>
          <p class="mt-0.5 text-xs text-slate-500">{{ summaryStatus(Number(row.revenueGrowthPercent)) }}</p>
        </template>
        <template #cell-opportunities="{ row }">
          <span class="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
            {{ opportunitiesText(Number(row.opportunityCount)) }}
          </span>
        </template>
        <template #cell-keyHighlights="{ row }">
          <ul class="space-y-1">
            <li
              v-for="(highlight, idx) in (row.keyHighlights as ReportKeyHighlight[])"
              :key="idx"
              class="flex items-start gap-1.5 text-xs text-slate-600"
            >
              <span
                class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                :class="highlight.tone === 'positive' ? 'bg-emerald-500' : 'bg-rose-500'"
              />
              {{ highlight.text }}
            </li>
          </ul>
        </template>
        <template #cell-generated="{ row }">
          <span class="text-xs text-slate-500">{{ formatGeneratedAt(String(row.generatedAt)) }}</span>
        </template>
        <template #cell-actions="{ row }">
          <RouterLink
            :to="reportDetailPath(String(row.id))"
            class="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {{ viewReportLabel }}
          </RouterLink>
        </template>
      </DataTable>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import DataTable, { type DataTableColumn } from "@/components/shared/DataTable.vue";
import { reportDetailPath } from "@/constants/routes";
import { useLocalizedString } from "@/composables/useLocalizedString";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";
import { formatGeneratedAt, formatReportPeriodShort } from "@/utils/reportFormatters";
import type { ReportKeyHighlight, WeeklyReportListItem } from "@/types/reports";

const props = defineProps<{ reports: WeeklyReportListItem[] }>();

const stringService = inject(STRING_SERVICE_KEY) as IStringService;
const tableTitle = useLocalizedString("reports", "table.recentTitle");
const viewReportLabel = useLocalizedString("reports", "columns.viewReport");
const comparisonVsLabel = useLocalizedString("reports", "formats.comparisonVs");

const columns = computed<DataTableColumn[]>(() => [
  { key: "period", label: stringService.getStrings("reports", "columns.period") },
  { key: "summary", label: stringService.getStrings("reports", "columns.summary") },
  { key: "opportunities", label: stringService.getStrings("reports", "columns.opportunities") },
  { key: "keyHighlights", label: stringService.getStrings("reports", "columns.keyHighlights") },
  { key: "generated", label: stringService.getStrings("reports", "columns.generated") },
  { key: "actions", label: stringService.getStrings("reports", "columns.actions"), align: "right" },
]);

const tableRows = computed(() => props.reports as unknown as Record<string, unknown>[]);

function revenueTrendText(percent: number): string {
  const key = percent >= 0 ? "summary.revenueUp" : "summary.revenueDown";
  return stringService.getStrings("reports", key).replace("{percent}", String(Math.abs(Math.round(percent))));
}

function summaryStatus(percent: number): string {
  return stringService.getStrings("reports", percent >= 0 ? "summary.strongPerformance" : "summary.needsImprovement");
}

function opportunitiesText(count: number): string {
  return stringService.getStrings("reports", "kpi.opportunitiesCount").replace("{count}", String(count));
}
</script>
