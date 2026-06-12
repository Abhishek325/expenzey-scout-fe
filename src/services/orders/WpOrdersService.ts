import type { IOrdersService } from "@/services/orders/IOrdersService";
import type { DateRangeSelection } from "@/types/metrics";
import type { OrderRow } from "@/types/orders";

export class WpOrdersService implements IOrdersService {
  async getRecentOrders(_range: DateRangeSelection): Promise<OrderRow[]> {
    throw new Error("Not implemented");
  }
}
