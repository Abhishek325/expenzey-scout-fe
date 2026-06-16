<template>
  <section class="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div class="shrink-0 border-b border-slate-100 px-4 py-3">
      <div class="flex items-start justify-between gap-3">
        <h3 class="text-sm font-bold text-slate-900">{{ title }}</h3>
        <span
          v-if="hasContent || priorWeekPeriod"
          class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
        >
          <FaIcon icon="fa-calendar-days" size="xs" icon-class="text-slate-400" />
          {{ weekOfLabel }}
        </span>
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto p-4">
      <WidgetSkeleton v-if="loading" variant="card" :row-count="4" />
      <div v-else-if="error" class="flex items-center gap-3 text-sm text-rose-600">
        <span>{{ errorLabel }}</span>
        <button type="button" class="font-medium underline" @click="reload">{{ retryLabel }}</button>
      </div>
      <div v-else-if="!hasContent && canGenerate" class="flex flex-col gap-2">
        <p class="text-sm text-slate-600">{{ emptyHint }}</p>
        <p class="text-xs text-slate-400">{{ scheduledHint }}</p>
      </div>
      <ul v-else-if="hasContent" class="flex flex-col gap-4">
        <li v-for="row in widgetRows" :key="row.key" class="flex gap-3">
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            :class="rowStyle[row.key].bg"
            aria-hidden="true"
          >
            <FaIcon :icon="rowStyle[row.key].icon" size="sm" :icon-class="rowStyle[row.key].color" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-[11px] font-medium text-slate-500">{{ row.label }}</p>
            <p class="mt-0.5 text-sm font-semibold leading-snug text-slate-900">{{ row.value }}</p>
            <p v-if="row.detail" class="mt-0.5 text-xs text-slate-600">{{ row.detail }}</p>
            <p
              v-if="row.trendPercent !== undefined && row.trendDirection"
              class="mt-0.5 text-xs font-medium"
              :class="row.trendDirection === 'up' ? 'text-emerald-600' : 'text-rose-600'"
            >
              {{ row.trendDirection === "up" ? "↑" : "↓" }} {{ row.trendPercent }}% {{ vsLastWeek }}
            </p>
          </div>
        </li>
      </ul>
      <p v-else class="text-sm text-slate-500">{{ emptyLabel }}</p>
    </div>

    <div class="flex shrink-0 gap-2 border-t border-slate-100 p-3">
      <RouterLink
        v-if="reportId && hasContent"
        :to="`/reports/${reportId}`"
        class="inline-flex flex-1 items-center justify-center rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
      >
        {{ viewFullReport }}
      </RouterLink>
      <GenerateReportButton
        v-if="canGenerate"
        class="flex-1"
        compact
        :full-width="true"
        :disabled="generating"
        :label-key="hasContent ? 'reports.generateNewReport' : 'reports.generatePastWeek'"
        @generate="generate"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import GenerateReportButton from "@/components/dashboard/GenerateReportButton.vue";
import WidgetSkeleton from "@/components/shared/skeleton/WidgetSkeleton.vue";
import { useWeeklyReport } from "@/composables/dashboard/useWeeklyReport";
import { useLocalizedString } from "@/composables/useLocalizedString";
import type { WeeklyReportWidgetRow } from "@/utils/weeklyReportWidget";

const {
  loading,
  generating,
  error,
  reportId,
  priorWeekPeriod,
  weekOfLabel,
  widgetRows,
  canGenerate,
  hasContent,
  reload,
  generate,
} = useWeeklyReport();

const loadingLabel = useLocalizedString("common", "loading");
const errorLabel = useLocalizedString("common", "error");
const retryLabel = useLocalizedString("common", "retry");
const emptyLabel = useLocalizedString("dashboard", "aiInsights.weeklyReportEmpty");
const viewFullReport = useLocalizedString("dashboard", "viewFullReport");
const title = useLocalizedString("dashboard", "aiInsights.weeklyReport.title");
const scheduledHint = useLocalizedString("dashboard", "aiInsights.weeklyReport.scheduledForMonday");
const vsLastWeek = useLocalizedString("dashboard", "aiInsights.weeklyReport.vsLastWeek");
const emptyHintRaw = useLocalizedString("reports", "latest.emptyHint");
const emptyHint = computed(() =>
  emptyHintRaw.value.replace("{period}", priorWeekPeriod.value || "—"),
);

const rowStyle: Record<
  WeeklyReportWidgetRow["key"],
  { icon: string; bg: string; color: string }
> = {
  revenue: { icon: "fa-chart-line", bg: "bg-sky-50", color: "text-sky-600" },
  orders: { icon: "fa-cart-shopping", bg: "bg-indigo-50", color: "text-indigo-600" },
  topProduct: { icon: "fa-shirt", bg: "bg-violet-50", color: "text-violet-600" },
  customerTrend: { icon: "fa-users", bg: "bg-emerald-50", color: "text-emerald-600" },
  mainRisk: { icon: "fa-triangle-exclamation", bg: "bg-rose-50", color: "text-rose-600" },
  recommendedAction: { icon: "fa-lightbulb", bg: "bg-amber-50", color: "text-amber-600" },
};
</script>
