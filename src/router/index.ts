import { createRouter, createWebHashHistory } from "vue-router";
import { useAppStore } from "@/stores/appStore";

const router = createRouter({
  history: createWebHashHistory(),
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
      path: "/reports",
      name: "reports",
      component: () => import("@/views/ReportsPage.vue"),
    },
    {
      path: "/chat",
      name: "chat",
      component: () => import("@/views/ChatPage.vue"),
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
