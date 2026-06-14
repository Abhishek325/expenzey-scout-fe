import { computed, inject, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import { useDateRangeStore } from "@/stores/dateRange";
import { useOpportunitiesStore } from "@/stores/opportunitiesStore";
import {
  FILTER_TABS,
  IMPACT_LEVEL_DOTS,
  PRIORITY_ORDER,
  type OpportunityFilterTab,
} from "@/utils/opportunityStyles";
import type { OpportunityDetail } from "@/types/ai";

export type OpportunitySortKey = "impact" | "priority";

const PAGE_SIZE = 6;

function matchesTab(item: OpportunityDetail, tab: OpportunityFilterTab): boolean {
  const config = FILTER_TABS.find((t) => t.id === tab);
  if (!config || !config.badges) return true;
  return (config.badges as readonly string[]).includes(item.badge);
}

export function useOpportunitiesPage() {
  const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;
  const store = useOpportunitiesStore();
  const dateRange = useDateRangeStore();
  const route = useRoute();
  const router = useRouter();
  const { items, loading, error } = storeToRefs(store);

  const activeTab = ref<OpportunityFilterTab>("all");
  const sortKey = ref<OpportunitySortKey>("impact");
  const page = ref(1);
  const selectedId = ref<string | null>(null);

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
    () => route.query.id,
    (id) => {
      selectedId.value = typeof id === "string" && id ? id : null;
    },
    { immediate: true },
  );

  const filteredItems = computed(() => {
    const list = items.value.filter((item) => matchesTab(item, activeTab.value));
    return [...list].sort((a, b) => {
      if (sortKey.value === "priority") {
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      }
      return (IMPACT_LEVEL_DOTS[b.impactLevel] ?? 0) - (IMPACT_LEVEL_DOTS[a.impactLevel] ?? 0);
    });
  });

  const tabCounts = computed(() => {
    const counts: Record<OpportunityFilterTab, number> = {
      all: items.value.length,
      highImpact: 0,
      quickWins: 0,
      needsAttention: 0,
      growth: 0,
    };
    for (const item of items.value) {
      for (const tab of FILTER_TABS) {
        if (tab.id !== "all" && (tab.badges as readonly string[] | null)?.includes(item.badge)) {
          counts[tab.id]++;
        }
      }
    }
    return counts;
  });

  const summary = computed(() => ({
    total: items.value.length,
    highImpact: tabCounts.value.highImpact,
    quickWins: tabCounts.value.quickWins,
    needsAttention: tabCounts.value.needsAttention,
    estimatedImpact: items.value.reduce((sum, item) => {
      const val =
        item.impact?.estimatedValue ?? item.impact?.estimatedRange?.min ?? 0;
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

  const selectedOpportunity = computed(() =>
    selectedId.value ? store.byId.get(selectedId.value) ?? null : null,
  );

  function setTab(tab: OpportunityFilterTab) {
    activeTab.value = tab;
    page.value = 1;
  }

  function setSort(key: OpportunitySortKey) {
    sortKey.value = key;
    page.value = 1;
  }

  function openDetail(id: string) {
    selectedId.value = id;
    void router.replace({ query: { ...route.query, id } });
  }

  function closeDetail() {
    selectedId.value = null;
    const { id: _removed, ...rest } = route.query;
    void router.replace({ query: rest });
  }

  function reload() {
    return store.reload(reportsService);
  }

  watch(activeTab, () => {
    page.value = 1;
  });

  return {
    loading,
    error,
    items,
    activeTab,
    sortKey,
    page,
    pageSize: PAGE_SIZE,
    selectedId,
    filteredItems,
    paginatedItems,
    tabCounts,
    summary,
    totalPages,
    selectedOpportunity,
    setTab,
    setSort,
    openDetail,
    closeDetail,
    reload,
  };
}
