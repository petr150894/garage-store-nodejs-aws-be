import { getDBClient } from "../../db";
import { Product } from "../models/product";
import { ProductST } from "../types/product.type";
import { getProductByIdQuery, getProductsQuery } from "./products.queries";

export async function getProducts(): Promise<ProductST[]> {
  try {
    const dbClient = await getDBClient();
    const { rows } = await dbClient.query(getProductsQuery);
    return rows as ProductST[];
  } catch (err) {
      throw err;
  }
}

export async function getProductById(id: string): Promise<ProductST> {
  try {
    const dbClient = await getDBClient();
    const { rows } = await dbClient.query({
      text: getProductByIdQuery,
      values: [id],
    });
    return rows[0] as ProductST;
  } catch (err) {
      throw err;
  }
}

export function mapProductsToClient(products: ProductST[]): Product[] {
  return products.map(product => { return mapProductToClient(product) })
}

export function mapProductToClient(product: ProductST): Product {
  if(!product) {
    return null;
  }
  return new Product({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    imageUrl: product.image,
    count: product.count,
  });
}