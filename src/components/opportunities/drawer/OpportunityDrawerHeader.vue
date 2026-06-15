<template>
  <div class="shrink-0 border-b border-slate-200 bg-white px-6 py-5">
    <div class="flex items-start justify-between gap-4">
      <div class="flex min-w-0 items-start gap-3">
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          :class="typeIconClass"
        >
          <FaIcon :icon="typeIcon" size="sm" />
        </div>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              :class="style.labelClass"
            >
              <FaIcon :icon="style.badgeIcon" size="xs" />
              {{ opportunity.badge }}
            </span>
            <span
              class="inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              :class="typeIconClass"
            >
              {{ typeLabel }}
            </span>
            <span class="text-[11px] text-slate-500">
              {{ detectedLabel }}
            </span>
          </div>
          <h2 class="mt-2 text-xl font-semibold leading-snug text-slate-900">
            {{ opportunity.title }}
          </h2>
        </div>
      </div>
      <button
        type="button"
        class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        :aria-label="closeLabel"
        @click="emit('close')"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { computed } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import { useLocalizedString, useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import type { OpportunityDetail } from "@/types/ai";
import {
  TYPE_ICON_CLASSES,
  TYPE_ICONS,
  badgeStyle,
} from "@/utils/opportunityStyles";

const props = defineProps<{
  opportunity: OpportunityDetail;
}>();

const emit = defineEmits<{
  close: [];
}>();

const copy = useReactiveLocaleStringRecord("opportunities", [
  "drawer.detectedToday",
  "drawer.detectedOn",
  "types.risingProduct",
  "types.decliningProduct",
  "types.bundleOpportunity",
  "types.customerRetention",
  "types.reviewComplaint",
] as const);

const closeLabel = useLocalizedString("common", "close");

const TYPE_LABEL_KEYS: Record<string, keyof typeof copy.value> = {
  rising_product: "types.risingProduct",
  declining_product: "types.decliningProduct",
  bundle_opportunity: "types.bundleOpportunity",
  customer_retention: "types.customerRetention",
  review_complaint: "types.reviewComplaint",
};

const style = computed(() => badgeStyle(props.opportunity.badge));
const typeIcon = computed(() => TYPE_ICONS[props.opportunity.type] ?? "fa-lightbulb");
const typeIconClass = computed(
  () => TYPE_ICON_CLASSES[props.opportunity.type] ?? "text-slate-600 bg-slate-100",
);
const typeLabel = computed(() => {
  const key = TYPE_LABEL_KEYS[props.opportunity.type];
  if (key) return copy.value[key] ?? props.opportunity.type;
  return props.opportunity.type;
});

const detectedLabel = computed(() => {
  const detected = dayjs(props.opportunity.generatedAt);
  const now = dayjs();

  if (detected.isSame(now, "day")) {
    return copy.value["drawer.detectedToday"].replace("{time}", detected.format("h:mm A"));
  }

  return copy.value["drawer.detectedOn"]
    .replace("{date}", detected.format("MMM D, YYYY"))
    .replace("{time}", detected.format("h:mm A"));
});
</script>
