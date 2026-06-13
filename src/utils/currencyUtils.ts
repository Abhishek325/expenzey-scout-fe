export function resolveIntlLocale(locale: string): string {
  const normalized = locale.toLowerCase().replace("_", "-");
  if (normalized === "en-us" || normalized === "en") {
    return "en-US";
  }
  return normalized;
}

export function formatCurrencyAmount(
  amount: number,
  currency: string,
  locale = "en-US",
  maximumFractionDigits?: number
): string {
  const code = currency.trim().toUpperCase();
  if (!code) {
    return amount.toLocaleString(locale, {
      ...(maximumFractionDigits !== undefined ? { maximumFractionDigits } : {}),
    });
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    ...(maximumFractionDigits !== undefined ? { maximumFractionDigits } : {}),
  }).format(amount);
}

export function formatCompactCurrencyAxis(
  amount: number,
  currency: string,
  locale = "en-US"
): string {
  const code = currency.trim().toUpperCase();
  if (!code) {
    return amount >= 1000 ? `${Math.round(amount / 1000)}K` : String(Math.round(amount));
  }

  if (amount === 0) {
    return formatCurrencyAmount(0, currency, locale, 0);
  }

  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).formatToParts(amount >= 1000 ? 1000 : amount);

  const symbol = parts.find((part) => part.type === "currency")?.value ?? currency;

  if (amount >= 1000) {
    return `${symbol}${Math.round(amount / 1000)}K`;
  }

  return formatCurrencyAmount(amount, currency, locale, 0);
}
