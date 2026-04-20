import { findOrderById, findOrdersByUserId, addOrder, usedPaymentIntents } from "../data/orders.js";
import { findProductById } from "../data/products.js";
import { verifyPaymentIntent } from "../stripe/stripe.service.js";
import type { Order, CreateOrderRequest, PaginatedOrdersResponse } from "../types/index.js";

// ─── Create order ─────────────────────────────────────────────────────────────

export async function createOrder(userId: number, body: CreateOrderRequest): Promise<Order> {
  const { paymentIntentId, customer, items } = body;

  if (usedPaymentIntents.has(paymentIntentId)) throw new Error("Payment already used");

  const { last4 } = await verifyPaymentIntent(paymentIntentId);
  usedPaymentIntents.add(paymentIntentId);

  const resolvedItems = items.map((item) => {
    const product = findProductById(item.productId);
    if (!product) throw new Error("Invalid items");
    return {
      productId: item.productId,
      name: product.name,
      quantity: item.quantity,
      unitPrice: product.price,
      subtotal: Math.round(product.price * item.quantity * 100) / 100,
    };
  });

  const total = Math.round(resolvedItems.reduce((sum, i) => sum + i.subtotal, 0) * 100) / 100;

  return addOrder({
    userId,
    items: resolvedItems,
    shipping: customer,
    payment: { last4, status: "succeeded" },
    total,
  });
}

// ─── List orders (paginated + search) ────────────────────────────────────────

export function listOrders(userId: number, page: number, q: string): PaginatedOrdersResponse {
  const safePage = Math.max(1, page);
  const perPage = 10;

  let userOrders = findOrdersByUserId(userId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (q) {
    const term = q.toLowerCase();
    userOrders = userOrders.filter(
      (o) =>
        o.items.some((i) => i.name.toLowerCase().includes(term)) ||
        o.shipping.name.toLowerCase().includes(term)
    );
  }

  const total = userOrders.length;
  const totalPages = Math.ceil(total / perPage);
  const paginated = userOrders.slice((safePage - 1) * perPage, safePage * perPage);

  return {
    orders: paginated.map((o) => ({
      orderId: o.orderId,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
    })),
    total,
    page: safePage,
    per_page: perPage,
    total_pages: totalPages,
  };
}

// ─── Get single order ─────────────────────────────────────────────────────────

export function getOrder(orderId: string, userId: number): Order {
  const order = findOrderById(orderId);
  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Forbidden");
  return order;
}
