import type { IProductsService } from "@/services/products/IProductsService";
import { wpRestFetch } from "@/services/wp/wpRestClient";
import { withDateRange } from "@/services/wp/wpQueryUtils";
import type { DateRangeSelection } from "@/types/metrics";
import type { ProductRow } from "@/types/products";

export class WpProductsService implements IProductsService {
  async getTopProducts(range: DateRangeSelection): Promise<ProductRow[]> {
    return wpRestFetch<ProductRow[]>(withDateRange("/products/top", range));
  }
}
