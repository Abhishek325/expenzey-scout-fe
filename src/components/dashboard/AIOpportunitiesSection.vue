<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import { useOpportunities } from "@/composables/dashboard/useOpportunities";
import { useLocalizedString } from "@/composables/useLocalizedString";

const { loading, error, opportunities, reload } = useOpportunities();
const loadingLabel = useLocalizedString("common", "loading");
const errorLabel = useLocalizedString("common", "error");
const retryLabel = useLocalizedString("common", "retry");
const emptyLabel = useLocalizedString("dashboard", "aiInsights.opportunitiesEmpty");
const viewAll = useLocalizedString("common", "viewAll");
const title = useLocalizedString("dashboard", "aiInsights.opportunitiesTitle");
const recommendationLabel = useLocalizedString("dashboard", "aiInsights.recommendation");
</script>

<template>
  <section class="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div class="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-2.5">
      <h3 class="text-sm font-semibold text-slate-900">{{ title }}</h3>
      <RouterLink to="/reports" class="card-header-action">
        {{ viewAll }}
      </RouterLink>
    </div>
    <div class="min-h-0 flex-1 overflow-y-auto p-4">
      <p v-if="loading" class="text-sm text-slate-500">{{ loadingLabel }}</p>
      <div v-else-if="error" class="flex items-center gap-3 text-sm text-rose-600">
        <span>{{ errorLabel }}</span>
        <button type="button" class="font-medium underline" @click="reload">{{ retryLabel }}</button>
      </div>
      <p v-else-if="opportunities.length === 0" class="text-sm text-slate-500">{{ emptyLabel }}</p>
      <div v-else class="flex flex-col gap-3">
        <article
          v-for="item in opportunities"
          :key="item.id"
          class="flex gap-3 rounded-xl border p-3.5"
          :class="item.cardClass"
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
    </div>
  </section>
</template>
