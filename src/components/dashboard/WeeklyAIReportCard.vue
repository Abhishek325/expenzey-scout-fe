<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import GenerateReportButton from "@/components/dashboard/GenerateReportButton.vue";
import { useWeeklyReport } from "@/composables/dashboard/useWeeklyReport";
import { useLocalizedString } from "@/composables/useLocalizedString";

const {
  loading,
  generating,
  error,
  reportPeriod,
  sections,
  recommendedAction,
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
const recommendedActionLabel = useLocalizedString("dashboard", "aiInsights.weeklyReport.recommendedAction");
</script>

<template>
  <section class="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div class="shrink-0 border-b border-slate-100 px-4 py-3">
      <div class="flex items-center gap-2">
        <FaIcon icon="fa-calendar-days" size="sm" icon-class="text-slate-400" />
        <div>
          <h3 class="text-sm font-semibold text-slate-900">{{ title }}</h3>
          <p class="mt-0.5 text-xs text-slate-500">{{ reportPeriod || "—" }}</p>
        </div>
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto p-4">
      <p v-if="loading" class="text-sm text-slate-500">{{ loadingLabel }}</p>
      <div v-else-if="error" class="flex items-center gap-3 text-sm text-rose-600">
        <span>{{ errorLabel }}</span>
        <button type="button" class="font-medium underline" @click="reload">{{ retryLabel }}</button>
      </div>
      <p v-else-if="!hasContent" class="text-sm text-slate-500">{{ emptyLabel }}</p>
      <div v-else class="flex flex-col gap-3">
        <div
          v-for="section in sections"
          :key="section.label"
          class="flex gap-3 rounded-lg bg-slate-50 px-3 py-2.5"
        >
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            :class="section.iconClass"
            aria-hidden="true"
          >
            <FaIcon :icon="section.icon" size="sm" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">{{ section.label }}</p>
            <p class="mt-0.5 text-sm font-semibold text-slate-900">{{ section.value }}</p>
          </div>
        </div>
        <div
          v-if="recommendedAction"
          class="flex gap-3 rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-2.5"
        >
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600"
            aria-hidden="true"
          >
            <FaIcon icon="fa-magnifying-glass" size="sm" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium uppercase tracking-wide text-indigo-400">{{ recommendedActionLabel }}</p>
            <p class="mt-1 text-sm leading-relaxed text-slate-700">{{ recommendedAction }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex shrink-0 gap-2 border-t border-slate-100 p-3">
      <RouterLink
        to="/reports"
        class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
      >
        {{ viewFullReport }}
        <FaIcon icon="fa-arrow-right" size="xs" />
      </RouterLink>
      <GenerateReportButton class="flex-1" compact :disabled="generating" @generate="generate" />
    </div>
  </section>
</template>
