import type { IReportsService } from "@/services/reports/IReportsService";
import type { AISummary, WeeklyReport } from "@/types/reports";

export class WpReportsService implements IReportsService {
  async getAISummary(): Promise<AISummary> {
    throw new Error("Not implemented");
  }

  async listWeeklyReports(): Promise<WeeklyReport[]> {
    throw new Error("Not implemented");
  }

  async generateWeeklyReport(): Promise<WeeklyReport> {
    throw new Error("Not implemented");
  }
}
