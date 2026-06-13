import { formatCurrencyAmount, resolveIntlLocale } from "@/utils/currencyUtils";

/** Rewrite USD-style amounts in AI prose to the store currency. */
export function sanitizeMonetaryText(
  text: string,
  currency: string,
  locale = "en-US",
): string {
  const code = currency.trim().toUpperCase();
  if (!code || !text.trim()) return text;
  if (code === "USD") return text;

  const intlLocale = resolveIntlLocale(locale);

  let result = text.replace(/\$\s?([\d,]+(?:\.\d{1,2})?)/g, (match, amountStr: string) => {
    const amount = parseFloat(amountStr.replace(/,/g, ""));
    if (Number.isNaN(amount)) return match;
    const fractionDigits = amountStr.includes(".") ? 2 : 0;
    return formatCurrencyAmount(amount, code, intlLocale, fractionDigits);
  });

  result = result.replace(/\bUSD\s?([\d,]+(?:\.\d{1,2})?)/gi, (match, amountStr: string) => {
    const amount = parseFloat(amountStr.replace(/,/g, ""));
    if (Number.isNaN(amount)) return match;
    const fractionDigits = amountStr.includes(".") ? 2 : 0;
    return formatCurrencyAmount(amount, code, intlLocale, fractionDigits);
  });

  return result.replace(/\bUS\$|\bUSD\b/gi, code);
}
