<script setup lang="ts">
import AIInsightItem from "@/components/dashboard/AIInsightItem.vue";
import GenerateReportButton from "@/components/dashboard/GenerateReportButton.vue";
import { useAISummary } from "@/composables/dashboard/useAISummary";
import { useLocalizedString } from "@/composables/useLocalizedString";

const { insights, loading } = useAISummary();
const title = useLocalizedString("dashboard", "aiInsightsTitle");
const viewFullReport = useLocalizedString("dashboard", "viewFullReport");

const emit = defineEmits<{ generate: [] }>();
</script>

<template>
  <section class="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="mb-4 flex items-center justify-between gap-2">
      <h3 class="text-sm font-semibold text-slate-900">{{ title }}</h3>
      <RouterLink to="/reports" class="card-header-action">
        {{ viewFullReport }}
      </RouterLink>
    </div>
    <div v-if="loading" class="flex flex-col gap-3">
      <div v-for="n in 3" :key="n" class="h-20 animate-pulse rounded-xl bg-slate-100" />
    </div>
    <div v-else class="flex flex-col gap-3">
      <AIInsightItem
        v-for="item in insights"
        :key="item.id"
        :variant="item.variant"
        :title="item.title"
        :detail="item.detail"
        :product-name="item.productName"
        :icon="item.icon"
      />
    </div>
    <div class="mt-4">
      <GenerateReportButton @click="emit('generate')" />
    </div>
  </section>
</template>
