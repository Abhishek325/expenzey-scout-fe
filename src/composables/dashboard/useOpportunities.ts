import { computed, inject, ref, watch } from "vue";
import { PRODUCTS_SERVICE_KEY, type IProductsService } from "@/services/products/IProductsService";
import { REPORTS_SERVICE_KEY, type IReportsService } from "@/services/reports/IReportsService";
import { useDateRangeStore } from "@/stores/dateRange";
import type { AIOpportunity } from "@/types/ai";

const MAX_OPPORTUNITIES = 5;

const BADGE_STYLES: Record<
  string,
  {
    cardClass: string;
    labelClass: string;
    impactClass: string;
    badgeIcon: string;
    thumbClass: string;
  }
> = {
  "High Impact": {
    cardClass: "border-emerald-200 bg-emerald-50/50",
    labelClass: "text-emerald-700",
    impactClass: "text-emerald-700",
    badgeIcon: "fa-fire",
    thumbClass: "bg-emerald-100 text-emerald-700",
  },
  "Needs Attention": {
    cardClass: "border-rose-200 bg-rose-50/50",
    labelClass: "text-rose-700",
    impactClass: "text-rose-700",
    badgeIcon: "fa-triangle-exclamation",
    thumbClass: "bg-rose-100 text-rose-700",
  },
  "Quick Win": {
    cardClass: "border-orange-200 bg-orange-50/50",
    labelClass: "text-orange-700",
    impactClass: "text-orange-700",
    badgeIcon: "fa-bolt",
    thumbClass: "bg-orange-100 text-orange-700",
  },
  "Growth Opportunity": {
    cardClass: "border-sky-200 bg-sky-50/50",
    labelClass: "text-sky-700",
    impactClass: "text-sky-700",
    badgeIcon: "fa-arrow-trend-up",
    thumbClass: "bg-sky-100 text-sky-700",
  },
  Risk: {
    cardClass: "border-amber-200 bg-amber-50/50",
    labelClass: "text-amber-700",
    impactClass: "text-amber-700",
    badgeIcon: "fa-shield-halved",
    thumbClass: "bg-amber-100 text-amber-700",
  },
};

export interface OpportunityViewModel extends AIOpportunity {
  cardClass: string;
  labelClass: string;
  impactClass: string;
  badgeIcon: string;
  thumbClass: string;
  impact: string;
  productInitial: string;
}

function buildImageLookup(products: Array<{ name: string; imageUrl: string }>): Map<string, string> {
  const lookup = new Map<string, string>();
  for (const product of products) {
    const url = product.imageUrl?.trim();
    if (url) lookup.set(product.name.toLowerCase(), url);
  }
  return lookup;
}

function resolveProductImageUrl(
  opportunity: AIOpportunity,
  imageByName: Map<string, string>,
): string | undefined {
  const direct = opportunity.productImageUrl?.trim();
  if (direct) return direct;

  const name = opportunity.productName?.trim().toLowerCase();
  if (!name) return undefined;

  return imageByName.get(name);
}

export function useOpportunities() {
  const reportsService = inject(REPORTS_SERVICE_KEY) as IReportsService;
  const productsService = inject(PRODUCTS_SERVICE_KEY) as IProductsService;
  const dateRange = useDateRangeStore();
  const loading = ref(true);
  const error = ref<string | null>(null);
  const opportunities = ref<AIOpportunity[]>([]);
  const productImagesByName = ref<Map<string, string>>(new Map());

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      const [opportunityRows, topProducts] = await Promise.all([
        reportsService.getOpportunities(dateRange.selection),
        productsService.getTopProducts(dateRange.selection),
      ]);
      opportunities.value = opportunityRows;
      productImagesByName.value = buildImageLookup(topProducts);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "error";
    } finally {
      loading.value = false;
    }
  }

  const items = computed<OpportunityViewModel[]>(() =>
    opportunities.value.slice(0, MAX_OPPORTUNITIES).map((o) => {
      const style = BADGE_STYLES[o.badge] ?? BADGE_STYLES["Quick Win"];
      const name = (o.productName ?? o.badge).trim();
      const productImageUrl = resolveProductImageUrl(o, productImagesByName.value);
      return {
        ...o,
        ...style,
        productImageUrl,
        impact: o.estimatedImpact ?? "",
        productInitial: name.charAt(0).toUpperCase() || "?",
      };
    }),
  );

  watch(() => dateRange.rangeKey, load, { immediate: true });

  return { loading, error, opportunities: items, reload: load };
}
