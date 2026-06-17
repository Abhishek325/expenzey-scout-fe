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
          <h3 class="text-lg font-semibold text-slate-900">{{ copy.purchaseTitle }}</h3>
        </div>

        <p class="mt-2 text-sm leading-relaxed text-slate-500">{{ copy.purchaseSubtitle }}</p>

        <ul class="mt-4 space-y-2.5">
          <li
            v-for="benefit in benefits"
            :key="benefit"
            class="flex items-start gap-2 text-sm text-slate-700"
          >
            <FaIcon icon="fa-circle-check" size="sm" icon-class="mt-0.5 shrink-0 text-emerald-500" />
            <span>{{ benefit }}</span>
          </li>
        </ul>

        <button
          type="button"
          class="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-expenzey-500 bg-white px-4 py-2.5 text-sm font-semibold text-expenzey-600 transition hover:bg-expenzey-50 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="!freemiusCheckoutReady"
          @click="pricingOpen = true"
        >
          <FaIcon icon="fa-cart-shopping" size="sm" />
          {{ copy.viewPricing }}
        </button>
      </div>

      <div class="p-6 lg:p-8">
        <LicenseActivationWidget input-id="pro-license-key" embedded />
      </div>
    </div>

    <PricingCheckoutModal
      :open="pricingOpen"
      :checkout-url="checkoutUrl"
      :freemius-checkout-ready="freemiusCheckoutReady"
      :contact-url="contactUrl"
      :marketing-pricing-url="marketingPricingUrl"
      @close="pricingOpen = false"
      @refresh-licensing="load"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import PricingCheckoutModal from "@/components/pro/PricingCheckoutModal.vue";
import LicenseActivationWidget from "@/components/shared/LicenseActivationWidget.vue";
import { useLicensingUrls } from "@/composables/useLicensingUrls";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";

const copy = useReactiveLocaleStringRecord("pro", [
  "purchaseTitle",
  "purchaseSubtitle",
  "purchaseBenefit1",
  "purchaseBenefit2",
  "purchaseBenefit3",
  "purchaseBenefit4",
  "purchaseBenefit5",
  "viewPricing",
] as const);

const benefits = computed(() => [
  copy.value.purchaseBenefit1,
  copy.value.purchaseBenefit2,
  copy.value.purchaseBenefit3,
  copy.value.purchaseBenefit4,
  copy.value.purchaseBenefit5,
]);

const pricingOpen = ref(false);
const { checkoutUrl, contactUrl, marketingPricingUrl, freemiusCheckoutReady, load } = useLicensingUrls();
</script>
