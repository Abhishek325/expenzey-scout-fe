<template>
  <DashboardCard
    :title="title"
    :loading="loading"
    :error="error"
    :has-data="hasData"
    :empty-label="emptyLabel"
    :action="viewAllAction"
    :body-class="INSIGHTS_CARD_BODY_HEIGHT"
    @retry="reload"
  >
    <div class="flex flex-col gap-3">
      <article
        v-for="item in opportunities"
        :key="item.id"
        class="flex cursor-pointer gap-3 rounded-xl border p-3.5 transition hover:shadow-sm"
        :class="item.cardClass"
        role="button"
        tabindex="0"
        @click="openOpportunity(item.id)"
        @keydown.enter="openOpportunity(item.id)"
      >
        <div class="min-w-0 flex-1">
          <p class="flex items-center gap-1.5 text-xs font-semibold" :class="item.labelClass">
            <FaIcon :icon="item.badgeIcon" size="xs" />
            {{ item.badge }}
          </p>
          <p class="mt-2 text-sm leading-snug text-slate-800">{{ item.title }}</p>
          <p class="mt-1.5 text-sm leading-snug text-slate-700">
            <span class="font-semibold text-slate-900">{{ recommendationLabel }}</span>
            {{ item.recommendation }}
          </p>
          <p v-if="item.impact" class="mt-1.5 text-xs font-semibold" :class="item.impactClass">
            {{ item.impact }}
          </p>
        </div>
        <div class="flex shrink-0 items-center self-center">
          <img
            v-if="item.productImageUrl"
            :src="item.productImageUrl"
            :alt="item.productName ?? item.badge"
            class="h-16 w-16 rounded-lg border border-white/80 object-cover shadow-sm"
          />
          <div
            v-else
            class="flex h-16 w-16 items-center justify-center rounded-lg text-lg font-bold shadow-sm"
            :class="item.thumbClass"
            aria-hidden="true"
          >
            {{ item.productInitial }}
          </div>
        </div>
      </article>
    </div>
  </DashboardCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import FaIcon from "@/components/icons/FaIcon.vue";
import DashboardCard from "@/components/shared/DashboardCard.vue";
import { INSIGHTS_CARD_BODY_HEIGHT } from "@/constants/dashboardRowHeights";
import { useOpportunities } from "@/composables/dashboard/useOpportunities";
import { useLocalizedString } from "@/composables/useLocalizedString";

const router = useRouter();
const { loading, error, hasData, opportunities, reload } = useOpportunities();
const emptyLabel = useLocalizedString("dashboard", "aiInsights.opportunitiesEmpty");
const viewAll = useLocalizedString("common", "viewAll");
const title = useLocalizedString("dashboard", "aiInsights.opportunitiesTitle");
const recommendationLabel = useLocalizedString("dashboard", "aiInsights.recommendation");

const viewAllAction = computed(() => ({
  kind: "link" as const,
  to: "/opportunities",
  label: viewAll.value,
}));

function openOpportunity(id: string) {
  void router.push({ path: "/opportunities", query: { id } });
}
</script>
