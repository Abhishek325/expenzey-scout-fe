import { ROUTES } from "@/constants/routes";

export interface SidebarItem {
  id: string;
  route: string;
  icon: string;
  labelKey: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    route: ROUTES.DASHBOARD,
    icon: "📊",
    labelKey: "nav.dashboard",
  },
  {
    id: "opportunities",
    route: ROUTES.OPPORTUNITIES,
    icon: "💡",
    labelKey: "nav.opportunities",
  },
  {
    id: "reports",
    route: ROUTES.REPORTS,
    icon: "📄",
    labelKey: "nav.reports",
  },
  {
    id: "reviews",
    route: ROUTES.REVIEWS,
    icon: "⭐",
    labelKey: "nav.reviews",
  },
  {
    id: "settings",
    route: ROUTES.SETTINGS,
    icon: "⚙️",
    labelKey: "nav.settings",
  },
];

export default sidebarItems;
