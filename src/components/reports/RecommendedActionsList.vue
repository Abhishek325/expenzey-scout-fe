<template>
  <ReportSectionCard :title="title" fill-height scrollable>
    <ol v-if="actions.length" class="flex flex-col gap-3">
      <li
        v-for="(action, index) in actions"
        :key="index"
        class="flex gap-3 rounded-lg border border-indigo-100 bg-indigo-50/60 p-4"
      >
        <span
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white"
        >
          {{ index + 1 }}
        </span>
        <p class="pt-0.5 text-sm font-medium leading-relaxed text-slate-800">{{ action }}</p>
      </li>
    </ol>
    <p v-else class="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-400">
      {{ emptyLabel }}
    </p>
  </ReportSectionCard>
</template>

<script setup lang="ts">
import ReportSectionCard from "@/components/reports/ReportSectionCard.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";

defineProps<{ title: string; actions: string[] }>();

const emptyLabel = useLocalizedString("reports", "detail.noData");
</script>
