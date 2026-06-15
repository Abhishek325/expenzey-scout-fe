<template>
  <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <span
      class="inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700"
    >
      {{ badge }}
    </span>
    <div class="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div class="min-w-0 flex-1">
        <h2 class="text-lg font-semibold text-slate-900">{{ reportTitle }}</h2>
        <p class="mt-3 text-sm leading-relaxed text-slate-600">{{ content.executiveSummary }}</p>
        <RouterLink
          :to="`/reports/${reportId}`"
          class="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          {{ viewFullReport }}
          <FaIcon icon="fa-arrow-right" size="xs" />
        </RouterLink>
      </div>
      <div class="grid shrink-0 grid-cols-2 gap-3 sm:w-80">
        <article class="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
          <p class="text-xs text-slate-500">{{ revenueLabel }}</p>
          <p class="mt-1 text-lg font-semibold text-slate-900">{{ formatCurrency(content.periodMetrics.revenue) }}</p>
          <TrendBadge
            compact
            class="mt-1"
            :percent="content.periodMetrics.revenueGrowthPercent"
            :direction="content.periodMetrics.revenueGrowthPercent >= 0 ? 'up' : 'down'"
          />
        </article>
        <article class="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
          <p class="text-xs text-slate-500">{{ ordersLabel }}</p>
          <p class="mt-1 text-lg font-semibold text-slate-900">{{ content.periodMetrics.orders }}</p>
          <TrendBadge
            compact
            class="mt-1"
            :percent="content.periodMetrics.ordersGrowthPercent"
            :direction="content.periodMetrics.ordersGrowthPercent >= 0 ? 'up' : 'down'"
          />
        </article>
        <article class="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
          <p class="text-xs text-slate-500">{{ opportunitiesLabel }}</p>
          <p class="mt-1 text-lg font-semibold text-slate-900">{{ content.opportunities.length }}</p>
          <p class="mt-1 text-[10px] text-slate-400">{{ newFoundLabel }}</p>
        </article>
        <article class="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
          <p class="text-xs text-slate-500">{{ attentionLabel }}</p>
          <p class="mt-1 text-lg font-semibold text-slate-900">{{ content.needsAttention.length }}</p>
          <p class="mt-1 text-[10px] text-rose-500">{{ requireActionLabel }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import TrendBadge from "@/components/shared/TrendBadge.vue";
import { useFormatCurrency } from "@/composables/useFormatCurrency";
import { useLocalizedString } from "@/composables/useLocalizedString";
import { formatReportPeriodShort } from "@/utils/reportFormatters";
import type { WeeklyReportContent } from "@/types/ai";

const props = defineProps<{
  reportId: string;
  periodStart: string;
  periodEnd: string;
  content: WeeklyReportContent;
}>();

const { formatCurrency } = useFormatCurrency();
const badge = useLocalizedString("reports", "latest.badge");
const latestTitle = useLocalizedString("reports", "latest.title");
const viewFullReport = useLocalizedString("reports", "latest.viewFullReport");
const revenueLabel = useLocalizedString("reports", "kpi.revenue");
const ordersLabel = useLocalizedString("reports", "kpi.orders");
const opportunitiesLabel = useLocalizedString("reports", "kpi.opportunities");
const attentionLabel = useLocalizedString("reports", "kpi.needsAttention");
const newFoundLabel = useLocalizedString("reports", "kpi.newFound");
const requireActionLabel = useLocalizedString("reports", "kpi.requireAction");

const reportTitle = computed(
  () => `${latestTitle.value} – ${formatReportPeriodShort(props.periodStart, props.periodEnd)}`,
);
</script>
