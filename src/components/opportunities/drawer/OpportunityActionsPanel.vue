<script setup lang="ts">
import { useChatOverlayStore } from "@/stores/chatOverlay";
import { useOpportunityInvestigationContext } from "@/composables/opportunities/useOpportunityInvestigation";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import { FALLBACK_ACTION_TITLE_KEY } from "@/utils/opportunityEvidence";
import type { OpportunityDetail } from "@/types/ai";

const props = defineProps<{
  opportunity: OpportunityDetail;
}>();

const chatOverlay = useChatOverlayStore();
const { actionPlanPrompt } = useOpportunityInvestigationContext();

const copy = useReactiveLocaleStringRecord("opportunities", [
  "drawer.actions",
  "drawer.createActionPlan",
  "drawer.defaultActionTitle",
] as const);

function actionTitle(title: string): string {
  if (title === FALLBACK_ACTION_TITLE_KEY) {
    return copy.value["drawer.defaultActionTitle"];
  }
  return title;
}

function createActionPlan() {
  chatOverlay.openWithPrompt(actionPlanPrompt.value);
}
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 class="text-sm font-semibold text-slate-900">
      {{ copy["drawer.actions"] }}
    </h3>

    <ol class="mt-4 flex flex-col gap-4">
      <li
        v-for="(action, idx) in opportunity.actions"
        :key="idx"
        class="flex gap-3"
      >
        <span
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600"
        >
          {{ idx + 1 }}
        </span>
        <div class="min-w-0 pt-0.5">
          <p class="text-sm font-semibold text-slate-900">{{ actionTitle(action.title) }}</p>
          <p class="mt-0.5 text-xs leading-relaxed text-slate-500">{{ action.description }}</p>
        </div>
      </li>
    </ol>

    <button
      type="button"
      class="mt-5 w-full rounded-lg border border-indigo-300 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-50"
      @click="createActionPlan"
    >
      {{ copy["drawer.createActionPlan"] }}
    </button>
  </section>
</template>
