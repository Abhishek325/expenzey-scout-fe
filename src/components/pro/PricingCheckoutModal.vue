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
        class="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
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
          <div class="relative border-b border-slate-200 bg-slate-50">
            <div
              v-if="loadingPricing"
              class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-50/90 text-sm text-slate-500"
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
              id="expenzey-pricing-mount"
              class="expenzey-pricing-mount min-h-[16rem]"
              :class="{ hidden: !hasFreemiusPricing && !loadingPricing }"
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
          <p v-if="checkoutError" class="mb-3 text-sm text-red-600">{{ checkoutError }}</p>
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
              :disabled="!freemiusCheckoutReady || checkoutLoading"
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
import { wpRestFetch } from "@/services/wp/wpRestClient";
import { resolveFreemiusCheckoutUrl } from "@/utils/freemiusCheckout";

interface ComparisonFeature {
  id: string;
  icon: string;
}

const highlightFeatures = (comparisonFeatures as ComparisonFeature[]).slice(0, 5);

const props = defineProps<{
  open: boolean;
  checkoutUrl: string;
  freemiusCheckoutReady: boolean;
  contactUrl: string;
  marketingPricingUrl: string;
}>();

const emit = defineEmits<{
  close: [];
  refreshLicensing: [];
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
  "pricingModalCheckoutUnavailable",
] as const);

const loadingPricing = ref(false);
const checkoutLoading = ref(false);
const checkoutError = ref("");
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

function waitForFreemiusPricing(timeoutMs = 10000): Promise<boolean> {
  if (window.Freemius?.pricing?.new) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      if (window.Freemius?.pricing?.new) {
        window.clearInterval(timer);
        resolve(true);
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        window.clearInterval(timer);
        resolve(false);
      }
    }, 50);
  });
}

async function loadPricingConfig(): Promise<Record<string, unknown> | null> {
  const bootstrapConfig = getWpConfig()?.licensing?.pricingConfig;
  if (bootstrapConfig) {
    return bootstrapConfig;
  }

  try {
    const response = await wpRestFetch<{
      pricingConfig?: Record<string, unknown> | null;
    }>("/licensing/urls", { cacheTtlMs: 0 });
    return response.pricingConfig ?? null;
  } catch {
    return null;
  }
}

function waitForPricingMount(timeoutMs = 10000): Promise<boolean> {
  return new Promise((resolve) => {
    const mount = document.getElementById("expenzey-pricing-mount");
    if (!mount) {
      resolve(false);
      return;
    }

    if (mount.children.length > 0) {
      resolve(true);
      return;
    }

    const observer = new MutationObserver(() => {
      if (mount.children.length > 0) {
        observer.disconnect();
        resolve(true);
      }
    });

    observer.observe(mount, { childList: true, subtree: true });

    window.setTimeout(() => {
      observer.disconnect();
      resolve(mount.children.length > 0);
    }, timeoutMs);
  });
}

async function mountFreemiusPricing() {
  const [config, freemiusReady] = await Promise.all([
    loadPricingConfig(),
    waitForFreemiusPricing(),
  ]);

  if (!config || !freemiusReady || !window.Freemius?.pricing?.new) {
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

    const mounted = await waitForPricingMount();
    if (!mounted) {
      hasFreemiusPricing.value = false;
      clearMount();
    }
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
  if (!props.freemiusCheckoutReady || checkoutLoading.value) {
    return;
  }

  checkoutLoading.value = true;
  checkoutError.value = "";

  try {
    const mount = document.getElementById("expenzey-pricing-mount");
    const checkoutTarget = await resolveFreemiusCheckoutUrl(props.checkoutUrl, mount);
    const target = window.top ?? window;
    target.location.href = checkoutTarget;
  } catch {
    checkoutError.value = copy.value.pricingModalCheckoutUnavailable;
  } finally {
    checkoutLoading.value = false;
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      checkoutError.value = "";
      loadingPricing.value = true;
      hasFreemiusPricing.value = false;
      emit("refreshLicensing");
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
</style>
<style>
#expenzey-pricing-mount .fs-upgrade-button-container,
#expenzey-pricing-mount .fs-upgrade-button, .fs-plugin-title-and-logo,
#expenzey-pricing-mount .fs-free-plan, .fs-page-title, .fs-annual-discount,
#expenzey-pricing-mount .fs-currencies {
  display: none !important;
}
.fs-section--billing-cycles {
  margin-top: 0 !important;
}
.fs-packages-nav {
  width: auto !important;
}
.fs-packages-nav ul.fs-packages {
  width: 100% !important;
}
.fs-featured-plan {
  float: none !important;
  margin: auto !important;
  width: 55% !important;
}


/* Chips */
/* Keep everything on one line within the group */
.fs-plan-features-with-value > li > .fs-feature-title {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 2px;
  align-items: center;
}

/* Individual chips */
.fs-plan-features-with-value > li > .fs-feature-title > span {
  display: inline-flex !important;
  width: auto !important;
  margin: 0;
  padding: 4px 10px;
  border-radius: 50px;
  background: #2171b1;
  font-size: 10px;
  white-space: nowrap;
  color: #ffffff;
}

.fs-plan-features-with-value > li > span.fs-tooltip {
  display: none !important;
}

/* Cancel bold from <strong> */
.fs-plan-features-with-value strong {
  font-weight: inherit !important;
}

/* Optional: keep tooltip inline too */
.fs-plan-features-with-value li {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.fs-section--faq .fs-section--faq-items .fs-section--faq-item h3 {
  background: #2171b1 !important;
}
</style>
