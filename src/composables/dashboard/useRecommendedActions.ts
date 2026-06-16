import { computed, inject, onMounted, ref, type ComputedRef } from "vue";
import { storeToRefs } from "pinia";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import { useOpportunitiesStore } from "@/stores/opportunitiesStore";
import type { DashboardWidgetState } from "@/types/dashboardWidget";

export interface RecommendedActionItem {
  id: string;
  title: string;
  description: string;
  priority: string;
  sourceId?: string;
}

const SNOOZE_KEY = "expenzey_recommended_actions_snoozed";

function readSnoozed(): Set<string> {
  try {
    const raw = localStorage.getItem(SNOOZE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function writeSnoozed(ids: Set<string>) {
  localStorage.setItem(SNOOZE_KEY, JSON.stringify([...ids]));
}

interface RecommendedActionsState extends DashboardWidgetState {
  actions: ComputedRef<RecommendedActionItem[]>;
  dismiss: (id: string) => void;
  remindLater: (id: string) => void;
  markDone: (id: string) => Promise<void>;
}

export function useRecommendedActions(): RecommendedActionsState {
  const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;
  const store = useOpportunitiesStore();
  const { activeItems, loading, error } = storeToRefs(store);
  const snoozed = ref<Set<string>>(readSnoozed());

  onMounted(() => {
    void store.ensureLoaded(reportsService);
  });

  const actions = computed<RecommendedActionItem[]>(() => {
    const items: RecommendedActionItem[] = [];

    for (const opp of activeItems.value.slice(0, 5)) {
      const action = opp.actions?.[0];
      if (!action) continue;
      const id = `${opp.id}:0`;
      if (snoozed.value.has(id)) continue;
      items.push({
        id,
        title: action.title,
        description: action.description,
        priority: opp.priority,
        sourceId: opp.id,
      });
    }

    return items.slice(0, 5);
  });

  const hasData = computed(() => actions.value.length > 0);

  function dismiss(id: string) {
    snoozed.value = new Set([...snoozed.value, id]);
    writeSnoozed(snoozed.value);
  }

  function remindLater(id: string) {
    dismiss(id);
  }

  async function markDone(id: string) {
    const sourceId = id.split(":")[0];
    if (!sourceId) return;
    await store.setStatus(reportsService, sourceId, "done");
  }

  return {
    loading,
    error,
    hasData,
    reload: () => store.reload(reportsService),
    actions,
    dismiss,
    remindLater,
    markDone,
  };
}
