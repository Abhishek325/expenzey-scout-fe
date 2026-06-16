<template>
  <div class="relative overflow-hidden" role="status" :aria-label="loadingLabel">
    <slot />
    <div
      class="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-slate-100/70 to-transparent motion-reduce:hidden"
      :class="shimmerClass"
      aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLocalizedString } from "@/composables/useLocalizedString";

const props = withDefaults(
  defineProps<{
    shimmerClass?: string;
    ariaLabel?: string;
  }>(),
  { shimmerClass: "animate-[shimmer_1.6s_infinite]", ariaLabel: "" }
);

const loading = useLocalizedString("common", "loading");
const loadingLabel = computed(() => props.ariaLabel || loading.value);
</script>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>

