<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import { useBusinessSummary } from "@/composables/dashboard/useBusinessSummary";
import { useLocalizedString } from "@/composables/useLocalizedString";

const { loading, error, highlights, reload } = useBusinessSummary();
const loadingLabel = useLocalizedString("common", "loading");
const errorLabel = useLocalizedString("common", "error");
const retryLabel = useLocalizedString("common", "retry");
const title = useLocalizedString("dashboard", "aiInsights.businessSummaryTitle");
const viewFullReport = useLocalizedString("dashboard", "viewFullReport");
</script>

<template>
  <section class="rounded-xl border border-expenzey-100 bg-expenzey-50 p-3 shadow-sm">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-expenzey-100/80 pb-3">
      <div class="flex items-center gap-2.5">
        <span
          class="flex h-8 w-8 items-center justify-center text-expenzey-600"
          aria-hidden="true"
        >
          <FaIcon icon="fa-robot" size="base" />
        </span>
        <h2 class="text-sm font-semibold text-expenzey-700">{{ title }}</h2>
      </div>
      <RouterLink
        to="/reports"
        class="inline-flex items-center gap-1.5 rounded-lg border border-expenzey-200/80 bg-white/90 px-3 py-1.5 text-xs font-medium text-expenzey-600 transition hover:border-expenzey-300 hover:bg-white"
      >
        {{ viewFullReport }}
        <FaIcon icon="fa-arrow-right" size="xs" />
      </RouterLink>
    </div>

    <p v-if="loading" class="text-sm text-slate-500">{{ loadingLabel }}</p>
    <div v-else-if="error" class="flex items-center gap-3 text-sm text-rose-600">
      <span>{{ errorLabel }}</span>
      <button type="button" class="font-medium underline" @click="reload">{{ retryLabel }}</button>
    </div>
    <div v-else class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="item in highlights"
        :key="item.id"
        class="flex min-w-0 items-center gap-3"
      >
        <span
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          :class="item.iconBgClass"
          aria-hidden="true"
        >
          <FaIcon :icon="item.icon" size="sm" :icon-class="item.iconClass" />
        </span>
        <div class="min-w-0">
          <p class="text-xs text-slate-500">{{ item.label }}</p>
          <p
            class="mt-0.5 font-bold leading-tight text-slate-900"
            :class="item.headlineLarge ? 'text-2xl' : 'text-sm'"
          >
            {{ item.headline }}
          </p>
          <p v-if="item.subtext" class="mt-0.5 text-xs text-slate-500">{{ item.subtext }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
