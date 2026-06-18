<template>
  <header
    class="flex w-full items-stretch justify-between border-b border-slate-200 bg-white px-6"
  >
    <div class="flex min-w-0 flex-1 items-stretch gap-8">
      <div class="flex items-center gap-3 py-3">
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200"
        >
          <img :src="logoUrl" alt="" class="h-full w-full object-contain opacity-90" aria-hidden="true" />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold tracking-tight text-slate-900">
            {{ copy.brandName }}
          </p>
          <p class="text-xs text-slate-500">{{ copy.tagline }}</p>
        </div>
      </div>

      <nav class="flex gap-6 overflow-x-auto" aria-label="Main navigation">
        <RouterLink
          v-for="item in items"
          :key="item.id"
          :to="item.route"
          class="relative flex shrink-0 items-center border-b-2 border-transparent py-3 text-sm font-medium text-slate-600 transition hover:text-expenzey-600 focus:outline-none focus-visible:outline-none focus:!shadow-none focus-visible:!shadow-none focus:ring-0 focus-visible:ring-0"
          active-class="!border-expenzey-600 !text-expenzey-600"
        >
          {{ labelFor(item.labelKey) }}
        </RouterLink>
      </nav>
    </div>

    <div class="flex shrink-0 items-center gap-3 py-3">
      <RouterLink
        v-if="!isPro"
        :to="ROUTES.PRO"
        class="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-1.5 text-sm font-semibold text-expenzey-600 transition hover:bg-expenzey-50 hover:text-expenzey-700"
        active-class="!border-expenzey-500 !bg-expenzey-50"
      >
        <FaIcon icon="fa-crown" size="sm" icon-class="text-expenzey-600" />
        {{ upgradeLabel }}
      </RouterLink>
      <span
        v-else
        class="inline-flex items-center gap-1.5 rounded-lg bg-expenzey-50 px-3 py-1.5 text-sm font-semibold text-expenzey-700"
      >
        <FaIcon icon="fa-crown" size="sm" />
        Pro
      </span>
      <!-- <button
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
      </button> -->
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import { usePlan } from "@/composables/usePlan";
import { ROUTES } from "@/constants/routes";
import sidebarItems from "@/data/sidebar";
import {
  useLocalizedString,
  useReactiveLocaleStringRecord,
} from "@/composables/useLocalizedString";
import logoUrl from "../../../logo.png";

interface NavItem {
  id: string;
  route: string;
  icon: string;
  labelKey: string;
}

const items = sidebarItems as NavItem[];
const { isPro } = usePlan();

const copy = useReactiveLocaleStringRecord("layout", [
  "brandName",
  "tagline",
  "notifications",
] as const);

const upgradeLabel = useLocalizedString("nav", "upgradeToPro");

const navDashboard = useLocalizedString("nav", "dashboard");
const navOpportunities = useLocalizedString("nav", "opportunities");
const navReports = useLocalizedString("nav", "reports");
const navReviews = useLocalizedString("nav", "reviews");
const navSettings = useLocalizedString("nav", "settings");

const labels = computed(() => ({
  "nav.dashboard": navDashboard.value,
  "nav.opportunities": navOpportunities.value,
  "nav.reports": navReports.value,
  "nav.reviews": navReviews.value,
  "nav.settings": navSettings.value,
}));

function labelFor(key: string) {
  return labels.value[key as keyof typeof labels.value] ?? key;
}
</script>
