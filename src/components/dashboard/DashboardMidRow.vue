<script setup lang="ts">
import AISummaryCard from "@/components/dashboard/AISummaryCard.vue";
import RevenueOverviewChart from "@/components/dashboard/RevenueOverviewChart.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";

const revenueTitle = useLocalizedString("dashboard", "revenueTrendTitle");
const periodDaily = useLocalizedString("dashboard", "revenuePeriodDaily");
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-3 lg:items-start">
    <div class="lg:col-span-2">
      <section class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h3 class="text-base font-semibold text-slate-900">{{ revenueTitle }}</h3>
          <select
            class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-expenzey-500 focus:outline-none focus:ring-2 focus:ring-expenzey-100"
          >
            <option>{{ periodDaily }}</option>
          </select>
        </div>
        <div class="px-4 pb-3 pt-2">
          <RevenueOverviewChart />
        </div>
      </section>
    </div>
    <div class="lg:col-span-1">
      <AISummaryCard />
    </div>
  </div>
</template>
