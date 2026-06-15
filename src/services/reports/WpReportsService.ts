import type { IReportsService } from "@/services/reports/IReportsService";
import { wpRestFetch } from "@/services/wp/wpRestClient";
import { withDateRange } from "@/services/wp/wpQueryUtils";
import type {
  BusinessSummary,
  OpportunityDetail,
  OpportunityLifecycleStatus,
  OpportunityStateRecord,
  OpportunityStateSnapshot,
  OpportunityStatesResponse,
  ReviewIntelligence,
  WeeklyReportDetail,
} from "@/types/ai";
import type {
  GenerateWeeklyReportOptions,
  GenerateWeeklyReportResult,
  WeeklyReportListItem,
} from "@/types/reports";
import type { DateRangeSelection } from "@/types/metrics";

export class WpReportsService implements IReportsService {
  async getBusinessSummary(range: DateRangeSelection): Promise<BusinessSummary> {
    return wpRestFetch<BusinessSummary>(withDateRange("/ai/business-summary", range));
  }

  async getOpportunities(range: DateRangeSelection): Promise<OpportunityDetail[]> {
    return wpRestFetch<OpportunityDetail[]>(withDateRange("/ai/opportunities", range));
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

  async listWeeklyReports(): Promise<WeeklyReportListItem[]> {
    return wpRestFetch<WeeklyReportListItem[]>("/reports");
  }

  async generateWeeklyReport(options?: GenerateWeeklyReportOptions): Promise<GenerateWeeklyReportResult> {
    const body = options
      ? { period_start: options.periodStart, period_end: options.periodEnd }
      : {};
    return wpRestFetch<GenerateWeeklyReportResult>("/reports/generate", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
}
