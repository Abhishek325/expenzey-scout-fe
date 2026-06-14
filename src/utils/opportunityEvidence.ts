import type {
  OpportunityDetail,
  OpportunityEvidenceItem,
  OpportunityListMetric,
} from "@/types/ai";

/** Locale key stored as action title when synthesizing from recommendation. */
export const FALLBACK_ACTION_TITLE_KEY = "drawer.defaultActionTitle";

export function asEvidenceArray(value: unknown): OpportunityEvidenceItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (entry): entry is OpportunityEvidenceItem =>
      entry != null &&
      typeof entry === "object" &&
      "label" in entry &&
      "value" in entry &&
      typeof (entry as OpportunityEvidenceItem).label === "string",
  );
}

export function findEvidenceValue(
  evidence: OpportunityEvidenceItem[],
  ...labels: string[]
): string | number | undefined {
  for (const label of labels) {
    const item = evidence.find(
      (entry) => entry.label.toLowerCase() === label.toLowerCase(),
    );
    if (item !== undefined) return item.value;
  }
  return undefined;
}

export function findEvidenceValueInOpportunity(
  opportunity: OpportunityDetail,
  ...labels: string[]
): string | number | undefined {
  return findEvidenceValue(asEvidenceArray(opportunity.evidence), ...labels);
}

export function parseRevenueSharePercent(opportunity: OpportunityDetail): number | null {
  const fromDetection = opportunity.detection.revenueSharePercent;
  if (fromDetection != null && !Number.isNaN(fromDetection)) {
    return fromDetection;
  }

  const shareEvidence = asEvidenceArray(opportunity.evidence).find((item) =>
    item.label.toLowerCase().includes("revenue share"),
  );
  if (!shareEvidence) return null;

  const parsed = parseFloat(String(shareEvidence.value).replace("%", "").trim());
  return Number.isNaN(parsed) ? null : parsed;
}

export function resolveDetectionCurrentValue(
  opportunity: OpportunityDetail,
): number | string | undefined {
  if (opportunity.detection.currentValue !== undefined) {
    return opportunity.detection.currentValue;
  }

  const evidence = asEvidenceArray(opportunity.evidence);

  if (opportunity.type === "bundle_opportunity") {
    return findEvidenceValue(evidence, "Combined orders");
  }

  if (opportunity.type === "review_complaint") {
    return findEvidenceValue(evidence, "Mentions in reviews");
  }

  if (opportunity.type === "customer_retention") {
    return findEvidenceValue(evidence, "Returning customers");
  }

  const revenue = findEvidenceValue(evidence, "Revenue");
  if (revenue !== undefined) return revenue;

  const metricLabel = opportunity.listMetric?.label?.toLowerCase() ?? "";
  if (metricLabel.includes("revenue") || metricLabel.includes("orders")) {
    return opportunity.listMetric?.value;
  }

  return undefined;
}

export function resolveDetectionPreviousValue(
  opportunity: OpportunityDetail,
): number | string | undefined {
  if (opportunity.detection.previousValue !== undefined) {
    return opportunity.detection.previousValue;
  }

  return findEvidenceValueInOpportunity(
    opportunity,
    "Previous revenue",
    "Previous period",
  );
}

export function enrichDetection(item: OpportunityDetail): OpportunityDetail["detection"] {
  const detection = item.detection ?? { summary: item.description };
  const evidence = asEvidenceArray(item.evidence);

  let currentValue = detection.currentValue;
  let previousValue = detection.previousValue;
  let metricLabel = detection.metricLabel;

  if (currentValue === undefined) {
    currentValue = resolveDetectionCurrentValue({ ...item, detection, evidence });
    if (metricLabel === undefined) {
      if (item.type === "bundle_opportunity") {
        metricLabel = "Combined orders";
      } else if (item.type === "review_complaint") {
        metricLabel = "Mentions in reviews";
      } else if (item.type === "customer_retention") {
        metricLabel = "Returning customers";
      } else {
        metricLabel = "Revenue this period";
      }
    }
  }

  if (previousValue === undefined) {
    previousValue = findEvidenceValue(evidence, "Previous revenue", "Previous period");
  }

  return {
    ...detection,
    currentValue,
    previousValue,
    metricLabel,
  };
}

export function enrichEvidence(
  item: OpportunityDetail,
  detection: OpportunityDetail["detection"],
): OpportunityEvidenceItem[] {
  const existing = asEvidenceArray(item.evidence);
  if (existing.length > 0) return existing;

  const items: OpportunityEvidenceItem[] = [];
  const seen = new Set<string>();

  const push = (
    label: string,
    value: string | number | undefined,
    extras?: Partial<OpportunityEvidenceItem>,
  ) => {
    if (value === undefined || value === null || value === "") return;
    const key = label.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    items.push({ label, value, ...extras });
  };

  if (detection.currentValue !== undefined) {
    push(detection.metricLabel ?? "Current period", detection.currentValue);
  }
  if (detection.previousValue !== undefined) {
    push("Previous period", detection.previousValue);
  }
  if (detection.growthPercent !== undefined) {
    push("Growth", `${detection.growthPercent}%`, {
      trend: `${detection.growthPercent > 0 ? "+" : ""}${detection.growthPercent}%`,
      trendDirection:
        detection.growthPercent > 0
          ? "up"
          : detection.growthPercent < 0
            ? "down"
            : "neutral",
    });
  }
  if (detection.revenueSharePercent !== undefined) {
    push("Revenue share", `${detection.revenueSharePercent}%`);
  }

  const listMetric = item.listMetric;
  if (listMetric?.label && listMetric.value) {
    push(listMetric.label, listMetric.value, {
      trend: listMetric.trendText,
      trendDirection: listMetric.trendDirection,
    });
  }

  if (item.estimatedImpact && item.estimatedImpact !== "—") {
    push("Estimated impact", item.estimatedImpact);
  }

  if (item.impact?.displayText && item.impact.displayText !== "—") {
    push("Business impact", item.impact.displayText);
  }

  if (item.type === "bundle_opportunity" && item.description) {
    const rateMatch = item.description.match(/([\d.]+)%/);
    if (rateMatch) {
      push("Co-purchase rate", `${rateMatch[1]}%`, { trendDirection: "neutral" });
    }
  }

  return items;
}

export function enrichListMetric(
  item: OpportunityDetail,
  detection: OpportunityDetail["detection"],
  evidence: OpportunityEvidenceItem[],
): OpportunityListMetric {
  if (item.listMetric?.label && item.listMetric.value) {
    return item.listMetric;
  }

  const revenue = evidence.find((entry) => entry.label.toLowerCase() === "revenue");
  if (revenue) {
    return {
      label: "Revenue",
      value: String(revenue.value),
      trendText: revenue.trend,
      trendDirection: revenue.trendDirection,
    };
  }

  if (detection.currentValue !== undefined) {
    return {
      label: detection.metricLabel ?? "Key metric",
      value: String(detection.currentValue),
    };
  }

  return {
    label: "",
    value: item.estimatedImpact ?? item.impact?.displayText ?? "—",
  };
}
