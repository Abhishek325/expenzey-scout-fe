<template>
  <ReportSectionCard :title="title" fill-height>
    <div v-if="opportunities.length" class="flex flex-col gap-3">
      <article
        v-for="(item, index) in opportunities"
        :key="index"
        class="rounded-lg border border-sky-100 bg-sky-50 p-4"
      >
        <div class="flex gap-3">
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600"
            aria-hidden="true"
          >
            <FaIcon :icon="iconFor(index)" size="sm" />
          </span>
          <div class="min-w-0">
            <h3 class="text-sm font-semibold text-slate-900">{{ item.title }}</h3>
            <p class="mt-1.5 text-sm leading-relaxed text-slate-600">{{ item.recommendation }}</p>
          </div>
        </div>
      </article>
    </div>
    <p v-else class="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-400">
      {{ emptyLabel }}
    </p>
  </ReportSectionCard>
</template>

<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import ReportSectionCard from "@/components/reports/ReportSectionCard.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";
import type { WeeklyReportOpportunity } from "@/types/ai";

defineProps<{ title: string; opportunities: WeeklyReportOpportunity[] }>();

const emptyLabel = useLocalizedString("reports", "detail.noData");

const icons = ["fa-gift", "fa-chart-line"] as const;

function iconFor(index: number): string {
  return icons[index % icons.length];
}
</script>
