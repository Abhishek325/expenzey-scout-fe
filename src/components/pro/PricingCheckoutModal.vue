<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[10004] flex items-center justify-center p-4"
      @keydown="onKeydown"
    >
      <button
        type="button"
        class="absolute inset-0 bg-slate-900/50"
        :aria-label="copy.pricingModalClose"
        @click="close"
      />

      <div
        class="relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        :aria-label="copy.pricingModalTitle"
      >
        <div class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 class="text-lg font-semibold text-slate-900">{{ copy.pricingModalTitle }}</h2>
            <p class="mt-1 text-sm text-slate-500">{{ copy.pricingModalSubtitle }}</p>
          </div>
          <button
            type="button"
            class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            :aria-label="copy.pricingModalClose"
            @click="close"
          >
            <FaIcon icon="fa-xmark" size="sm" />
          </button>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto">
          <div class="border-b border-slate-200 bg-slate-50 px-4 py-4">
            <div
              v-if="loadingPricing"
              class="flex h-64 flex-col items-center justify-center gap-3 text-sm text-slate-500"
              role="status"
              :aria-label="copy.pricingModalLoading"
            >
              <FaIcon
                icon="fa-spinner"
                size="lg"
                icon-class="sync-now-spinner text-expenzey-600"
              />
              <span>{{ copy.pricingModalLoading }}</span>
            </div>
            <div
              v-show="!loadingPricing && hasFreemiusPricing"
              id="expenzey-pricing-mount"
              class="expenzey-pricing-mount min-h-[16rem]"
            />
            <ul v-if="!loadingPricing && !hasFreemiusPricing" class="space-y-3">
              <li
                v-for="feature in highlightFeatures"
                :key="feature.id"
                class="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
              >
                <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-expenzey-50 text-expenzey-600"
                  aria-hidden="true"
                >
                  <FaIcon :icon="feature.icon" size="sm" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-slate-900">{{ featureTitle(feature.id) }}</p>
                  <p class="mt-0.5 text-xs text-slate-500">{{ featureDescription(feature.id) }}</p>
                </div>
              </li>
            </ul>
          </div>

          <div class="px-5 py-5">
            <h3 class="text-sm font-semibold text-slate-900">{{ copy.pricingModalHelpTitle }}</h3>
            <ul class="mt-3 space-y-2">
              <li v-if="marketingPricingUrl">
                <a
                  :href="marketingPricingUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm font-medium text-expenzey-600 hover:text-expenzey-700"
                >
                  {{ copy.pricingModalHelpWebsite }}
                  <FaIcon icon="fa-arrow-up-right-from-square" size="xs" />
                </a>
              </li>
              <li v-if="contactUrl">
                <a
                  :href="contactUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm font-medium text-expenzey-600 hover:text-expenzey-700"
                >
                  {{ copy.pricingModalHelpContact }}
                  <FaIcon icon="fa-arrow-up-right-from-square" size="xs" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-slate-200 bg-slate-50 px-5 py-4">
          <p class="mb-3 text-xs text-slate-500">{{ copy.pricingModalSecureNote }}</p>
          <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              @click="close"
            >
              {{ copy.pricingModalClose }}
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-expenzey-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-expenzey-700 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="!checkoutUrl || checkoutLoading"
              @click="continueToCheckout"
            >
              <FaIcon
                :icon="checkoutLoading ? 'fa-spinner' : 'fa-cart-shopping'"
                size="sm"
                :icon-class="checkoutLoading ? 'sync-now-spinner' : undefined"
              />
              {{ copy.pricingModalContinueCheckout }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { inject, nextTick, ref, watch } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import comparisonFeatures from "@/data/pro/comparison-features.json";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import { getWpConfig } from "@/services/wp/applyWpBootstrap";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";
import { resolveFreemiusCheckoutUrl } from "@/utils/freemiusCheckout";

interface ComparisonFeature {
  id: string;
  icon: string;
}

const highlightFeatures = (comparisonFeatures as ComparisonFeature[]).slice(0, 5);

const props = defineProps<{
  open: boolean;
  checkoutUrl: string;
  contactUrl: string;
  marketingPricingUrl: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const stringService = inject(STRING_SERVICE_KEY) as IStringService;

const copy = useReactiveLocaleStringRecord("pro", [
  "pricingModalTitle",
  "pricingModalSubtitle",
  "pricingModalContinueCheckout",
  "pricingModalSecureNote",
  "pricingModalHelpTitle",
  "pricingModalHelpWebsite",
  "pricingModalHelpContact",
  "pricingModalClose",
  "pricingModalLoading",
] as const);

const loadingPricing = ref(false);
const checkoutLoading = ref(false);
const hasFreemiusPricing = ref(false);

function featureTitle(id: string) {
  return stringService.getStrings("pro", `features.${id}.title`);
}

function featureDescription(id: string) {
  return stringService.getStrings("pro", `features.${id}.description`);
}

function clearMount() {
  const mount = document.getElementById("expenzey-pricing-mount");
  if (mount) {
    mount.innerHTML = "";
  }
}

function waitForPricingMount(timeoutMs = 5000): Promise<void> {
  return new Promise((resolve) => {
    const mount = document.getElementById("expenzey-pricing-mount");
    if (!mount) {
      resolve();
      return;
    }

    if (mount.children.length > 0) {
      resolve();
      return;
    }

    const observer = new MutationObserver(() => {
      if (mount.children.length > 0) {
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(mount, { childList: true, subtree: true });

    window.setTimeout(() => {
      observer.disconnect();
      resolve();
    }, timeoutMs);
  });
}

async function mountFreemiusPricing() {
  const config = getWpConfig()?.licensing?.pricingConfig;
  if (!config || !window.Freemius?.pricing?.new) {
    hasFreemiusPricing.value = false;
    loadingPricing.value = false;
    return;
  }

  hasFreemiusPricing.value = true;
  clearMount();

  await nextTick();

  try {
    window.Freemius.pricing.new({
      ...config,
      selector: "#expenzey-pricing-mount",
    });
    await waitForPricingMount();
  } catch {
    hasFreemiusPricing.value = false;
    clearMount();
  } finally {
    loadingPricing.value = false;
  }
}

function close() {
  emit("close");
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    close();
  }
}

async function continueToCheckout() {
  if (!props.checkoutUrl || checkoutLoading.value) {
    return;
  }

  checkoutLoading.value = true;

  try {
    const mount = document.getElementById("expenzey-pricing-mount");
    const checkoutTarget = hasFreemiusPricing.value
      ? await resolveFreemiusCheckoutUrl(props.checkoutUrl, mount)
      : props.checkoutUrl;

    const target = window.top ?? window;
    target.location.href = checkoutTarget;
  } finally {
    checkoutLoading.value = false;
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      loadingPricing.value = true;
      hasFreemiusPricing.value = false;
      void mountFreemiusPricing();
      return;
    }
    loadingPricing.value = false;
    hasFreemiusPricing.value = false;
    clearMount();
  }
);
</script>

<style scoped>
.expenzey-pricing-mount :deep(.fs-section) {
  margin: 0;
  padding: 0;
}

.expenzey-pricing-mount :deep(.fs-full-size-wrapper) {
  max-width: none;
}

/* Checkout is handled by the modal footer — hide Freemius in-widget upgrade buttons. */
.expenzey-pricing-mount :deep(.fs-upgrade-button-container) {
  display: none !important;
}

.expenzey-pricing-mount :deep(.fs-currencies) {
  display: none !important;
}
</style>
