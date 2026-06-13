<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import { useRecentReports } from "@/composables/dashboard/useRecentReports";
import { useLocalizedString } from "@/composables/useLocalizedString";

const { loading, error, reports, reload } = useRecentReports();
const loadingLabel = useLocalizedString("common", "loading");
const errorLabel = useLocalizedString("common", "error");
const retryLabel = useLocalizedString("common", "retry");
const emptyLabel = useLocalizedString("dashboard", "aiInsights.reportsEmpty");
const viewAllReports = useLocalizedString("common", "viewAllReports");
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="mb-4 flex items-center justify-between gap-2">
      <h3 class="text-sm font-semibold text-slate-900">Recent AI Reports</h3>
      <RouterLink to="/reports" class="card-header-action">
        {{ viewAllReports }}
      </RouterLink>
    </div>

    <p v-if="loading" class="text-sm text-slate-500">{{ loadingLabel }}</p>
    <div v-else-if="error" class="flex items-center gap-3 text-sm text-rose-600">
      <span>{{ errorLabel }}</span>
      <button type="button" class="font-medium underline" @click="reload">{{ retryLabel }}</button>
    </div>
    <p v-else-if="reports.length === 0" class="text-sm text-slate-500">{{ emptyLabel }}</p>
    <div v-else class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
  </section>
</template>
