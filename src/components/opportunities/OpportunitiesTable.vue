<script setup lang="ts">
import { computed } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import DataTable, { type DataTableColumn } from "@/components/shared/DataTable.vue";
import OpportunityImpactMeter from "@/components/opportunities/OpportunityImpactMeter.vue";
import { useLocalizedString, useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import type { OpportunityDetail } from "@/types/ai";
import { TYPE_ICON_CLASSES, TYPE_ICONS, badgeStyle } from "@/utils/opportunityStyles";

const props = defineProps<{
  rows: OpportunityDetail[];
}>();

const emit = defineEmits<{ viewDetails: [id: string] }>();

const copy = useReactiveLocaleStringRecord("opportunities", [
  "columns.opportunity",
  "columns.impact",
  "columns.dataReason",
  "columns.recommendation",
  "columns.action",
  "drawer.confidence.high",
  "drawer.confidence.medium",
  "drawer.confidence.low",
] as const);

const viewDetailsLabel = useLocalizedString("common", "viewDetails");

const impactLabels = computed(() => ({
  high: copy.value["drawer.confidence.high"],
  medium: copy.value["drawer.confidence.medium"],
  low: copy.value["drawer.confidence.low"],
}));

const columns = computed<DataTableColumn[]>(() => [
  { key: "opportunity", label: copy.value["columns.opportunity"] },
  { key: "impact", label: copy.value["columns.impact"] },
  { key: "dataReason", label: copy.value["columns.dataReason"] },
  { key: "recommendation", label: copy.value["columns.recommendation"] },
  { key: "action", label: copy.value["columns.action"], align: "right" },
]);

const TREND_CLASSES: Record<string, string> = {
  up: "text-emerald-600",
  down: "text-rose-600",
  neutral: "text-slate-500",
};

function opp(row: Record<string, unknown>): OpportunityDetail {
  return row as unknown as OpportunityDetail;
}

const tableRows = computed(() => props.rows as unknown as Record<string, unknown>[]);
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <DataTable :columns="columns" :rows="tableRows" row-key="id">
      <template #cell-opportunity="{ row: raw }">
        <div class="flex items-start gap-3 py-1">
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            :class="TYPE_ICON_CLASSES[opp(raw).type] ?? 'bg-slate-100 text-slate-600'"
          >
            <FaIcon :icon="TYPE_ICONS[opp(raw).type] ?? 'fa-lightbulb'" size="sm" />
          </span>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-slate-900">{{ opp(raw).title }}</p>
            <p class="mt-0.5 text-xs text-slate-500">{{ opp(raw).description }}</p>
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
        <p class="max-w-xs text-xs leading-snug text-slate-600">{{ opp(raw).recommendation }}</p>
      </template>
      <template #cell-action="{ row: raw }">
        <button
          type="button"
          class="inline-flex items-center gap-1 text-xs font-semibold text-expenzey-600 hover:text-expenzey-700"
          @click="emit('viewDetails', opp(raw).id)"
        >
          {{ viewDetailsLabel }}
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="m9 18 6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </template>
    </DataTable>
  </div>
</template>
