import { onMounted, ref } from "vue";
import { useLocalizedString } from "@/composables/useLocalizedString";
import { getWpConfig } from "@/services/wp/applyWpBootstrap";
import { wpRestFetch } from "@/services/wp/wpRestClient";

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

  async function load(): Promise<void> {
    checkoutUrl.value = marketingPricingUrl.value;

    const config = getWpConfig();
    if (config?.licensing?.enabled) {
      if (config.licensing.upgradeUrl) {
        checkoutUrl.value = config.licensing.upgradeUrl;
      }
      pricingPageUrl.value = config.licensing.pricingPageUrl ?? "";
      accountUrl.value = config.licensing.accountUrl ?? "";
      contactUrl.value = config.licensing.contactUrl ?? "";
      return;
    }

    try {
      const res = await wpRestFetch<LicensingUrls>("/licensing/urls", { cacheTtlMs: 30_000 });
      if (res.enabled) {
        if (res.upgradeUrl) {
          checkoutUrl.value = res.upgradeUrl;
        }
        pricingPageUrl.value = res.pricingPageUrl ?? "";
        accountUrl.value = res.accountUrl ?? "";
        contactUrl.value = res.contactUrl ?? "";
      }
    } catch {
      // Keep fallback URL.
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
    load,
  };
}
