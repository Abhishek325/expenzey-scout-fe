import { defineStore } from "pinia";
import type { IReportsService } from "@/services/reports/IReportsService";
import { useDateRangeStore } from "@/stores/dateRange";
import type { DateRangeSelection } from "@/types/metrics";
import type { OpportunityDetail } from "@/types/ai";
import {
  enrichDetection,
  enrichEvidence,
  enrichListMetric,
  FALLBACK_ACTION_TITLE_KEY,
} from "@/utils/opportunityEvidence";

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

export const useOpportunitiesStore = defineStore("opportunities", {
  state: () => ({
    items: [] as OpportunityDetail[],
    loading: false,
    error: null as string | null,
    loadedRangeKey: null as string | null,
  }),
  getters: {
    byId: (state) => {
      const map = new Map<string, OpportunityDetail>();
      for (const item of state.items) {
        map.set(item.id, item);
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
        this.items = (await reportsService.getOpportunities(selection)).map(
          normalizeOpportunity,
        );
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
  },
});
