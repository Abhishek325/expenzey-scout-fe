<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/appStore";
import { useLocalizedString } from "@/composables/useLocalizedString";
import { isWpContext, wpRestFetch } from "@/services/wp/wpRestClient";

const router = useRouter();
const appStore = useAppStore();
const connecting = ref(false);

const title = useLocalizedString("onboarding", "steps.connect");
const description = useLocalizedString("onboarding", "connect.description");
const connectCta = useLocalizedString("onboarding", "connectCta");
const installationIdLabel = useLocalizedString("settings", "connection.installationId");

const installationId = computed(() => appStore.installationId);

async function connect() {
  connecting.value = true;
  try {
    if (isWpContext()) {
      const result = await wpRestFetch<{ connected: boolean; lastSync: string }>(
        "/connection/connect",
        { method: "POST" }
      );
      appStore.applyWpConfig({
        connected: true,
        siteUrl: appStore.siteUrl,
        installationId: appStore.installationId,
        lastSync: result.lastSync,
      });
    } else {
      appStore.setConnected(true);
    }
    void router.push("/dashboard");
  } finally {
    connecting.value = false;
  }
}
</script>

<template>
  <div class="mx-auto max-w-md px-6 py-16">
    <h1 class="text-xl font-semibold text-gray-900">{{ title }}</h1>
    <p class="mt-2 text-sm text-gray-600">{{ description }}</p>
    <div class="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ installationIdLabel }}</p>
      <p class="mt-2 break-all font-mono text-sm text-gray-900">{{ installationId }}</p>
      <button
        type="button"
        class="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
        :disabled="connecting"
        @click="connect"
      >
        {{ connectCta }}
      </button>
    </div>
  </div>
</template>
