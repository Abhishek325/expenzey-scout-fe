<template>
  <article class="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
    <div class="flex items-center justify-between gap-3">
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ title }}</p>
      <button
        v-if="reviews.length > previewCount"
        type="button"
        class="text-xs font-medium text-indigo-600 hover:text-indigo-700"
        @click="emit('viewAll')"
      >
        {{ viewAllLabel }}
      </button>
    </div>

    <ul class="mt-3 flex flex-1 flex-col gap-3">
      <ReviewNegativeReviewItem
        v-for="review in previewReviews"
        :key="review.id"
        :review="review"
      />
    </ul>

    <p v-if="reviews.length === 0" class="mt-3 text-sm text-slate-400">{{ emptyLabel }}</p>

    <button
      v-if="reviews.length > previewCount"
      type="button"
      class="mt-4 w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
      @click="emit('viewAll')"
    >
      {{ viewAllNegativeLabel }}
    </button>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ReviewNegativeReviewItem from "@/components/reviews/ReviewNegativeReviewItem.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";

const props = withDefaults(
  defineProps<{
    title: string;
    reviews: Array<{
      id: string;
      productName: string;
      rating: number;
      content: string;
      date: string;
    }>;
    previewCount?: number;
  }>(),
  { previewCount: 2 },
);

const emit = defineEmits<{
  viewAll: [];
}>();

const emptyLabel = useLocalizedString("reviews", "detail.noNegativeReviews");
const viewAllNegativeLabel = useLocalizedString("reviews", "detail.viewAllNegative");
const viewAllCountRaw = useLocalizedString("reviews", "detail.viewAllCount");

const viewAllLabel = computed(() =>
  viewAllCountRaw.value.replace("{count}", String(props.reviews.length)),
);

const previewReviews = computed(() => props.reviews.slice(0, props.previewCount));
</script>
