<script setup lang="ts">
import { computed } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import { useOpportunityInvestigationContext } from "@/composables/opportunities/useOpportunityInvestigation";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";

const { opportunity, impactRangeText } = useOpportunityInvestigationContext();

const copy = useReactiveLocaleStringRecord("opportunities", [
  "drawer.impact",
  "drawer.impactSubtitle.revenue",
  "drawer.impactSubtitle.retention",
  "drawer.impactSubtitle.risk",
  "drawer.confidenceLabel",
  "drawer.confidence.high",
  "drawer.confidence.medium",
  "drawer.confidence.low",
] as const);

const impactSubtitle = computed(() => {
  const impactType = opportunity.value.impact?.impactType ?? "revenue";
  const key = `drawer.impactSubtitle.${impactType}` as keyof typeof copy.value;
  if (impactRangeText.value && key in copy.value) {
    return copy.value[key];
  }
  return opportunity.value.impact.displayText;
});

const confidenceLabel = computed(() => {
  const map = {
    high: copy.value["drawer.confidence.high"],
    medium: copy.value["drawer.confidence.medium"],
    low: copy.value["drawer.confidence.low"],
  };
  const confidence = opportunity.value.impact?.confidence ?? "medium";
  return map[confidence] ?? confidence;
});

const confidenceBadgeText = computed(() =>
  copy.value["drawer.confidenceLabel"].replace("{level}", confidenceLabel.value),
);

const confidenceClass = computed(() => {
  const map: Record<string, string> = {
    high: "bg-emerald-50 text-emerald-800",
    medium: "bg-amber-50 text-amber-800",
    low: "bg-slate-100 text-slate-600",
  };
  return map[opportunity.value.impact?.confidence ?? "medium"] ?? map.medium;
});

const confidenceIconClass = computed(() => {
  const map: Record<string, string> = {
    high: "text-emerald-600",
    medium: "text-amber-600",
    low: "text-slate-500",
  };
  return map[opportunity.value.impact?.confidence ?? "medium"] ?? map.medium;
});
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-center gap-1.5">
      <h3 class="text-sm font-semibold text-slate-900">
        {{ copy["drawer.impact"] }}
      </h3>
      <FaIcon icon="fa-circle-info" size="xs" class="text-slate-400" />
    </div>

    <p class="mt-1 text-xs text-slate-500">
      {{ impactSubtitle }}
    </p>

    <p
      v-if="impactRangeText"
      class="mt-3 text-2xl font-bold tabular-nums"
      :class="opportunity.impact.impactType === 'risk' ? 'text-rose-600' : 'text-emerald-600'"
    >
      {{ impactRangeText }}
    </p>
    <p
      v-else
      class="mt-3 text-base font-semibold leading-snug text-slate-800"
    >
      {{ opportunity.impact.displayText }}
    </p>

    <span
      class="mt-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
      :class="confidenceClass"
    >
      <FaIcon icon="fa-chart-column" size="xs" :class="confidenceIconClass" />
      {{ confidenceBadgeText }}
    </span>
  </section>
</template>
