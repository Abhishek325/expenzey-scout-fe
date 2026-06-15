<template>
  <div class="flex h-full min-h-0 flex-col justify-center gap-2 p-4">
    <div class="flex items-center gap-3">
      <div class="relative flex h-16 w-16 shrink-0 items-center justify-center">
        <div class="absolute inset-1 rounded-2xl bg-violet-100/70" aria-hidden="true" />
        <span
          class="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-expenzey-500 text-white shadow-sm"
          aria-hidden="true"
        >
          <FaIcon icon="fa-magnifying-glass" size="xs" />
        </span>
      </div>

      <div class="min-w-0 flex-1">
        <h4 class="text-sm font-semibold text-slate-900">{{ emptyTitle }}</h4>
        <p class="mt-0.5 line-clamp-2 text-xs leading-snug text-slate-500">{{ emptyDescription }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";

const emptyTitle = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.empty.title");
const emptyDescription = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.empty.description");
const emptyFooter = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.empty.footer");
</script>
