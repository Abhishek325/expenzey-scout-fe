<template>
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <DataTable :columns="columns" :rows="tableRows" row-key="id" fixed>
      <template #cell-opportunity="{ row: raw }">
        <div class="flex min-w-0 items-start gap-3 py-1">
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            :class="TYPE_ICON_CLASSES[opp(raw).type] ?? 'bg-slate-100 text-slate-600'"
          >
            <FaIcon :icon="TYPE_ICONS[opp(raw).type] ?? 'fa-lightbulb'" size="sm" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-slate-900">{{ opp(raw).title }}</p>
            <p class="mt-0.5 line-clamp-2 text-xs text-slate-500">{{ opp(raw).description }}</p>
            <span
              class="mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
              :class="badgeStyle(opp(raw).badge).labelClass"
            >
              {{ opp(raw).badge }}
            </span>
          </div>
        </div>
      </template>
      <template #cell-impact="{ row: raw }">
        <div class="flex flex-col gap-1">
          <span class="text-xs font-medium text-slate-700">
            {{ impactLabels[opp(raw).impactLevel] ?? opp(raw).impactLevel }}
          </span>
          <OpportunityImpactMeter :level="opp(raw).impactLevel" />
        </div>
      </template>
      <template #cell-dataReason="{ row: raw }">
        <div>
          <p class="text-xs font-semibold text-slate-800">
            {{ opp(raw).listMetric.value }}
          </p>
          <p class="text-[10px] text-slate-500">
            {{ opp(raw).listMetric.label }}
          </p>
          <p
            v-if="opp(raw).listMetric.trendText"
            class="mt-0.5 text-[10px] font-medium"
            :class="TREND_CLASSES[opp(raw).listMetric.trendDirection ?? 'neutral']"
          >
            {{ opp(raw).listMetric.trendText }}
          </p>
        </div>
      </template>
      <template #cell-recommendation="{ row: raw }">
        <p class="line-clamp-3 text-xs leading-snug text-slate-600">{{ opp(raw).recommendation }}</p>
      </template>
      <template #cell-action="{ row: raw }">
        <div v-if="isArchived" class="flex justify-end">
          <span
            v-if="statusOf"
            class="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1"
            :class="STATUS_CLASSES[statusOf(opp(raw).id)]"
          >
            {{ statusLabel(statusOf(opp(raw).id)) }}
          </span>
        </div>
        <div v-else class="flex items-center justify-end gap-1">
          <button
            type="button"
            class="inline-flex items-center gap-1 text-xs font-semibold text-expenzey-600 hover:text-expenzey-700"
            @click="emit('viewDetails', opp(raw).id)"
          >
            {{ viewDetailsLabel }}
          </button>
          <OpportunityRowActions
            :open="openMenuId === opp(raw).id"
            @toggle="emit('toggleMenu', opp(raw).id)"
            @mark-done="emit('markDone', opp(raw).id)"
            @dismiss="emit('dismiss', opp(raw).id)"
            @close="emit('closeMenu')"
          />
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import DataTable, { type DataTableColumn } from "@/components/shared/DataTable.vue";
import OpportunityImpactMeter from "@/components/opportunities/OpportunityImpactMeter.vue";
import OpportunityRowActions from "@/components/opportunities/OpportunityRowActions.vue";
import type { OpportunitiesTableMode } from "@/composables/opportunities/useOpportunitiesPage";
import { useLocalizedString, useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import type { OpportunityDetail, OpportunityLifecycleStatus } from "@/types/ai";
import { TYPE_ICON_CLASSES, TYPE_ICONS, badgeStyle } from "@/utils/opportunityStyles";

const props = defineProps<{
  rows: OpportunityDetail[];
  mode?: OpportunitiesTableMode;
  openMenuId?: string | null;
  statusOf?: (id: string) => OpportunityLifecycleStatus;
}>();

const emit = defineEmits<{
  viewDetails: [id: string];
  markDone: [id: string];
  dismiss: [id: string];
  toggleMenu: [id: string];
  closeMenu: [];
}>();

const copy = useReactiveLocaleStringRecord("opportunities", [
  "columns.opportunity",
  "columns.impact",
  "columns.dataReason",
  "columns.recommendation",
  "columns.action",
  "columns.status",
  "drawer.confidence.high",
  "drawer.confidence.medium",
  "drawer.confidence.low",
  "status.done",
  "status.dismissed",
] as const);

const viewDetailsLabel = useLocalizedString("common", "viewDetails");

const isArchived = computed(() => props.mode === "archived");

const actionColumnLabel = computed(() =>
  isArchived.value ? copy.value["columns.status"] : copy.value["columns.action"],
);

const impactLabels = computed(() => ({
  high: copy.value["drawer.confidence.high"],
  medium: copy.value["drawer.confidence.medium"],
  low: copy.value["drawer.confidence.low"],
}));

const columns = computed<DataTableColumn[]>(() => [
  { key: "opportunity", label: copy.value["columns.opportunity"], className: "w-[40%]" },
  { key: "impact", label: copy.value["columns.impact"], className: "w-[12%]" },
  { key: "dataReason", label: copy.value["columns.dataReason"], className: "w-[14%]" },
  { key: "recommendation", label: copy.value["columns.recommendation"], className: "w-[28%]" },
  {
    key: "action",
    label: actionColumnLabel.value,
    align: "right",
    className: "w-[14%]",
  },
]);

const TREND_CLASSES: Record<string, string> = {
  up: "text-emerald-600",
  down: "text-rose-600",
  neutral: "text-slate-500",
};

const STATUS_CLASSES: Record<string, string> = {
  done: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  dismissed: "bg-slate-100 text-slate-600 ring-slate-200",
};

function opp(row: Record<string, unknown>): OpportunityDetail {
  return row as unknown as OpportunityDetail;
}

function statusLabel(status: OpportunityLifecycleStatus): string {
  if (status === "done") return copy.value["status.done"];
  if (status === "dismissed") return copy.value["status.dismissed"];
  return "";
}

const tableRows = computed(() => props.rows as unknown as Record<string, unknown>[]);
</script>
