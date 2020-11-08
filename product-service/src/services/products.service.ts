import { ProductST } from "../types/product.type";
import getProductsListMock from "./getProductsList.mock";

export async function getProductsFromDB(): Promise<ProductST[]> {
  return Promise.resolve(getProductsListMock);
}