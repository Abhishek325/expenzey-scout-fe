import mockRecentOrders from "@/data/dashboard/mock-recent-orders.json";
import { simulateDelay } from "@/services/delay";
import { filterByDateRange } from "@/services/metrics/dateRangeFilter";
import type { IOrdersService } from "@/services/orders/IOrdersService";
import type { DateRangeSelection } from "@/types/metrics";
import type { OrderRow } from "@/types/orders";

export class MockOrdersService implements IOrdersService {
  async getRecentOrders(range: DateRangeSelection): Promise<OrderRow[]> {
    await simulateDelay();
    const orders = mockRecentOrders.orders as OrderRow[];
    return filterByDateRange(
      orders.map((o) => ({ ...o, date: o.date.slice(0, 10) })),
      range.start,
      range.end
    );
  }
}
