import { createRouter, createWebHashHistory } from "vue-router";
import { isOnboardingPath, ROUTES } from "@/constants/routes";
import { useAppStore } from "@/stores/appStore";

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, top: 12, behavior: "smooth" };
    }
    return { left: 0, top: 0 };
  },
  routes: [
    {
      path: ROUTES.ONBOARDING,
      component: () => import("@/views/OnboardingLayout.vue"),
      children: [
        {
          path: "",
          redirect: ROUTES.ONBOARDING_WELCOME,
        },
        {
          path: "welcome",
          name: "onboarding-welcome",
          component: () => import("@/views/onboarding/OnboardingWelcomePage.vue"),
        },
        {
          path: "connect",
          name: "onboarding-connect",
          component: () => import("@/views/onboarding/OnboardingConnectPage.vue"),
        },
      ],
    },
    {
      path: ROUTES.ROOT,
      redirect: ROUTES.DASHBOARD,
    },
    {
      path: ROUTES.DASHBOARD,
      name: "dashboard",
      component: () => import("@/views/DashboardPage.vue"),
    },
    {
      path: ROUTES.OPPORTUNITIES,
      name: "opportunities",
      component: () => import("@/views/OpportunitiesPage.vue"),
    },
    {
      path: ROUTES.REPORTS,
      name: "reports",
      component: () => import("@/views/ReportsPage.vue"),
    },
    {
      path: ROUTES.REPORT_DETAIL,
      name: "report-detail",
      component: () => import("@/views/WeeklyReportDetailPage.vue"),
    },
    {
      path: ROUTES.REVIEWS,
      name: "review-intelligence",
      component: () => import("@/views/ReviewIntelligencePage.vue"),
    },
    {
      path: ROUTES.SETTINGS,
      name: "settings",
      component: () => import("@/views/SettingsPage.vue"),
    },
    {
      path: ROUTES.PRO,
      name: "pro-upgrade",
      component: () => import("@/views/ProUpgradePage.vue"),
    },
  ],
});

router.beforeEach((to) => {
  const appStore = useAppStore();
  const isOnboarding = isOnboardingPath(to.path);

  if (appStore.requiresOnboarding && !isOnboarding) {
    if (appStore.connected && !appStore.dataConsent) {
      return { path: ROUTES.ONBOARDING_CONNECT };
    }
    return { path: ROUTES.ONBOARDING_WELCOME };
  }

  if (appStore.connected && appStore.dataConsent && isOnboarding && !import.meta.env.DEV) {
    return { path: ROUTES.DASHBOARD };
  }

  return true;
});

export default router;
