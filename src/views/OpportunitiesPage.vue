<template>
  <div class="flex min-h-full flex-col gap-6 pb-10">
    <header class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-xl font-semibold text-slate-900">{{ copy.title }}</h1>
        <p class="mt-1 text-sm text-slate-500">{{ copy.subtitle }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <DateRangePicker />
      </div>
    </header>

    <template v-if="loading">
      <SkeletonShimmer>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div
            v-for="n in 5"
            :key="n"
            class="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <SkeletonBlock class-name="h-10 w-10 rounded-lg" />
            <div class="min-w-0 flex-1 space-y-2">
              <SkeletonBlock class-name="h-6 w-1/3" />
              <SkeletonBlock class-name="h-4 w-2/3" />
              <SkeletonBlock class-name="h-3 w-1/2" />
            </div>
          </div>
        </div>
      </SkeletonShimmer>

      <div class="mt-2">
        <WidgetSkeleton variant="table" :row-count="6" :columns="opportunityTableSkeletonColumns" />
      </div>
    </template>
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
        <OpportunitiesFilterTabs
          :active-tab="activeTab"
          :counts="tabCounts"
          :archived-count="archivedCount"
          @change="setTab"
        />
        <!-- <label class="flex items-center gap-2 text-sm text-slate-600">
          <span>{{ copy.sortBy }}</span>
          <select
            class="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800"
            :value="sortKey"
            @change="onSortChange"
          >
            <option value="impact">{{ copy.sortImpact }}</option>
            <option value="priority">{{ copy.sortPriority }}</option>
          </select>
        </label> -->
      </div>

      <p v-if="statusError" class="text-sm text-rose-600">{{ statusError }}</p>

      <p v-if="filteredItems.length === 0" class="text-sm text-slate-500">
        {{ activeTab === 'archived' ? copy['archived.empty'] : copy.empty }}
      </p>
      <template v-else>
        <OpportunitiesTable
          :rows="paginatedItems"
          :mode="tableMode"
          :open-menu-id="openMenuId"
          :status-of="statusOf"
          :loading="loading"
          :skeleton-row-count="6"
          @view-details="openDetail"
          @mark-done="markDone"
          @dismiss="dismiss"
          @toggle-menu="toggleMenu"
          @close-menu="closeMenu"
        />

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

      <LockedOpportunitiesSection
        v-if="!isPro && lockedCount > 0 && activeTab !== 'archived'"
        :locked-count="lockedCount"
        :previews="lockedPreviews"
      />
    </template>

    <OpportunityDetailDrawer
      v-if="selectedOpportunity"
      :opportunity="selectedOpportunity"
      :lifecycle-status="statusOf(selectedOpportunity.id)"
      @close="closeDetail"
      @select-related="openDetail"
      @mark-done="markDone(selectedOpportunity.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import DateRangePicker from "@/components/shared/DateRangePicker.vue";
import OpportunitiesFilterTabs from "@/components/opportunities/OpportunitiesFilterTabs.vue";
import OpportunitiesSummaryCards from "@/components/opportunities/OpportunitiesSummaryCards.vue";
import OpportunitiesTable from "@/components/opportunities/OpportunitiesTable.vue";
import LockedOpportunitiesSection from "@/components/opportunities/LockedOpportunitiesSection.vue";
import SkeletonBlock from "@/components/shared/skeleton/SkeletonBlock.vue";
import SkeletonShimmer from "@/components/shared/skeleton/SkeletonShimmer.vue";
import WidgetSkeleton from "@/components/shared/skeleton/WidgetSkeleton.vue";
import {
  useOpportunitiesPage,
  type OpportunitySortKey,
} from "@/composables/opportunities/useOpportunitiesPage";
import { usePlan } from "@/composables/usePlan";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import type { DataTableColumn } from "@/components/shared/DataTable.vue";

const OpportunityDetailDrawer = defineAsyncComponent(
  () => import("@/components/opportunities/OpportunityDetailDrawer.vue"),
);

const {
  loading,
  error,
  statusError,
  activeTab,
  sortKey,
  page,
  pageSize,
  paginatedItems,
  filteredItems,
  tabCounts,
  archivedCount,
  lockedCount,
  lockedPreviews,
  summary,
  totalPages,
  selectedOpportunity,
  tableMode,
  openMenuId,
  setTab,
  setSort,
  openDetail,
  closeDetail,
  reload,
  markDone,
  dismiss,
  toggleMenu,
  closeMenu,
  statusOf,
} = useOpportunitiesPage();

const { isPro } = usePlan();

const copy = useReactiveLocaleStringRecord("opportunities", [
  "title",
  "subtitle",
  "empty",
  "archived.empty",
  "sortBy",
  "sortImpact",
  "sortPriority",
  "showing",
  "of",
  "opportunities",
] as const);

const common = useReactiveLocaleStringRecord("common", ["loading", "error", "retry"] as const);

const opportunityTableSkeletonColumns: DataTableColumn[] = [
  { key: "opportunity", label: "", className: "w-[40%]" },
  { key: "impact", label: "", className: "w-[12%]" },
  { key: "dataReason", label: "", className: "w-[14%]" },
  { key: "recommendation", label: "", className: "w-[28%]" },
  { key: "action", label: "", align: "right", className: "w-[14%]" },
];

function onSortChange(event: Event) {
  setSort((event.target as HTMLSelectElement).value as OpportunitySortKey);
}
</script>
