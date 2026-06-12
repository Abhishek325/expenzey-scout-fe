import { inject, ref, watch } from "vue";
import { ORDERS_SERVICE_KEY, type IOrdersService } from "@/services/orders/IOrdersService";
import { useDateRangeStore } from "@/stores/dateRange";
import type { OrderRow } from "@/types/orders";

export function useRecentOrders() {
  const ordersService = inject(ORDERS_SERVICE_KEY) as IOrdersService;
  const dateRange = useDateRangeStore();
  const loading = ref(true);
  const orders = ref<OrderRow[]>([]);

  async function load() {
    loading.value = true;
    try {
      orders.value = await ordersService.getRecentOrders(dateRange.selection);
    } finally {
      loading.value = false;
    }
  }

  watch(() => dateRange.rangeKey, load, { immediate: true });

  return { loading, orders, reload: load };
}
