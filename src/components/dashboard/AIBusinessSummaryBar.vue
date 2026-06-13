<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import { useBusinessSummary } from "@/composables/dashboard/useBusinessSummary";
import { useLocalizedString } from "@/composables/useLocalizedString";

const { loading, error, highlights, reload } = useBusinessSummary();
const loadingLabel = useLocalizedString("common", "loading");
const errorLabel = useLocalizedString("common", "error");
const retryLabel = useLocalizedString("common", "retry");
const viewFullReport = useLocalizedString("dashboard", "viewFullReport");
</script>

<template>
  <section class="rounded-xl border border-indigo-100 bg-violet-50/70 p-5 shadow-sm">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <span
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-expenzey-600 text-white shadow-sm"
          aria-hidden="true"
        >
          <FaIcon icon="fa-robot" size="base" />
        </span>
        <h2 class="text-sm font-semibold text-expenzey-700">AI Business Summary</h2>
      </div>
      <RouterLink
        to="/reports"
        class="inline-flex items-center gap-1.5 rounded-lg border border-expenzey-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-expenzey-600 transition hover:bg-white hover:text-expenzey-700"
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
    <div v-else class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="item in highlights"
        :key="item.id"
        class="flex items-start gap-3"
      >
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          :class="item.iconClass"
          aria-hidden="true"
        >
          <FaIcon :icon="item.icon" size="sm" />
        </span>
        <div class="min-w-0">
          <p class="text-xs font-medium text-slate-500">{{ item.label }}</p>
          <p class="mt-0.5 text-sm font-semibold leading-snug text-slate-900">{{ item.detail }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
