<template>
  <div class="flex min-h-full flex-col gap-6 pb-10">
    <header class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-xl font-semibold text-slate-900">{{ title }}</h1>
        <p class="mt-1 text-sm text-slate-500">{{ subtitle }}</p>
      </div>
      <DateRangePicker />
    </header>

    <p v-if="loading" class="text-sm text-slate-500">{{ loadingLabel }}</p>
    <div v-else-if="error" class="flex items-center gap-3 text-sm text-rose-600">
      <span>{{ errorLabel }}</span>
      <button type="button" class="font-medium underline" @click="reload">{{ retryLabel }}</button>
    </div>
    <div
      v-else-if="!hasData"
      class="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center"
    >
      <h2 class="text-sm font-semibold text-slate-900">{{ emptyTitle }}</h2>
      <p class="mt-2 text-sm text-slate-500">{{ emptyDescription }}</p>
    </div>
    <template v-else-if="data">
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ReviewSentimentSummaryCard
          :label="overallSentimentLabel"
          :positive-percent="data.sentiment.positive"
          :review-count="data.totalReviews"
        />
        <ReviewThemeMentionList
          :title="topPositiveMentionsLabel"
          variant="positive"
          :items="positiveThemes"
        />
        <ReviewThemeMentionList
          :title="topComplaintsLabel"
          variant="complaint"
          :items="complaintThemes"
        />
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <ReviewSentimentTrendChart
          :title="sentimentTrendLabel"
          :points="data.sentimentTrend ?? []"
        />
        <ReviewSentimentBreakdownChart
          :title="sentimentBreakdownLabel"
          :sentiment="data.sentiment"
        />
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ReviewThemeTable
          :title="topPositiveThemesLabel"
          variant="positive"
          :rows="positiveThemeRows"
        />
        <ReviewThemeTable
          :title="topComplaintThemesLabel"
          variant="complaint"
          :rows="complaintThemeRows"
        />
        <ReviewNegativeReviewsPanel
          :title="recentNegativeReviewsLabel"
          :reviews="data.recentNegativeReviews ?? []"
          @view-all="negativeReviewsDrawerOpen = true"
        />
      </div>

      <ReviewNegativeReviewsDrawer
        v-if="negativeReviewsDrawerOpen"
        :title="recentNegativeReviewsLabel"
        :reviews="data.recentNegativeReviews ?? []"
        @close="negativeReviewsDrawerOpen = false"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import DateRangePicker from "@/components/shared/DateRangePicker.vue";
import ReviewNegativeReviewsDrawer from "@/components/reviews/ReviewNegativeReviewsDrawer.vue";
import ReviewNegativeReviewsPanel from "@/components/reviews/ReviewNegativeReviewsPanel.vue";
import ReviewSentimentBreakdownChart from "@/components/reviews/ReviewSentimentBreakdownChart.vue";
import ReviewSentimentSummaryCard from "@/components/reviews/ReviewSentimentSummaryCard.vue";
import ReviewSentimentTrendChart from "@/components/reviews/ReviewSentimentTrendChart.vue";
import ReviewThemeMentionList from "@/components/reviews/ReviewThemeMentionList.vue";
import ReviewThemeTable from "@/components/reviews/ReviewThemeTable.vue";
import { useReviewIntelligencePage } from "@/composables/reviews/useReviewIntelligencePage";
import { useLocalizedString } from "@/composables/useLocalizedString";

const {
  loading,
  error,
  data,
  hasData,
  positiveThemes,
  complaintThemes,
  reload,
} = useReviewIntelligencePage();

const negativeReviewsDrawerOpen = ref(false);

const title = useLocalizedString("reviews", "detail.title");
const subtitleRaw = useLocalizedString("reviews", "detail.subtitle");
const loadingLabel = useLocalizedString("common", "loading");
const errorLabel = useLocalizedString("common", "error");
const retryLabel = useLocalizedString("common", "retry");
const emptyTitle = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.empty.title");
const emptyDescription = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.empty.description");
const overallSentimentLabel = useLocalizedString("reports", "sections.overallSentiment");
const topPositiveMentionsLabel = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.topPositiveMentions");
const topComplaintsLabel = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.topComplaints");
const sentimentTrendLabel = useLocalizedString("reviews", "detail.sentimentTrend");
const sentimentBreakdownLabel = useLocalizedString("reviews", "detail.sentimentBreakdown");
const topPositiveThemesLabel = useLocalizedString("reviews", "detail.topPositiveThemes");
const topComplaintThemesLabel = useLocalizedString("reviews", "detail.topComplaintThemes");
const recentNegativeReviewsLabel = useLocalizedString("reviews", "detail.recentNegativeReviews");

const subtitle = computed(() =>
  subtitleRaw.value.replace("{count}", String(data.value?.totalReviews ?? 0)),
);

const positiveThemeRows = computed(() =>
  positiveThemes.value.map((entry) => ({
    theme: entry.theme,
    label: entry.label,
    count: entry.count,
    percent: entry.percentOfPositive,
  })),
);

const complaintThemeRows = computed(() =>
  complaintThemes.value.map((entry) => ({
    theme: entry.theme,
    label: entry.label,
    count: entry.count,
    percent: entry.percentOfNegative,
  })),
);
</script>
