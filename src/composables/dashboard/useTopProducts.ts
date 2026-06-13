import { computed, inject, provide, type ComputedRef, type InjectionKey } from "vue";
import { useDashboardWidget } from "@/composables/dashboard/useDashboardWidget";
import { PRODUCTS_SERVICE_KEY, type IProductsService } from "@/services/products/IProductsService";
import { useDateRangeStore } from "@/stores/dateRange";
import type { DashboardWidgetState } from "@/types/dashboardWidget";
import type { ProductRow } from "@/types/products";

function buildProductImageLookup(products: ProductRow[]): Map<string, string> {
  const lookup = new Map<string, string>();
  for (const product of products) {
    const url = product.imageUrl?.trim();
    if (url) lookup.set(product.name.toLowerCase(), url);
  }
  return lookup;
}

interface TopProductsState extends DashboardWidgetState {
  products: ComputedRef<ProductRow[]>;
  productImagesByName: ComputedRef<Map<string, string>>;
}

const TOP_PRODUCTS_KEY: InjectionKey<TopProductsState> = Symbol("topProducts");

function createTopProductsState(): TopProductsState {
  const productsService = inject(PRODUCTS_SERVICE_KEY) as IProductsService;
  const dateRange = useDateRangeStore();

  const widget = useDashboardWidget(
    () => productsService.getTopProducts(dateRange.selection),
    { hasData: (data) => (data?.length ?? 0) > 0 }
  );

  const products = computed(() => widget.data.value ?? []);
  const productImagesByName = computed(() => buildProductImageLookup(products.value));

  return {
    loading: widget.loading,
    error: widget.error,
    hasData: widget.hasData,
    reload: widget.reload,
    products,
    productImagesByName,
  };
}

export function provideTopProducts(): TopProductsState {
  const state = createTopProductsState();
  provide(TOP_PRODUCTS_KEY, state);
  return state;
}

export function useTopProducts(): TopProductsState {
  return inject(TOP_PRODUCTS_KEY) ?? createTopProductsState();
}
