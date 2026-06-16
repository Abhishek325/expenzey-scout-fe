<template>
  <div class="flex flex-col gap-3">
    <div class="grid gap-3 lg:grid-cols-3 lg:items-start">
      <section class="flex min-h-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
        <div class="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
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
        <div class="min-h-0 flex-1 px-4 pb-3 pt-2">
          <RevenueOverviewChart :granularity="chartGranularity" />
        </div>
      </section>

      <LazyWidget class="min-h-0 lg:col-span-1" :class="WEEKLY_REPORT_HEIGHT">
        <WeeklyAIReportCard class="h-full min-h-0" />
        <template #fallback>
          <section class="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="shrink-0 border-b border-slate-100 px-4 py-3">
              <div class="h-4 w-40 rounded bg-slate-100" />
            </div>
            <div class="min-h-0 flex-1 p-4">
              <WidgetSkeleton variant="card" :row-count="4" />
            </div>
          </section>
        </template>
      </LazyWidget>

      <TopProductsTable :class="INSIGHTS_DATA_TABLE_OFFSET" />
      <AIOpportunitiesSection :class="INSIGHTS_DATA_TABLE_OFFSET" />
      <LazyWidget class="min-h-0">
        <ReviewIntelligenceCard />
        <template #fallback>
          <section class="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-100 px-4 py-3">
              <div class="h-4 w-44 rounded bg-slate-100" />
            </div>
            <div class="px-4 py-4">
              <WidgetSkeleton variant="list" :row-count="3" />
            </div>
          </section>
        </template>
      </LazyWidget>
    </div>

    <LazyWidget>
      <RecentAIReportsRow />
      <template #fallback>
        <section class="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div class="border-b border-slate-100 px-4 py-3">
            <div class="h-4 w-40 rounded bg-slate-100" />
          </div>
          <div class="px-4 py-4">
            <WidgetSkeleton variant="table" :row-count="4" />
          </div>
        </section>
      </template>
    </LazyWidget>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AIOpportunitiesSection from "@/components/dashboard/AIOpportunitiesSection.vue";
import RecentAIReportsRow from "@/components/dashboard/RecentAIReportsRow.vue";
import ReviewIntelligenceCard from "@/components/dashboard/ReviewIntelligenceCard.vue";
import RevenueOverviewChart from "@/components/dashboard/RevenueOverviewChart.vue";
import TopProductsTable from "@/components/dashboard/TopProductsTable.vue";
import WeeklyAIReportCard from "@/components/dashboard/WeeklyAIReportCard.vue";
import LazyWidget from "@/components/shared/LazyWidget.vue";
import WidgetSkeleton from "@/components/shared/skeleton/WidgetSkeleton.vue";
import { provideTopProducts } from "@/composables/dashboard/useTopProducts";
import { INSIGHTS_DATA_TABLE_OFFSET, WEEKLY_REPORT_HEIGHT } from "@/constants/dashboardRowHeights";
import { useLocalizedString } from "@/composables/useLocalizedString";
import type { RevenueChartGranularity } from "@/types/metrics";

provideTopProducts();

const revenueTitle = useLocalizedString("dashboard", "revenueTrendTitle");
const periodDaily = useLocalizedString("dashboard", "revenuePeriodDaily");
const periodWeekly = useLocalizedString("dashboard", "revenuePeriodWeekly");
const periodMonthly = useLocalizedString("dashboard", "revenuePeriodMonthly");

const chartGranularity = ref<RevenueChartGranularity>("daily");
</script>
