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
          <dt class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ syncStatusLabel }}</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ statusLabel("connection.status", connection.syncStatus) }}
            <span v-if="Object.keys(entityCounts).length" class="text-gray-500">
              ({{ Object.entries(entityCounts).map(([k, v]) => `${k}: ${v}`).join(", ") }})
            </span>
          </dd>
        </div>
        <div>
          <dt class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ lastSyncLabel }}</dt>
          <dd class="mt-1 text-sm text-gray-900">{{ formatDate(connection.lastSync) }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ accountStatusLabel }}</dt>
          <dd class="mt-1 text-sm capitalize text-gray-900">
            {{ statusLabel("account.status", connection.accountStatus) }}
          </dd>
        </div>
      </dl>
      <div class="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="syncing"
          @click="syncNow"
        >
          <FaIcon
            v-if="syncing"
            icon="fa-spinner"
            size="sm"
            icon-class="sync-now-spinner"
          />
          {{ syncNowLabel }}
        </button>
        <button
          v-if="connection.connected"
          type="button"
          class="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
          :disabled="disconnecting"
          @click="disconnectStore"
        >
          {{ disconnectLabel }}
        </button>
      </div>
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

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
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
const syncStatusLabel = useLocalizedString("settings", "connection.syncStatus");
const accountStatusLabel = useLocalizedString("settings", "connection.accountStatus");
const disconnectLabel = useLocalizedString("settings", "connection.disconnect");
const usageTitle = useLocalizedString("settings", "usage.title");
const syncNowLabel = useLocalizedString("common", "syncNow");
const helpOpen = ref(false);

const strings = useReactiveLocaleStringRecord("settings", [
  "usage.reports",
  "usage.chat",
  "usage.usedOfLimit",
  "help.title",
  "help.body",
  "connection.status.idle",
  "connection.status.queued",
  "connection.status.syncing",
  "connection.status.completed",
  "connection.status.error",
  "account.status.active",
  "account.status.trial",
  "account.status.suspended",
  "account.status.disconnected",
] as const);

const stringService = inject(STRING_SERVICE_KEY) as IStringService;
const usageService = inject(USAGE_SERVICE_KEY) as IUsageService;
const appStore = useAppStore();

const connection = computed(() => ({
  connected: appStore.connected,
  siteUrl: appStore.siteUrl,
  installationId: appStore.installationId,
  lastSync: appStore.lastSync,
  accountStatus: appStore.accountStatus,
  syncStatus: appStore.syncStatus,
}));
const usage = ref<UsageQuota>({
  reports: { used: 0, limit: 0, labelKey: "settings.usage.reports" },
  chat: { used: 0, limit: 0, labelKey: "settings.usage.chat" },
});
const syncing = ref(false);
const disconnecting = ref(false);
const entityCounts = ref<Record<string, number>>({});

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

function statusLabel(prefix: string, value: string): string {
  const key = `${prefix}.${value}` as keyof typeof strings.value;
  return strings.value[key] ?? value;
}

async function refreshSyncStatus() {
  const status = await appStore.fetchSyncStatus();
  if (status) {
    appStore.syncStatus = status.status;
    entityCounts.value = status.entityCounts;
    if (status.lastSync) {
      appStore.lastSync = status.lastSync;
    }
  }
}

async function pollSyncUntilSettled(maxAttempts = 30): Promise<void> {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await refreshSyncStatus();
    if (appStore.syncStatus === "completed" || appStore.syncStatus === "error") {
      return;
    }
  }
}

async function syncNow() {
  if (!isWpContext()) {
    return;
  }

  syncing.value = true;
  try {
    const result = await wpRestFetch<{ lastSync: string; syncStatus?: string }>("/sync/trigger", {
      method: "POST",
    });
    appStore.applyWpConfig({
      connected: appStore.connected,
      siteUrl: appStore.siteUrl,
      installationId: appStore.installationId,
      lastSync: result.lastSync,
      syncStatus: (result.syncStatus as typeof appStore.syncStatus) ?? "queued",
    });
    await refreshSyncStatus();

    if (appStore.syncStatus === "queued" || appStore.syncStatus === "syncing") {
      await pollSyncUntilSettled();
    }
  } finally {
    syncing.value = false;
  }
}

async function disconnectStore() {
  if (!window.confirm(stringService.getStrings("settings", "connection.disconnectConfirm"))) {
    return;
  }
  disconnecting.value = true;
  try {
    await appStore.disconnect();
  } finally {
    disconnecting.value = false;
  }
}

let pollTimer: ReturnType<typeof setInterval> | undefined;

onMounted(async () => {
  try {
    usage.value = await usageService.getUsage();
  } catch {
    /* usage stays at zero defaults */
  }
  await refreshSyncStatus();
  pollTimer = setInterval(refreshSyncStatus, 10000);
});

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
});
</script>
