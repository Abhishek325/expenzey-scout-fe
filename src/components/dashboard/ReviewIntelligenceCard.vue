<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import { useReviewIntelligence } from "@/composables/dashboard/useReviewIntelligence";
import { useLocalizedString } from "@/composables/useLocalizedString";

const { loading, error, positivePercent, reviewCount, positiveMentions, complaints, hasData, reload } =
  useReviewIntelligence();
const loadingLabel = useLocalizedString("common", "loading");
const errorLabel = useLocalizedString("common", "error");
const retryLabel = useLocalizedString("common", "retry");
const emptyLabel = useLocalizedString("dashboard", "aiInsights.reviewsEmpty");
const viewDetails = useLocalizedString("common", "viewDetails");
const title = useLocalizedString("dashboard", "aiInsights.reviewIntelligenceTitle");
const overallSentiment = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.overallSentiment");
const positiveLabel = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.positive");
const reviewsAnalyzed = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.reviewsAnalyzed");
const topPositiveMentions = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.topPositiveMentions");
const topComplaints = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.topComplaints");
</script>

<template>
  <section class="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div class="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-2.5">
      <h3 class="text-sm font-semibold text-slate-900">{{ title }}</h3>
      <RouterLink to="/reports" class="card-header-action">
        {{ viewDetails }}
      </RouterLink>
    </div>

    <div class="p-3">
      <p v-if="loading" class="text-sm text-slate-500">{{ loadingLabel }}</p>
      <div v-else-if="error" class="flex items-center gap-3 text-sm text-rose-600">
        <span>{{ errorLabel }}</span>
        <button type="button" class="font-medium underline" @click="reload">{{ retryLabel }}</button>
      </div>
      <p v-else-if="!hasData" class="text-sm text-slate-500">{{ emptyLabel }}</p>
      <div v-else class="grid gap-3 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div class="flex flex-col rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
          <p class="text-xs font-medium text-slate-600">{{ overallSentiment }}</p>
          <div class="mt-2 flex items-center gap-2.5">
            <div class="relative h-14 w-14 shrink-0">
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
                <FaIcon icon="fa-face-smile" size="sm" />
              </span>
            </div>
            <div>
              <p class="text-xl font-bold leading-none text-emerald-600">{{ positivePercent }}%</p>
              <p class="mt-0.5 text-xs font-medium text-emerald-600">{{ positiveLabel }}</p>
            </div>
          </div>
          <p class="mt-2 text-[11px] text-slate-500">{{ reviewCount }} {{ reviewsAnalyzed }}</p>
        </div>

        <div class="flex flex-col justify-center gap-3">
          <div v-if="positiveMentions.length > 0">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">{{ topPositiveMentions }}</p>
            <ul class="mt-1.5 space-y-1.5">
              <li
                v-for="mention in positiveMentions.slice(0, 3)"
                :key="mention"
                class="flex items-center gap-2 text-xs text-slate-700"
              >
                <span
                  class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
                  aria-hidden="true"
                >
                  <FaIcon icon="fa-check" size="xs" />
                </span>
                {{ mention }}
              </li>
            </ul>
          </div>

          <div v-if="complaints.length > 0">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-rose-500">{{ topComplaints }}</p>
            <ul class="mt-1.5 space-y-1.5">
              <li
                v-for="complaint in complaints.slice(0, 3)"
                :key="complaint"
                class="flex items-center gap-2 text-xs text-slate-700"
              >
                <span
                  class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white"
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
