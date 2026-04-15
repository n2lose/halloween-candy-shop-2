import { Order, OrderStatus } from "../types/index.js";
import { formatOrderId } from "../utils/formatters.js";

function daysAgo(days: number, hourOffset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hourOffset, 0, 0, 0);
  return d.toISOString();
}

function monthsAgo(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  d.setDate(10);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

const seedOrders: Order[] = [
  // Today — 6 orders
  {
    orderId: formatOrderId(1), userId: 1,
    items: [{ productId: "prod_1", name: "Pumpkin Spice Lollipop", quantity: 3, unitPrice: 2.99, subtotal: 8.97 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 8.97, status: "processing", createdAt: daysAgo(0, 8),
  },
  {
    orderId: formatOrderId(2), userId: 1,
    items: [{ productId: "prod_4", name: "Spider Web Cotton Candy", quantity: 5, unitPrice: 1.99, subtotal: 9.95 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 9.95, status: "processing", createdAt: daysAgo(0, 9),
  },
  {
    orderId: formatOrderId(3), userId: 1,
    items: [{ productId: "prod_3", name: "Skull Chocolate Bar", quantity: 2, unitPrice: 4.99, subtotal: 9.98 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 9.98, status: "processing", createdAt: daysAgo(0, 10),
  },
  {
    orderId: formatOrderId(4), userId: 1,
    items: [
      { productId: "prod_5", name: "Ghost Marshmallow", quantity: 4, unitPrice: 2.49, subtotal: 9.96 },
      { productId: "prod_7", name: "Vampire Fang Candy Corn", quantity: 2, unitPrice: 1.99, subtotal: 3.98 },
    ],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 13.94, status: "processing", createdAt: daysAgo(0, 11),
  },
  {
    orderId: formatOrderId(5), userId: 1,
    items: [{ productId: "prod_2", name: "Witch Finger Gummy", quantity: 3, unitPrice: 3.49, subtotal: 10.47 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 10.47, status: "processing", createdAt: daysAgo(0, 13),
  },
  {
    orderId: formatOrderId(6), userId: 1,
    items: [{ productId: "prod_9", name: "Frankenstein Fudge", quantity: 2, unitPrice: 4.49, subtotal: 8.98 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 8.98, status: "processing", createdAt: daysAgo(0, 14),
  },

  // Yesterday — 3 orders
  {
    orderId: formatOrderId(7), userId: 1,
    items: [{ productId: "prod_1", name: "Pumpkin Spice Lollipop", quantity: 5, unitPrice: 2.99, subtotal: 14.95 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 14.95, status: "processing", createdAt: daysAgo(1, 9),
  },
  {
    orderId: formatOrderId(8), userId: 1,
    items: [{ productId: "prod_6", name: "Cauldron Caramel Apple", quantity: 2, unitPrice: 5.99, subtotal: 11.98 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 11.98, status: "shipped", createdAt: daysAgo(1, 11),
  },
  {
    orderId: formatOrderId(9), userId: 1,
    items: [{ productId: "prod_10", name: "Zombie Brain Gummy", quantity: 4, unitPrice: 3.29, subtotal: 13.16 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 13.16, status: "shipped", createdAt: daysAgo(1, 14),
  },

  // 2 days ago — 2 orders
  {
    orderId: formatOrderId(10), userId: 1,
    items: [{ productId: "prod_4", name: "Spider Web Cotton Candy", quantity: 8, unitPrice: 1.99, subtotal: 15.92 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 15.92, status: "shipped", createdAt: daysAgo(2, 10),
  },
  {
    orderId: formatOrderId(11), userId: 1,
    items: [{ productId: "prod_3", name: "Skull Chocolate Bar", quantity: 3, unitPrice: 4.99, subtotal: 14.97 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 14.97, status: "delivered", createdAt: daysAgo(2, 15),
  },

  // 3–6 days ago — 2 orders each
  {
    orderId: formatOrderId(12), userId: 1,
    items: [{ productId: "prod_2", name: "Witch Finger Gummy", quantity: 4, unitPrice: 3.49, subtotal: 13.96 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 13.96, status: "delivered", createdAt: daysAgo(3, 9),
  },
  {
    orderId: formatOrderId(13), userId: 1,
    items: [{ productId: "prod_5", name: "Ghost Marshmallow", quantity: 6, unitPrice: 2.49, subtotal: 14.94 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 14.94, status: "delivered", createdAt: daysAgo(4, 11),
  },
  {
    orderId: formatOrderId(14), userId: 1,
    items: [{ productId: "prod_8", name: "Black Cat Licorice", quantity: 3, unitPrice: 3.99, subtotal: 11.97 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 11.97, status: "delivered", createdAt: daysAgo(5, 10),
  },
  {
    orderId: formatOrderId(15), userId: 1,
    items: [{ productId: "prod_1", name: "Pumpkin Spice Lollipop", quantity: 6, unitPrice: 2.99, subtotal: 17.94 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 17.94, status: "delivered", createdAt: daysAgo(6, 13),
  },

  // Past months — 2 orders per month for 12 months
  {
    orderId: formatOrderId(16), userId: 1,
    items: [{ productId: "prod_6", name: "Cauldron Caramel Apple", quantity: 5, unitPrice: 5.99, subtotal: 29.95 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 29.95, status: "delivered", createdAt: monthsAgo(1),
  },
  {
    orderId: formatOrderId(17), userId: 1,
    items: [{ productId: "prod_3", name: "Skull Chocolate Bar", quantity: 4, unitPrice: 4.99, subtotal: 19.96 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 19.96, status: "delivered", createdAt: monthsAgo(1),
  },
  {
    orderId: formatOrderId(18), userId: 1,
    items: [{ productId: "prod_9", name: "Frankenstein Fudge", quantity: 6, unitPrice: 4.49, subtotal: 26.94 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 26.94, status: "delivered", createdAt: monthsAgo(2),
  },
  {
    orderId: formatOrderId(19), userId: 1,
    items: [{ productId: "prod_2", name: "Witch Finger Gummy", quantity: 5, unitPrice: 3.49, subtotal: 17.45 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 17.45, status: "delivered", createdAt: monthsAgo(2),
  },
  {
    orderId: formatOrderId(20), userId: 1,
    items: [{ productId: "prod_10", name: "Zombie Brain Gummy", quantity: 5, unitPrice: 3.29, subtotal: 16.45 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 16.45, status: "delivered", createdAt: monthsAgo(3),
  },
  {
    orderId: formatOrderId(21), userId: 1,
    items: [{ productId: "prod_4", name: "Spider Web Cotton Candy", quantity: 10, unitPrice: 1.99, subtotal: 19.90 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 19.90, status: "delivered", createdAt: monthsAgo(3),
  },
  {
    orderId: formatOrderId(22), userId: 1,
    items: [{ productId: "prod_5", name: "Ghost Marshmallow", quantity: 8, unitPrice: 2.49, subtotal: 19.92 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 19.92, status: "delivered", createdAt: monthsAgo(4),
  },
  {
    orderId: formatOrderId(23), userId: 1,
    items: [{ productId: "prod_8", name: "Black Cat Licorice", quantity: 4, unitPrice: 3.99, subtotal: 15.96 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 15.96, status: "delivered", createdAt: monthsAgo(5),
  },
  {
    orderId: formatOrderId(24), userId: 1,
    items: [{ productId: "prod_1", name: "Pumpkin Spice Lollipop", quantity: 7, unitPrice: 2.99, subtotal: 20.93 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 20.93, status: "delivered", createdAt: monthsAgo(6),
  },
  {
    orderId: formatOrderId(25), userId: 1,
    items: [{ productId: "prod_7", name: "Vampire Fang Candy Corn", quantity: 8, unitPrice: 1.99, subtotal: 15.92 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 15.92, status: "delivered", createdAt: monthsAgo(7),
  },
  {
    orderId: formatOrderId(26), userId: 1,
    items: [{ productId: "prod_6", name: "Cauldron Caramel Apple", quantity: 4, unitPrice: 5.99, subtotal: 23.96 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 23.96, status: "delivered", createdAt: monthsAgo(8),
  },
  {
    orderId: formatOrderId(27), userId: 1,
    items: [{ productId: "prod_3", name: "Skull Chocolate Bar", quantity: 3, unitPrice: 4.99, subtotal: 14.97 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 14.97, status: "delivered", createdAt: monthsAgo(9),
  },
  {
    orderId: formatOrderId(28), userId: 1,
    items: [{ productId: "prod_2", name: "Witch Finger Gummy", quantity: 6, unitPrice: 3.49, subtotal: 20.94 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 20.94, status: "delivered", createdAt: monthsAgo(10),
  },
  {
    orderId: formatOrderId(29), userId: 1,
    items: [{ productId: "prod_10", name: "Zombie Brain Gummy", quantity: 4, unitPrice: 3.29, subtotal: 13.16 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 13.16, status: "delivered", createdAt: monthsAgo(11),
  },
  {
    orderId: formatOrderId(30), userId: 1,
    items: [{ productId: "prod_5", name: "Ghost Marshmallow", quantity: 9, unitPrice: 2.49, subtotal: 22.41 }],
    shipping: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St" },
    payment: { last4: "4242", status: "succeeded" },
    total: 22.41, status: "delivered", createdAt: monthsAgo(12),
  },
];

export const orders: Order[] = [...seedOrders];
export const usedPaymentIntents = new Set<string>();

let nextOrderNum = seedOrders.length + 1;

export function findOrderById(orderId: string): Order | undefined {
  return orders.find((o) => o.orderId === orderId);
}

export function findOrdersByUserId(userId: number): Order[] {
  return orders.filter((o) => o.userId === userId);
}

export function addOrder(order: Omit<Order, "orderId" | "status" | "createdAt">): Order {
  const newOrder: Order = {
    ...order,
    orderId: formatOrderId(nextOrderNum++),
    status: "processing",
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  return newOrder;
}
