<script setup lang="ts">
import { computed } from "vue";
import { useOpportunityInvestigationContext } from "@/composables/opportunities/useOpportunityInvestigation";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";

const { highlightedEvidence, revenueShareRing, typeFocusKey } =
  useOpportunityInvestigationContext();

const copy = useReactiveLocaleStringRecord("opportunities", [
  "drawer.evidence",
  "drawer.revenueShare",
  "drawer.revenueShareOfTotal",
  "drawer.typeFocus.risingProduct",
  "drawer.typeFocus.bundleOpportunity",
  "drawer.typeFocus.decliningProduct",
  "drawer.typeFocus.customerRetention",
  "drawer.typeFocus.reviewComplaint",
  "drawer.evidenceEmpty",
] as const);

const typeFocusCopy = computed(() => {
  if (!typeFocusKey.value) return null;
  return copy.value[typeFocusKey.value as keyof typeof copy.value] ?? null;
});

const gridEvidence = computed(() =>
  highlightedEvidence.value.filter(
    (item) => !item.label.toLowerCase().includes("revenue share"),
  ),
);

const ringStyle = computed(() => {
  if (!revenueShareRing.value) return null;
  const percent = revenueShareRing.value.percent;
  return {
    background: `conic-gradient(#10b981 ${percent}%, #e2e8f0 ${percent}% 100%)`,
  };
});

const TREND_CLASSES: Record<string, string> = {
  up: "text-emerald-600 bg-emerald-50",
  down: "text-rose-600 bg-rose-50",
  neutral: "text-slate-600 bg-slate-100",
};
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 class="text-sm font-semibold text-slate-900">
      {{ copy["drawer.evidence"] }}
    </h3>
    <p v-if="typeFocusCopy" class="mt-1 text-xs leading-relaxed text-slate-500">
      {{ typeFocusCopy }}
    </p>

    <p v-if="highlightedEvidence.length === 0" class="mt-4 text-sm text-slate-500">
      {{ copy["drawer.evidenceEmpty"] }}
    </p>

    <div v-else class="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
      <div
        v-if="revenueShareRing && ringStyle"
        class="flex shrink-0 flex-col items-center rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-4 sm:w-36"
      >
        <div
          class="flex h-20 w-20 items-center justify-center rounded-full"
          :style="ringStyle"
        >
          <div class="flex h-14 w-14 flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
            <span class="text-sm font-bold tabular-nums text-emerald-700">
              {{ revenueShareRing.percent }}%
            </span>
          </div>
        </div>
        <p class="mt-2 text-xs font-semibold text-slate-700">
          {{ copy["drawer.revenueShare"] }}
        </p>
        <p class="text-[10px] text-slate-500">
          {{ copy["drawer.revenueShareOfTotal"] }}
        </p>
      </div>

      <div
        class="min-w-0 flex-1 grid gap-3"
        :class="gridEvidence.length >= 3 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'"
      >
        <div
          v-for="(item, idx) in gridEvidence"
          :key="idx"
          class="rounded-lg border border-slate-100 bg-white p-3"
        >
          <p class="text-xs font-medium text-slate-500">{{ item.label }}</p>
          <p class="mt-0.5 text-base font-semibold text-slate-900">{{ item.value }}</p>
          <span
            v-if="item.trend"
            class="mt-1.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium"
            :class="TREND_CLASSES[item.trendDirection ?? 'neutral']"
          >
            {{ item.trend }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
