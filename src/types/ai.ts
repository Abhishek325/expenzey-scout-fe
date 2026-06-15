export interface BusinessSummary {
  overview: string;
  topPerformer: string;
  needsAttention: string;
  opportunity: string;
  generatedAt: string;
  cached?: boolean;
}

export interface WeeklyReportContent {
  overview: string;
  revenueAnalysis: string;
  productAnalysis: string;
  customerAnalysis: string | null;
  risks: string[] | string;
  opportunities: string[] | string;
  recommendedActions: string[];
}

export interface WeeklyReportDetail {
  id: string | null;
  title: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  generatedAt: string | null;
  status: string | null;
  reportType?: string | null;
  content: WeeklyReportContent | null;
}

export interface AIOpportunity {
  id: string;
  type: string;
  badge: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  recommendation: string;
  estimatedImpact?: string;
  productName?: string;
  productImageUrl?: string;
}

export interface OpportunityDetection {
  summary: string;
  currentValue?: number | string;
  previousValue?: number | string;
  growthPercent?: number;
  metricLabel?: string;
  revenueSharePercent?: number;
}

export interface OpportunityEvidenceItem {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
}

export interface OpportunityImpact {
  impactType: "revenue" | "retention" | "risk";
  estimatedValue?: number;
  estimatedRange?: { min: number; max: number };
  displayText: string;
  confidence: "high" | "medium" | "low";
}

export interface OpportunityAction {
  title: string;
  description: string;
}

export interface OpportunityListMetric {
  label: string;
  value: string;
  trendText?: string;
  trendDirection?: "up" | "down" | "neutral";
}

export interface OpportunityDetail extends AIOpportunity {
  generatedAt: string;
  detection: OpportunityDetection;
  evidence: OpportunityEvidenceItem[];
  impact: OpportunityImpact;
  actions: OpportunityAction[];
  relatedIds: string[];
  listMetric: OpportunityListMetric;
  impactLevel: "high" | "medium" | "low";
  insightBanner?: string;
}

export type OpportunityLifecycleStatus = "active" | "in_progress" | "done" | "dismissed";

export interface OpportunityActionProgress {
  completed: number[];
}

export interface OpportunityStateSnapshot extends Partial<OpportunityDetail> {
  actionProgress?: OpportunityActionProgress;
}

export interface OpportunityStateRecord {
  opportunityId: string;
  status: "in_progress" | "done" | "dismissed";
  snapshot: OpportunityStateSnapshot;
  updatedAt: string;
}

export interface OpportunityStatesResponse {
  items: OpportunityStateRecord[];
}

export interface ReviewIntelligence {
  averageRating: number;
  totalReviews: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  complaintThemes: string[];
  positiveMentions: string[];
  recentReviews: Array<{
    id: string;
    productName: string;
    rating: number;
    content: string;
    date: string;
  }>;
}
