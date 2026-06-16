import dayjs from "dayjs";
import { formatDashboardDateRangeLabel } from "@/utils/dateRangeUtils";

export function formatReviewTrendLabel(periodStart: string, periodEnd: string): string {
  return formatDashboardDateRangeLabel(new Date(periodStart), new Date(periodEnd));
}

export function formatReviewDate(isoDate: string): string {
  return dayjs(isoDate).format("MMM D, YYYY");
}
