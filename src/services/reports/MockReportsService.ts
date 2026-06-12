import mockAiSummary from "@/data/dashboard/mock-ai-summary.json";
import mockReportsHistory from "@/data/reports/mock-reports-history.json";
import { simulateDelay } from "@/services/delay";
import type { IReportsService } from "@/services/reports/IReportsService";
import type { AISummary, WeeklyReport } from "@/types/reports";

export class MockReportsService implements IReportsService {
  private reports: WeeklyReport[] = [...(mockReportsHistory.reports as WeeklyReport[])];

  async getAISummary(): Promise<AISummary> {
    await simulateDelay();
    return mockAiSummary as AISummary;
  }

  async listWeeklyReports(): Promise<WeeklyReport[]> {
    await simulateDelay();
    return [...this.reports];
  }

  async generateWeeklyReport(): Promise<WeeklyReport> {
    await simulateDelay(2000);
    const generatedAt = new Date().toISOString();
    const report: WeeklyReport = {
      id: `report-${Date.now()}`,
      title: "Weekly Report — Generated",
      periodStart: "2024-05-20",
      periodEnd: "2024-05-26",
      generatedAt,
      status: "completed",
      summaryKey: "reports.history.generatedSummary",
      downloadUrl: "#",
    };
    this.reports = [report, ...this.reports];
    return report;
  }
}
