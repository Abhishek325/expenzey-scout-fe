<template>
  <section
    class="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 text-center shadow-sm"
  >
    <div
      class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700"
      aria-hidden="true"
    >
      <FaIcon icon="fa-lock" size="sm" />
    </div>
    <h3 class="text-sm font-semibold text-slate-900">{{ title }}</h3>
    <p v-if="description" class="mt-2 text-sm text-slate-600">{{ description }}</p>
    <button
      type="button"
      class="mt-4 inline-flex items-center justify-center rounded-lg bg-expenzey-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-expenzey-700"
      @click="onCta"
    >
      {{ ctaLabel }}
    </button>
  </section>
</template>

<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import { usePlan } from "@/composables/usePlan";

defineProps<{
  title: string;
  description?: string;
  ctaLabel: string;
}>();

const { goToUpgrade } = usePlan();

function onCta() {
  goToUpgrade();
}
</script>
