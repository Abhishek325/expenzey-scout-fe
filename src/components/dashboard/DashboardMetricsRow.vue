<script setup lang="ts">
import MetricCard from "@/components/dashboard/MetricCard.vue";
import { useDashboardMetrics } from "@/composables/dashboard/useDashboardMetrics";
import { useLocalizedString } from "@/composables/useLocalizedString";

const { kpis, loading, comparisonPeriod } = useDashboardMetrics();
const loadingLabel = useLocalizedString("common", "loading");

const iconMap: Record<string, { icon: string; iconClass: string }> = {
  "total-revenue": { icon: "💰", iconClass: "bg-violet-100 text-violet-600" },
  orders: { icon: "📦", iconClass: "bg-indigo-100 text-indigo-600" },
  customers: { icon: "👥", iconClass: "bg-sky-100 text-sky-600" },
  aov: { icon: "📈", iconClass: "bg-emerald-100 text-emerald-600" },
};
</script>

<template>
  <div v-if="loading" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <div
      v-for="n in 4"
      :key="n"
      class="h-32 animate-pulse rounded-xl bg-slate-200/60"
    />
  </div>
  <p v-else-if="!kpis.length" class="text-sm text-slate-500">{{ loadingLabel }}</p>
  <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <MetricCard
      v-for="metric in kpis"
      :key="metric.id"
      :metric="metric"
      :comparison-period="comparisonPeriod"
      v-bind="iconMap[metric.id] ?? { icon: '✨', iconClass: 'bg-expenzey-100 text-expenzey-600' }"
    />
  </div>
</template>
