<template>
  <ReportSectionCard :title="title" fill-height scrollable>
    <template #actions>
      <span
        v-if="hasData"
        class="inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600"
      >
        {{ basedOnLabel }}
      </span>
    </template>

    <template v-if="hasData">
      <div class="flex min-h-0 flex-1 flex-col gap-2.5">
        <article class="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
          <p class="text-[11px] font-medium text-slate-500">{{ overallSentimentLabel }}</p>
          <div class="mt-2 flex items-center gap-2.5">
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
              aria-hidden="true"
            >
              <FaIcon icon="fa-face-smile" size="xs" />
            </span>
            <div class="min-w-0">
              <p class="text-lg font-bold leading-none text-slate-900">{{ sentimentScore }}%</p>
              <p class="mt-0.5 text-xs font-medium text-emerald-600">{{ positiveLabel }}</p>
            </div>
          </div>
          <p
            v-if="sentimentChangePercent !== undefined"
            class="mt-2 text-[11px] font-medium"
            :class="sentimentTrendClass"
          >
            {{ sentimentTrendPrefix }} {{ Math.abs(sentimentChangePercent) }}% {{ vsLastWeekLabel }}
          </p>
        </article>

        <article class="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p class="text-[11px] font-medium text-slate-500">{{ topPositiveThemeLabel }}</p>
          <div class="mt-2 flex items-center gap-2.5">
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
              aria-hidden="true"
            >
              <FaIcon icon="fa-thumbs-up" size="xs" />
            </span>
            <p class="min-w-0 text-xs font-semibold leading-snug text-slate-900">
              {{ topPositiveTheme || noThemeLabel }}
            </p>
          </div>
          <p v-if="topPositiveThemePercent !== undefined" class="mt-2 text-[11px] leading-snug text-slate-500">
            {{ mentionedInPositiveLabel }}
          </p>
        </article>

        <article class="rounded-lg border border-rose-100 bg-rose-50/50 p-3">
          <p class="text-[11px] font-medium text-slate-500">{{ topComplaintThemeLabel }}</p>
          <div class="mt-2 flex items-center gap-2.5">
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600"
              aria-hidden="true"
            >
              <FaIcon icon="fa-face-frown" size="xs" />
            </span>
            <p class="min-w-0 text-xs font-semibold leading-snug text-slate-900">
              {{ topComplaintTheme || noThemeLabel }}
            </p>
          </div>
          <p v-if="topComplaintThemePercent !== undefined" class="mt-2 text-[11px] leading-snug text-slate-500">
            {{ mentionedInNegativeLabel }}
          </p>
        </article>

        <RouterLink
          :to="viewAllLink"
          class="mt-auto pt-1 text-xs font-medium text-indigo-600 transition hover:text-indigo-700"
        >
          {{ viewAllInsightsLabel }} →
        </RouterLink>
      </div>
    </template>
    <p v-else class="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-400">
      {{ emptyLabel }}
    </p>
  </ReportSectionCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import FaIcon from "@/components/icons/FaIcon.vue";
import ReportSectionCard from "@/components/reports/ReportSectionCard.vue";
import { ROUTES, reportDetailPath } from "@/constants/routes";
import { useLocalizedString } from "@/composables/useLocalizedString";
import type { WeeklyReportReviewIntelligence } from "@/types/ai";

const props = defineProps<{
  title: string;
  intelligence?: WeeklyReportReviewIntelligence;
}>();

const emptyLabel = useLocalizedString("reports", "detail.noData");
const positiveLabel = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.positive");
const overallSentimentLabel = useLocalizedString("reports", "sections.overallSentiment");
const topPositiveThemeLabel = useLocalizedString("reports", "customerFeedback.topPositiveTheme");
const topComplaintThemeLabel = useLocalizedString("reports", "customerFeedback.topComplaintTheme");
const vsLastWeekLabel = useLocalizedString("dashboard", "aiInsights.weeklyReport.vsLastWeek");
const viewAllInsightsLabel = useLocalizedString("reports", "customerFeedback.viewAllInsights");
const noThemeLabel = useLocalizedString("reports", "customerFeedback.noTheme");
const mentionedInPositiveRaw = useLocalizedString("reports", "customerFeedback.mentionedInPositive");
const mentionedInNegativeRaw = useLocalizedString("reports", "customerFeedback.mentionedInNegative");
const basedOnReviewsRaw = useLocalizedString("reports", "customerFeedback.basedOnReviews");

const route = useRoute();

const viewAllLink = computed(() => {
  const id = route.name === "report-detail" ? String(route.params.id ?? "") : "";
  if (id) {
    return { path: ROUTES.REVIEWS, query: { fromReportId: id } };
  }
  return ROUTES.REVIEWS;
});

const hasData = computed(() => (props.intelligence?.totalReviews ?? 0) > 0);
const sentimentScore = computed(() => props.intelligence?.sentimentScore ?? 0);
const sentimentChangePercent = computed(() => props.intelligence?.sentimentChangePercent);
const topPositiveTheme = computed(() => props.intelligence?.topPositiveTheme);
const topPositiveThemePercent = computed(() => props.intelligence?.topPositiveThemePercent);
const topComplaintTheme = computed(() => props.intelligence?.topComplaintTheme);
const topComplaintThemePercent = computed(() => props.intelligence?.topComplaintThemePercent);

const basedOnLabel = computed(() =>
  basedOnReviewsRaw.value.replace("{count}", String(props.intelligence?.totalReviews ?? "—")),
);

const mentionedInPositiveLabel = computed(() =>
  mentionedInPositiveRaw.value.replace("{percent}", String(topPositiveThemePercent.value ?? 0)),
);

const mentionedInNegativeLabel = computed(() =>
  mentionedInNegativeRaw.value.replace("{percent}", String(topComplaintThemePercent.value ?? 0)),
);

const sentimentTrendClass = computed(() => {
  const change = sentimentChangePercent.value ?? 0;
  if (change > 0) return "text-emerald-600";
  if (change < 0) return "text-rose-600";
  return "text-slate-500";
});

const sentimentTrendPrefix = computed(() => {
  const change = sentimentChangePercent.value ?? 0;
  if (change > 0) return "↑";
  if (change < 0) return "↓";
  return "→";
});
</script>
