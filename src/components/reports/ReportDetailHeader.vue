<template>
  <header class="flex flex-col gap-4">
    <RouterLink
      to="/reports"
      class="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
    >
      <FaIcon icon="fa-arrow-left" size="xs" />
      {{ backLabel }}
    </RouterLink>

    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">{{ title }}</h1>
        <p v-if="periodLabel" class="mt-1 text-sm text-slate-500">{{ periodLabel }}</p>
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!canDownload"
          @click="emit('downloadPdf')"
        >
          <FaIcon icon="fa-file-pdf" size="sm" />
          {{ downloadLabel }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";

defineProps<{
  title: string;
  periodLabel?: string;
  canDownload?: boolean;
}>();

const emit = defineEmits<{ downloadPdf: [] }>();

const backLabel = useLocalizedString("reports", "detail.backToReports");
const downloadLabel = useLocalizedString("reports", "detail.downloadPdf");
const moreActionsLabel = useLocalizedString("reports", "detail.moreActions");
</script>
