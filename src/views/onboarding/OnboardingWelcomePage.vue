<script setup lang="ts">
import { useRouter } from "vue-router";
import { useLocalizedString } from "@/composables/useLocalizedString";

const router = useRouter();

const title = useLocalizedString("onboarding", "welcome.title");
const subtitle = useLocalizedString("onboarding", "welcome.subtitle");
const createAccount = useLocalizedString("onboarding", "welcome.createAccount");
const login = useLocalizedString("onboarding", "welcome.login");
const connectCta = useLocalizedString("onboarding", "connectCta");

function goConnect() {
  void router.push("/onboarding/connect");
}

function mockCreateAccount() {
  /* mock */
}

function mockLogin() {
  /* mock */
}
</script>

<template>
  <div class="mx-auto flex max-w-lg flex-col items-center px-6 py-16 text-center">
    <div
      class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-lg"
    >
      e
    </div>
    <h1 class="text-3xl font-semibold text-gray-900">{{ title }}</h1>
    <p class="mt-3 text-base text-gray-600">{{ subtitle }}</p>
    <div class="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
      <button
        type="button"
        class="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
        @click="mockCreateAccount"
      >
        {{ createAccount }}
      </button>
      <button
        type="button"
        class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        @click="mockLogin"
      >
        {{ login }}
      </button>
    </div>
    <button
      type="button"
      class="mt-6 text-sm font-medium text-indigo-600 hover:text-indigo-500"
      @click="goConnect"
    >
      {{ connectCta }} →
    </button>
  </div>
</template>
