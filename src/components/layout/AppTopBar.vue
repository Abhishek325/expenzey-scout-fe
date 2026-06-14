<script setup lang="ts">
import { computed } from "vue";
import ExpenzeyIcon from "@/components/icons/ExpenzeyIcon.vue";
import sidebarItems from "@/data/sidebar.json";
import {
  useLocalizedString,
  useReactiveLocaleStringRecord,
} from "@/composables/useLocalizedString";

interface NavItem {
  id: string;
  route: string;
  icon: string;
  labelKey: string;
}

const items = sidebarItems as NavItem[];

const copy = useReactiveLocaleStringRecord("layout", [
  "brandName",
  "tagline",
  "proPlan",
  "notifications",
] as const);

const navDashboard = useLocalizedString("nav", "dashboard");
const navReports = useLocalizedString("nav", "reports");
const navSettings = useLocalizedString("nav", "settings");

const labels = computed(() => ({
  "nav.dashboard": navDashboard.value,
  "nav.reports": navReports.value,
  "nav.settings": navSettings.value,
}));

function labelFor(key: string) {
  return labels.value[key as keyof typeof labels.value] ?? key;
}
</script>

<template>
  <header
    class="flex w-full items-stretch justify-between border-b border-slate-200 bg-white px-6"
  >
    <div class="flex min-w-0 flex-1 items-stretch gap-8">
      <div class="flex items-center gap-3 py-3">
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-expenzey-600 text-white shadow-sm"
          aria-hidden="true"
        >
          <ExpenzeyIcon />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold lowercase tracking-tight text-slate-900">
            {{ copy.brandName }}
          </p>
          <p class="text-xs text-slate-500">{{ copy.tagline }}</p>
        </div>
      </div>

      <nav class="flex gap-8" aria-label="Main navigation">
        <RouterLink
          v-for="item in items"
          :key="item.id"
          :to="item.route"
          class="relative flex items-center border-b-2 border-transparent text-sm font-medium text-slate-600 transition hover:text-expenzey-600"
          active-class="!border-expenzey-600 !text-expenzey-600"
        >
          {{ labelFor(item.labelKey) }}
        </RouterLink>
      </nav>
    </div>

    <div class="flex shrink-0 items-center gap-3 py-3">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-sm font-semibold text-amber-950 shadow-sm transition hover:bg-amber-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7L2 9.4h7.6L12 2z"
          />
        </svg>
        {{ copy.proPlan }}
      </button>
      <button
        type="button"
        class="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
        :aria-label="copy.notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-5 w-5"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        <span
          class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
          aria-hidden="true"
        />
      </button>
      <div
        class="flex h-9 w-9 items-center justify-center rounded-full bg-expenzey-600 text-sm font-semibold text-white"
        aria-hidden="true"
      >
        A
      </div>
    </div>
  </header>
</template>
