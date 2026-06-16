import type { DateRangeSelection } from "@/types/metrics";
import type {
  BusinessSummary,
  OpportunityDetail,
  OpportunityLifecycleStatus,
  OpportunityStateRecord,
  OpportunityStateSnapshot,
  ReviewIntelligence,
  ReviewIntelligenceDetail,
  WeeklyReportDetail,
} from "@/types/ai";
import type { RevenueChartGranularity } from "@/types/metrics";
import type {
  GenerateWeeklyReportOptions,
  GenerateWeeklyReportResult,
  WeeklyReportListItem,
} from "@/types/reports";

export interface IReportsService {
  getBusinessSummary(range: DateRangeSelection): Promise<BusinessSummary>;
  getOpportunities(range: DateRangeSelection): Promise<OpportunityDetail[]>;
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
  listWeeklyReports(): Promise<WeeklyReportListItem[]>;
  generateWeeklyReport(options?: GenerateWeeklyReportOptions): Promise<GenerateWeeklyReportResult>;
}

export const REPORTS_SERVICE_KEY = "reportsService";
