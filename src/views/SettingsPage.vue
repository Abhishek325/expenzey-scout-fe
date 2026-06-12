<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { inject } from "vue";
import mockUsage from "@/data/settings/mock-usage.json";
import { useLocalizedString } from "@/composables/useLocalizedString";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";
import { USAGE_SERVICE_KEY, type IUsageService } from "@/services/usage/IUsageService";
import { isWpContext, wpRestFetch } from "@/services/wp/wpRestClient";
import { useAppStore } from "@/stores/appStore";
import type { UsageQuota } from "@/types/usage";

const title = useLocalizedString("settings", "title");
const subtitle = useLocalizedString("settings", "subtitle");
const connectionTitle = useLocalizedString("settings", "connection.title");
const siteUrlLabel = useLocalizedString("settings", "connection.siteUrl");
const installationIdLabel = useLocalizedString("settings", "connection.installationId");
const lastSyncLabel = useLocalizedString("settings", "connection.lastSync");
const usageTitle = useLocalizedString("settings", "usage.title");
const syncNowLabel = useLocalizedString("common", "syncNow");
const helpOpen = ref(false);

const strings = useReactiveLocaleStringRecord("settings", [
  "usage.reports",
  "usage.chat",
  "usage.usedOfLimit",
  "help.title",
  "help.body",
] as const);

const stringService = inject(STRING_SERVICE_KEY) as IStringService;
const usageService = inject(USAGE_SERVICE_KEY) as IUsageService;
const appStore = useAppStore();

const connection = computed(() => ({
  connected: appStore.connected,
  siteUrl: appStore.siteUrl,
  installationId: appStore.installationId,
  lastSync: appStore.lastSync,
}));
const usage = ref<UsageQuota>({
  reports: { ...mockUsage.reports },
  chat: { ...mockUsage.chat },
});
const syncing = ref(false);

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function usageLabel(used: number, limit: number): string {
  return stringService
    .getStrings("settings", "usage.usedOfLimit")
    .replace("{used}", String(used))
    .replace("{limit}", String(limit));
}

async function syncNow() {
  syncing.value = true;
  try {
    if (isWpContext()) {
      const result = await wpRestFetch<{ lastSync: string }>("/sync/trigger", {
        method: "POST",
      });
      appStore.applyWpConfig({
        connected: appStore.connected,
        siteUrl: appStore.siteUrl,
        installationId: appStore.installationId,
        lastSync: result.lastSync,
      });
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    appStore.applyWpConfig({
      connected: appStore.connected,
      siteUrl: appStore.siteUrl,
      installationId: appStore.installationId,
      lastSync: new Date().toISOString(),
    });
  } finally {
    syncing.value = false;
  }
}

onMounted(async () => {
  try {
    usage.value = await usageService.getUsage();
  } catch {
    /* keep mock */
  }
});
</script>

<template>
  <div class="flex flex-col gap-6 pb-10">
    <header>
      <h1 class="text-xl font-semibold text-gray-900">{{ title }}</h1>
      <p class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
    </header>

    <section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-gray-900">{{ connectionTitle }}</h2>
      <dl class="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <dt class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ siteUrlLabel }}</dt>
          <dd class="mt-1 text-sm text-gray-900">{{ connection.siteUrl }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ installationIdLabel }}</dt>
          <dd class="mt-1 font-mono text-sm text-gray-900">{{ connection.installationId }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ lastSyncLabel }}</dt>
          <dd class="mt-1 text-sm text-gray-900">{{ formatDate(connection.lastSync) }}</dd>
        </div>
      </dl>
      <button
        type="button"
        class="mt-5 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
        :disabled="syncing"
        @click="syncNow"
      >
        {{ syncNowLabel }}
      </button>
    </section>

    <section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-gray-900">{{ usageTitle }}</h2>
      <ul class="mt-4 space-y-3">
        <li class="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
          <span class="font-medium text-gray-700">{{ strings['usage.reports'] }}</span>
          <span class="text-gray-900">{{ usageLabel(usage.reports.used, usage.reports.limit) }}</span>
        </li>
        <li class="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
          <span class="font-medium text-gray-700">{{ strings['usage.chat'] }}</span>
          <span class="text-gray-900">{{ usageLabel(usage.chat.used, usage.chat.limit) }}</span>
        </li>
      </ul>
    </section>

    <section class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        class="flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50"
        @click="helpOpen = !helpOpen"
      >
        <span>{{ strings['help.title'] }}</span>
        <span :class="helpOpen ? 'rotate-180' : ''" class="text-indigo-600 transition" aria-hidden="true">▼</span>
      </button>
      <div v-show="helpOpen" class="border-t border-gray-100 px-6 py-4 text-sm text-gray-600">
        <p>{{ strings['help.body'] }}</p>
      </div>
    </section>
  </div>
</template>
