import type { DateRangeSelection } from "@/types/metrics";
import type { ProductRow } from "@/types/products";

export interface IProductsService {
  getTopProducts(range: DateRangeSelection): Promise<ProductRow[]>;
}

export const PRODUCTS_SERVICE_KEY = "productsService";
