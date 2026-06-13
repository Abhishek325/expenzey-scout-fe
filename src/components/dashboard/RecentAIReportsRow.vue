<script setup lang="ts">
import { computed } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import DashboardCard from "@/components/shared/DashboardCard.vue";
import { useRecentReports } from "@/composables/dashboard/useRecentReports";
import { useLocalizedString } from "@/composables/useLocalizedString";

const { loading, error, hasData, reports, reload } = useRecentReports();
const emptyLabel = useLocalizedString("dashboard", "aiInsights.reportsEmpty");
const viewAllReports = useLocalizedString("common", "viewAllReports");
const title = useLocalizedString("dashboard", "aiInsights.recentReportsTitle");

const viewAllAction = computed(() => ({
  kind: "link" as const,
  to: "/reports",
  label: viewAllReports.value,
}));
</script>

<template>
  <DashboardCard
    :title="title"
    :loading="loading"
    :error="error"
    :has-data="hasData"
    :empty-label="emptyLabel"
    :action="viewAllAction"
    section-padding
    body-class="!p-0"
    @retry="reload"
  >
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="report in reports"
        :key="report.id"
        class="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-slate-200 hover:bg-white"
      >
        <span
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm"
          :class="report.iconClass"
          aria-hidden="true"
        >
          <FaIcon :icon="report.icon" size="base" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold text-slate-900">{{ report.title }}</p>
          <p class="mt-0.5 text-xs text-slate-500">{{ report.generatedAt }}</p>
          <span
            class="mt-2 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700"
          >
            {{ report.status }}
          </span>
        </div>
      </article>
    </div>
  </DashboardCard>
</template>
