<template>
  <ReportSectionCard :title="title">
    <div class="grid gap-3 sm:grid-cols-3">
      <article class="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
        <p class="text-xs font-medium text-slate-500">{{ sentimentLabel }}</p>
        <p class="mt-2 text-xl font-semibold text-emerald-700">{{ intelligence.sentimentScore ?? 0 }}%</p>
      </article>
      <article v-if="intelligence.topPositiveTheme" class="rounded-lg border border-slate-100 bg-slate-50 p-4">
        <p class="text-xs font-medium text-slate-500">{{ positiveLabel }}</p>
        <p class="mt-2 text-sm font-semibold text-slate-900">{{ intelligence.topPositiveTheme }}</p>
      </article>
      <article v-if="intelligence.topComplaintTheme" class="rounded-lg border border-rose-100 bg-rose-50 p-4">
        <p class="text-xs font-medium text-slate-500">{{ complaintLabel }}</p>
        <p class="mt-2 text-sm font-semibold text-slate-900">{{ intelligence.topComplaintTheme }}</p>
      </article>
    </div>
  </ReportSectionCard>
</template>

<script setup lang="ts">
import ReportSectionCard from "@/components/reports/ReportSectionCard.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";
import type { WeeklyReportReviewIntelligence } from "@/types/ai";

defineProps<{ title: string; intelligence: WeeklyReportReviewIntelligence }>();

const sentimentLabel = useLocalizedString("reports", "sections.overallSentiment");
const positiveLabel = useLocalizedString("reports", "sections.topPositiveTheme");
const complaintLabel = useLocalizedString("reports", "sections.topComplaintTheme");
</script>
