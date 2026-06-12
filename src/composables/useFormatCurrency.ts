import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/appStore";
import {
  formatCompactCurrencyAxis,
  formatCurrencyAmount,
  resolveIntlLocale,
} from "@/utils/currencyUtils";

export function useFormatCurrency() {
  const appStore = useAppStore();
  const { currency, locale } = storeToRefs(appStore);

  const intlLocale = computed(() => resolveIntlLocale(locale.value));

  function formatCurrency(
    amount: number,
    options?: { maximumFractionDigits?: number }
  ): string {
    return formatCurrencyAmount(
      amount,
      currency.value,
      intlLocale.value,
      options?.maximumFractionDigits
    );
  }

  function formatCompactAxis(amount: number): string {
    return formatCompactCurrencyAxis(amount, currency.value, intlLocale.value);
  }

  return { formatCurrency, formatCompactAxis, currency, locale: intlLocale };
}
