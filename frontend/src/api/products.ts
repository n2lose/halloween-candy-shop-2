import client from "./client";
import type { Product } from "../types/index";

export const getProducts = () =>
  client.get<Product[]>("/products");

export const getProduct = (id: string) =>
  client.get<Product>(`/products/${id}`);
