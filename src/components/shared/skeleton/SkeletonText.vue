<template>
  <div class="space-y-2">
    <SkeletonBlock
      v-for="(w, idx) in widths"
      :key="idx"
      :class-name="`h-3 ${w}`"
      rounded
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SkeletonBlock from "@/components/shared/skeleton/SkeletonBlock.vue";

const props = withDefaults(
  defineProps<{
    lines?: number;
    widthPreset?: "short" | "medium" | "long";
  }>(),
  { lines: 3, widthPreset: "medium" }
);

const widths = computed(() => {
  const base =
    props.widthPreset === "short"
      ? ["w-1/3", "w-2/5", "w-1/4"]
      : props.widthPreset === "long"
        ? ["w-5/6", "w-4/5", "w-2/3"]
        : ["w-2/3", "w-1/2", "w-3/5"];
  return base.slice(0, Math.max(1, Math.min(props.lines, base.length)));
});
</script>

