<template>
  <div class="flex min-h-full flex-col gap-6 pb-10">
    <header>
      <h1 class="text-xl font-semibold text-gray-900">{{ title }}</h1>
      <p class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
    </header>

    <div v-if="loading" class="space-y-4">
      <WidgetSkeleton variant="card" :row-count="3" />
      <WidgetSkeleton variant="card" :row-count="3" />
      <WidgetSkeleton
        variant="table"
        :row-count="5"
        :columns="reportTableSkeletonColumns"
      />
    </div>
    <p v-else-if="error" class="text-sm text-rose-600">{{ error }}</p>

    <template v-else>
      <GenerateReportCard
        :show-button="canGenerate"
        :generating="generating"
        :last-report-relative="lastReportRelative"
        :last-report-period="lastReportPeriod"
        :next-scheduled-relative="nextScheduledRelative"
        :next-scheduled-note="nextScheduledNote"
        @generate="generate"
      />

      <LatestReportSummaryCard
        v-if="priorWeekReportExists && latestPriorWeekContent && latestPriorWeekReportId && latestPriorWeekPeriodStart && latestPriorWeekPeriodEnd"
        :report-id="latestPriorWeekReportId"
        :period-start="latestPriorWeekPeriodStart"
        :period-end="latestPriorWeekPeriodEnd"
        :content="latestPriorWeekContent"
      />

      <RecentReportsTable v-if="reports.length > 0" :reports="reports" />

      <UpgradeCtaCard
        v-if="!isPro && reportsLockedCount > 0"
        :title="historyTitle"
        :description="historyDescription"
        :cta-label="historyCta"
      />
    </template>

    <p v-if="!loading && !isPro" class="mt-auto text-xs text-slate-500">
      {{ historyStoredLabel }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import GenerateReportCard from "@/components/reports/GenerateReportCard.vue";
import LatestReportSummaryCard from "@/components/reports/LatestReportSummaryCard.vue";
import RecentReportsTable from "@/components/reports/RecentReportsTable.vue";
import UpgradeCtaCard from "@/components/shared/UpgradeCtaCard.vue";
import WidgetSkeleton from "@/components/shared/skeleton/WidgetSkeleton.vue";
import { useReportsPage } from "@/composables/reports/useReportsPage";
import { usePlan } from "@/composables/usePlan";
import { useLocalizedString, useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import { formatLocaleTemplate } from "@/utils/formatLocaleTemplate";
import type { DataTableColumn } from "@/components/shared/DataTable.vue";

const title = useLocalizedString("reports", "title");
const subtitle = useLocalizedString("reports", "subtitle");

const reportTableSkeletonColumns: DataTableColumn[] = [
  { key: "period", label: "", className: "" },
  { key: "summary", label: "", className: "" },
  { key: "opportunities", label: "", className: "" },
  { key: "keyHighlights", label: "", className: "" },
  { key: "generated", label: "", className: "" },
  { key: "actions", label: "", align: "right", className: "" },
];

const {
  loading,
  generating,
  error,
  reports,
  reportsTotalCount,
  reportsLockedCount,
  reportsHistoryLimit,
  priorWeekReportExists,
  canGenerate,
  latestPriorWeekContent,
  latestPriorWeekReportId,
  latestPriorWeekPeriodStart,
  latestPriorWeekPeriodEnd,
  lastReportRelative,
  lastReportPeriod,
  nextScheduledRelative,
  nextScheduledNote,
  generate,
} = useReportsPage();

const { isPro } = usePlan();

const upgradeCopy = useReactiveLocaleStringRecord("upgrade", [
  "reports.historyTitle",
  "reports.historyDescription",
  "reports.historyCta",
  "reports.stored",
] as const);

const historyTitle = computed(() => upgradeCopy.value["reports.historyTitle"]);
const historyDescription = computed(() => upgradeCopy.value["reports.historyDescription"]);
const historyCta = computed(() => upgradeCopy.value["reports.historyCta"]);

const historyStoredLabel = computed(() =>
  formatLocaleTemplate(upgradeCopy.value["reports.stored"], {
    stored: reportsTotalCount.value,
    limit: reportsHistoryLimit.value,
  }),
);
</script>
