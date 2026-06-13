<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";

const positivePercent = 87;
const reviewCount = 42;

const positiveMentions = ["Fast delivery", "Product quality", "Great customer service"];
const complaints = ["Packaging damage", "Delivery delays"];
</script>

<template>
  <section class="flex h-full min-h-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
    <div class="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
      <h3 class="text-sm font-semibold text-slate-900">Review Intelligence</h3>
      <RouterLink
        to="/reports"
        class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-expenzey-600 transition hover:border-expenzey-200 hover:bg-expenzey-50"
      >
        View Details
      </RouterLink>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto p-4">
      <div class="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <!-- Overall sentiment -->
        <div class="flex flex-col rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
          <p class="text-xs font-medium text-slate-600">Overall Sentiment</p>
          <div class="mt-3 flex items-center gap-3">
            <div class="relative h-[4.5rem] w-[4.5rem] shrink-0">
              <svg viewBox="0 0 36 36" class="h-full w-full -rotate-90" aria-hidden="true">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#d1fae5" stroke-width="3.2" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#22c55e"
                  stroke-width="3.2"
                  :stroke-dasharray="`${positivePercent} ${100 - positivePercent}`"
                  stroke-linecap="round"
                />
              </svg>
              <span
                class="absolute inset-0 flex items-center justify-center text-emerald-600"
                aria-hidden="true"
              >
                <FaIcon icon="fa-face-smile" size="lg" />
              </span>
            </div>
            <div>
              <p class="text-2xl font-bold leading-none text-emerald-600">{{ positivePercent }}%</p>
              <p class="mt-1 text-sm font-medium text-emerald-600">Positive</p>
            </div>
          </div>
          <p class="mt-auto pt-4 text-xs text-slate-500">{{ reviewCount }} reviews analyzed</p>
        </div>

        <!-- Mentions -->
        <div class="flex flex-col justify-center gap-5 py-1">
          <div>
            <p class="text-xs font-semibold text-emerald-600">Top Positive Mentions</p>
            <ul class="mt-2.5 space-y-2">
              <li
                v-for="mention in positiveMentions"
                :key="mention"
                class="flex items-center gap-2.5 text-sm text-slate-700"
              >
                <span
                  class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
                  aria-hidden="true"
                >
                  <FaIcon icon="fa-check" size="xs" />
                </span>
                {{ mention }}
              </li>
            </ul>
          </div>

          <div>
            <p class="text-xs font-semibold text-rose-500">Top Complaints</p>
            <ul class="mt-2.5 space-y-2">
              <li
                v-for="complaint in complaints"
                :key="complaint"
                class="flex items-center gap-2.5 text-sm text-slate-700"
              >
                <span
                  class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white"
                  aria-hidden="true"
                >
                  <FaIcon icon="fa-exclamation" size="xs" />
                </span>
                {{ complaint }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
