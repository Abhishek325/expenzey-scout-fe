<template>
  <span class="inline-flex items-center gap-0.5" :aria-label="ariaLabel">
    <FaIcon
      v-for="star in 5"
      :key="star"
      icon="fa-star"
      size="xs"
      :icon-class="star <= filledStars ? 'text-amber-500' : 'text-slate-300'"
    />
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";

const props = defineProps<{
  rating: number;
}>();

const filledStars = computed(() => Math.max(0, Math.min(5, Math.round(props.rating))));

const ariaLabel = computed(() => `${filledStars.value} out of 5 stars`);
</script>
