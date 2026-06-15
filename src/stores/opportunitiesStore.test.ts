import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IReportsService } from "@/services/reports/IReportsService";
import type { OpportunityDetail } from "@/types/ai";
import { useOpportunitiesStore } from "./opportunitiesStore";

function makeOpportunity(id: string, overrides: Partial<OpportunityDetail> = {}): OpportunityDetail {
  return {
    id,
    type: "rising_product",
    badge: "High Impact",
    priority: "HIGH",
    title: `Opportunity ${id}`,
    description: "Description",
    recommendation: "Recommendation",
    generatedAt: "2026-01-01T00:00:00.000Z",
    detection: { summary: "Detected" },
    evidence: [],
    impact: {
      impactType: "revenue",
      displayText: "$100",
      confidence: "medium",
    },
    actions: [{ title: "Act", description: "Do the thing" }],
    relatedIds: [],
    listMetric: { label: "Revenue", value: "$100" },
    impactLevel: "high",
    ...overrides,
  };
}

function createReportsService(
  overrides: Partial<IReportsService> = {},
): IReportsService {
  return {
    getAISummary: vi.fn(),
    getBusinessSummary: vi.fn(),
    getOpportunities: vi.fn(),
    getOpportunityStates: vi.fn().mockResolvedValue([]),
    setOpportunityStatus: vi.fn().mockResolvedValue(undefined),
    getWeeklyReportDetail: vi.fn(),
    getReviewIntelligence: vi.fn(),
    listWeeklyReports: vi.fn(),
    generateWeeklyReport: vi.fn(),
    ...overrides,
  };
}

describe("useOpportunitiesStore status logic", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("treats opportunities without state as active", () => {
    const store = useOpportunitiesStore();
    store.items = [makeOpportunity("opp-1")];

    expect(store.statusOf("opp-1")).toBe("active");
    expect(store.activeItems).toHaveLength(1);
    expect(store.archivedItems).toHaveLength(0);
  });

  it("excludes done and dismissed opportunities from activeItems", () => {
    const store = useOpportunitiesStore();
    const item = makeOpportunity("opp-1");
    store.items = [item, makeOpportunity("opp-2")];
    store.states = [
      {
        opportunityId: "opp-1",
        status: "done",
        updatedAt: "2026-01-02T00:00:00.000Z",
        snapshot: { title: item.title },
      },
    ];

    expect(store.activeItems.map((o) => o.id)).toEqual(["opp-2"]);
    expect(store.archivedCount).toBe(1);
    expect(store.statusOf("opp-1")).toBe("done");
  });

  it("builds archivedItems from snapshot when item is not in current range", () => {
    const store = useOpportunitiesStore();
    store.items = [];
    store.states = [
      {
        opportunityId: "archived-1",
        status: "dismissed",
        updatedAt: "2026-01-02T00:00:00.000Z",
        snapshot: {
          title: "Old opportunity",
          badge: "Quick Win",
          type: "bundle_opportunity",
        },
      },
    ];

    expect(store.archivedItems).toHaveLength(1);
    expect(store.archivedItems[0]?.title).toBe("Old opportunity");
    expect(store.byId.get("archived-1")?.badge).toBe("Quick Win");
  });

  it("setStatus optimistically archives and calls the API", async () => {
    const store = useOpportunitiesStore();
    const item = makeOpportunity("opp-1");
    store.items = [item];
    const reportsService = createReportsService();

    await store.setStatus(reportsService, "opp-1", "done", item);

    expect(store.statusOf("opp-1")).toBe("done");
    expect(store.activeItems).toHaveLength(0);
    expect(reportsService.setOpportunityStatus).toHaveBeenCalledWith(
      "opp-1",
      "done",
      expect.objectContaining({ id: "opp-1", title: item.title }),
    );
  });

  it("setStatus rolls back when the API fails", async () => {
    const store = useOpportunitiesStore();
    const item = makeOpportunity("opp-1");
    store.items = [item];
    const reportsService = createReportsService({
      setOpportunityStatus: vi.fn().mockRejectedValue(new Error("network")),
    });

    await expect(store.setStatus(reportsService, "opp-1", "done", item)).rejects.toThrow(
      "network",
    );

    expect(store.statusOf("opp-1")).toBe("active");
    expect(store.states).toHaveLength(0);
  });

  it("toggleActionComplete tracks in_progress and clears back to active", async () => {
    const store = useOpportunitiesStore();
    const item = makeOpportunity("opp-1", {
      actions: [
        { title: "One", description: "First" },
        { title: "Two", description: "Second" },
      ],
    });
    store.items = [item];
    const reportsService = createReportsService();

    await store.toggleActionComplete(reportsService, item, 0);

    expect(store.statusOf("opp-1")).toBe("in_progress");
    expect(store.completedActionIndices("opp-1")).toEqual([0]);
    expect(reportsService.setOpportunityStatus).toHaveBeenLastCalledWith(
      "opp-1",
      "in_progress",
      expect.objectContaining({
        actionProgress: { completed: [0] },
      }),
    );

    await store.toggleActionComplete(reportsService, item, 0);

    expect(store.statusOf("opp-1")).toBe("active");
    expect(store.completedActionIndices("opp-1")).toEqual([]);
    expect(reportsService.setOpportunityStatus).toHaveBeenLastCalledWith("opp-1", "active");
  });
});
