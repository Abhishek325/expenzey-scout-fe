<template>
  <Teleport to="body">
    <div class="opportunity-drawer fixed inset-0 z-[10003] flex justify-end" @keydown="onKeydown">
      <Transition name="drawer-backdrop" appear>
        <button
          type="button"
          class="absolute inset-0 bg-slate-900/30"
          :aria-label="closeLabel"
          @click="emit('close')"
        />
      </Transition>

      <Transition name="drawer-panel" appear>
        <aside
          class="relative flex h-full w-full max-w-[56rem] flex-col overflow-hidden bg-white shadow-2xl"
          role="dialog"
          aria-modal="true"
        >
          <OpportunityDrawerHeader :opportunity="opportunity" @close="emit('close')" />

          <div class="min-h-0 flex-1 overflow-y-auto bg-slate-50">
            <div class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_22rem] lg:items-start">
              <div class="flex min-w-0 flex-col gap-6">
                <OpportunityWhyDetected />
                <OpportunitySupportingData />
                <OpportunityRelatedPanel
                  v-if="isPro"
                  class="lg:hidden"
                  :opportunity="opportunity"
                  @select-related="emit('selectRelated', $event)"
                />
              </div>

              <div class="flex flex-col gap-4 lg:sticky lg:top-5">
                <OpportunityImpactPanel />
                <OpportunityActionsPanel :opportunity="opportunity" />
                <OpportunityRelatedPanel
                  v-if="isPro"
                  class="hidden lg:block"
                  :opportunity="opportunity"
                  @select-related="emit('selectRelated', $event)"
                />
                <UpgradeCtaCard
                  v-else
                  class="hidden lg:block"
                  :title="advancedTitle"
                  :cta-label="advancedCta"
                />
              </div>
            </div>
          </div>

          <footer class="shrink-0 border-t border-slate-100 px-6 py-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex min-w-0 items-center gap-2 text-xs text-slate-500">
                <span class="font-medium text-slate-600">{{ copy["drawer.opportunityId"] }}:</span>
                <code class="truncate rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700">
                  {{ opportunity.id }}
                </code>
                <button
                  type="button"
                  class="rounded px-2 py-0.5 text-[11px] font-medium text-indigo-600 hover:bg-indigo-50"
                  @click="copyId"
                >
                  {{ copied ? copy["drawer.copiedId"] : copy["drawer.copyId"] }}
                </button>
              </div>
              <button
                v-if="
                  lifecycleStatus === 'active' ||
                  lifecycleStatus === 'in_progress' ||
                  !lifecycleStatus
                "
                type="button"
                class="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                @click="emit('markDone')"
              >
                {{ copy["actions.markDone"] }}
              </button>
              <span
                v-else-if="lifecycleStatus === 'done' || lifecycleStatus === 'dismissed'"
                class="rounded-lg border px-3 py-1.5 text-xs font-medium"
                :class="
                  lifecycleStatus === 'done'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-slate-100 text-slate-600'
                "
              >
                {{ lifecycleStatus === 'done' ? copy['status.done'] : copy['status.dismissed'] }}
              </span>
            </div>
          </footer>
        </aside>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from "vue";
import OpportunityActionsPanel from "@/components/opportunities/drawer/OpportunityActionsPanel.vue";
import OpportunityDrawerHeader from "@/components/opportunities/drawer/OpportunityDrawerHeader.vue";
import OpportunityImpactPanel from "@/components/opportunities/drawer/OpportunityImpactPanel.vue";
import OpportunityRelatedPanel from "@/components/opportunities/drawer/OpportunityRelatedPanel.vue";
import OpportunitySupportingData from "@/components/opportunities/drawer/OpportunitySupportingData.vue";
import OpportunityWhyDetected from "@/components/opportunities/drawer/OpportunityWhyDetected.vue";
import UpgradeCtaCard from "@/components/shared/UpgradeCtaCard.vue";
import { provideOpportunityInvestigation } from "@/composables/opportunities/useOpportunityInvestigation";
import { usePlan } from "@/composables/usePlan";
import { useLocalizedString, useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import type { OpportunityDetail, OpportunityLifecycleStatus } from "@/types/ai";

const props = defineProps<{
  opportunity: OpportunityDetail;
  lifecycleStatus?: OpportunityLifecycleStatus;
}>();

const emit = defineEmits<{
  close: [];
  selectRelated: [id: string];
  markDone: [];
}>();

const copy = useReactiveLocaleStringRecord("opportunities", [
  "drawer.opportunityId",
  "drawer.copyId",
  "drawer.copiedId",
  "actions.markDone",
  "status.done",
  "status.dismissed",
] as const);

const closeLabel = useLocalizedString("common", "close");
const { isPro } = usePlan();

const upgradeCopy = useReactiveLocaleStringRecord("upgrade", [
  "opportunities.advancedTitle",
  "opportunities.advancedCta",
] as const);

const advancedTitle = computed(() => upgradeCopy.value["opportunities.advancedTitle"]);
const advancedCta = computed(() => upgradeCopy.value["opportunities.advancedCta"]);

provideOpportunityInvestigation(toRef(() => props.opportunity));

const copied = ref(false);

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") emit("close");
}

async function copyId() {
  try {
    await navigator.clipboard.writeText(props.opportunity.id);
    copied.value = true;
    window.setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    copied.value = false;
  }
}
</script>

<style scoped>
.drawer-backdrop-enter-active,
.drawer-backdrop-leave-active {
  transition: opacity 160ms ease-out;
}

.drawer-backdrop-enter-from,
.drawer-backdrop-leave-to {
  opacity: 0;
}

.drawer-panel-enter-active,
.drawer-panel-leave-active {
  transition:
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 220ms ease-out;
}

.drawer-panel-enter-from,
.drawer-panel-leave-to {
  transform: translateX(18px);
  opacity: 0;
}
</style>
