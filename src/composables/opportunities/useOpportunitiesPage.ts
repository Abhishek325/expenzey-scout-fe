import { computed, inject, onMounted, ref, watch } from "vue";
import router from "@/router";
import { storeToRefs } from "pinia";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import { useDateRangeStore } from "@/stores/dateRange";
import { useOpportunitiesStore } from "@/stores/opportunitiesStore";
import { usePlan } from "@/composables/usePlan";
import {
  FILTER_TABS,
  IMPACT_LEVEL_DOTS,
  PRIORITY_ORDER,
  type OpportunityFilterTab,
} from "@/utils/opportunityStyles";
import type { OpportunityDetail } from "@/types/ai";
import { ROUTES } from "@/constants/routes";

export type OpportunitySortKey = "impact" | "priority";
export type OpportunitiesTableMode = "active" | "archived";

const PAGE_SIZE = 6;

function matchesTab(item: OpportunityDetail, tab: OpportunityFilterTab): boolean {
  if (tab === "archived") return true;
  const config = FILTER_TABS.find((t) => t.id === tab);
  if (!config || !config.badges) return true;
  return (config.badges as readonly string[]).includes(item.badge);
}

function sortItems(
  list: OpportunityDetail[],
  sortKey: OpportunitySortKey,
): OpportunityDetail[] {
  return [...list].sort((a, b) => {
    if (sortKey === "priority") {
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    }
    return (IMPACT_LEVEL_DOTS[b.impactLevel] ?? 0) - (IMPACT_LEVEL_DOTS[a.impactLevel] ?? 0);
  });
}

export function useOpportunitiesPage() {
  const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;
  const store = useOpportunitiesStore();
  const dateRange = useDateRangeStore();
  const { isPro } = usePlan();
  const {
    activeItems,
    archivedItems,
    archivedCount,
    lockedCount,
    lockedPreviews,
    freeVisibleCount,
    loading,
    error,
  } = storeToRefs(store);

  const activeTab = ref<OpportunityFilterTab>("all");
  const sortKey = ref<OpportunitySortKey>("impact");
  const page = ref(1);
  const selectedId = ref<string | null>(null);
  const openMenuId = ref<string | null>(null);
  const statusError = ref<string | null>(null);

  const tableMode = computed<OpportunitiesTableMode>(() =>
    activeTab.value === "archived" ? "archived" : "active",
  );

  onMounted(() => {
    void store.ensureLoaded(reportsService);
  });

  watch(
    () => dateRange.rangeKey,
    () => {
      page.value = 1;
      void store.ensureLoaded(reportsService, true);
    },
  );

  watch(
    () => {
      const current = router.currentRoute.value;
      return current.path === ROUTES.OPPORTUNITIES ? current.query.id : undefined;
    },
    (id) => {
      selectedId.value = typeof id === "string" && id ? id : null;
    },
    { immediate: true },
  );

  const visibleActiveItems = computed(() => {
    if (isPro.value || activeTab.value === "archived") {
      return activeItems.value;
    }
    return activeItems.value.slice(0, freeVisibleCount.value);
  });

  const sourceItems = computed(() =>
    activeTab.value === "archived" ? archivedItems.value : visibleActiveItems.value,
  );

  const filteredItems = computed(() => {
    const list = sourceItems.value.filter((item) => matchesTab(item, activeTab.value));
    return sortItems(list, sortKey.value);
  });

  const tabCounts = computed(() => {
    const counts: Record<Exclude<OpportunityFilterTab, "archived">, number> = {
      all: activeItems.value.length,
      highImpact: 0,
      quickWins: 0,
      needsAttention: 0,
      growth: 0,
    };
    for (const item of activeItems.value) {
      for (const tab of FILTER_TABS) {
        if (tab.id !== "all" && (tab.badges as readonly string[] | null)?.includes(item.badge)) {
          counts[tab.id]++;
        }
      }
    }
    return counts;
  });

  const summary = computed(() => ({
    total: activeItems.value.length,
    highImpact: tabCounts.value.highImpact,
    quickWins: tabCounts.value.quickWins,
    needsAttention: tabCounts.value.needsAttention,
    estimatedImpact: activeItems.value.reduce((sum, item) => {
      const val = item.impact?.estimatedValue ?? item.impact?.estimatedRange?.min ?? 0;
      return sum + val;
    }, 0),
  }));

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredItems.value.length / PAGE_SIZE)),
  );

  const paginatedItems = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE;
    return filteredItems.value.slice(start, start + PAGE_SIZE);
  });

  const selectedOpportunity = computed(() => {
    if (!selectedId.value) return null;
    const item = store.byId.get(selectedId.value) ?? null;
    if (!item) return null;
    if (!isPro.value && activeTab.value !== "archived") {
      const isVisible = visibleActiveItems.value.some((entry) => entry.id === selectedId.value);
      if (!isVisible) return null;
    }
    return item;
  });

  function setTab(tab: OpportunityFilterTab) {
    activeTab.value = tab;
    page.value = 1;
    openMenuId.value = null;
  }

  function setSort(key: OpportunitySortKey) {
    sortKey.value = key;
    page.value = 1;
  }

  function syncQueryId(id: string | null) {
    const current = router.currentRoute.value;
    if (current.path !== ROUTES.OPPORTUNITIES) return;

    const query = { ...current.query };
    if (id) {
      query.id = id;
    } else {
      delete query.id;
    }
    void router.replace({ path: ROUTES.OPPORTUNITIES, query });
  }

  function openDetail(id: string) {
    selectedId.value = id;
    syncQueryId(id);
  }

  function closeDetail() {
    selectedId.value = null;
    syncQueryId(null);
  }

  function reload() {
    return store.reload(reportsService);
  }

  async function updateStatus(id: string, status: "done" | "dismissed") {
    statusError.value = null;
    const item = store.byId.get(id);
    try {
      await store.setStatus(reportsService, id, status, item);
      if (selectedId.value === id) {
        closeDetail();
      }
    } catch (e) {
      statusError.value = e instanceof Error ? e.message : "error";
    } finally {
      openMenuId.value = null;
    }
  }

  function markDone(id: string) {
    return updateStatus(id, "done");
  }

  function dismiss(id: string) {
    return updateStatus(id, "dismissed");
  }

  function toggleMenu(id: string) {
    openMenuId.value = openMenuId.value === id ? null : id;
  }

  function closeMenu() {
    openMenuId.value = null;
  }

  return {
    loading,
    error,
    statusError,
    activeTab,
    sortKey,
    page,
    pageSize: PAGE_SIZE,
    selectedId,
    filteredItems,
    paginatedItems,
    tabCounts,
    archivedCount,
    lockedCount,
    lockedPreviews,
    summary,
    totalPages,
    selectedOpportunity,
    tableMode,
    openMenuId,
    setTab,
    setSort,
    openDetail,
    closeDetail,
    reload,
    markDone,
    dismiss,
    toggleMenu,
    closeMenu,
    statusOf: (id: string) => store.statusOf(id),
  };
}
