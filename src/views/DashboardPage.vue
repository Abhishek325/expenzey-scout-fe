<template>
  <div class="flex flex-col gap-4 pb-8">
    <div class="flex flex-col gap-3">
      <DashboardHeader />
      <DashboardMetricsRow />
    </div>
    <DashboardBodyGrid />
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import DashboardBodyGrid from "@/components/dashboard/DashboardBodyGrid.vue";
import DashboardHeader from "@/components/dashboard/DashboardHeader.vue";
import DashboardMetricsRow from "@/components/dashboard/DashboardMetricsRow.vue";
import { useDashboardOverviewStore } from "@/stores/dashboardOverviewStore";
import { useDateRangeStore } from "@/stores/dateRange";

const overviewStore = useDashboardOverviewStore();
const dateRange = useDateRangeStore();

watch(
  () => dateRange.rangeKey,
  () => {
    void overviewStore.fetch(dateRange.selection, dateRange.rangeKey, "daily");
  },
  { immediate: true }
);
</script>
