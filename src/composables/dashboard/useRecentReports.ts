import { computed, inject, type ComputedRef } from "vue";
import { useDashboardWidget } from "@/composables/dashboard/useDashboardWidget";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import type { DashboardWidgetState } from "@/types/dashboardWidget";
import type { WeeklyReport } from "@/types/reports";

interface RecentReportCard {
  id: string;
  title: string;
  generatedAt: string;
  icon: string;
  iconClass: string;
  status: string;
}

const REPORT_ICONS = [
  { icon: "fa-calendar-days", iconClass: "text-sky-600" },
  { icon: "fa-chart-column", iconClass: "text-violet-600" },
  { icon: "fa-comment-dots", iconClass: "text-rose-500" },
  { icon: "fa-box", iconClass: "text-indigo-600" },
];

function formatGeneratedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function toCard(report: WeeklyReport, index: number): RecentReportCard {
  const style = REPORT_ICONS[index % REPORT_ICONS.length];
  return {
    id: report.id,
    title: report.title,
    generatedAt: formatGeneratedAt(report.generatedAt),
    icon: style.icon,
    iconClass: style.iconClass,
    status: report.status,
  };
}

interface RecentReportsState extends DashboardWidgetState {
  reports: ComputedRef<RecentReportCard[]>;
}

export function useRecentReports(): RecentReportsState {
  const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;

  const widget = useDashboardWidget(
    async () => {
      const list = await reportsService.listWeeklyReports();
      return list.items.slice(0, 4).map(toCard);
    },
    {
      hasData: (data) => (data?.length ?? 0) > 0,
      watchOnMount: true,
      watchDateRange: false,
    }
  );

  const reports = computed(() => widget.data.value ?? []);

  return {
    loading: widget.loading,
    error: widget.error,
    hasData: widget.hasData,
    reload: widget.reload,
    reports,
  };
}
