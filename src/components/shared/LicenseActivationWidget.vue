<template>
  <section
    :class="
      embedded
        ? ''
        : 'rounded-xl border border-slate-200 bg-white p-6 shadow-sm'
    "
  >
    <div v-if="isPro" class="flex items-start gap-3">
      <div
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
        aria-hidden="true"
      >
        <FaIcon icon="fa-crown" size="lg" />
      </div>
      <div>
        <h2 class="text-lg font-semibold text-slate-900">{{ copy.alreadyProTitle }}</h2>
        <p class="mt-1 text-sm text-slate-500">{{ copy.alreadyProSubtitle }}</p>
        <a
          v-if="accountUrl"
          :href="accountUrl"
          class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-expenzey-600 hover:text-expenzey-700"
        >
          {{ copy.manageSubscription }}
          <FaIcon icon="fa-arrow-up-right-from-square" size="xs" />
        </a>
      </div>
    </div>

    <template v-else>
      <div class="flex items-center gap-3">
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-expenzey-100 text-expenzey-600"
          aria-hidden="true"
        >
          <FaIcon icon="fa-crown" size="lg" />
        </div>
        <h2 class="text-lg font-semibold text-slate-900">{{ copy.licenseTitle }}</h2>
      </div>
      <p class="mt-2 text-sm leading-relaxed text-slate-500">{{ copy.licenseSubtitle }}</p>

      <label class="mt-6 block text-sm font-semibold text-slate-900" :for="inputId">
        {{ copy.licenseInputLabel }}
      </label>
      <div class="relative mt-2">
        <FaIcon
          icon="fa-key"
          size="sm"
          icon-class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          :id="inputId"
          v-model="licenseKey"
          type="text"
          :placeholder="copy.licensePlaceholder"
          class="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-expenzey-500 focus:outline-none focus:ring-1 focus:ring-expenzey-500"
        />
      </div>

      <p v-if="error" class="mt-3 text-sm text-rose-600">{{ error }}</p>
      <p v-if="success" class="mt-3 text-sm text-emerald-600">{{ copy.activationSuccess }}</p>

      <button
        type="button"
        class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-expenzey-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-expenzey-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        :disabled="!licenseKey.trim() || activating"
        @click="activateLicense"
      >
        <FaIcon icon="fa-lock" size="sm" />
        {{ activating ? copy.activating : copy.activateLicense }}
      </button>

      <p class="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
        <FaIcon icon="fa-lock" size="xs" />
        {{ copy.licenseSecure }}
      </p>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import { refreshPlan } from "@/composables/usePlan";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import { getWpConfig } from "@/services/wp/applyWpBootstrap";
import { clearWpRestCache, getWpRestErrorMessage, wpRestFetch } from "@/services/wp/wpRestClient";

const props = withDefaults(
  defineProps<{
    inputId?: string;
    embedded?: boolean;
  }>(),
  {
    inputId: "license-key",
    embedded: false,
  }
);

type LicensingUrlsResponse = {
  enabled: boolean;
  upgradeUrl: string | null;
  accountUrl: string | null;
  isPro?: boolean;
};

type ActivationResponse = {
  success: boolean;
  plan: "free" | "pro";
};

const copy = useReactiveLocaleStringRecord("pro", [
  "licenseTitle",
  "licenseSubtitle",
  "licenseInputLabel",
  "licensePlaceholder",
  "activateLicense",
  "activating",
  "activationSuccess",
  "licenseSecure",
  "alreadyProTitle",
  "alreadyProSubtitle",
  "manageSubscription",
] as const);

const licenseKey = ref("");
const activating = ref(false);
const error = ref<string | null>(null);
const success = ref(false);
const isPro = ref(false);
const accountUrl = ref<string | null>(null);

const inputId = computed(() => props.inputId);

onMounted(() => {
  const config = getWpConfig();
  if (config?.licensing?.isPro) {
    isPro.value = true;
  }
  if (config?.licensing?.accountUrl) {
    accountUrl.value = config.licensing.accountUrl;
  }
});

async function activateLicense() {
  const key = licenseKey.value.trim();
  if (!key || activating.value) return;

  activating.value = true;
  error.value = null;
  success.value = false;

  try {
    const result = await wpRestFetch<ActivationResponse>("/licensing/activate", {
      method: "POST",
      body: JSON.stringify({ licenseKey: key }),
      cacheTtlMs: 0,
    });
    if (result.plan === "pro") {
      success.value = true;
      isPro.value = true;
      clearWpRestCache();
      await refreshPlan();
    }
  } catch (e) {
    error.value = getWpRestErrorMessage(e, "Activation failed");
  } finally {
    activating.value = false;
  }
}
</script>
<style scoped>
#pro-license-key {
  text-indent: 1.25rem;
}
</style>