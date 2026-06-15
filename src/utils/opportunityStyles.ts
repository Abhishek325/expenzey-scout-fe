import type { AIOpportunity } from "@/types/ai";

const BADGE_STYLES: Record<
  string,
  {
    cardClass: string;
    labelClass: string;
    impactClass: string;
    badgeIcon: string;
    thumbClass: string;
  }
> = {
  "High Impact": {
    cardClass: "border-emerald-200 bg-emerald-50/50",
    labelClass: "text-emerald-700",
    impactClass: "text-emerald-700",
    badgeIcon: "fa-fire",
    thumbClass: "bg-emerald-100 text-emerald-700",
  },
  "Needs Attention": {
    cardClass: "border-rose-200 bg-rose-50/50",
    labelClass: "text-rose-700",
    impactClass: "text-rose-700",
    badgeIcon: "fa-triangle-exclamation",
    thumbClass: "bg-rose-100 text-rose-700",
  },
  "Quick Win": {
    cardClass: "border-orange-200 bg-orange-50/50",
    labelClass: "text-orange-700",
    impactClass: "text-orange-700",
    badgeIcon: "fa-bolt",
    thumbClass: "bg-orange-100 text-orange-700",
  },
  "Growth Opportunity": {
    cardClass: "border-sky-200 bg-sky-50/50",
    labelClass: "text-sky-700",
    impactClass: "text-sky-700",
    badgeIcon: "fa-arrow-trend-up",
    thumbClass: "bg-sky-100 text-sky-700",
  },
  Risk: {
    cardClass: "border-amber-200 bg-amber-50/50",
    labelClass: "text-amber-700",
    impactClass: "text-amber-700",
    badgeIcon: "fa-shield-halved",
    thumbClass: "bg-amber-100 text-amber-700",
  },
};

export const TYPE_ICONS: Record<string, string> = {
  rising_product: "fa-arrow-trend-up",
  declining_product: "fa-arrow-trend-down",
  bundle_opportunity: "fa-link",
  customer_retention: "fa-users",
  review_complaint: "fa-shield-halved",
};

export const TYPE_ICON_CLASSES: Record<string, string> = {
  rising_product: "text-emerald-600 bg-emerald-50",
  declining_product: "text-rose-600 bg-rose-50",
  bundle_opportunity: "text-orange-600 bg-orange-50",
  customer_retention: "text-sky-600 bg-sky-50",
  review_complaint: "text-amber-600 bg-amber-50",
};

export const FILTER_TABS = [
  { id: "all", badges: null },
  { id: "highImpact", badges: ["High Impact"] },
  { id: "quickWins", badges: ["Quick Win"] },
  { id: "needsAttention", badges: ["Needs Attention", "Risk"] },
  { id: "growth", badges: ["Growth Opportunity"] },
] as const;

export type OpportunityFilterTab =
  | (typeof FILTER_TABS)[number]["id"]
  | "archived";

export function badgeStyle(badge: string) {
  return BADGE_STYLES[badge] ?? BADGE_STYLES["Quick Win"];
}

export function resolveProductImageUrl(
  opportunity: AIOpportunity,
  imageByName: Map<string, string>,
): string | undefined {
  const direct = opportunity.productImageUrl?.trim();
  if (direct) return direct;

  const name = opportunity.productName?.trim().toLowerCase();
  if (!name) return undefined;

  return imageByName.get(name);
}

export const IMPACT_LEVEL_DOTS: Record<string, number> = {
  high: 4,
  medium: 3,
  low: 2,
};

export const PRIORITY_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };
