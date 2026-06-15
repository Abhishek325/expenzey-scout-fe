export type WeeklyReportStatus = "completed" | "pending" | "failed";

export interface ReportKeyHighlight {
  text: string;
  tone: "positive" | "negative";
}

export interface WeeklyReportListItem {
  id: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  status: WeeklyReportStatus;
  summaryKey: string;
  downloadUrl: string;
  summary: string;
  revenueGrowthPercent: number;
  opportunityCount: number;
  attentionCount: number;
  keyHighlights: ReportKeyHighlight[];
  comparisonPeriodStart: string;
  comparisonPeriodEnd: string;
}

/** @deprecated Use WeeklyReportListItem */
export type WeeklyReport = WeeklyReportListItem;

export interface GenerateWeeklyReportOptions {
  periodStart?: string;
  periodEnd?: string;
}

export interface GenerateWeeklyReportResult extends WeeklyReportListItem {
  content?: import("@/types/ai").WeeklyReportContent;
  existing?: boolean;
}
