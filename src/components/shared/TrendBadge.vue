<template>
  <span
    class="inline-flex items-center gap-0.5 text-xs font-medium"
    :class="
      compact
        ? isUp
          ? 'text-emerald-600'
          : isDown
            ? 'text-rose-600'
            : 'text-slate-600'
        : isUp
          ? 'rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700'
          : isDown
            ? 'rounded-full bg-rose-50 px-2 py-0.5 font-semibold text-rose-700'
            : 'rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600'
    "
  >
    <span aria-hidden="true">{{ isUp ? "↑" : isDown ? "↓" : "→" }}</span>
    <span>{{ displayPercent }}%</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { MetricChangeDirection } from "@/types/metrics";

const props = withDefaults(
  defineProps<{
    percent: number;
    direction: MetricChangeDirection;
    compact?: boolean;
  }>(),
  { compact: false }
);

const isUp = computed(() => props.direction === "up");
const isDown = computed(() => props.direction === "down");
const displayPercent = computed(() => Math.abs(props.percent).toFixed(1));
</script>
