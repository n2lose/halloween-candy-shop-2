# PLAN-005: Stripe + Orders Endpoints

**Status**: DONE

## Context

Final backend plan — implements Stripe payment intent creation and the full orders API. Depends on auth middleware (PLAN-002) and products/orders data (PLAN-001).

**Endpoints**:
- `POST /stripe/create-payment-intent` (protected) — validate items, calculate total, create Stripe PaymentIntent
- `POST /orders` (protected) — verify Stripe payment succeeded, persist order
- `GET /orders` (protected) — user's order history, paginated + searchable
- `GET /orders/:id` (protected) — single order, 403 if not owner

**Key rules from api-spec.md**:
- Amount in cents: `Math.round(price * 100) * quantity` per item
- Items validation: non-empty, valid productId, positive integer quantity → 400 if invalid
- Duplicate PaymentIntent guard: `usedPaymentIntents` Set → 400 "Payment already used"
- Stripe verify: `stripe.paymentIntents.retrieve(id)` → check `status === "succeeded"` → extract `last4`
- Search `q`: case-insensitive `includes()` on product name OR customer name (no regex)
- Pagination: `page` defaults to 1, clamp `< 1` to 1, `per_page = 10`

## Tasks

### Task 1: Create `stripe/stripe.service.ts`

```typescript
import Stripe from "stripe";
import { findProductById } from "../data/products.js";
import type { CreatePaymentIntentRequest } from "../types/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", { apiVersion: "2024-04-10" });

function validateItems(items: CreatePaymentIntentRequest["items"]): void {
  if (!Array.isArray(items) || items.length === 0) throw new Error("Invalid items");
  for (const item of items) {
    if (!findProductById(item.productId)) throw new Error("Invalid items");
    if (!Number.isInteger(item.quantity) || item.quantity < 1) throw new Error("Invalid items");
  }
}

function calcAmountCents(items: CreatePaymentIntentRequest["items"]): number {
  return items.reduce((total, item) => {
    const product = findProductById(item.productId)!;
    return total + Math.round(product.price * 100) * item.quantity;
  }, 0);
}

export async function createPaymentIntent(items: CreatePaymentIntentRequest["items"]): Promise<{ clientSecret: string; amount: number }> {
  validateItems(items);
  const amount = calcAmountCents(items);
  const intent = await stripe.paymentIntents.create({ amount, currency: "usd" });
  return { clientSecret: intent.client_secret!, amount };
}

export async function verifyPaymentIntent(paymentIntentId: string): Promise<{ last4: string }> {
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ["payment_method"],
  });
  if (intent.status !== "succeeded") throw new Error("Payment not confirmed");
  const pm = intent.payment_method as Stripe.PaymentMethod | null;
  const last4 = pm?.card?.last4 ?? "4242";
  return { last4 };
}
```

**Files**: `backend/src/stripe/stripe.service.ts`

---

### Task 2: Create `stripe/stripe.router.ts`

```typescript
import { Router, Request, Response } from "express";
import { verifyAccessToken } from "../auth/auth.middleware.js";
import { createPaymentIntent } from "./stripe.service.js";
import type { CreatePaymentIntentRequest } from "../types/index.js";

const router = Router();

router.post("/create-payment-intent", verifyAccessToken, async (req: Request, res: Response) => {
  const { items } = req.body as CreatePaymentIntentRequest;
  try {
    const result = await createPaymentIntent(items);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export { router as stripeRouter };
```

**Files**: `backend/src/stripe/stripe.router.ts`

---

### Task 3: Create `orders/orders.service.ts`

Split into focused functions:

```typescript
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

  return addOrder({ userId, items: resolvedItems, shipping: customer, payment: { last4, status: "succeeded" }, total });
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
    orders: paginated.map((o) => ({ orderId: o.orderId, total: o.total, status: o.status, createdAt: o.createdAt })),
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
```

**Files**: `backend/src/orders/orders.service.ts`

---

### Task 4: Create `orders/orders.router.ts`

```typescript
import { Router, Request, Response } from "express";
import { verifyAccessToken } from "../auth/auth.middleware.js";
import { createOrder, listOrders, getOrder } from "./orders.service.js";
import type { CreateOrderRequest } from "../types/index.js";

const router = Router();

// POST /orders
router.post("/", verifyAccessToken, async (req: Request, res: Response) => {
  try {
    const order = await createOrder(req.user!.sub, req.body as CreateOrderRequest);
    res.status(201).json(order);
  } catch (err) {
    const msg = (err as Error).message;
    const status = msg === "Forbidden" ? 403 : msg === "Order not found" ? 404 : 400;
    res.status(status).json({ error: msg });
  }
});

// GET /orders
router.get("/", verifyAccessToken, (req: Request, res: Response) => {
  const page = parseInt(String(req.query.page ?? "1"), 10) || 1;
  const q = String(req.query.q ?? "");
  res.status(200).json(listOrders(req.user!.sub, page, q));
});

// GET /orders/:id
router.get("/:id", verifyAccessToken, (req: Request, res: Response) => {
  try {
    res.status(200).json(getOrder(req.params.id, req.user!.sub));
  } catch (err) {
    const msg = (err as Error).message;
    const status = msg === "Forbidden" ? 403 : 404;
    res.status(status).json({ error: msg });
  }
});

export { router as ordersRouter };
```

**Files**: `backend/src/orders/orders.router.ts`

---

### Task 5: Mount routers in `app.ts`

```typescript
import { stripeRouter } from "./stripe/stripe.router.js";
import { ordersRouter } from "./orders/orders.router.js";
// ...
app.use("/stripe", stripeRouter);
app.use("/orders", ordersRouter);
```

**Files**: `backend/src/app.ts`

## Verification

```bash
# Login first
TOKEN=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"freddy@halloween.shop","password":"ElmStreet2019"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

# List orders (Freddy has 30 mock orders)
curl -s "http://localhost:3001/orders" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

# Paginate
curl -s "http://localhost:3001/orders?page=2" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

# Search by product name
curl -s "http://localhost:3001/orders?q=pumpkin" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

# Get single order (replace ORD-0001)
curl -s "http://localhost:3001/orders/ORD-0001" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

# 404 not found
curl -s "http://localhost:3001/orders/ORD-9999" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

# Stripe: requires real sk_test_ key — verify with Stripe test mode
# POST /stripe/create-payment-intent + POST /orders tested manually
```

> **Note on Stripe**: `createPaymentIntent` and `verifyPaymentIntent` require a valid `STRIPE_SECRET_KEY` in `.env`. Update `.env` with a real `sk_test_` key before testing those endpoints. List/detail orders can be tested without Stripe.

## Task dependency graph

```
Task 1 (stripe.service.ts) → Task 2 (stripe.router.ts) → Task 5 (mount)
Task 1 (stripe.service.ts) → Task 3 (orders.service.ts) → Task 4 (orders.router.ts) → Task 5
```
