import { computed, inject, provide, ref, watch, type ComputedRef, type InjectionKey, type Ref } from "vue";
import { PRODUCTS_SERVICE_KEY, type IProductsService } from "@/services/products/IProductsService";
import { useDateRangeStore } from "@/stores/dateRange";
import type { ProductRow } from "@/types/products";

function buildProductImageLookup(products: ProductRow[]): Map<string, string> {
  const lookup = new Map<string, string>();
  for (const product of products) {
    const url = product.imageUrl?.trim();
    if (url) lookup.set(product.name.toLowerCase(), url);
  }
  return lookup;
}

interface TopProductsState {
  loading: Ref<boolean>;
  products: Ref<ProductRow[]>;
  productImagesByName: ComputedRef<Map<string, string>>;
  reload: () => Promise<void>;
}

const TOP_PRODUCTS_KEY: InjectionKey<TopProductsState> = Symbol("topProducts");

function createTopProductsState(): TopProductsState {
  const productsService = inject(PRODUCTS_SERVICE_KEY) as IProductsService;
  const dateRange = useDateRangeStore();
  const loading = ref(true);
  const products = ref<ProductRow[]>([]);

  async function load() {
    loading.value = true;
    try {
      products.value = await productsService.getTopProducts(dateRange.selection);
    } finally {
      loading.value = false;
    }
  }

  const productImagesByName = computed(() => buildProductImageLookup(products.value));

  watch(() => dateRange.rangeKey, load, { immediate: true });

  return { loading, products, productImagesByName, reload: load };
}

export function provideTopProducts(): TopProductsState {
  const state = createTopProductsState();
  provide(TOP_PRODUCTS_KEY, state);
  return state;
}

export function useTopProducts(): TopProductsState {
  return inject(TOP_PRODUCTS_KEY) ?? createTopProductsState();
}
