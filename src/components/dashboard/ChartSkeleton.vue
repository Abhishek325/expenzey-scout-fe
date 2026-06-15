<template>
  <div
    class="h-full min-h-0 w-full overflow-hidden"
    role="status"
    :aria-label="loading"
  >
    <div class="relative h-full w-full overflow-hidden">
      <div
        class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-100/80 to-transparent"
      />
      <div class="flex h-full min-h-0 flex-col justify-end gap-2 p-2">
        <div class="h-2.5 w-1/4 rounded bg-slate-200" />
        <div class="flex min-h-0 flex-1 items-end gap-1.5 pb-1">
          <div
            v-for="n in 7"
            :key="n"
            class="flex-1 rounded-t bg-slate-200/80"
            :style="{ height: `${28 + n * 7}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocalizedString } from "@/composables/useLocalizedString";

const loading = useLocalizedString("common", "loading");
</script>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
