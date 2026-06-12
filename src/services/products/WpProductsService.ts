import type { IProductsService } from "@/services/products/IProductsService";
import type { DateRangeSelection } from "@/types/metrics";
import type { ProductRow } from "@/types/products";

export class WpProductsService implements IProductsService {
  async getTopProducts(_range: DateRangeSelection): Promise<ProductRow[]> {
    throw new Error("Not implemented");
  }
}
