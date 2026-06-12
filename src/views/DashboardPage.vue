<script setup lang="ts">
import DashboardHeader from "@/components/dashboard/DashboardHeader.vue";
import DashboardMetricsRow from "@/components/dashboard/DashboardMetricsRow.vue";
import DashboardBodyGrid from "@/components/dashboard/DashboardBodyGrid.vue";
</script>

<template>
  <div class="flex flex-col gap-4 pb-8">
    <DashboardHeader />
    <DashboardMetricsRow />
    <DashboardBodyGrid />
  </div>
</template>
