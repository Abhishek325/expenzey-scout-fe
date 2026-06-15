import { describe, expect, it } from "vitest";
import type { OpportunityDetail, OpportunityStateRecord } from "@/types/ai";
import { buildOpportunitySnapshot, getCompletedActionIndices } from "./opportunitySnapshot";

function makeOpportunity(overrides: Partial<OpportunityDetail> = {}): OpportunityDetail {
  return {
    id: "opp-1",
    type: "rising_product",
    badge: "High Impact",
    priority: "HIGH",
    title: "Rising product",
    description: "Sales are up",
    recommendation: "Increase inventory",
    generatedAt: "2026-01-01T00:00:00.000Z",
    detection: { summary: "Revenue grew 25%" },
    evidence: [],
    impact: {
      impactType: "revenue",
      displayText: "$500/mo",
      confidence: "high",
    },
    actions: [
      { title: "Restock", description: "Order more units" },
      { title: "Promote", description: "Feature on homepage" },
    ],
    relatedIds: [],
    listMetric: { label: "Revenue", value: "$1,200" },
    impactLevel: "high",
    estimatedImpact: "$500/mo",
    productName: "Widget",
    ...overrides,
  };
}

describe("buildOpportunitySnapshot", () => {
  it("copies display fields from the opportunity", () => {
    const item = makeOpportunity();
    const snapshot = buildOpportunitySnapshot(item);

    expect(snapshot).toEqual({
      id: "opp-1",
      type: "rising_product",
      badge: "High Impact",
      priority: "HIGH",
      title: "Rising product",
      description: "Sales are up",
      recommendation: "Increase inventory",
      impactLevel: "high",
      listMetric: { label: "Revenue", value: "$1,200" },
      estimatedImpact: "$500/mo",
      productName: "Widget",
      productImageUrl: undefined,
      actions: item.actions,
    });
  });

  it("includes actionProgress when provided", () => {
    const snapshot = buildOpportunitySnapshot(makeOpportunity(), { completed: [0, 2] });
    expect(snapshot.actionProgress).toEqual({ completed: [0, 2] });
  });

  it("omits actionProgress when not provided", () => {
    const snapshot = buildOpportunitySnapshot(makeOpportunity());
    expect(snapshot.actionProgress).toBeUndefined();
  });
});

describe("getCompletedActionIndices", () => {
  it("returns an empty array when record is missing", () => {
    expect(getCompletedActionIndices()).toEqual([]);
  });

  it("returns completed indices from the snapshot", () => {
    const record: OpportunityStateRecord = {
      opportunityId: "opp-1",
      status: "in_progress",
      updatedAt: "2026-01-02T00:00:00.000Z",
      snapshot: {
        title: "Rising product",
        actionProgress: { completed: [1] },
      },
    };

    expect(getCompletedActionIndices(record)).toEqual([1]);
  });
});
