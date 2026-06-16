import { computed, inject, provide, ref, watch, type ComputedRef, type InjectionKey } from "vue";
import { PRODUCTS_SERVICE_KEY, type IProductsService } from "@/services/products/IProductsService";
import { useDashboardOverviewStore } from "@/stores/dashboardOverviewStore";
import { useDateRangeStore } from "@/stores/dateRange";
import type { DashboardWidgetState } from "@/types/dashboardWidget";
import type { ProductRow } from "@/types/products";

function isSoldProduct(product: ProductRow): boolean {
  return product.orders > 0 && product.revenue > 0;
}

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
  const overviewStore = useDashboardOverviewStore();

  const loading = ref(true);
  const error = ref<string | null>(null);
  const data = ref<ProductRow[] | null>(null);

  const inOverviewRange = computed(() => overviewStore.loadedRangeKey === dateRange.rangeKey);

  async function loadFallback() {
    loading.value = true;
    error.value = null;
    try {
      data.value = await productsService.getTopProducts(dateRange.selection);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "error";
      data.value = [];
    } finally {
      loading.value = false;
    }
  }

  watch(
    [() => dateRange.rangeKey, () => overviewStore.topProducts, () => overviewStore.loading, () => overviewStore.error],
    async () => {
      if (inOverviewRange.value) {
        loading.value = overviewStore.loading;
        error.value = overviewStore.error;
        data.value = overviewStore.topProducts;
        return;
      }

      const waitingForOverview =
        overviewStore.loading &&
        overviewStore.requestedRangeKey === dateRange.rangeKey;
      if (waitingForOverview) {
        loading.value = true;
        error.value = null;
        return;
      }

      await loadFallback();
    },
    { immediate: true },
  );

  const products = computed(() => (data.value ?? []).filter(isSoldProduct));
  const productImagesByName = computed(() => buildProductImageLookup(products.value));
  const hasData = computed(() => products.value.length > 0);

  return {
    loading,
    error,
    hasData,
    reload: async () => {
      if (inOverviewRange.value) {
        await overviewStore.fetch(dateRange.selection, dateRange.rangeKey, "daily", true);
        return;
      }
      await loadFallback();
    },
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
