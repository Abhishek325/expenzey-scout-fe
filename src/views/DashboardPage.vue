<script setup lang="ts">
import AIBusinessSummaryBar from "@/components/dashboard/AIBusinessSummaryBar.vue";
import DashboardBodyGrid from "@/components/dashboard/DashboardBodyGrid.vue";
import DashboardHeader from "@/components/dashboard/DashboardHeader.vue";
import DashboardMetricsRow from "@/components/dashboard/DashboardMetricsRow.vue";
</script>

<template>
  <div class="flex flex-col gap-4 pb-8">
    <div class="flex flex-col gap-3">
      <DashboardHeader />
      <DashboardMetricsRow />
    </div>
    <AIBusinessSummaryBar />
    <DashboardBodyGrid />
  </div>
</template>
