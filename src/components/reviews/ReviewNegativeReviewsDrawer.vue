<template>
  <Teleport to="body">
    <div
      class="review-drawer fixed inset-0 z-[10003] flex justify-end"
      @keydown="onKeydown"
    >
      <button
        type="button"
        class="absolute inset-0 bg-slate-900/30"
        :aria-label="closeLabel"
        @click="emit('close')"
      />
      <aside
        class="relative flex h-full w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <header class="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <h2 class="text-base font-semibold text-slate-900">{{ title }}</h2>
          <button
            type="button"
            class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            :aria-label="closeLabel"
            @click="emit('close')"
          >
            <FaIcon icon="fa-xmark" size="sm" />
          </button>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <ul v-if="reviews.length > 0" class="flex flex-col gap-3">
            <ReviewNegativeReviewItem
              v-for="review in reviews"
              :key="review.id"
              :review="review"
            />
          </ul>
          <p v-else class="text-sm text-slate-400">{{ emptyLabel }}</p>
        </div>
      </aside>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import ReviewNegativeReviewItem from "@/components/reviews/ReviewNegativeReviewItem.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";

defineProps<{
  title: string;
  reviews: Array<{
    id: string;
    productName: string;
    rating: number;
    content: string;
    date: string;
  }>;
}>();

const emit = defineEmits<{
  close: [];
}>();

const closeLabel = useLocalizedString("common", "close");
const emptyLabel = useLocalizedString("reviews", "detail.noNegativeReviews");

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") emit("close");
}
</script>
