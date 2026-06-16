<template>
  <section class="flex flex-col gap-3">
    <p class="text-sm text-slate-600">
      {{ additionalLabel }}
    </p>
    <LockedFeatureCard
      v-for="(preview, index) in previews"
      :key="`${preview.type}-${index}`"
      :title="preview.title"
    />
    <UpgradeCtaCard
      :title="ctaTitle"
      :description="ctaDescription"
      :cta-label="ctaButton"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import LockedFeatureCard from "@/components/shared/LockedFeatureCard.vue";
import UpgradeCtaCard from "@/components/shared/UpgradeCtaCard.vue";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import { formatLocaleTemplate } from "@/utils/formatLocaleTemplate";
import type { OpportunityLockedPreview } from "@/types/opportunities";

const props = defineProps<{
  lockedCount: number;
  previews: OpportunityLockedPreview[];
}>();

const copy = useReactiveLocaleStringRecord("upgrade", [
  "opportunities.additionalDetected",
  "opportunities.unlockAllTitle",
  "opportunities.unlockAllDescription",
  "opportunities.unlockAllCta",
] as const);

const additionalLabel = computed(() =>
  formatLocaleTemplate(copy.value["opportunities.additionalDetected"], {
    count: props.lockedCount,
  }),
);

const ctaTitle = computed(() => copy.value["opportunities.unlockAllTitle"]);
const ctaDescription = computed(() => copy.value["opportunities.unlockAllDescription"]);
const ctaButton = computed(() => copy.value["opportunities.unlockAllCta"]);
</script>
