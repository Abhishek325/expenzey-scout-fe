<template>
  <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 class="text-sm font-semibold text-slate-900">
      {{ copy["drawer.actions"] }}
    </h3>

    <ol class="mt-4 flex flex-col gap-4">
      <li v-for="(action, idx) in opportunity.actions" :key="idx">
        <label
          class="flex gap-3"
          :class="readOnly ? 'cursor-default' : 'cursor-pointer'"
        >
          <span class="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
            <input
              type="checkbox"
              class="peer sr-only"
              :checked="isCompleted(idx)"
              :disabled="readOnly"
              @change="onToggle(idx)"
            />
            <span
              class="flex h-5 w-5 items-center justify-center rounded-md border border-slate-300 bg-white transition peer-checked:border-emerald-600 peer-checked:bg-emerald-600 peer-disabled:opacity-60 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500 peer-focus-visible:ring-offset-1"
              aria-hidden="true"
            >
              <svg
                v-if="isCompleted(idx)"
                class="h-3 w-3 text-white"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M2 6l3 3 5-5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </span>
          <div
            class="min-w-0 pt-0.5 transition"
            :class="
              isCompleted(idx)
                ? 'text-slate-400 line-through decoration-slate-300'
                : 'text-slate-900'
            "
          >
            <p class="text-sm font-semibold">{{ actionTitle(action.title) }}</p>
            <p
              class="mt-0.5 text-xs leading-relaxed"
              :class="isCompleted(idx) ? 'text-slate-400' : 'text-slate-500'"
            >
              {{ action.description }}
            </p>
          </div>
        </label>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { storeToRefs } from "pinia";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import { useOpportunitiesStore } from "@/stores/opportunitiesStore";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import { FALLBACK_ACTION_TITLE_KEY } from "@/utils/opportunityEvidence";
import type { OpportunityDetail } from "@/types/ai";

const props = defineProps<{
  opportunity: OpportunityDetail;
}>();

const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;
const store = useOpportunitiesStore();
const { completedActionIndices } = storeToRefs(store);

const copy = useReactiveLocaleStringRecord("opportunities", [
  "drawer.actions",
  "drawer.defaultActionTitle",
] as const);

const readOnly = computed(() => {
  const status = store.statusOf(props.opportunity.id);
  return status === "done" || status === "dismissed";
});

function isCompleted(idx: number): boolean {
  return completedActionIndices.value(props.opportunity.id).includes(idx);
}

function actionTitle(title: string): string {
  if (title === FALLBACK_ACTION_TITLE_KEY) {
    return copy.value["drawer.defaultActionTitle"];
  }
  return title;
}

function onToggle(idx: number) {
  if (readOnly.value) return;
  void store.toggleActionComplete(reportsService, props.opportunity, idx);
}
</script>
