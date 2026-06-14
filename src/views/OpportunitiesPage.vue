<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import DateRangePicker from "@/components/shared/DateRangePicker.vue";
import ExportButton from "@/components/shared/ExportButton.vue";
import OpportunitiesFilterTabs from "@/components/opportunities/OpportunitiesFilterTabs.vue";
import OpportunitiesSummaryCards from "@/components/opportunities/OpportunitiesSummaryCards.vue";
import OpportunitiesTable from "@/components/opportunities/OpportunitiesTable.vue";
import {
  useOpportunitiesPage,
  type OpportunitySortKey,
} from "@/composables/opportunities/useOpportunitiesPage";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";

const OpportunityDetailDrawer = defineAsyncComponent(
  () => import("@/components/opportunities/OpportunityDetailDrawer.vue"),
);

const {
  loading,
  error,
  activeTab,
  sortKey,
  page,
  pageSize,
  paginatedItems,
  filteredItems,
  tabCounts,
  summary,
  totalPages,
  selectedOpportunity,
  setTab,
  setSort,
  openDetail,
  closeDetail,
  reload,
} = useOpportunitiesPage();

const copy = useReactiveLocaleStringRecord("opportunities", [
  "title",
  "subtitle",
  "empty",
  "sortBy",
  "sortImpact",
  "sortPriority",
  "showing",
  "of",
  "opportunities",
] as const);

const common = useReactiveLocaleStringRecord("common", ["loading", "error", "retry"] as const);

function onSortChange(event: Event) {
  setSort((event.target as HTMLSelectElement).value as OpportunitySortKey);
}
</script>

<template>
  <div class="flex min-h-full flex-col gap-6 pb-10">
    <header class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-xl font-semibold text-slate-900">{{ copy.title }}</h1>
        <p class="mt-1 text-sm text-slate-500">{{ copy.subtitle }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <DateRangePicker />
        <ExportButton />
      </div>
    </header>

    <p v-if="loading" class="text-sm text-slate-500">{{ common.loading }}</p>
    <div v-else-if="error" class="flex items-center gap-3 text-sm text-rose-600">
      <span>{{ common.error }}</span>
      <button type="button" class="font-medium underline" @click="reload">{{ common.retry }}</button>
    </div>
    <template v-else>
      <OpportunitiesSummaryCards
        :total="summary.total"
        :high-impact="summary.highImpact"
        :quick-wins="summary.quickWins"
        :needs-attention="summary.needsAttention"
        :estimated-impact="summary.estimatedImpact"
      />

      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <OpportunitiesFilterTabs :active-tab="activeTab" :counts="tabCounts" @change="setTab" />
        <label class="flex items-center gap-2 text-sm text-slate-600">
          <span>{{ copy.sortBy }}</span>
          <select
            class="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800"
            :value="sortKey"
            @change="onSortChange"
          >
            <option value="impact">{{ copy.sortImpact }}</option>
            <option value="priority">{{ copy.sortPriority }}</option>
          </select>
        </label>
      </div>

      <p v-if="filteredItems.length === 0" class="text-sm text-slate-500">{{ copy.empty }}</p>
      <template v-else>
        <OpportunitiesTable :rows="paginatedItems" @view-details="openDetail" />

        <div class="flex items-center justify-between text-xs text-slate-500">
          <p>
            {{ copy.showing }}
            {{ (page - 1) * pageSize + 1 }}–{{ Math.min(page * pageSize, filteredItems.length) }}
            {{ copy.of }} {{ filteredItems.length }} {{ copy.opportunities }}
          </p>
          <div class="flex items-center gap-1">
            <button
              type="button"
              class="rounded px-2 py-1 hover:bg-slate-100 disabled:opacity-40"
              :disabled="page <= 1"
              @click="page--"
            >
              ‹
            </button>
            <span class="px-2 tabular-nums">{{ page }} / {{ totalPages }}</span>
            <button
              type="button"
              class="rounded px-2 py-1 hover:bg-slate-100 disabled:opacity-40"
              :disabled="page >= totalPages"
              @click="page++"
            >
              ›
            </button>
          </div>
        </div>
      </template>
    </template>

    <OpportunityDetailDrawer
      v-if="selectedOpportunity"
      :opportunity="selectedOpportunity"
      @close="closeDetail"
      @select-related="openDetail"
    />
  </div>
</template>
