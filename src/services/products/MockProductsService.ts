import mockTopProducts from "@/data/dashboard/mock-top-products.json";
import { simulateDelay } from "@/services/delay";
import { scaleValueForRange } from "@/services/metrics/dateRangeFilter";
import type { IProductsService } from "@/services/products/IProductsService";
import type { DateRangeSelection } from "@/types/metrics";
import type { ProductRow } from "@/types/products";

export class MockProductsService implements IProductsService {
  async getTopProducts(range: DateRangeSelection): Promise<ProductRow[]> {
    await simulateDelay();
    return (mockTopProducts.products as ProductRow[]).map((product) => ({
      ...product,
      revenue: scaleValueForRange(product.revenue, range.start, range.end),
      orders: Math.round(scaleValueForRange(product.orders, range.start, range.end)),
    }));
  }
}
