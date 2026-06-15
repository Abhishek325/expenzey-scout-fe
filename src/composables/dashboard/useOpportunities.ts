import { computed, inject, onMounted, watch, type ComputedRef } from "vue";
import { storeToRefs } from "pinia";
import { useTopProducts } from "@/composables/dashboard/useTopProducts";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import { useDateRangeStore } from "@/stores/dateRange";
import { useOpportunitiesStore } from "@/stores/opportunitiesStore";
import type { AIOpportunity } from "@/types/ai";
import type { DashboardWidgetState } from "@/types/dashboardWidget";
import { badgeStyle, resolveProductImageUrl } from "@/utils/opportunityStyles";

const MAX_OPPORTUNITIES = 5;

interface OpportunityViewModel extends AIOpportunity {
  cardClass: string;
  labelClass: string;
  impactClass: string;
  badgeIcon: string;
  thumbClass: string;
  impact: string;
  productInitial: string;
}

interface OpportunitiesState extends DashboardWidgetState {
  opportunities: ComputedRef<OpportunityViewModel[]>;
}

export function useOpportunities(): OpportunitiesState {
  const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;
  const store = useOpportunitiesStore();
  const dateRange = useDateRangeStore();
  const { productImagesByName } = useTopProducts();
  const { activeItems, loading, error } = storeToRefs(store);

  onMounted(() => {
    void store.ensureLoaded(reportsService);
  });

  watch(
    () => dateRange.rangeKey,
    () => {
      void store.ensureLoaded(reportsService, true);
    },
  );

  const hasData = computed(() => activeItems.value.length > 0);

  const opportunities = computed<OpportunityViewModel[]>(() =>
    activeItems.value.slice(0, MAX_OPPORTUNITIES).map((o) => {
      const style = badgeStyle(o.badge);
      const name = (o.productName ?? o.badge).trim();
      const productImageUrl = resolveProductImageUrl(o, productImagesByName.value);
      return {
        id: o.id,
        type: o.type,
        badge: o.badge,
        priority: o.priority,
        title: o.title,
        description: o.description,
        recommendation: o.recommendation,
        productName: o.productName,
        ...style,
        productImageUrl,
        impact: o.estimatedImpact ?? o.impact?.displayText ?? "",
        productInitial: name.charAt(0).toUpperCase() || "?",
      };
    }),
  );

  return {
    loading,
    error,
    hasData,
    reload: () => store.reload(reportsService),
    opportunities,
  };
}
