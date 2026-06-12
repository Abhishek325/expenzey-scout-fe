<script setup lang="ts">
import { computed } from "vue";
import type { LocalizedMetricCard } from "@/composables/dashboard/useDashboardMetrics";
import { useLocalizedString } from "@/composables/useLocalizedString";

const props = defineProps<{
  metric: LocalizedMetricCard;
  icon: string;
  iconClass: string;
  comparisonPeriod: string;
}>();

const vsLabel = useLocalizedString("common", "vs");

const isUp = computed(() => props.metric.changeDirection === "up");
const isDown = computed(() => props.metric.changeDirection === "down");
const displayPercent = computed(() => Math.abs(props.metric.changePercent).toFixed(1));
const trendArrow = computed(() => (isUp.value ? "↑" : isDown.value ? "↓" : "→"));
</script>

<template>
  <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-sm font-medium text-slate-500">{{ metric.label }}</p>
        <p class="mt-2 text-xl font-semibold tracking-tight text-slate-900">
          {{ metric.formattedValue }}
        </p>
      </div>
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
        :class="iconClass"
      >
        <span aria-hidden="true">{{ icon }}</span>
      </div>
    </div>
    <div class="mt-4 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
      <span
        class="text-xs font-semibold"
        :class="
          isUp
            ? 'text-emerald-600'
            : isDown
              ? 'text-rose-600'
              : 'text-slate-600'
        "
      >
        {{ trendArrow }} {{ displayPercent }}%
      </span>
      <span class="text-xs text-slate-400">{{ vsLabel }} {{ comparisonPeriod }}</span>
    </div>
  </article>
</template>
