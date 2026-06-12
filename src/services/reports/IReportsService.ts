import type { AISummary, WeeklyReport } from "@/types/reports";

export interface IReportsService {
  getAISummary(): Promise<AISummary>;
  listWeeklyReports(): Promise<WeeklyReport[]>;
  generateWeeklyReport(): Promise<WeeklyReport>;
}

export const REPORTS_SERVICE_KEY = "reportsService";
