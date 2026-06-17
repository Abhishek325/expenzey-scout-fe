import { computed, onMounted, ref } from "vue";
import { useLocalizedString } from "@/composables/useLocalizedString";
import { getWpConfig } from "@/services/wp/applyWpBootstrap";
import { wpRestFetch } from "@/services/wp/wpRestClient";
import { isFreemiusCheckoutUrl } from "@/utils/freemiusCheckout";

export type LicensingUrls = {
  enabled: boolean;
  upgradeUrl: string | null;
  pricingPageUrl: string | null;
  accountUrl: string | null;
  contactUrl: string | null;
  isPro?: boolean;
  paidPlanId?: string | null;
};

export function useLicensingUrls() {
  const checkoutUrl = ref("");
  const pricingPageUrl = ref("");
  const accountUrl = ref("");
  const contactUrl = ref("");
  const marketingPricingUrl = useLocalizedString("pro", "pricingUrl");
  const freemiusCheckoutReady = computed(() => isFreemiusCheckoutUrl(checkoutUrl.value));

  function applyLicensingUrls(licensing: LicensingUrls): void {
    if (licensing.upgradeUrl) {
      checkoutUrl.value = licensing.upgradeUrl;
    }
    pricingPageUrl.value = licensing.pricingPageUrl ?? "";
    accountUrl.value = licensing.accountUrl ?? "";
    contactUrl.value = licensing.contactUrl ?? "";
  }

  async function load(): Promise<void> {
    const config = getWpConfig();
    if (config?.licensing?.upgradeUrl) {
      applyLicensingUrls(config.licensing);
      return;
    }

    try {
      const res = await wpRestFetch<LicensingUrls>("/licensing/urls", { cacheTtlMs: 0 });
      if (res.upgradeUrl) {
        applyLicensingUrls(res);
      }
    } catch {
      // Leave checkoutUrl empty — never fall back to expenzey.com/pricing for checkout.
    }
  }

  onMounted(() => {
    void load();
  });

  return {
    checkoutUrl,
    pricingPageUrl,
    accountUrl,
    contactUrl,
    marketingPricingUrl,
    freemiusCheckoutReady,
    load,
  };
}
