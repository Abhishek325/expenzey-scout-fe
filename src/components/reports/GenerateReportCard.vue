<template>
  <section class="rounded-xl border border-slate-200 bg-white shadow-sm">
    <div class="grid grid-cols-1 lg:grid-cols-12 lg:divide-x lg:divide-slate-100">
      <!-- Generate action -->
      <div class="flex gap-4 p-5 lg:col-span-6 lg:p-6">
        <span
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"
          aria-hidden="true"
        >
          <FaIcon icon="fa-file-lines" size="lg" />
        </span>
        <div class="min-w-0 flex-1">
          <h2 class="text-base font-semibold text-slate-900">{{ cardTitle }}</h2>
          <p class="mt-1 text-sm leading-relaxed text-slate-500">{{ cardDescription }}</p>
          <GenerateReportButton
            v-if="showButton"
            class="mt-4 w-fit"
            show-arrow
            :disabled="generating"
            @generate="emit('generate')"
          />
        </div>
      </div>

      <!-- Last report (or empty state) -->
      <div class="flex items-center gap-3 border-t border-slate-100 p-5 lg:col-span-3 lg:border-t-0 lg:p-6">
        <span
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"
          aria-hidden="true"
        >
          <FaIcon icon="fa-calendar-days" size="sm" />
        </span>
        <div class="min-w-0">
          <p class="text-xs text-slate-500">{{ lastReportLabel }}</p>
          <template v-if="lastReportRelative">
            <p class="mt-0.5 text-sm font-semibold text-slate-900">{{ lastReportRelative }}</p>
            <p v-if="lastReportPeriod" class="mt-0.5 text-xs text-slate-400">{{ lastReportPeriod }}</p>
          </template>
          <p v-else class="mt-0.5 text-sm font-semibold text-slate-400">{{ noReportsFound }}</p>
        </div>
      </div>

      <!-- Next recommended -->
      <div class="flex items-center gap-3 border-t border-slate-100 p-5 lg:col-span-3 lg:border-t-0 lg:p-6">
        <span
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
          aria-hidden="true"
        >
          <FaIcon icon="fa-calendar-days" size="sm" />
        </span>
        <div class="min-w-0">
          <p class="text-xs text-slate-500">{{ nextRecommendedLabel }}</p>
          <p class="mt-0.5 text-sm font-semibold text-emerald-600">{{ nextScheduledRelative || "—" }}</p>
          <p v-if="nextScheduledNote" class="mt-0.5 text-xs text-slate-400">{{ nextScheduledNote }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import GenerateReportButton from "@/components/dashboard/GenerateReportButton.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";

defineProps<{
  showButton: boolean;
  generating?: boolean;
  lastReportRelative?: string;
  lastReportPeriod?: string;
  nextScheduledRelative?: string;
  nextScheduledNote?: string;
}>();

const emit = defineEmits<{ generate: [] }>();

const cardTitle = useLocalizedString("reports", "generateCard.title");
const cardDescription = useLocalizedString("reports", "generateCard.description");
const lastReportLabel = useLocalizedString("reports", "status.lastReport");
const noReportsFound = useLocalizedString("reports", "status.noReportsFound");
const nextRecommendedLabel = useLocalizedString("reports", "status.nextRecommended");
</script>
