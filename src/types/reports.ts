export type WeeklyReportStatus = "completed" | "pending" | "failed";

export interface AISummaryProductInsight {
  productName: string;
  revenue: number;
  growthPercent: number;
}

export interface AISummaryGrowthOpportunity {
  textKey: string;
}

export interface AISummary {
  topPerformer: AISummaryProductInsight;
  needsAttention: AISummaryProductInsight;
  growthOpportunity: AISummaryGrowthOpportunity;
}

export interface WeeklyReport {
  id: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  status: WeeklyReportStatus;
  summaryKey: string;
  downloadUrl: string;
}
