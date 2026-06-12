import { inject, ref, watch } from "vue";
import { PRODUCTS_SERVICE_KEY, type IProductsService } from "@/services/products/IProductsService";
import { useDateRangeStore } from "@/stores/dateRange";
import type { ProductRow } from "@/types/products";

export function useTopProducts() {
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

  watch(() => dateRange.rangeKey, load, { immediate: true });

  return { loading, products, reload: load };
}
