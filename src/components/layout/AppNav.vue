<script setup lang="ts">
import { computed } from "vue";
import sidebarItems from "@/data/sidebar.json";
import { useLocalizedString } from "@/composables/useLocalizedString";

interface NavItem {
  id: string;
  route: string;
  icon: string;
  labelKey: string;
}

const items = sidebarItems as NavItem[];

const navDashboard = useLocalizedString("nav", "dashboard");
const navReports = useLocalizedString("nav", "reports");
const navChat = useLocalizedString("nav", "chat");
const navSettings = useLocalizedString("nav", "settings");

const labels = computed(() => ({
  "nav.dashboard": navDashboard.value,
  "nav.reports": navReports.value,
  "nav.chat": navChat.value,
  "nav.settings": navSettings.value,
}));

function labelFor(key: string) {
  return labels.value[key as keyof typeof labels.value] ?? key;
}
</script>

<template>
  <nav
    class="border-b border-slate-200 bg-white px-6"
    aria-label="Main navigation"
  >
    <div class="flex gap-8">
      <RouterLink
        v-for="item in items"
        :key="item.id"
        :to="item.route"
        class="relative border-b-2 border-transparent py-3 text-sm font-medium text-slate-600 transition hover:text-expenzey-600"
        active-class="!border-expenzey-600 !text-expenzey-600"
      >
        {{ labelFor(item.labelKey) }}
      </RouterLink>
    </div>
  </nav>
</template>
