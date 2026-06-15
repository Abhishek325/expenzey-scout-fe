<template>
  <DashboardCard
    :title="title"
    :loading="loading"
    :error="error"
    :has-data="hasData"
    :empty-label="emptyLabel"
    :action="viewDetailsAction"
    :body-class="`!p-2 ${REVIEW_INTELLIGENCE_CARD_BODY_HEIGHT}`"
    @retry="reload"
  >
    <template #empty>
      <ReviewIntelligenceEmptyState />
    </template>

    <div class="grid gap-3 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div class="flex flex-col rounded-lg border border-emerald-100 bg-emerald-50/60 p-2.5">
        <p class="text-xs font-medium text-slate-600">{{ overallSentiment }}</p>
        <div class="mt-2 flex items-center gap-2.5">
          <div class="relative h-12 w-12 shrink-0">
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

      <div class="flex flex-col justify-center gap-2.5">
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
  </DashboardCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import DashboardCard from "@/components/shared/DashboardCard.vue";
import ReviewIntelligenceEmptyState from "@/components/dashboard/ReviewIntelligenceEmptyState.vue";
import { REVIEW_INTELLIGENCE_CARD_BODY_HEIGHT } from "@/constants/dashboardRowHeights";
import { useReviewIntelligence } from "@/composables/dashboard/useReviewIntelligence";
import { useLocalizedString } from "@/composables/useLocalizedString";

const {
  loading,
  error,
  hasData,
  positivePercent,
  reviewCount,
  positiveMentions,
  complaints,
  reload,
} = useReviewIntelligence();
const emptyLabel = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.empty.title");
const viewDetails = useLocalizedString("common", "viewDetails");
const title = useLocalizedString("dashboard", "aiInsights.reviewIntelligenceTitle");
const overallSentiment = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.overallSentiment");
const positiveLabel = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.positive");
const reviewsAnalyzed = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.reviewsAnalyzed");
const topPositiveMentions = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.topPositiveMentions");
const topComplaints = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.topComplaints");

const viewDetailsAction = computed(() => ({
  kind: "link" as const,
  to: "/reports",
  label: viewDetails.value,
}));
</script>
