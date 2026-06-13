import type { IReportsService } from "@/services/reports/IReportsService";
import { wpRestFetch } from "@/services/wp/wpRestClient";
import { withDateRange } from "@/services/wp/wpQueryUtils";
import type {
  AIOpportunity,
  BusinessSummary,
  ReviewIntelligence,
  WeeklyReportDetail,
} from "@/types/ai";
import type { DateRangeSelection } from "@/types/metrics";
import type { AISummary, WeeklyReport } from "@/types/reports";
import type { StoreSnapshot } from "@/types/snapshot";

export class WpReportsService implements IReportsService {
  async getAISummary(): Promise<AISummary> {
    const snapshot = await wpRestFetch<StoreSnapshot>("/dashboard/snapshot");

    return {
      topPerformer: {
        productName: snapshot.bestPerformingProduct?.name ?? "—",
        revenue: snapshot.bestPerformingProduct?.revenue ?? 0,
        growthPercent: snapshot.bestPerformingProduct?.growthPercent ?? 0,
      },
      needsAttention: {
        productName: snapshot.needsAttentionProduct?.name ?? "—",
        revenue: snapshot.needsAttentionProduct?.metric ?? 0,
        growthPercent: snapshot.needsAttentionProduct?.issue === "low_stock" ? -10 : -5,
      },
      growthOpportunity: {
        textKey: "aiSummary.growthOpportunity.detail",
      },
    };
  }

  async getBusinessSummary(range: DateRangeSelection): Promise<BusinessSummary> {
    return wpRestFetch<BusinessSummary>(withDateRange("/ai/business-summary", range));
  }

  async getOpportunities(range: DateRangeSelection): Promise<AIOpportunity[]> {
    return wpRestFetch<AIOpportunity[]>(withDateRange("/ai/opportunities", range));
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

  async listWeeklyReports(): Promise<WeeklyReport[]> {
    return wpRestFetch<WeeklyReport[]>("/reports");
  }

  async generateWeeklyReport(): Promise<WeeklyReport> {
    return wpRestFetch<WeeklyReport>("/reports/generate", { method: "POST" });
  }
}
