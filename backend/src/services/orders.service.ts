import { orderRepository }   from "../repositories/orderRepository.js";
import { productRepository }  from "../repositories/productRepository.js";
import { verifyPaymentIntent } from "./stripe.service.js";
import type { Order, CreateOrderRequest, PaginatedOrdersResponse } from "../types/index.js";

export async function createOrder(userId: string, body: CreateOrderRequest): Promise<Order> {
  const { paymentIntentId, customer, items } = body;

  if (orderRepository.isPaymentIntentUsed(paymentIntentId)) throw new Error("Payment already used");

  const { last4 } = await verifyPaymentIntent(paymentIntentId);

  const resolvedItems = items.map((item) => {
    const product = productRepository.findById(item.productId);
    if (!product) throw new Error("Invalid items");
    if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
    return { productId: item.productId, name: product.name, quantity: item.quantity, price: product.price };
  });

  const total = Math.round(
    resolvedItems.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100
  ) / 100;

  return orderRepository.create({
    userId,
    customerName:  customer.name,
    customerEmail: customer.email,
    address:       customer.address,
    total,
    paymentIntentId,
    paymentLast4: last4,
    items: resolvedItems,
  });
}

export function listOrders(userId: string, page: number, q: string): PaginatedOrdersResponse {
  return orderRepository.listByUserId(userId, Math.max(1, page), q);
}

export function getOrder(orderId: string, userId: string): Order {
  const order = orderRepository.findById(orderId);
  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Forbidden");
  return order;
}
