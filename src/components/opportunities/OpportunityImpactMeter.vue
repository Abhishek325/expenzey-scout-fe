<template>
  <div class="flex items-center gap-1" aria-hidden="true">
    <span
      v-for="i in 5"
      :key="i"
      class="h-2 w-2 rounded-full"
      :class="i <= IMPACT_LEVEL_DOTS[level] ? DOT_COLORS[level] : INACTIVE"
    />
  </div>
</template>

<script setup lang="ts">
import { IMPACT_LEVEL_DOTS } from "@/utils/opportunityStyles";

defineProps<{
  level: "high" | "medium" | "low";
}>();

const DOT_COLORS: Record<string, string> = {
  high: "bg-rose-500",
  medium: "bg-orange-400",
  low: "bg-emerald-400",
};

const INACTIVE = "bg-slate-200";
</script>
