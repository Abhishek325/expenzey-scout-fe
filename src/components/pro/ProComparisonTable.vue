<template>
  <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div class="grid grid-cols-3 border-b border-slate-200">
      <div class="px-6 py-5">
        <h2 class="text-lg font-semibold text-slate-900">{{ copy.comparisonTitle }}</h2>
      </div>
      <div class="border-l border-slate-200 px-4 py-5 text-center">
        <p class="text-base font-semibold text-slate-900">{{ copy.freePlan }}</p>
        <p class="mt-0.5 text-sm text-slate-500">{{ copy.freePlanSubtitle }}</p>
      </div>
      <div
        class="flex flex-col items-center justify-center border-l border-expenzey-200 bg-expenzey-50 px-4 py-5 text-center"
      >
        <p class="text-base font-semibold text-expenzey-700">{{ copy.proPlan }}</p>
        <span
          class="mt-1.5 inline-flex rounded-full bg-expenzey-600 px-2.5 py-0.5 text-xs font-medium text-white"
        >
          {{ copy.proPlanBadge }}
        </span>
      </div>
    </div>

    <div
      v-for="(feature, index) in features"
      :key="feature.id"
      class="grid grid-cols-3 border-b border-slate-100 last:border-b-0"
      :class="index % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'"
    >
      <div class="flex items-start gap-3 px-6 py-4">
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600"
          aria-hidden="true"
        >
          <FaIcon :icon="feature.icon" size="sm" />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-slate-900">{{ featureTitle(feature.id) }}</p>
          <p class="mt-0.5 text-xs text-slate-500">{{ featureDescription(feature.id) }}</p>
        </div>
      </div>
      <div class="flex items-center justify-center border-l border-slate-200 px-4 py-4 text-center text-sm text-slate-600">
        <span>{{ featureFree(feature.id) }}</span>
      </div>
      <div
        class="flex items-center justify-center gap-2 border-l border-expenzey-200 bg-expenzey-50 px-4 py-4 text-center text-sm font-medium text-slate-700"
      >
        <FaIcon
          icon="fa-circle-check"
          size="base"
          icon-class="shrink-0 text-expenzey-600"
        />
        <span>{{ featurePro(feature.id) }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { inject } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import comparisonFeatures from "@/data/pro/comparison-features.json";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";

interface ComparisonFeature {
  id: string;
  icon: string;
}

const features = comparisonFeatures as ComparisonFeature[];

const stringService = inject(STRING_SERVICE_KEY) as IStringService;

const copy = useReactiveLocaleStringRecord("pro", [
  "comparisonTitle",
  "freePlan",
  "freePlanSubtitle",
  "proPlan",
  "proPlanBadge",
] as const);

function featureTitle(id: string) {
  return stringService.getStrings("pro", `features.${id}.title`);
}

function featureDescription(id: string) {
  return stringService.getStrings("pro", `features.${id}.description`);
}

function featureFree(id: string) {
  return stringService.getStrings("pro", `features.${id}.free`);
}

function featurePro(id: string) {
  return stringService.getStrings("pro", `features.${id}.pro`);
}
</script>
