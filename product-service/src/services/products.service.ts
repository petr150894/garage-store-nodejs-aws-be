import { getDBClient } from "../../db";
import { Product } from "../models/product";
import { ProductST } from "../types/product.type";
import { GET_PRODUCT_BY_ID_QUERY, GET_PRODUCTS_QUERY, INSERT_PRODUCT_QUERY, INSERT_STOCK_RECORD_QUERY } from "./products.queries";

export async function getProducts(): Promise<ProductST[]> {
  try {
    const dbClient = await getDBClient();
    const { rows } = await dbClient.query(GET_PRODUCTS_QUERY);
    return rows as ProductST[];
  } catch (err) {
      throw err;
  }
}

export async function getProductById(id: string): Promise<ProductST> {
  try {
    const dbClient = await getDBClient();
    const { rows } = await dbClient.query({
      text: GET_PRODUCT_BY_ID_QUERY,
      values: [id],
    });
    return rows[0] as ProductST;
  } catch (err) {
      throw err;
  }
}

export async function addProduct(product: Product): Promise<void> {
  const dbClient = await getDBClient();
  try {
    await dbClient.query('BEGIN');
    const insertProductValues = [
      product.title, 
      product.description, 
      product.price, 
      product.imageUrl
    ];
    const res = await dbClient.query(INSERT_PRODUCT_QUERY, insertProductValues);
    const insertStockValues = [res.rows[0].id, product.count];
    await dbClient.query(INSERT_STOCK_RECORD_QUERY, insertStockValues);
    await dbClient.query('COMMIT');      
  } catch (err) {
      await dbClient.query('ROLLBACK');
      throw err;
  }
}

export async function addProductsBatch(products: Product[]): Promise<void> {
  const dbClient = await getDBClient();
  try {
    await dbClient.query('BEGIN');
    let insertProductValues;
    for (const product of products) {
      insertProductValues = [
        product.title, 
        product.description, 
        product.price, 
        product.imageUrl
      ];
      const res = await dbClient.query(INSERT_PRODUCT_QUERY, insertProductValues);
      const insertStockValues = [res.rows[0].id, product.count];
      await dbClient.query(INSERT_STOCK_RECORD_QUERY, insertStockValues);
    }
    await dbClient.query('COMMIT');      
  } catch (err) {
      await dbClient.query('ROLLBACK');
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