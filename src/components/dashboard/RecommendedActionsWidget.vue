<template>
  <DashboardCard
    :title="title"
    :loading="loading"
    :error="error"
    :has-data="hasData"
    :empty-label="emptyLabel"
    skeleton-variant="list"
    :skeleton-row-count="3"
    :body-class="INSIGHTS_CARD_BODY_HEIGHT"
    @retry="reload"
  >
    <ul class="flex flex-col gap-3">
      <li
        v-for="action in actions"
        :key="action.id"
        class="rounded-xl border border-slate-200 bg-white p-3.5"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-xs font-semibold uppercase tracking-wide text-expenzey-600">
              {{ action.priority }}
            </p>
            <p class="mt-1 text-sm font-semibold text-slate-900">{{ action.title }}</p>
            <p class="mt-1 text-sm text-slate-600">{{ action.description }}</p>
          </div>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
            @click="markDone(action.id)"
          >
            {{ doneLabel }}
          </button>
          <button
            type="button"
            class="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
            @click="dismiss(action.id)"
          >
            {{ dismissLabel }}
          </button>
          <button
            type="button"
            class="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
            @click="remindLater(action.id)"
          >
            {{ remindLabel }}
          </button>
        </div>
      </li>
    </ul>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from "@/components/shared/DashboardCard.vue";
import { useRecommendedActions } from "@/composables/dashboard/useRecommendedActions";
import { INSIGHTS_CARD_BODY_HEIGHT } from "@/constants/dashboardRowHeights";
import { useLocalizedString } from "@/composables/useLocalizedString";

const {
  loading,
  error,
  hasData,
  actions,
  reload,
  dismiss,
  remindLater,
  markDone,
} = useRecommendedActions();

const title = useLocalizedString("dashboard", "recommendedActionsTitle");
const emptyLabel = useLocalizedString("dashboard", "recommendedActionsEmpty");
const doneLabel = useLocalizedString("dashboard", "recommendedActionsDone");
const dismissLabel = useLocalizedString("dashboard", "recommendedActionsDismiss");
const remindLabel = useLocalizedString("dashboard", "recommendedActionsRemind");
</script>
