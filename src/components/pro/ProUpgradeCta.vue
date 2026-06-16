<template>
  <section
    class="overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-expenzey-50 via-white to-indigo-50 shadow-sm"
  >
    <div class="grid lg:grid-cols-2">
      <div class="border-b border-slate-200 p-6 lg:border-b-0 lg:border-r lg:p-8">
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

        <label class="mt-6 block text-sm font-semibold text-slate-900" for="license-key">
          {{ copy.licenseInputLabel }}
        </label>
        <div class="relative mt-2">
          <FaIcon
            icon="fa-key"
            size="sm"
            icon-class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            id="license-key"
            v-model="licenseKey"
            type="text"
            :placeholder="copy.licensePlaceholder"
            class="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-expenzey-500 focus:outline-none focus:ring-1 focus:ring-expenzey-500"
          />
        </div>

        <button
          type="button"
          class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-expenzey-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-expenzey-700 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="!licenseKey.trim()"
          @click="activateLicense"
        >
          <FaIcon icon="fa-lock" size="sm" />
          {{ copy.activateLicense }}
        </button>

        <p class="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <FaIcon icon="fa-lock" size="xs" />
          {{ copy.licenseSecure }}
        </p>
      </div>

      <div class="border-b border-slate-200 p-6 lg:border-b-0 lg:p-8">
        <div class="flex items-stretch gap-6">
          <div class="min-w-0 flex-1">
            <h3 class="text-lg font-semibold text-slate-900">{{ copy.purchaseTitle }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-500">{{ copy.purchaseSubtitle }}</p>

            <ul class="mt-4 space-y-2.5">
              <li
                v-for="benefit in benefits"
                :key="benefit"
                class="flex items-start gap-2 text-sm text-slate-700"
              >
                <FaIcon
                  icon="fa-circle-check"
                  size="sm"
                  icon-class="mt-0.5 shrink-0 text-emerald-500"
                />
                <span>{{ benefit }}</span>
              </li>
            </ul>

            <a
              :href="copy.pricingUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-expenzey-500 bg-white px-4 py-2.5 text-sm font-semibold text-expenzey-600 transition hover:bg-expenzey-50"
            >
              <FaIcon icon="fa-cart-shopping" size="sm" />
              {{ copy.viewPricing }}
              <FaIcon icon="fa-arrow-up-right-from-square" size="xs" />
            </a>

            <p class="mt-3 text-xs text-slate-500">{{ copy.moneyBackGuarantee }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";

const licenseKey = ref("");

const copy = useReactiveLocaleStringRecord("pro", [
  "licenseTitle",
  "licenseSubtitle",
  "licenseInputLabel",
  "licensePlaceholder",
  "activateLicense",
  "licenseSecure",
  "purchaseTitle",
  "purchaseSubtitle",
  "purchaseBenefit1",
  "purchaseBenefit2",
  "purchaseBenefit3",
  "purchaseBenefit4",
  "purchaseBenefit5",
  "viewPricing",
  "pricingUrl",
  "moneyBackGuarantee",
] as const);

const benefits = computed(() => [
  copy.value.purchaseBenefit1,
  copy.value.purchaseBenefit2,
  copy.value.purchaseBenefit3,
  copy.value.purchaseBenefit4,
  copy.value.purchaseBenefit5,
]);

function activateLicense() {
  // License activation API not yet implemented.
}
</script>
