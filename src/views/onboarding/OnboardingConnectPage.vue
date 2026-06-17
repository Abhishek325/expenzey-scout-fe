<template>
  <div class="mx-auto max-w-lg px-6 py-16">
    <h1 class="text-xl font-semibold text-gray-900">{{ title }}</h1>
    <p class="mt-2 text-sm text-gray-600">{{ description }}</p>
    <div class="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ installationIdLabel }}</p>
      <p class="mt-2 break-all font-mono text-sm text-gray-900">{{ installationId }}</p>

      <div class="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-left text-sm text-gray-700">
        <p class="font-medium text-gray-900">{{ consentTitle }}</p>
        <p class="mt-2 leading-relaxed">{{ consentIntro }}</p>
        <ul class="mt-3 list-disc space-y-1 pl-5">
          <li v-for="item in consentItems" :key="item">{{ item }}</li>
        </ul>
        <p class="mt-3 leading-relaxed">{{ consentThirdParty }}</p>
        <p v-if="privacyPolicyUrl" class="mt-3">
          <a
            :href="privacyPolicyUrl"
            class="font-medium text-indigo-600 hover:text-indigo-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ privacyPolicyLabel }}
          </a>
        </p>
      </div>

      <label class="mt-5 flex cursor-pointer items-start gap-3 text-sm text-gray-700">
        <input
          v-model="consentAccepted"
          type="checkbox"
          class="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span>{{ consentCheckbox }}</span>
      </label>
      <p v-if="syncPhase === 'syncing'" class="mt-4 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-700">
        {{ syncingLabel }}
      </p>
      <p v-if="syncPhase === 'connecting'" class="mt-4 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-700">
        {{ connectingLabel }}
      </p>
      <p v-if="syncPhase === 'done'" class="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
        {{ syncCompleteLabel }}
      </p>
      <p v-if="errorMessage" class="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
        {{ errorMessage }}
      </p>
      <button
        type="button"
        class="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
        :disabled="connecting || syncPhase === 'syncing' || syncPhase === 'connecting' || !consentAccepted"
        @click="connect"
      >
        <span class="inline-flex items-center justify-center gap-2">
          <FaIcon
            v-if="syncPhase === 'connecting'"
            icon="fa-spinner"
            size="sm"
            icon-class="sync-now-spinner text-white"
          />
          {{ connectCta }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { ROUTES } from "@/constants/routes";
import { useAppStore } from "@/stores/appStore";
import { useLocalizedString, useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import { getWpConfig } from "@/services/wp/applyWpBootstrap";
import { WpRestError } from "@/services/wp/wpRestClient";
import FaIcon from "@/components/icons/FaIcon.vue";

const router = useRouter();
const appStore = useAppStore();
const connecting = ref(false);
const consentAccepted = ref(false);
const errorMessage = ref("");
const syncPhase = ref<"idle" | "connecting" | "syncing" | "done">("idle");

const title = useLocalizedString("onboarding", "steps.connect");
const description = useLocalizedString("onboarding", "connect.description");
const syncingLabel = useLocalizedString("onboarding", "connect.syncing");
const syncCompleteLabel = useLocalizedString("onboarding", "connect.syncComplete");
const connectCta = useLocalizedString("onboarding", "connectCta");
const connectingLabel = computed(() => `${connectCta.value}…`);
const installationIdLabel = useLocalizedString("settings", "connection.installationId");
const consentTitle = useLocalizedString("onboarding", "consent.title");
const consentIntro = useLocalizedString("onboarding", "consent.intro");
const consentThirdParty = useLocalizedString("onboarding", "consent.thirdParty");
const consentCheckbox = useLocalizedString("onboarding", "consent.checkbox");
const privacyPolicyLabel = useLocalizedString("onboarding", "consent.privacyPolicy");

const consentCopy = useReactiveLocaleStringRecord("onboarding", [
  "consent.itemSite",
  "consent.itemOrders",
  "consent.itemProducts",
  "consent.itemReviews",
  "consent.itemChat",
] as const);

const consentItems = computed(() => [
  consentCopy.value["consent.itemSite"],
  consentCopy.value["consent.itemOrders"],
  consentCopy.value["consent.itemProducts"],
  consentCopy.value["consent.itemReviews"],
  consentCopy.value["consent.itemChat"],
]);

const installationId = computed(() => appStore.installationId);
const privacyPolicyUrl = computed(() => getWpConfig()?.privacyPolicyUrl ?? "");

let pollTimer: ReturnType<typeof setInterval> | undefined;

async function goToDashboard() {
  try {
    await router.replace(ROUTES.DASHBOARD);
  } catch {
    const base = window.location.href.split("#")[0] ?? window.location.href;
    window.location.href = `${base}#${ROUTES.DASHBOARD}`;
  }
}

async function pollSyncUntilDone(): Promise<void> {
  syncPhase.value = "syncing";
  return await new Promise((resolve) => {
    pollTimer = setInterval(async () => {
      const status = await appStore.fetchSyncStatus();
      if (!status) return;
      appStore.syncStatus = status.status;
      if (status.status === "completed" || status.status === "error") {
        syncPhase.value = status.status === "completed" ? "done" : "idle";
        if (pollTimer) clearInterval(pollTimer);
        if (status.status === "completed") {
          await goToDashboard();
        }
        resolve();
      }
    }, 2000);
  });
}

async function connect() {
  connecting.value = true;
  errorMessage.value = "";
  try {
    if (!consentAccepted.value) {
      return;
    }

    syncPhase.value = "connecting";
    await appStore.completeConnection(true);
    await pollSyncUntilDone();
  } catch (error) {
    errorMessage.value =
      error instanceof WpRestError
        ? `Connection failed (${error.status}). Check you are logged in as an administrator.`
        : error instanceof Error
          ? error.message
          : "Connection failed.";
    syncPhase.value = "idle";
  } finally {
    connecting.value = false;
  }
}

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
});
</script>
