export interface WeeklyReportPeriodMetrics {
  revenue: number;
  revenueGrowthPercent: number;
  orders: number;
  ordersGrowthPercent: number;
}

export interface WeeklyReportTopProduct {
  productName: string;
  revenue: number;
  growthPercent: number;
  imageUrl?: string;
}

export interface WeeklyReportCustomerInsights {
  newCustomers: number;
  newCustomersGrowthPercent?: number;
  returningCustomers: number;
  returningGrowthPercent: number;
  averageOrderValue: number;
  averageOrderValueGrowthPercent: number;
  repeatRevenue: number;
  repeatRevenueGrowthPercent: number;
}

export interface WeeklyReportOpportunity {
  title: string;
  recommendation: string;
}

export interface WeeklyReportReviewIntelligence {
  sentimentScore?: number;
  sentimentChangePercent?: number;
  totalReviews?: number;
  topPositiveTheme?: string;
  topPositiveThemePercent?: number;
  topComplaintTheme?: string;
  topComplaintThemePercent?: number;
}

export interface WeeklyReportContent {
  executiveSummary: string;
  keyWins: string[];
  needsAttention: string[];
  topProducts: WeeklyReportTopProduct[];
  customerInsights: WeeklyReportCustomerInsights;
  periodMetrics: WeeklyReportPeriodMetrics;
  opportunities: WeeklyReportOpportunity[];
  recommendedActions: string[];
  reviewIntelligence?: WeeklyReportReviewIntelligence;
}

export interface ReportsPageMeta {
  priorWeekReportExists: boolean;
  priorWeekReportId: string | null;
  priorWeek: {
    periodStart: string;
    periodEnd: string;
    comparisonPeriodStart: string;
    comparisonPeriodEnd: string;
  };
  lastReportGeneratedAt: string | null;
  lastReportPeriodStart: string | null;
  lastReportPeriodEnd: string | null;
  nextScheduledAt: string;
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
  meta?: ReportsPageMeta;
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

export interface ReviewThemeDetail {
  theme: string;
  count: number;
  percentOfPositive?: number;
  percentOfNegative?: number;
}

export interface ReviewSentimentTrendPoint {
  periodStart: string;
  periodEnd: string;
  positivePercent: number;
  reviewCount: number;
}

export interface ReviewIntelligenceDetail extends Omit<
  ReviewIntelligence,
  "sentiment" | "complaintThemes" | "positiveMentions"
> {
  sentiment: {
    positive: number;
    positiveCount: number;
    neutral: number;
    neutralCount: number;
    negative: number;
    negativeCount: number;
  };
  positiveThemes: Array<{
    theme: string;
    count: number;
    percentOfPositive: number;
  }>;
  complaintThemes: Array<{
    theme: string;
    count: number;
    percentOfNegative: number;
  }>;
  sentimentTrend: ReviewSentimentTrendPoint[];
  recentNegativeReviews: Array<{
    id: string;
    productName: string;
    rating: number;
    content: string;
    date: string;
  }>;
}
