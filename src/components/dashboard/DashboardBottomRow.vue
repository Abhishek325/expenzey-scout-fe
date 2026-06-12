<script setup lang="ts">
import AIChatWidget from "@/components/dashboard/AIChatWidget.vue";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable.vue";
import TopProductsTable from "@/components/dashboard/TopProductsTable.vue";
</script>

<template>
  <div class="grid gap-4 xl:grid-cols-3">
    <TopProductsTable class="xl:col-span-1" />
    <RecentOrdersTable class="xl:col-span-1" />
    <div class="xl:col-span-1">
      <AIChatWidget />
    </div>
  </div>
</template>
