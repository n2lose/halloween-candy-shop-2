import { getAllProducts, findProductById } from "../data/products.js";
import type { Product } from "../types/index.js";

export function listProducts(): Product[] {
  return getAllProducts();
}

export function getProduct(id: string): Product {
  const product = findProductById(id);
  if (!product) throw new Error("Product not found");
  return product;
}
