import type { DateRangeSelection } from "@/types/metrics";
import type { OrderRow } from "@/types/orders";

export interface IOrdersService {
  getRecentOrders(range: DateRangeSelection): Promise<OrderRow[]>;
}

export const ORDERS_SERVICE_KEY = "ordersService";
