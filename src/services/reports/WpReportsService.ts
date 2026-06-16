import type { IReportsService } from "@/services/reports/IReportsService";
import { wpRestFetch } from "@/services/wp/wpRestClient";
import { withDateRange, withReviewIntelligenceDetailQuery } from "@/services/wp/wpQueryUtils";
import type {
  OpportunityLifecycleStatus,
  OpportunityStateRecord,
  OpportunityStateSnapshot,
  OpportunityStatesResponse,
  ReviewIntelligence,
  ReviewIntelligenceDetail,
  WeeklyReportDetail,
} from "@/types/ai";
import type { OpportunitiesListResponse } from "@/types/opportunities";
import type {
  GenerateWeeklyReportOptions,
  GenerateWeeklyReportResult,
  WeeklyReportListItem,
} from "@/types/reports";
import type { WeeklyReportsListResponse } from "@/types/reportsList";
import type { DateRangeSelection, RevenueChartGranularity } from "@/types/metrics";

function normalizeReportsList(
  data: WeeklyReportsListResponse | WeeklyReportListItem[],
): WeeklyReportsListResponse {
  if (Array.isArray(data)) {
    return {
      items: data,
      totalCount: data.length,
      historyLimit: data.length,
      lockedCount: 0,
    };
  }
  return data;
}

function normalizeOpportunitiesList(
  data: OpportunitiesListResponse | OpportunitiesListResponse["items"],
): OpportunitiesListResponse {
  if (Array.isArray(data)) {
    return {
      items: data,
      freeVisibleCount: data.length,
      lockedCount: 0,
      lockedPreviews: [],
      total: data.length,
    };
  }
  return data;
}

export class WpReportsService implements IReportsService {
  async getOpportunities(range: DateRangeSelection): Promise<OpportunitiesListResponse> {
    const data = await wpRestFetch<OpportunitiesListResponse | OpportunitiesListResponse["items"]>(
      withDateRange("/ai/opportunities", range),
    );
    return normalizeOpportunitiesList(data);
  }

  async getOpportunityStates(): Promise<OpportunityStateRecord[]> {
    const response = await wpRestFetch<OpportunityStatesResponse>("/ai/opportunities/status");
    return response.items ?? [];
  }

  async setOpportunityStatus(
    opportunityId: string,
    status: OpportunityLifecycleStatus,
    snapshot?: OpportunityStateSnapshot,
  ): Promise<void> {
    await wpRestFetch<{ ok: boolean }>("/ai/opportunities/status", {
      method: "POST",
      body: JSON.stringify({ opportunityId, status, snapshot }),
    });
  }

  async getWeeklyReportDetail(id?: string): Promise<WeeklyReportDetail> {
    if (id) {
      return wpRestFetch<WeeklyReportDetail>(`/reports/${id}`);
    }
    return wpRestFetch<WeeklyReportDetail>("/reports/latest");
  }

  async getReviewIntelligence(range: DateRangeSelection): Promise<ReviewIntelligence> {
    return wpRestFetch<ReviewIntelligence>(withDateRange("/reviews/summary", range));
  }

  async getReviewIntelligenceDetail(
    range: DateRangeSelection,
    options?: { granularity?: RevenueChartGranularity; trendBuckets?: number },
  ): Promise<ReviewIntelligenceDetail> {
    return wpRestFetch<ReviewIntelligenceDetail>(
      withReviewIntelligenceDetailQuery("/reviews/summary", range, options),
    );
  }

  async listWeeklyReports(): Promise<WeeklyReportsListResponse> {
    const data = await wpRestFetch<WeeklyReportsListResponse | WeeklyReportListItem[]>("/reports");
    return normalizeReportsList(data);
  }

  async generateWeeklyReport(options?: GenerateWeeklyReportOptions): Promise<GenerateWeeklyReportResult> {
    const body = options
      ? { period_start: options.periodStart, period_end: options.periodEnd }
      : {};
    return wpRestFetch<GenerateWeeklyReportResult>("/reports/generate", {
      method: "POST",
      body: JSON.stringify(body),
      cacheTtlMs: 0,
    });
  }
}
