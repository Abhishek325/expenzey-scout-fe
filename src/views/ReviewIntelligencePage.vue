<template>
  <div class="flex min-h-full flex-col gap-6 pb-10">
    <header class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="min-w-0">
        <RouterLink
          v-if="backToReportLink"
          :to="backToReportLink"
          class="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-700"
        >
          <span aria-hidden="true">←</span>
          {{ backToReportLabel }}
        </RouterLink>
        <h1 class="text-xl font-semibold text-slate-900">{{ title }}</h1>
        <p class="mt-1 text-sm text-slate-500">{{ subtitle }}</p>
      </div>
      <DateRangePicker />
    </header>

    <div v-if="loading" class="space-y-4">
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <WidgetSkeleton variant="card" :row-count="3" />
        <WidgetSkeleton variant="card" :row-count="3" />
        <WidgetSkeleton variant="card" :row-count="3" />
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <WidgetSkeleton variant="chart" />
        <WidgetSkeleton variant="chart" />
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <WidgetSkeleton variant="table" :row-count="6" :columns="themeTableSkeletonColumns" />
        <WidgetSkeleton variant="table" :row-count="6" :columns="themeTableSkeletonColumns" />
        <WidgetSkeleton variant="list" :row-count="3" />
      </div>
    </div>
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

      <div v-if="isPro" class="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <ReviewSentimentTrendChart
          :title="sentimentTrendLabel"
          :points="data.sentimentTrend ?? []"
        />
        <ReviewSentimentBreakdownChart
          :title="sentimentBreakdownLabel"
          :sentiment="data.sentiment"
        />
      </div>

      <UpgradeCtaCard
        v-else
        :title="reviewsHistoryTitle"
        :description="reviewsHistoryDescription"
        :cta-label="reviewsHistoryCta"
      />

      <div v-if="isPro" class="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
import { useRoute } from "vue-router";
import { reportDetailPath } from "@/constants/routes";
import DateRangePicker from "@/components/shared/DateRangePicker.vue";
import ReviewNegativeReviewsDrawer from "@/components/reviews/ReviewNegativeReviewsDrawer.vue";
import ReviewNegativeReviewsPanel from "@/components/reviews/ReviewNegativeReviewsPanel.vue";
import ReviewSentimentBreakdownChart from "@/components/reviews/ReviewSentimentBreakdownChart.vue";
import ReviewSentimentSummaryCard from "@/components/reviews/ReviewSentimentSummaryCard.vue";
import ReviewSentimentTrendChart from "@/components/reviews/ReviewSentimentTrendChart.vue";
import ReviewThemeMentionList from "@/components/reviews/ReviewThemeMentionList.vue";
import ReviewThemeTable from "@/components/reviews/ReviewThemeTable.vue";
import WidgetSkeleton from "@/components/shared/skeleton/WidgetSkeleton.vue";
import UpgradeCtaCard from "@/components/shared/UpgradeCtaCard.vue";
import { useReviewIntelligencePage } from "@/composables/reviews/useReviewIntelligencePage";
import { usePlan } from "@/composables/usePlan";
import { useLocalizedString, useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import type { DataTableColumn } from "@/components/shared/DataTable.vue";

const {
  loading,
  error,
  data,
  hasData,
  positiveThemes,
  complaintThemes,
  reload,
} = useReviewIntelligencePage();

const { isPro } = usePlan();

const reviewsUpgradeCopy = useReactiveLocaleStringRecord("upgrade", [
  "reviews.historyCta",
  "reviews.historyDescription",
] as const);

const reviewsHistoryTitle = computed(() => "Need deeper review trends?");
const reviewsHistoryDescription = computed(() => reviewsUpgradeCopy.value["reviews.historyDescription"]);
const reviewsHistoryCta = computed(() => reviewsUpgradeCopy.value["reviews.historyCta"]);

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
const backToReportLabel = useLocalizedString("reports", "columns.viewReport");
const subtitleLoadingLabel = useLocalizedString("reviews", "detail.subtitleLoading");

const route = useRoute();
const backToReportLink = computed(() => {
  const fromReportId = route.query.fromReportId;
  if (typeof fromReportId === "string" && fromReportId.trim() !== "") {
    return { path: reportDetailPath(fromReportId) };
  }
  return null;
});

const themeTableSkeletonColumns: DataTableColumn[] = [
  { key: "theme", label: "" },
  { key: "mentions", label: "" },
  { key: "percent", label: "" },
];

const subtitle = computed(() => {
  if (loading.value) {
    return subtitleLoadingLabel.value;
  }
  return subtitleRaw.value.replace("{count}", String(data.value?.totalReviews ?? 0));
});

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
