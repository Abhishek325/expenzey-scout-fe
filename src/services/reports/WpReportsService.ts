import type { IReportsService } from "@/services/reports/IReportsService";
import { wpRestFetch } from "@/services/wp/wpRestClient";
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

  async listWeeklyReports(): Promise<WeeklyReport[]> {
    return wpRestFetch<WeeklyReport[]>("/reports");
  }

  async generateWeeklyReport(): Promise<WeeklyReport> {
    return wpRestFetch<WeeklyReport>("/reports/generate", { method: "POST" });
  }
}
