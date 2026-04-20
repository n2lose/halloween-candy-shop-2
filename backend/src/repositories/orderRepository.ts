import db from "../db/sqlite.js";
import type { Order, OrderItem, OrderStatus, PaginatedOrdersResponse } from "../types/index.js";

interface OrderRow {
  id: string; user_id: string; customer_name: string; customer_email: string;
  address: string; total: number; status: string; payment_intent_id: string;
  payment_last4: string; created_at: string;
}
interface ItemRow { product_id: string; name: string; quantity: number; price: number; }

function toOrder(row: OrderRow, items: ItemRow[]): Order {
  return {
    orderId: row.id,
    userId: row.user_id,
    items: items.map((i): OrderItem => ({
      productId: i.product_id, name: i.name,
      quantity: i.quantity, unitPrice: i.price,
      subtotal: Math.round(i.price * i.quantity * 100) / 100,
    })),
    shipping: { name: row.customer_name, email: row.customer_email, address: row.address },
    payment:  { last4: row.payment_last4, status: "succeeded" },
    total: row.total,
    status: row.status as OrderStatus,
    createdAt: row.created_at,
  };
}

const stmts = {
  byId:            db.prepare<[string]>("SELECT * FROM orders WHERE id = ?"),
  itemsByOrderId:  db.prepare<[string]>("SELECT * FROM order_items WHERE order_id = ?"),
  insertOrder:     db.prepare("INSERT INTO orders (id,user_id,customer_name,customer_email,address,total,status,payment_intent_id,payment_last4,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)"),
  insertItem:      db.prepare("INSERT INTO order_items (order_id,product_id,name,quantity,price) VALUES (?,?,?,?,?)"),
  updateStatus:    db.prepare<[string, string]>("UPDATE orders SET status=? WHERE id=?"),
  countUser: db.prepare(`
    SELECT COUNT(DISTINCT o.id) as c FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id=? AND (o.id LIKE ? OR oi.name LIKE ?)`),
  countAll:  db.prepare("SELECT COUNT(*) as c FROM orders WHERE customer_name LIKE ? OR id LIKE ?"),
  listUser:  db.prepare(`
    SELECT DISTINCT o.* FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id=? AND (o.id LIKE ? OR oi.name LIKE ?)
    ORDER BY o.created_at DESC LIMIT ? OFFSET ?`),
  listAll:   db.prepare("SELECT * FROM orders WHERE customer_name LIKE ? OR id LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?"),
  intentExists:    db.prepare<[string]>("SELECT 1 FROM orders WHERE payment_intent_id=?"),
  nextNum:         db.prepare("SELECT COUNT(*) as c FROM orders"),
};

function nextId(): string {
  const { c } = stmts.nextNum.get() as { c: number };
  return `ORD-${String(c + 1).padStart(4, "0")}`;
}

function fetchWithItems(row: OrderRow): Order {
  const items = stmts.itemsByOrderId.all(row.id) as ItemRow[];
  return toOrder(row, items);
}

function buildPaginated(rows: OrderRow[], total: number, page: number): PaginatedOrdersResponse {
  return {
    orders: rows.map((r) => ({
      orderId: r.id, customerName: r.customer_name,
      total: r.total, status: r.status as OrderStatus, createdAt: r.created_at,
    })),
    total, page, per_page: 10, total_pages: Math.ceil(total / 10),
  };
}

export const orderRepository = {
  findById(id: string): Order | undefined {
    const row = stmts.byId.get(id) as OrderRow | undefined;
    return row ? fetchWithItems(row) : undefined;
  },

  isPaymentIntentUsed(intentId: string): boolean {
    return !!stmts.intentExists.get(intentId);
  },

  create(data: {
    userId: string; customerName: string; customerEmail: string; address: string;
    total: number; paymentIntentId: string; paymentLast4: string;
    items: Array<{ productId: string; name: string; quantity: number; price: number }>;
  }): Order {
    const id  = nextId();
    const now = new Date().toISOString();

    const run = db.transaction(() => {
      stmts.insertOrder.run(id, data.userId, data.customerName, data.customerEmail, data.address, data.total, "processing", data.paymentIntentId, data.paymentLast4, now);
      for (const item of data.items) {
        stmts.insertItem.run(id, item.productId, item.name, item.quantity, item.price);
      }
    });
    run();
    return orderRepository.findById(id)!;
  },

  updateStatus(id: string, status: string): Order | undefined {
    stmts.updateStatus.run(status, id);
    return orderRepository.findById(id);
  },

  listByUserId(userId: string, page: number, q: string): PaginatedOrdersResponse {
    const safePage = Math.max(1, page);
    const like = `%${q}%`;
    const { c } = stmts.countUser.get(userId, like, like) as { c: number };
    const rows  = stmts.listUser.all(userId, like, like, 10, (safePage - 1) * 10) as OrderRow[];
    return buildPaginated(rows, c, safePage);
  },

  listAll(page: number, q: string): PaginatedOrdersResponse {
    const safePage = Math.max(1, page);
    const like = `%${q}%`;
    const { c } = stmts.countAll.get(like, like) as { c: number };
    const rows  = stmts.listAll.all(like, like, 10, (safePage - 1) * 10) as OrderRow[];
    return buildPaginated(rows, c, safePage);
  },
};
