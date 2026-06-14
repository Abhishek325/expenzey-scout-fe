<script setup lang="ts">
import { computed } from "vue";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import { FILTER_TABS, type OpportunityFilterTab } from "@/utils/opportunityStyles";

const props = defineProps<{
  activeTab: OpportunityFilterTab;
  counts: Record<OpportunityFilterTab, number>;
}>();

const emit = defineEmits<{ change: [tab: OpportunityFilterTab] }>();

const copy = useReactiveLocaleStringRecord("opportunities", [
  "tabs.all",
  "tabs.highImpact",
  "tabs.quickWins",
  "tabs.needsAttention",
  "tabs.growth",
] as const);

const tabs = computed(() =>
  FILTER_TABS.map((tab) => ({
    id: tab.id,
    label: copy.value[`tabs.${tab.id}` as keyof typeof copy.value] ?? tab.id,
    count: props.counts[tab.id],
  })),
);
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      class="rounded-full px-3.5 py-1.5 text-sm font-medium transition"
      :class="
        activeTab === tab.id
          ? 'bg-slate-900 text-white shadow-sm'
          : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
      "
      @click="emit('change', tab.id)"
    >
      {{ tab.label }}
      <span
        class="ml-1.5 tabular-nums"
        :class="activeTab === tab.id ? 'text-slate-300' : 'text-slate-400'"
      >
        ({{ tab.count }})
      </span>
    </button>
  </div>
</template>
