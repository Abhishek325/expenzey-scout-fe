import { createRouter, createWebHashHistory } from "vue-router";
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
      path: "/onboarding",
      component: () => import("@/views/OnboardingLayout.vue"),
      children: [
        {
          path: "",
          redirect: "/onboarding/welcome",
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
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("@/views/DashboardPage.vue"),
    },
    {
      path: "/opportunities",
      name: "opportunities",
      component: () => import("@/views/OpportunitiesPage.vue"),
    },
    {
      path: "/reports",
      name: "reports",
      component: () => import("@/views/ReportsPage.vue"),
    },
    {
      path: "/reports/:id",
      name: "report-detail",
      component: () => import("@/views/WeeklyReportDetailPage.vue"),
    },
    {
      path: "/reviews",
      name: "review-intelligence",
      component: () => import("@/views/ReviewIntelligencePage.vue"),
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("@/views/SettingsPage.vue"),
    },
  ],
});

router.beforeEach((to) => {
  const appStore = useAppStore();
  const isOnboarding = to.path.startsWith("/onboarding");

  if (appStore.requiresOnboarding && !isOnboarding) {
    return { path: "/onboarding/welcome" };
  }

  if (appStore.connected && isOnboarding && !import.meta.env.DEV) {
    return { path: "/dashboard" };
  }

  return true;
});

export default router;
