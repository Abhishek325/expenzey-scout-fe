import type { IOrdersService } from "@/services/orders/IOrdersService";
import { wpRestFetch } from "@/services/wp/wpRestClient";
import { withDateRange } from "@/services/wp/wpQueryUtils";
import type { DateRangeSelection } from "@/types/metrics";
import type { OrderRow } from "@/types/orders";

export class WpOrdersService implements IOrdersService {
  async getRecentOrders(range: DateRangeSelection): Promise<OrderRow[]> {
    return wpRestFetch<OrderRow[]>(withDateRange("/orders/recent", range));
  }
}
