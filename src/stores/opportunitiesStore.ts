import { defineStore } from "pinia";
import type { IReportsService } from "@/services/reports/IReportsService";
import { useDateRangeStore } from "@/stores/dateRange";
import type { DateRangeSelection } from "@/types/metrics";
import type {
  OpportunityDetail,
  OpportunityLifecycleStatus,
  OpportunityStateRecord,
} from "@/types/ai";
import {
  enrichDetection,
  enrichEvidence,
  enrichListMetric,
  FALLBACK_ACTION_TITLE_KEY,
} from "@/utils/opportunityEvidence";
import {
  buildOpportunitySnapshot,
  getCompletedActionIndices,
} from "@/utils/opportunitySnapshot";

function isArchivedStatus(status: OpportunityStateRecord["status"]): boolean {
  return status === "done" || status === "dismissed";
}

function normalizeOpportunity(item: OpportunityDetail): OpportunityDetail {
  const fallbackImpactText = item.estimatedImpact ?? "—";
  const detection = enrichDetection(item);
  const evidence = enrichEvidence(item, detection);
  const listMetric = enrichListMetric(item, detection, evidence);

  return {
    ...item,
    generatedAt: item.generatedAt ?? new Date().toISOString(),
    detection,
    evidence,
    impact: item.impact ?? {
      impactType: "revenue",
      displayText: fallbackImpactText,
      confidence: "medium",
    },
    actions:
      item.actions ??
      (item.recommendation
        ? [{ title: FALLBACK_ACTION_TITLE_KEY, description: item.recommendation }]
        : []),
    relatedIds: item.relatedIds ?? [],
    listMetric,
    impactLevel: item.impactLevel ?? "medium",
    estimatedImpact: item.estimatedImpact ?? item.impact?.displayText,
  };
}

function detailFromStateRecord(
  record: OpportunityStateRecord,
  current?: OpportunityDetail,
): OpportunityDetail {
  if (current) return current;
  return normalizeOpportunity({
    id: record.opportunityId,
    type: record.snapshot.type ?? "rising_product",
    badge: record.snapshot.badge ?? "Quick Win",
    priority: record.snapshot.priority ?? "MEDIUM",
    title: record.snapshot.title ?? record.opportunityId,
    description: record.snapshot.description ?? "",
    recommendation: record.snapshot.recommendation ?? "",
    generatedAt: record.updatedAt,
    detection: record.snapshot.detection ?? { summary: "" },
    evidence: record.snapshot.evidence ?? [],
    impact: record.snapshot.impact ?? {
      impactType: "revenue",
      displayText: record.snapshot.estimatedImpact ?? "—",
      confidence: "medium",
    },
    actions: record.snapshot.actions ?? [],
    relatedIds: record.snapshot.relatedIds ?? [],
    listMetric: record.snapshot.listMetric ?? { label: "", value: "—" },
    impactLevel: record.snapshot.impactLevel ?? "medium",
    estimatedImpact: record.snapshot.estimatedImpact,
    productName: record.snapshot.productName,
    productImageUrl: record.snapshot.productImageUrl,
  });
}

