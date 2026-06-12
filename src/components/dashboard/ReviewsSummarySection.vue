<script setup lang="ts">
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";

const copy = useReactiveLocaleStringRecord("reviews", [
  "title",
  "avgRating",
  "reviewStub",
] as const);

const stubReviews = [
  { id: 1, author: "Jordan P.", rating: 5 },
  { id: 2, author: "Sam R.", rating: 4 },
  { id: 3, author: "Taylor M.", rating: 5 },
];
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 class="text-sm font-semibold text-slate-900">{{ copy.title }}</h3>
    <div class="mt-4 flex items-center gap-3">
      <span class="text-3xl font-bold text-expenzey-600">4.8</span>
      <div>
        <p class="text-sm font-medium text-slate-700">{{ copy.avgRating }}</p>
        <p class="text-amber-500" aria-hidden="true">★★★★★</p>
      </div>
    </div>
    <ul class="mt-5 space-y-3">
      <li
        v-for="review in stubReviews"
        :key="review.id"
        class="rounded-lg border border-slate-100 bg-slate-50/50 p-3"
      >
        <div class="flex items-center justify-between text-sm">
          <span class="font-medium text-slate-800">{{ review.author }}</span>
          <span class="text-amber-500">{{ "★".repeat(review.rating) }}</span>
        </div>
        <p class="mt-1 text-sm text-slate-600">{{ copy.reviewStub }}</p>
      </li>
    </ul>
  </section>
</template>
