<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/appStore";
import { useLocalizedString } from "@/composables/useLocalizedString";
import { WpRestError } from "@/services/wp/wpRestClient";

const router = useRouter();
const appStore = useAppStore();
const connecting = ref(false);
const errorMessage = ref("");

const title = useLocalizedString("onboarding", "steps.connect");
const description = useLocalizedString("onboarding", "connect.description");
const connectCta = useLocalizedString("onboarding", "connectCta");
const skipForNow = useLocalizedString("onboarding", "skipForNow");
const installationIdLabel = useLocalizedString("settings", "connection.installationId");

const installationId = computed(() => appStore.installationId);

async function goToDashboard() {
  await router.replace("/dashboard");
}

async function connect() {
  connecting.value = true;
  errorMessage.value = "";
  try {
    await appStore.completeConnection();
    await goToDashboard();
  } catch (error) {
    errorMessage.value =
      error instanceof WpRestError
        ? `Connection failed (${error.status}). Check you are logged in as an administrator.`
        : error instanceof Error
          ? error.message
          : "Connection failed.";
  } finally {
    connecting.value = false;
  }
}

async function skip() {
  connecting.value = true;
  errorMessage.value = "";
  try {
    await appStore.completeConnection();
  } catch {
    appStore.setConnected(true);
  }
  await goToDashboard();
}
</script>

<template>
  <div class="mx-auto max-w-md px-6 py-16">
    <h1 class="text-xl font-semibold text-gray-900">{{ title }}</h1>
    <p class="mt-2 text-sm text-gray-600">{{ description }}</p>
    <div class="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ installationIdLabel }}</p>
      <p class="mt-2 break-all font-mono text-sm text-gray-900">{{ installationId }}</p>
      <p v-if="errorMessage" class="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
        {{ errorMessage }}
      </p>
      <button
        type="button"
        class="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
        :disabled="connecting"
        @click="connect"
      >
        {{ connectCta }}
      </button>
      <button
        type="button"
        class="mt-3 w-full text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-60"
        :disabled="connecting"
        @click="skip"
      >
        {{ skipForNow }}
      </button>
    </div>
  </div>
</template>
