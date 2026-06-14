<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import { useOpportunityInvestigationContext } from "@/composables/opportunities/useOpportunityInvestigation";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";

const { opportunity, comparisonCards, insightBanner } = useOpportunityInvestigationContext();

const copy = useReactiveLocaleStringRecord("opportunities", [
  "drawer.whyDetected",
  "drawer.currentPeriod",
  "drawer.currentRevenue",
  "drawer.previousPeriod",
  "drawer.previousRevenue",
  "drawer.growth",
  "drawer.revenueShare",
  "drawer.coPurchaseRate",
  "drawer.smallerProductRevenue",
  "drawer.combinedOrders",
] as const);

const CARD_LABELS: Record<string, string> = {
  current: "drawer.currentPeriod",
  previous: "drawer.previousPeriod",
  growth: "drawer.growth",
  revenueShare: "drawer.revenueShare",
  coPurchase: "drawer.coPurchaseRate",
  smallerRevenue: "drawer.smallerProductRevenue",
};

const TONE_CLASSES = {
  positive: "text-emerald-600",
  negative: "text-rose-600",
  neutral: "text-slate-700",
} as const;

function cardLabel(card: { id: string; label: string }): string {
  if (card.label.startsWith("drawer.")) {
    return copy.value[card.label as keyof typeof copy.value] ?? card.label;
  }
  const key = CARD_LABELS[card.id];
  if (!key) return card.label;
  return copy.value[key as keyof typeof copy.value] ?? card.label;
}
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 class="text-sm font-semibold text-slate-900">
      {{ copy["drawer.whyDetected"] }}
    </h3>
    <p class="mt-2 text-sm leading-relaxed text-slate-600">
      {{ opportunity.detection.summary }}
    </p>

    <div
      v-if="comparisonCards.length > 0"
      class="mt-4 grid gap-3"
      :class="comparisonCards.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'"
    >
      <div
        v-for="card in comparisonCards"
        :key="card.id"
        class="rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-3"
      >
        <p class="text-xs font-medium text-slate-500">
          {{ cardLabel(card) }}
        </p>
        <p
          class="mt-1 text-lg font-semibold tabular-nums"
          :class="card.tone ? TONE_CLASSES[card.tone] : 'text-slate-900'"
        >
          {{ card.value }}
        </p>
      </div>
    </div>

    <p
      v-if="insightBanner"
      class="mt-4 flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800"
    >
      <FaIcon icon="fa-arrow-trend-up" size="xs" class="mt-0.5 shrink-0 text-emerald-600" />
      <span>{{ insightBanner }}</span>
    </p>
  </section>
</template>
