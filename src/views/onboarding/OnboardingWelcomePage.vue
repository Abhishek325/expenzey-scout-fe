<template>
  <div class="mx-auto flex max-w-lg flex-col items-center px-6 py-16 text-center">
    <div class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow-sm ring-1 ring-gray-200">
      <img :src="logoUrl" alt="" class="h-full w-full object-contain opacity-90" aria-hidden="true" />
    </div>
    <h1 class="text-3xl font-semibold text-gray-900">{{ title }}</h1>
    <p class="mt-3 text-base text-gray-600">{{ subtitle }}</p>
    <div class="mt-8 flex w-full flex-col gap-3">
      <button
        type="button"
        class="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
        @click="goConnect"
      >
        {{ connectCta }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ROUTES } from "@/constants/routes";
import { useLocalizedString } from "@/composables/useLocalizedString";
import logoUrl from "../../../logo.png";

const router = useRouter();

const title = useLocalizedString("onboarding", "welcome.title");
const subtitle = useLocalizedString("onboarding", "welcome.subtitle");
const connectCta = useLocalizedString("onboarding", "connectCta");

function goConnect() {
  void router.push(ROUTES.ONBOARDING_CONNECT);
}
</script>
