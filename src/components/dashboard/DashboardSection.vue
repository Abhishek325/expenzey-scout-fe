<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  id?: string;
  sectionId?: string;
  title?: string;
}>();

const sectionId = computed(() => props.id ?? props.sectionId ?? "");
</script>

<template>
  <section v-if="sectionId" :id="sectionId" class="scroll-mt-6">
    <h2 v-if="title" class="mb-4 text-lg font-semibold text-slate-900">{{ title }}</h2>
    <slot />
  </section>
  <div v-else>
    <slot />
  </div>
</template>
