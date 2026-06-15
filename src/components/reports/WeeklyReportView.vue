<template>
  <div v-if="content" class="flex flex-col gap-5">
    <ExecutiveSummaryHero :title="executiveSummaryTitle" :summary="content.executiveSummary" />

    <div class="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12 lg:gap-5">
      <ReportInsightList
        class="h-full lg:col-span-3"
        :title="keyWinsTitle"
        :items="content.keyWins"
        variant="success"
      />
      <ReportInsightList
        class="h-full lg:col-span-3"
        :title="needsAttentionTitle"
        :items="content.needsAttention"
        variant="warning"
      />
      <TopProductsReportTable
        class="h-full lg:col-span-6"
        :title="topProductsTitle"
        :products="content.topProducts"
      />
    </div>

    <CustomerInsightsKpis :title="customerInsightsTitle" :insights="content.customerInsights" />

    <div class="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
      <OpportunityReportCards
        class="h-full"
        :title="opportunitiesTitle"
        :opportunities="content.opportunities"
      />
      <RecommendedActionsList
        class="h-full"
        :title="recommendedActionsTitle"
        :actions="content.recommendedActions"
      />
    </div>

    <ReviewIntelligenceReportSection
      v-if="content.reviewIntelligence"
      :title="reviewIntelligenceTitle"
      :intelligence="content.reviewIntelligence"
    />
  </div>
</template>

<script setup lang="ts">
import CustomerInsightsKpis from "@/components/reports/CustomerInsightsKpis.vue";
import ExecutiveSummaryHero from "@/components/reports/ExecutiveSummaryHero.vue";
import OpportunityReportCards from "@/components/reports/OpportunityReportCards.vue";
import RecommendedActionsList from "@/components/reports/RecommendedActionsList.vue";
import ReportInsightList from "@/components/reports/ReportInsightList.vue";
import ReviewIntelligenceReportSection from "@/components/reports/ReviewIntelligenceReportSection.vue";
import TopProductsReportTable from "@/components/reports/TopProductsReportTable.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";
import type { WeeklyReportContent } from "@/types/ai";

defineProps<{ content: WeeklyReportContent | null }>();

const executiveSummaryTitle = useLocalizedString("reports", "sections.executiveSummary");
const keyWinsTitle = useLocalizedString("reports", "sections.keyWins");
const needsAttentionTitle = useLocalizedString("reports", "sections.needsAttention");
const topProductsTitle = useLocalizedString("reports", "sections.topProducts");
const customerInsightsTitle = useLocalizedString("reports", "sections.customerInsights");
const opportunitiesTitle = useLocalizedString("reports", "sections.opportunities");
const recommendedActionsTitle = useLocalizedString("reports", "sections.recommendedActions");
const reviewIntelligenceTitle = useLocalizedString("reports", "sections.reviewIntelligence");
</script>
