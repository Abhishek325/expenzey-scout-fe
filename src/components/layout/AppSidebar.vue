<script setup lang="ts">
import { computed } from "vue";
import sidebarItems from "@/data/sidebar.json";
import { useLocalizedString } from "@/composables/useLocalizedString";

interface SidebarItem {
  id: string;
  route: string;
  icon: string;
  labelKey: string;
}

const items = sidebarItems as SidebarItem[];

const navDashboard = useLocalizedString("nav", "dashboard");
const navOpportunities = useLocalizedString("nav", "opportunities");
const navReports = useLocalizedString("nav", "reports");
const navSettings = useLocalizedString("nav", "settings");

const labels = computed(() => ({
  "nav.dashboard": navDashboard.value,
  "nav.opportunities": navOpportunities.value,
  "nav.reports": navReports.value,
  "nav.settings": navSettings.value,
}));

function labelFor(key: string) {
  return labels.value[key as keyof typeof labels.value] ?? key;
}
</script>

<template>
  <aside class="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-6">
    <nav class="flex flex-col gap-1">
      <RouterLink
        v-for="item in items"
        :key="item.id"
        :to="item.route"
        class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-expenzey-50 hover:text-expenzey-600"
        active-class="!bg-expenzey-50 !text-expenzey-600 ring-1 ring-expenzey-100"
      >
        <span class="text-lg" aria-hidden="true">{{ item.icon }}</span>
        <span>{{ labelFor(item.labelKey) }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>
