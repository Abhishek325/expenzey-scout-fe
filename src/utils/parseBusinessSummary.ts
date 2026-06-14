import { ensureLocaleString, formatLocaleTemplate } from "@/utils/formatLocaleTemplate";

export interface ParsedSummaryField {
  label: string;
  headline: string;
  subtext: string;
  headlineLarge?: boolean;
}

interface SummaryLabels {
  overview: unknown;
  topPerformer: unknown;
  needsAttention: unknown;
  opportunity: unknown;
  revenueIncreased: unknown;
  revenueDecreased: unknown;
  vsLastPeriod: unknown;
  salesDown: unknown;
  bundleHeadline: unknown;
  coPurchaseRate: unknown;
}

function asSummaryText(value: unknown): string {
  return ensureLocaleString(value);
}

export function parseOverview(text: unknown, labels: SummaryLabels): ParsedSummaryField {
  const source = asSummaryText(text);
  const match = source.match(/Revenue (increased|decreased) ([\d.]+)%/i);
  if (match) {
    const direction = match[1].toLowerCase();
    return {
      label:
        direction === "increased"
          ? ensureLocaleString(labels.revenueIncreased)
          : ensureLocaleString(labels.revenueDecreased),
      headline: `${match[2]}%`,
      subtext: ensureLocaleString(labels.vsLastPeriod),
      headlineLarge: true,
    };
  }

  return {
    label: ensureLocaleString(labels.overview),
    headline: source,
    subtext: "",
  };
}

export function parseTopPerformer(text: unknown, labels: SummaryLabels): ParsedSummaryField {
  const source = asSummaryText(text);
  const match = source.match(/^(.+?) generated (.+?) \(([-\d.]+)% growth\)\.?$/i);
  if (match) {
    const growth = parseFloat(match[3]);
    const arrow = growth >= 0 ? "↑" : "↓";
    return {
      label: ensureLocaleString(labels.topPerformer),
      headline: match[1].trim(),
      subtext: `${match[2].trim()} • ${arrow} ${Math.abs(growth)}%`,
    };
  }

  return {
    label: ensureLocaleString(labels.topPerformer),
    headline: source,
    subtext: "",
  };
}

export function parseNeedsAttention(text: unknown, labels: SummaryLabels): ParsedSummaryField {
  const source = asSummaryText(text);
  const declineMatch = source.match(/^(.+?) sales declined ([\d.]+)%\.?$/i);
  if (declineMatch) {
    return {
      label: ensureLocaleString(labels.needsAttention),
      headline: declineMatch[1].trim(),
      subtext: formatLocaleTemplate(labels.salesDown, { percent: declineMatch[2] }),
    };
  }

  return {
    label: ensureLocaleString(labels.needsAttention),
    headline: source,
    subtext: "",
  };
}

export function parseOpportunity(text: unknown, labels: SummaryLabels): ParsedSummaryField {
  const source = asSummaryText(text);
  const bundleMatch = source.match(/^Bundle (.+?) with (.+?) \(([\d.]+)% co-purchase rate\)\.?$/i);
  if (bundleMatch) {
    return {
      label: ensureLocaleString(labels.opportunity),
      headline: ensureLocaleString(labels.bundleHeadline),
      subtext: formatLocaleTemplate(labels.coPurchaseRate, { percent: bundleMatch[3] }),
    };
  }

  const returningMatch = source.match(/Returning customers grew ([\d.]+)%/i);
  if (returningMatch) {
    return {
      label: ensureLocaleString(labels.opportunity),
      headline: source.split("—")[0]?.trim() || source,
      subtext: ensureLocaleString(labels.vsLastPeriod),
    };
  }

  const sentence = source.split(/[.!]/)[0]?.trim() || source;
  return {
    label: ensureLocaleString(labels.opportunity),
    headline: sentence,
    subtext: "",
  };
}
