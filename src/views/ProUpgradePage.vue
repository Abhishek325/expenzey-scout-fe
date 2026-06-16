<template>
  <div class="flex flex-col gap-6 pb-10">
    <div v-if="isPro" class="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
      <h2 class="text-lg font-semibold">{{ copy.alreadyProTitle }}</h2>
      <p class="mt-2 text-sm">{{ copy.alreadyProSubtitle }}</p>
    </div>

    <div id="license">
      <ProUpgradeCta />
    </div>
    <div id="compare-plans">
      <ProComparisonTable />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProComparisonTable from "@/components/pro/ProComparisonTable.vue";
import ProUpgradeCta from "@/components/pro/ProUpgradeCta.vue";
import { usePlan } from "@/composables/usePlan";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";

const { isPro } = usePlan();

const copy = useReactiveLocaleStringRecord("pro", [
  "alreadyProTitle",
  "alreadyProSubtitle",
] as const);
</script>
