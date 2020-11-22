import { Product } from "../models/product";

export function checkProductValidity(product: Partial<Product>): boolean {
  return !!product.title && 
    !!product.price &&
    !!product.imageUrl &&
    !!product.count;
}