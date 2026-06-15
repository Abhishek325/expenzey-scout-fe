<template>
  <ReportSectionCard fill-height>
    <template #header>
      <div class="flex items-center gap-2">
        <span
          class="flex h-6 w-6 items-center justify-center rounded-full"
          :class="variant === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'"
          aria-hidden="true"
        >
          <FaIcon :icon="variant === 'success' ? 'fa-check' : 'fa-triangle-exclamation'" size="xs" />
        </span>
        <h2
          class="text-xs font-bold uppercase tracking-wide"
          :class="variant === 'success' ? 'text-emerald-700' : 'text-amber-700'"
        >
          {{ title }}
        </h2>
      </div>
    </template>

    <ul v-if="items.length" class="flex flex-col gap-2">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="rounded-lg border p-3"
        :class="variant === 'success' ? 'border-emerald-100 bg-emerald-50' : 'border-amber-100 bg-amber-50'"
      >
        <div class="flex gap-2.5">
          <span
            class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
            :class="variant === 'success' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'"
            aria-hidden="true"
          >
            <FaIcon :icon="variant === 'success' ? 'fa-check' : 'fa-triangle-exclamation'" size="xs" />
          </span>
          <p class="text-sm leading-snug text-slate-700">{{ item }}</p>
        </div>
      </li>
    </ul>
    <p v-else class="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-400">
      {{ emptyLabel }}
    </p>
  </ReportSectionCard>
</template>

<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import ReportSectionCard from "@/components/reports/ReportSectionCard.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";

defineProps<{
  title: string;
  items: string[];
  variant: "success" | "warning";
}>();

const emptyLabel = useLocalizedString("reports", "detail.noData");
</script>
