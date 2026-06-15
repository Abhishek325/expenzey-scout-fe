<template>
  <div class="mx-auto flex max-w-lg flex-col items-center px-6 py-16 text-center">
    <div
      class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-lg"
    >
      e
    </div>
    <h1 class="text-3xl font-semibold text-gray-900">{{ title }}</h1>
    <p class="mt-3 text-base text-gray-600">{{ subtitle }}</p>
    <div class="mt-8 flex w-full flex-col gap-3">
      <button
        type="button"
        class="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
        :disabled="busy"
        @click="goConnect"
      >
        {{ connectCta }}
      </button>
      <button
        type="button"
        class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        :disabled="busy"
        @click="skipToDashboard"
      >
        {{ skipForNow }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/appStore";
import { useLocalizedString } from "@/composables/useLocalizedString";

const router = useRouter();
const appStore = useAppStore();
const busy = ref(false);

const title = useLocalizedString("onboarding", "welcome.title");
const subtitle = useLocalizedString("onboarding", "welcome.subtitle");
const connectCta = useLocalizedString("onboarding", "connectCta");
const skipForNow = useLocalizedString("onboarding", "skipForNow");

function goConnect() {
  void router.push("/onboarding/connect");
}

async function skipToDashboard() {
  busy.value = true;
  try {
    await appStore.completeConnection();
  } catch {
    appStore.setConnected(true);
  }
  await router.replace("/dashboard");
  busy.value = false;
}
</script>
