import { inject, onMounted, ref } from "vue";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
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

export function useRecentReports() {
  const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;
  const loading = ref(true);
  const error = ref<string | null>(null);
  const reports = ref<RecentReportCard[]>([]);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      const list = await reportsService.listWeeklyReports();
      reports.value = list.slice(0, 4).map(toCard);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "error";
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    void load();
  });

  return { loading, error, reports, reload: load };
}
