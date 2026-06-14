import { computed, inject, provide, toValue, type InjectionKey, type MaybeRefOrGetter } from "vue";
import { useFormatCurrency } from "@/composables/useFormatCurrency";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import type { OpportunityDetail, OpportunityEvidenceItem } from "@/types/ai";
import {
  findEvidenceValueInOpportunity,
  parseRevenueSharePercent,
  resolveDetectionCurrentValue,
  resolveDetectionPreviousValue,
} from "@/utils/opportunityEvidence";

interface ComparisonCard {
  id: string;
  label: string;
  value: string;
  tone?: "positive" | "negative" | "neutral";
}

interface RevenueShareRing {
  percent: number;
}

interface HighlightedEvidenceItem extends OpportunityEvidenceItem {
  highlighted: boolean;
}

const TYPE_EVIDENCE_HIGHLIGHTS: Record<string, string[]> = {
  rising_product: ["Revenue", "Orders", "Revenue share"],
  bundle_opportunity: ["Co-purchase rate", "Combined orders", "Anchor product", "Paired product"],
  declining_product: ["Revenue", "Previous revenue", "Orders"],
  customer_retention: ["Returning customers", "New customers", "Store revenue"],
  review_complaint: ["Mentions in reviews", "Previous period", "Average rating"],
};

const TYPE_FOCUS_KEYS: Record<string, string> = {
  rising_product: "drawer.typeFocus.risingProduct",
  bundle_opportunity: "drawer.typeFocus.bundleOpportunity",
  declining_product: "drawer.typeFocus.decliningProduct",
  customer_retention: "drawer.typeFocus.customerRetention",
  review_complaint: "drawer.typeFocus.reviewComplaint",
};

const REVENUE_OPPORTUNITY_TYPES = new Set(["rising_product", "declining_product"]);

const EVIDENCE_EXCLUDED_LABELS = new Set([
  "estimated impact",
  "business impact",
  "estimate basis",
]);

type OpportunityInvestigation = ReturnType<typeof useOpportunityInvestigation>;

export const OPPORTUNITY_INVESTIGATION_KEY: InjectionKey<OpportunityInvestigation> =
  Symbol("opportunityInvestigation");

export function provideOpportunityInvestigation(
  opportunity: MaybeRefOrGetter<OpportunityDetail>,
): OpportunityInvestigation {
  const investigation = useOpportunityInvestigation(opportunity);
  provide(OPPORTUNITY_INVESTIGATION_KEY, investigation);
  return investigation;
}

export function useOpportunityInvestigationContext(): OpportunityInvestigation {
  const investigation = inject(OPPORTUNITY_INVESTIGATION_KEY);
  if (!investigation) {
    throw new Error(
      "useOpportunityInvestigationContext must be used within OpportunityDetailDrawer",
    );
  }
  return investigation;
}

