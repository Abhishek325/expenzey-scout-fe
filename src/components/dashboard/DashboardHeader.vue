<script setup lang="ts">
import DateRangePicker from "@/components/shared/DateRangePicker.vue";
import ExportButton from "@/components/shared/ExportButton.vue";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";

const emit = defineEmits<{ export: [] }>();

const copy = useReactiveLocaleStringRecord("dashboard", ["title", "greeting"] as const);
</script>

<template>
  <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <h1 class="text-xl font-semibold text-slate-900">{{ copy.title }}</h1>
      <p class="mt-1 text-sm text-slate-500">
        {{ copy.greeting }}
      </p>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <DateRangePicker />
      <ExportButton @export="emit('export')" />
    </div>
  </div>
</template>
