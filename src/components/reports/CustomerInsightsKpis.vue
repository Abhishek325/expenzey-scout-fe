<template>
  <section>
    <h2 class="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">{{ title }}</h2>
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <ReportSectionCard
        v-for="card in cards"
        :key="card.label"
        padding-class="p-4"
      >
        <div class="flex items-start gap-3">
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            :class="card.iconBg"
            aria-hidden="true"
          >
            <FaIcon :icon="card.icon" size="sm" :icon-class="card.iconColor" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium text-slate-500">{{ card.label }}</p>
            <p class="mt-1 text-2xl font-bold text-slate-900">{{ card.value }}</p>
            <p v-if="card.trend" class="mt-1 text-xs font-medium" :class="card.trendClass">{{ card.trend }}</p>
          </div>
        </div>
      </ReportSectionCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import ReportSectionCard from "@/components/reports/ReportSectionCard.vue";
import { useFormatCurrency } from "@/composables/useFormatCurrency";
import { useLocalizedString } from "@/composables/useLocalizedString";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";
import type { WeeklyReportCustomerInsights } from "@/types/ai";
import { formatGrowthVsPriorWeek } from "@/utils/reportFormatters";

const props = defineProps<{ title: string; insights: WeeklyReportCustomerInsights }>();

const stringService = inject(STRING_SERVICE_KEY) as IStringService;
const { formatCurrency } = useFormatCurrency();
const newCustomersLabel = useLocalizedString("reports", "customerKpi.newCustomers");
const returningLabel = useLocalizedString("reports", "customerKpi.returningCustomers");
const repeatRevenueLabel = useLocalizedString("reports", "customerKpi.repeatRevenue");
const aovLabel = useLocalizedString("reports", "customerKpi.aov");

const growthTemplate = computed(() =>
  stringService.getStrings("reports", "formats.growthVsPriorWeek"),
);

function growthTrend(percent: number): string {
  return formatGrowthVsPriorWeek(percent, growthTemplate.value);
}

function trendClass(percent: number): string {
  return percent >= 0 ? "text-emerald-600" : "text-rose-600";
}

const cards = computed(() => [
  {
    label: newCustomersLabel.value,
    value: String(props.insights.newCustomers),
    trend: props.insights.newCustomersGrowthPercent !== undefined
      ? growthTrend(props.insights.newCustomersGrowthPercent)
      : undefined,
    trendClass: props.insights.newCustomersGrowthPercent !== undefined
      ? trendClass(props.insights.newCustomersGrowthPercent)
      : "",
    icon: "fa-user-plus",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    label: returningLabel.value,
    value: String(props.insights.returningCustomers),
    trend: growthTrend(props.insights.returningGrowthPercent),
    trendClass: trendClass(props.insights.returningGrowthPercent),
    icon: "fa-user-check",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
  {
    label: repeatRevenueLabel.value,
    value: formatCurrency(props.insights.repeatRevenue),
    trend: growthTrend(props.insights.repeatRevenueGrowthPercent),
    trendClass: trendClass(props.insights.repeatRevenueGrowthPercent),
    icon: "fa-arrows-rotate",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    label: aovLabel.value,
    value: formatCurrency(props.insights.averageOrderValue),
    trend: growthTrend(props.insights.averageOrderValueGrowthPercent),
    trendClass: trendClass(props.insights.averageOrderValueGrowthPercent),
    icon: "fa-bag-shopping",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
]);
</script>
