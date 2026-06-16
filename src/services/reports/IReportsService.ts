import type { DateRangeSelection } from "@/types/metrics";
import type {
  OpportunityDetail,
  OpportunityLifecycleStatus,
  OpportunityStateRecord,
  OpportunityStateSnapshot,
  ReviewIntelligence,
  ReviewIntelligenceDetail,
  WeeklyReportDetail,
} from "@/types/ai";
import type { RevenueChartGranularity } from "@/types/metrics";
import type { OpportunitiesListResponse } from "@/types/opportunities";
import type {
  GenerateWeeklyReportOptions,
  GenerateWeeklyReportResult,
} from "@/types/reports";
import type { WeeklyReportsListResponse } from "@/types/reportsList";

export interface IReportsService {
  getOpportunities(range: DateRangeSelection): Promise<OpportunitiesListResponse>;
  getOpportunityStates(): Promise<OpportunityStateRecord[]>;
  setOpportunityStatus(
    opportunityId: string,
    status: OpportunityLifecycleStatus,
    snapshot?: OpportunityStateSnapshot,
  ): Promise<void>;
  getWeeklyReportDetail(id?: string): Promise<WeeklyReportDetail>;
  getReviewIntelligence(range: DateRangeSelection): Promise<ReviewIntelligence>;
  getReviewIntelligenceDetail(
    range: DateRangeSelection,
    options?: { granularity?: RevenueChartGranularity; trendBuckets?: number },
  ): Promise<ReviewIntelligenceDetail>;
  listWeeklyReports(): Promise<WeeklyReportsListResponse>;
  generateWeeklyReport(options?: GenerateWeeklyReportOptions): Promise<GenerateWeeklyReportResult>;
}

export const REPORTS_SERVICE_KEY = "reportsService";
