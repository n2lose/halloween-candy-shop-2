import client from "./client";
import type { Order, PaginatedOrders, ShippingInfo, CartItem } from "../types/index";

export const getOrders = (page = 1, q = "") =>
  client.get<PaginatedOrders>(`/orders?page=${page}&q=${encodeURIComponent(q)}`);

export const getOrder = (id: string) =>
  client.get<Order>(`/orders/${id}`);

export const createOrder = (data: {
  paymentIntentId: string;
  customer: ShippingInfo;
  items: CartItem[];
}) => client.post<Order>("/orders", data);

export const createPaymentIntent = (items: CartItem[]) =>
  client.post<{ clientSecret: string; amount: number }>("/stripe/create-payment-intent", { items });
