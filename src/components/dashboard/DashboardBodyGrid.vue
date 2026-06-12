<script setup lang="ts">
import { ref } from "vue";
import AISummaryCard from "@/components/dashboard/AISummaryCard.vue";
import AIChatWidget from "@/components/dashboard/AIChatWidget.vue";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable.vue";
import RevenueOverviewChart from "@/components/dashboard/RevenueOverviewChart.vue";
import StoreSnapshotCard from "@/components/dashboard/StoreSnapshotCard.vue";
import TopProductsTable from "@/components/dashboard/TopProductsTable.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";
import type { RevenueChartGranularity } from "@/types/metrics";

const revenueTitle = useLocalizedString("dashboard", "revenueTrendTitle");
const periodDaily = useLocalizedString("dashboard", "revenuePeriodDaily");
const periodWeekly = useLocalizedString("dashboard", "revenuePeriodWeekly");
const periodMonthly = useLocalizedString("dashboard", "revenuePeriodMonthly");

const chartGranularity = ref<RevenueChartGranularity>("daily");
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-3 lg:items-start">
    <!-- Left 2/3: chart then tables — independent of right column height -->
    <div class="flex flex-col gap-4 lg:col-span-2">
      <section class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h3 class="text-sm font-semibold text-slate-900">{{ revenueTitle }}</h3>
          <select
            v-model="chartGranularity"
            class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-expenzey-500 focus:outline-none focus:ring-2 focus:ring-expenzey-100"
          >
            <option value="daily">{{ periodDaily }}</option>
            <option value="weekly">{{ periodWeekly }}</option>
            <option value="monthly">{{ periodMonthly }}</option>
          </select>
        </div>
        <div class="px-4 pb-3 pt-2">
          <RevenueOverviewChart :granularity="chartGranularity" />
        </div>
      </section>

      <div class="grid gap-4 md:grid-cols-2">
        <TopProductsTable />
        <RecentOrdersTable />
      </div>
    </div>

    <!-- Right 1/3: snapshot + AI summary + chat stacked -->
    <div class="flex flex-col gap-4 lg:col-span-1">
      <StoreSnapshotCard />
      <AISummaryCard />
      <AIChatWidget />
    </div>
  </div>
</template>
