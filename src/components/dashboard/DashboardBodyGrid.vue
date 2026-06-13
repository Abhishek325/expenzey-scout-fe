<script setup lang="ts">
import { ref } from "vue";
import AIOpportunitiesSection from "@/components/dashboard/AIOpportunitiesSection.vue";
import RecentAIReportsRow from "@/components/dashboard/RecentAIReportsRow.vue";
import ReviewIntelligenceCard from "@/components/dashboard/ReviewIntelligenceCard.vue";
import RevenueOverviewChart from "@/components/dashboard/RevenueOverviewChart.vue";
import TopProductsTable from "@/components/dashboard/TopProductsTable.vue";
import WeeklyAIReportCard from "@/components/dashboard/WeeklyAIReportCard.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";
import type { RevenueChartGranularity } from "@/types/metrics";

const revenueTitle = useLocalizedString("dashboard", "revenueTrendTitle");
const periodDaily = useLocalizedString("dashboard", "revenuePeriodDaily");
const periodWeekly = useLocalizedString("dashboard", "revenuePeriodWeekly");
const periodMonthly = useLocalizedString("dashboard", "revenuePeriodMonthly");

const chartGranularity = ref<RevenueChartGranularity>("daily");
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Left 2/3: chart + products/opportunities · Right 1/3: weekly report + review intel -->
    <div class="grid gap-3 lg:grid-cols-3 lg:items-stretch">
      <div class="flex flex-col gap-3 lg:col-span-2">
        <section class="shrink-0 rounded-xl border border-slate-200 bg-white shadow-sm">
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

        <div class="grid min-h-0 flex-1 gap-3 md:grid-cols-2 lg:items-stretch">
          <TopProductsTable class="h-full" />
          <AIOpportunitiesSection class="h-full" />
        </div>
      </div>

      <div class="flex min-h-0 flex-col gap-3 lg:col-span-1">
        <WeeklyAIReportCard class="min-h-0 flex-[1.15] basis-0" />
        <ReviewIntelligenceCard class="min-h-0 flex-1 basis-0" />
      </div>
    </div>

    <RecentAIReportsRow />
  </div>
</template>
