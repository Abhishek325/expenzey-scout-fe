<template>
  <li class="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
    <div class="flex items-center justify-between gap-2">
      <ReviewStarRating :rating="review.rating" />
      <span class="text-xs text-slate-500">{{ formatReviewDate(review.date) }}</span>
    </div>
    <p class="mt-2 text-sm leading-relaxed text-slate-700">{{ review.content }}</p>
  </li>
</template>

<script setup lang="ts">
import ReviewStarRating from "@/components/reviews/ReviewStarRating.vue";
import { formatReviewDate } from "@/utils/reviewDetailUtils";

defineProps<{
  review: {
    id: string;
    productName: string;
    rating: number;
    content: string;
    date: string;
  };
}>();
</script>
