<template>
  <div class="flex min-h-full flex-col gap-6 pb-10">
    <header>
      <h1 class="text-xl font-semibold text-gray-900">{{ title }}</h1>
      <p class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
    </header>

    <p v-if="loading" class="text-sm text-gray-500">{{ loadingLabel }}</p>
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
    </template>

    <UsageQuotaFooter feature="reports" class="mt-auto" />
  </div>
</template>

<script setup lang="ts">
import GenerateReportCard from "@/components/reports/GenerateReportCard.vue";
import LatestReportSummaryCard from "@/components/reports/LatestReportSummaryCard.vue";
import RecentReportsTable from "@/components/reports/RecentReportsTable.vue";
import UsageQuotaFooter from "@/components/shared/UsageQuotaFooter.vue";
import { useReportsPage } from "@/composables/reports/useReportsPage";
import { useLocalizedString } from "@/composables/useLocalizedString";

const title = useLocalizedString("reports", "title");
const subtitle = useLocalizedString("reports", "subtitle");
const loadingLabel = useLocalizedString("common", "loading");

const {
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
  lastReportRelative,
  lastReportPeriod,
  nextScheduledRelative,
  nextScheduledNote,
  generate,
} = useReportsPage();
</script>
