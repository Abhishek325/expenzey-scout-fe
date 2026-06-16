import { getWpConfig } from "@/services/wp/applyWpBootstrap";
import { wpRestFetch } from "@/services/wp/wpRestClient";

export type FreemiusCheckoutSelection = {
  billing_cycle?: string;
  plan_id?: string;
  pricing_id?: string;
  currency?: string;
};

function getPaidPackageRoot(mount: HTMLElement): HTMLElement | null {
  return (
    mount.querySelector<HTMLElement>(".fs-package.fs-featured-plan") ??
    mount.querySelector<HTMLElement>(".fs-package:not(.fs-free-plan)") ??
    null
  );
}

export function getFreemiusPricingSelection(
  mount: HTMLElement | null
): FreemiusCheckoutSelection {
  if (!mount) {
    return {};
  }

  const paidPackage = getPaidPackageRoot(mount);
  const selection: FreemiusCheckoutSelection = {};

  const billing =
    mount.querySelector<HTMLElement>(".fs-selected-billing-cycle[data-billing-cycle]") ??
    paidPackage?.querySelector<HTMLElement>(".fs-selected-billing-cycle[data-billing-cycle]");
  if (billing?.dataset.billingCycle) {
    selection.billing_cycle = billing.dataset.billingCycle;
  }

  const pricingRow =
    paidPackage?.querySelector<HTMLElement>(
      ".fs-license-quantity-container.fs-license-quantity-selected[data-pricing-id]"
    ) ??
    mount.querySelector<HTMLElement>(
      ".fs-package:not(.fs-free-plan) .fs-license-quantity-container.fs-license-quantity-selected[data-pricing-id]"
    );
  if (pricingRow?.dataset.pricingId) {
    selection.pricing_id = pricingRow.dataset.pricingId;
  }

  const paidPlanId = getWpConfig()?.licensing?.paidPlanId;
  if (paidPlanId) {
    selection.plan_id = paidPlanId;
  }

  const paidPricingId = getWpConfig()?.licensing?.paidPricingId;
  if (!selection.pricing_id && paidPricingId) {
    selection.pricing_id = paidPricingId;
  }

  const currency = mount.querySelector<HTMLSelectElement>(".fs-currencies select");
  if (currency?.value) {
    selection.currency = currency.value;
  }

  return selection;
}

export function buildFreemiusCheckoutUrl(
  baseCheckoutUrl: string,
  mount: HTMLElement | null = document.getElementById("expenzey-pricing-mount")
): string {
  const selection = getFreemiusPricingSelection(mount);

  try {
    const url = new URL(baseCheckoutUrl, window.location.origin);
    for (const [key, value] of Object.entries(selection)) {
      if (value) {
        url.searchParams.set(key, value);
      }
    }
    return url.toString();
  } catch {
    return baseCheckoutUrl;
  }
}

export async function resolveFreemiusCheckoutUrl(
  baseCheckoutUrl: string,
  mount: HTMLElement | null = document.getElementById("expenzey-pricing-mount")
): Promise<string> {
  const selection = getFreemiusPricingSelection(mount);

  try {
    const response = await wpRestFetch<{ checkoutUrl: string }>("/licensing/checkout-url", {
      method: "POST",
      body: {
        billing_cycle: selection.billing_cycle ?? "annual",
        pricing_id: selection.pricing_id ?? null,
      },
    });

    if (response.checkoutUrl) {
      return response.checkoutUrl;
    }
  } catch {
    // Fall back to client-built URL below.
  }

  return buildFreemiusCheckoutUrl(baseCheckoutUrl, mount);
}
