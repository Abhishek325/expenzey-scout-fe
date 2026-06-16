export interface WeeklyReportsListResponse {
  items: import("@/types/reports").WeeklyReportListItem[];
  totalCount: number;
  historyLimit: number;
  lockedCount: number;
}
