import client from "./client";
import type { Order, AdminOrderSummary, PaginatedOrders, Product, OrderStatus } from "../types/index";

// ─── Orders ──────────────────────────────────────────────────────────────────

export const getAdminOrders = (page = 1, q = "") =>
  client.get<PaginatedOrders<AdminOrderSummary>>(`/admin/orders?page=${page}&q=${encodeURIComponent(q)}`);

export const getAdminOrder = (id: string) =>
  client.get<Order>(`/admin/orders/${id}`);

export const updateOrderStatus = (id: string, status: OrderStatus) =>
  client.patch<Order>(`/admin/orders/${id}/status`, { status });

// ─── Products ─────────────────────────────────────────────────────────────────

type ProductPayload = { name: string; price: number; stock: number };

export const createProduct = (data: ProductPayload) =>
  client.post<Product>("/admin/products", data);

export const updateProduct = (id: string, data: Partial<ProductPayload>) =>
  client.put<Product>(`/admin/products/${id}`, data);

export const deleteProduct = (id: string) =>
  client.delete(`/admin/products/${id}`);
