import type { DateRangeSelection } from "@/types/metrics";
import type {
  BusinessSummary,
  OpportunityDetail,
  OpportunityLifecycleStatus,
  OpportunityStateRecord,
  OpportunityStateSnapshot,
  ReviewIntelligence,
  WeeklyReportDetail,
} from "@/types/ai";
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
  listWeeklyReports(): Promise<WeeklyReportListItem[]>;
  generateWeeklyReport(options?: GenerateWeeklyReportOptions): Promise<GenerateWeeklyReportResult>;
}

export const REPORTS_SERVICE_KEY = "reportsService";
