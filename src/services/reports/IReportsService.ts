import type { DateRangeSelection } from "@/types/metrics";
import type {
  AIOpportunity,
  BusinessSummary,
  ReviewIntelligence,
  WeeklyReportDetail,
} from "@/types/ai";
import type { AISummary, WeeklyReport } from "@/types/reports";

export interface IReportsService {
  getAISummary(): Promise<AISummary>;
  getBusinessSummary(range: DateRangeSelection): Promise<BusinessSummary>;
  getOpportunities(range: DateRangeSelection): Promise<AIOpportunity[]>;
  getWeeklyReportDetail(id?: string): Promise<WeeklyReportDetail>;
  getReviewIntelligence(range: DateRangeSelection): Promise<ReviewIntelligence>;
  listWeeklyReports(): Promise<WeeklyReport[]>;
  generateWeeklyReport(): Promise<WeeklyReport>;
}

export const REPORTS_SERVICE_KEY = "reportsService";