function buildContextBlock(
  opportunity: OpportunityDetail,
  labels: Record<string, string>,
): string {
  const evidenceLines = opportunity.evidence
    .slice(0, 6)
    .map((item) => `- ${item.label}: ${item.value}${item.trend ? ` (${item.trend})` : ""}`)
    .join("\n");
  const actionsLines = opportunity.actions
    .map((action, index) => `${index + 1}. ${action.title}: ${action.description}`)
    .join("\n");

  return [
    `${labels.opportunity}: ${opportunity.title}`,
    `${labels.type}: ${opportunity.type}`,
    opportunity.productName ? `${labels.product}: ${opportunity.productName}` : null,
    `${labels.detection}: ${opportunity.detection.summary}`,
    opportunity.detection.growthPercent != null
      ? `${labels.growth}: ${opportunity.detection.growthPercent}%`
      : null,
    `${labels.impact}: ${opportunity.impact.displayText}`,
    evidenceLines ? `${labels.supportingData}:\n${evidenceLines}` : null,
    actionsLines ? `${labels.recommendedActions}:\n${actionsLines}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function useOpportunityInvestigation(
  opportunity: MaybeRefOrGetter<OpportunityDetail>,
) {
  const { formatCurrency } = useFormatCurrency();

  const copy = useReactiveLocaleStringRecord("opportunities", [
    "drawer.insightBannerRevenueShare",
    "drawer.actionPlanIntro",
    "drawer.actionPlanOutro",
    "drawer.promptContext.opportunity",
    "drawer.promptContext.type",
    "drawer.promptContext.product",
    "drawer.promptContext.detection",
    "drawer.promptContext.growth",
    "drawer.promptContext.impact",
    "drawer.promptContext.supportingData",
    "drawer.promptContext.recommendedActions",
    "drawer.impactRangePerMonth",
  ] as const);

  function formatDetectionValue(value: number | string | undefined): string {
    if (value === undefined || value === null || value === "") return "—";
    if (typeof value === "number") return formatCurrency(value);
    return String(value);
  }

  const comparisonCards = computed((): ComparisonCard[] => {
    const opp = toValue(opportunity);
    const detection = opp.detection;
    const cards: ComparisonCard[] = [];

    if (opp.type === "bundle_opportunity") {
      const combinedOrders = resolveDetectionCurrentValue(opp);
      if (combinedOrders !== undefined) {
        cards.push({
          id: "current",
          label: detection.metricLabel ?? "drawer.combinedOrders",
          value: formatDetectionValue(combinedOrders),
        });
      }

      const coPurchase = findEvidenceValueInOpportunity(opp, "Co-purchase rate");
      if (coPurchase !== undefined) {
        cards.push({
          id: "coPurchase",
          label: "drawer.coPurchaseRate",
          value: String(coPurchase),
          tone: "positive",
        });
      }

      const smallerRevenue = findEvidenceValueInOpportunity(opp, "Smaller product revenue");
      if (smallerRevenue !== undefined) {
        cards.push({
          id: "smallerRevenue",
          label: "drawer.smallerProductRevenue",
          value: String(smallerRevenue),
        });
      }

      return cards;
    }

    const currentValue = resolveDetectionCurrentValue(opp);
    if (currentValue !== undefined) {
      const currentLabel = REVENUE_OPPORTUNITY_TYPES.has(opp.type)
        ? "drawer.currentRevenue"
        : (detection.metricLabel ?? "drawer.currentPeriod");
      cards.push({
        id: "current",
        label: currentLabel.startsWith("drawer.")
          ? currentLabel
          : currentLabel,
        value: formatDetectionValue(currentValue),
      });
    }

    const previousValue = resolveDetectionPreviousValue(opp);
    if (previousValue !== undefined) {
      cards.push({
        id: "previous",
        label: REVENUE_OPPORTUNITY_TYPES.has(opp.type)
          ? "drawer.previousRevenue"
          : "drawer.previousPeriod",
        value: formatDetectionValue(previousValue),
      });
    }

    if (detection.growthPercent !== undefined) {
      const growth = detection.growthPercent;
      cards.push({
        id: "growth",
        label: "drawer.growth",
        value: `${growth > 0 ? "+" : ""}${growth}%`,
        tone: growth >= 0 ? "positive" : "negative",
      });
    } else {
      const share = parseRevenueSharePercent(opp);
      if (share != null) {
        cards.push({
          id: "revenueShare",
          label: "drawer.revenueShare",
          value: `${share}%`,
          tone: "positive",
        });
      }
    }

    return cards;
  });

  const insightBanner = computed(() => {
    const opp = toValue(opportunity);
    if (opp.insightBanner) return opp.insightBanner;

    const share = parseRevenueSharePercent(opp);
    if (share != null) {
      return copy.value["drawer.insightBannerRevenueShare"].replace(
        "{percent}",
        String(share),
      );
    }

    return null;
  });

  const revenueShareRing = computed((): RevenueShareRing | null => {
    const share = parseRevenueSharePercent(toValue(opportunity));
    if (share == null) return null;
    return { percent: Math.min(100, Math.max(0, share)) };
  });

  const typeFocusKey = computed(() => {
    const type = toValue(opportunity).type;
    return TYPE_FOCUS_KEYS[type] ?? null;
  });

  const highlightedEvidence = computed((): HighlightedEvidenceItem[] => {
    const opp = toValue(opportunity);
    const highlights = (TYPE_EVIDENCE_HIGHLIGHTS[opp.type] ?? []).map((label) =>
      label.toLowerCase(),
    );

    const sorted = [...opp.evidence]
      .filter((item) => !EVIDENCE_EXCLUDED_LABELS.has(item.label.toLowerCase()))
      .sort((a, b) => {
        const aIndex = highlights.indexOf(a.label.toLowerCase());
        const bIndex = highlights.indexOf(b.label.toLowerCase());
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });

    const primary = sorted.filter((item) =>
      highlights.includes(item.label.toLowerCase()),
    );
    const display = (primary.length > 0 ? primary : sorted).slice(0, 4);

    return display.map((item) => ({
      ...item,
      highlighted: highlights.includes(item.label.toLowerCase()),
    }));
  });

  const actionPlanPrompt = computed(() => {
    const opp = toValue(opportunity);
    const context = buildContextBlock(opp, {
      opportunity: copy.value["drawer.promptContext.opportunity"],
      type: copy.value["drawer.promptContext.type"],
      product: copy.value["drawer.promptContext.product"],
      detection: copy.value["drawer.promptContext.detection"],
      growth: copy.value["drawer.promptContext.growth"],
      impact: copy.value["drawer.promptContext.impact"],
      supportingData: copy.value["drawer.promptContext.supportingData"],
      recommendedActions: copy.value["drawer.promptContext.recommendedActions"],
    });
    return `${copy.value["drawer.actionPlanIntro"]}\n\n${context}\n\n${copy.value["drawer.actionPlanOutro"]}`;
  });

  const impactRangeText = computed(() => {
    const range = toValue(opportunity).impact?.estimatedRange;
    if (!range) return null;
    const formatted = `${formatCurrency(range.min)} – ${formatCurrency(range.max)}`;
    return copy.value["drawer.impactRangePerMonth"].replace("{range}", formatted);
  });

  const currentOpportunity = computed(() => toValue(opportunity));

  return {
    opportunity: currentOpportunity,
    comparisonCards,
    insightBanner,
    revenueShareRing,
    typeFocusKey,
    highlightedEvidence,
    actionPlanPrompt,
    impactRangeText,
    formatDetectionValue,
  };
}
