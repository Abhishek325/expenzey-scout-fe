<template>
  <article class="flex h-full flex-col rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 sm:p-5">
    <p class="text-xs font-medium text-slate-600">{{ label }}</p>
    <div class="mt-3 flex flex-1 items-center gap-3">
      <div class="relative h-14 w-14 shrink-0">
        <svg viewBox="0 0 36 36" class="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#d1fae5" stroke-width="3.2" />
          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke="#22c55e"
            stroke-width="3.2"
            :stroke-dasharray="`${positivePercent} ${100 - positivePercent}`"
            stroke-linecap="round"
          />
        </svg>
        <span
          class="absolute inset-0 flex items-center justify-center text-emerald-600"
          aria-hidden="true"
        >
          <FaIcon icon="fa-face-smile" size="sm" />
        </span>
      </div>
      <div>
        <p class="text-2xl font-bold leading-none text-emerald-600">{{ positivePercent }}%</p>
        <p class="mt-1 text-sm font-medium text-emerald-600">{{ positiveLabel }}</p>
      </div>
    </div>
    <p class="mt-3 text-xs text-slate-500">{{ reviewCount }} {{ reviewsAnalyzedLabel }}</p>
  </article>
</template>

<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";

defineProps<{
  label: string;
  positivePercent: number;
  reviewCount: number;
}>();

const positiveLabel = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.positive");
const reviewsAnalyzedLabel = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.reviewsAnalyzed");
</script>