export const useOpportunitiesStore = defineStore("opportunities", {
  state: () => ({
    items: [] as OpportunityDetail[],
    states: [] as OpportunityStateRecord[],
    loading: false,
    error: null as string | null,
    loadedRangeKey: null as string | null,
  }),
  getters: {
    statesById: (state) => {
      const map = new Map<string, OpportunityStateRecord>();
      for (const record of state.states) {
        map.set(record.opportunityId, record);
      }
      return map;
    },
    statusOf() {
      return (id: string): OpportunityLifecycleStatus => {
        const record = this.statesById.get(id);
        return record?.status ?? "active";
      };
    },
    completedActionIndices() {
      return (id: string): number[] => {
        return getCompletedActionIndices(this.statesById.get(id));
      };
    },
    activeItems(state): OpportunityDetail[] {
      return state.items.filter((item) => {
        const record = this.statesById.get(item.id);
        return !record || !isArchivedStatus(record.status);
      });
    },
    archivedItems(): OpportunityDetail[] {
      const itemsById = new Map(this.items.map((item) => [item.id, item]));
      return this.states
        .filter((record) => isArchivedStatus(record.status))
        .map((record) => detailFromStateRecord(record, itemsById.get(record.opportunityId)));
    },
    archivedCount(): number {
      return this.states.filter((record) => isArchivedStatus(record.status)).length;
    },
    byId(): Map<string, OpportunityDetail> {
      const map = new Map<string, OpportunityDetail>();
      for (const item of this.items) {
        map.set(item.id, item);
      }
      for (const archived of this.archivedItems) {
        if (!map.has(archived.id)) {
          map.set(archived.id, archived);
        }
      }
      return map;
    },
  },
  actions: {
    async fetchForRange(
      reportsService: IReportsService,
      selection: DateRangeSelection,
      rangeKey: string,
      force = false,
    ) {
      if (!force && this.loadedRangeKey === rangeKey && this.items.length > 0) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const [items, states] = await Promise.all([
          reportsService.getOpportunities(selection),
          reportsService.getOpportunityStates(),
        ]);
        this.items = items.map(normalizeOpportunity);
        this.states = states;
        this.loadedRangeKey = rangeKey;
      } catch (e) {
        this.error = e instanceof Error ? e.message : "error";
        this.items = [];
        this.loadedRangeKey = null;
      } finally {
        this.loading = false;
      }
    },
    async ensureLoaded(reportsService: IReportsService, force = false) {
      const dateRange = useDateRangeStore();
      await this.fetchForRange(
        reportsService,
        dateRange.selection,
        dateRange.rangeKey,
        force,
      );
    },
    async reload(reportsService: IReportsService) {
      await this.ensureLoaded(reportsService, true);
    },
    async setStatus(
      reportsService: IReportsService,
      opportunityId: string,
      status: OpportunityLifecycleStatus,
      item?: OpportunityDetail,
    ) {
      const previousStates = [...this.states];
      const existing = this.states.find((s) => s.opportunityId === opportunityId);
      const existingProgress = getCompletedActionIndices(existing);

      if (status === "active") {
        this.states = this.states.filter((s) => s.opportunityId !== opportunityId);
      } else {
        const snapshot = item
          ? buildOpportunitySnapshot(
              item,
              existingProgress.length > 0 ? { completed: existingProgress } : undefined,
            )
          : (existing?.snapshot ?? {});
        const record: OpportunityStateRecord = {
          opportunityId,
          status: status as OpportunityStateRecord["status"],
          snapshot,
          updatedAt: new Date().toISOString(),
        };
        this.states = [
          record,
          ...this.states.filter((s) => s.opportunityId !== opportunityId),
        ];
      }

      try {
        const snapshot =
          status === "active"
            ? undefined
            : item
              ? buildOpportunitySnapshot(
                  item,
                  existingProgress.length > 0 ? { completed: existingProgress } : undefined,
                )
              : existing?.snapshot;
        await reportsService.setOpportunityStatus(opportunityId, status, snapshot);
      } catch (e) {
        this.states = previousStates;
        throw e;
      }
    },
    async toggleActionComplete(
      reportsService: IReportsService,
      opportunity: OpportunityDetail,
      actionIndex: number,
    ) {
      const previousStates = [...this.states];
      const existing = this.states.find((s) => s.opportunityId === opportunity.id);
      const current = new Set(getCompletedActionIndices(existing));

      if (current.has(actionIndex)) {
        current.delete(actionIndex);
      } else {
        current.add(actionIndex);
      }

      const completed = [...current].sort((a, b) => a - b);
      const snapshot = buildOpportunitySnapshot(opportunity, { completed });
      const record: OpportunityStateRecord = {
        opportunityId: opportunity.id,
        status: "in_progress",
        snapshot,
        updatedAt: new Date().toISOString(),
      };

      if (completed.length === 0) {
        this.states = this.states.filter((s) => s.opportunityId !== opportunity.id);
        try {
          await reportsService.setOpportunityStatus(opportunity.id, "active");
        } catch (e) {
          this.states = previousStates;
          throw e;
        }
        return;
      }

      this.states = [
        record,
        ...this.states.filter((s) => s.opportunityId !== opportunity.id),
      ];

      try {
        await reportsService.setOpportunityStatus(opportunity.id, "in_progress", snapshot);
      } catch (e) {
        this.states = previousStates;
        throw e;
      }
    },
  },
});
