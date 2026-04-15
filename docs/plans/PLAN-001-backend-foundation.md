# PLAN-001: Backend Foundation

**Status**: DONE

## Context

First plan in the project — sets up the Express + TypeScript backend scaffold, type definitions, mock data, and the app entry point. All subsequent backend plans (PLAN-002 through PLAN-006) depend on this foundation.

**Existing code**: `types/index.ts` (4 interfaces), `data/users.ts` (pre-seeded Freddy with fake bcrypt hash), `auth/login.service.ts` (login + token generation), `utils/formatters.ts` (3 helpers). No `package.json`, no `tsconfig.json`, no `app.ts`.

## Tasks

### Task 1: Initialize project — `package.json` + dependencies

Create `backend/package.json` with:

**Production deps**: `express`, `cors`, `jsonwebtoken`, `bcryptjs`, `dotenv`, `stripe`

**Dev deps**: `typescript`, `ts-node-dev`, `@types/express`, `@types/cors`, `@types/jsonwebtoken`, `@types/bcryptjs`, `jest`, `ts-jest`, `@types/jest`, `supertest`, `@types/supertest`

**Scripts**:
```json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "test": "jest",
  "lint": "tsc --noEmit"
}
```

**Files**: `backend/package.json`

---

### Task 2: TypeScript config — `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}
```

Must match existing `.js` import extensions in `login.service.ts` (uses `"../data/users.js"` — NodeNext module resolution).

**Files**: `backend/tsconfig.json`

---

### Task 3: Environment config — `.env`, `.env.example`, `.gitignore`

`.env.example` (committed):
```
PORT=3001
JWT_ACCESS_SECRET=your-access-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
STRIPE_SECRET_KEY=sk_test_your-key-here
```

`.env` (gitignored): same with actual dev values.

`.gitignore`: add `node_modules/`, `dist/`, `.env`

**Files**: `backend/.env`, `backend/.env.example`, `backend/.gitignore`

---

### Task 4: Expand type definitions — `types/index.ts`

Keep existing: `User`, `TokenPair`, `AccessTokenPayload`, `RefreshTokenPayload`

Add:
```typescript
export interface Product {
  id: string;        // "prod_1" through "prod_10"
  name: string;
  emoji: string;
  price: number;     // in dollars (e.g., 2.99)
  stock: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ShippingInfo {
  name: string;
  email: string;
  address: string;
}

export interface PaymentInfo {
  last4: string;
  status: "succeeded";
}

export type OrderStatus = "processing" | "shipped" | "delivered";

export interface Order {
  orderId: string;       // "ORD-0001" format
  userId: number;        // internal, not exposed in API
  items: OrderItem[];
  shipping: ShippingInfo;
  payment: PaymentInfo;
  total: number;
  status: OrderStatus;
  createdAt: string;     // ISO 8601
}

export interface StatsBlock {
  revenue: number;
  orders: number;
}

export interface SalesDataPoint {
  label: string;
  revenue: number;
}

export interface Bestseller {
  name: string;
  price: number;
  units_sold: number;
  revenue: number;
}

export interface DashboardResponse {
  stats: {
    today: StatsBlock;
    last_week: StatsBlock;
    last_month: StatsBlock;
  };
  sales_overview: {
    weekly: SalesDataPoint[];
    yearly: SalesDataPoint[];
  };
  bestsellers: Bestseller[];
}

export interface PaginatedOrdersResponse {
  orders: Array<{
    orderId: string;
    total: number;
    status: OrderStatus;
    createdAt: string;
  }>;
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface CreatePaymentIntentRequest {
  items: Array<{ productId: string; quantity: number }>;
}

export interface CreateOrderRequest {
  paymentIntentId: string;
  customer: ShippingInfo;
  items: Array<{ productId: string; quantity: number }>;
}
```

**Files**: `backend/src/types/index.ts`

---

### Task 5: Fix bcrypt hash + add user helpers — `data/users.ts`

Current hash is fake (72 chars, valid bcrypt is 60). Fix:

```typescript
import bcrypt from "bcryptjs";

// Generate real hash at module load (dev only — acceptable for assignment)
const freddyHash = bcrypt.hashSync("ElmStreet2019", 10);

export const users: User[] = [
  { id: 1, name: "Freddy", email: "freddy@halloween.shop", password: freddyHash }
];

let nextId = 2;

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email.toLowerCase());
}

export function addUser(name: string, email: string, hashedPassword: string): User {
  const user: User = { id: nextId++, name, email: email.toLowerCase(), password: hashedPassword };
  users.push(user);
  return user;
}

export function findUserById(id: number): User | undefined {
  return users.find((u) => u.id === id);
}
```

**Files**: `backend/src/data/users.ts`

---

### Task 6: Create mock products — `data/products.ts`

10 Halloween candy products matching CLAUDE.md names. IDs `prod_1` through `prod_10`, prices $1.99–$5.99, stock 50–200.

Export: `getAllProducts()`, `findProductById(id: string)`

**Files**: `backend/src/data/products.ts`

---

### Task 7: Create mock orders — `data/orders.ts`

~30 orders assigned to user id 1 (Freddy):
- 5–8 orders today (for `stats.today`)
- ~15 orders in last 7 days (for `stats.last_week` and `sales_overview.weekly`)
- Remaining spread across last 12 months (for `sales_overview.yearly`)

Mix of statuses: `processing`, `shipped`, `delivered`. Items reference real product IDs from `products.ts`. Use `formatOrderId()` from formatters for IDs.

Export: `findOrderById()`, `findOrdersByUserId()`, `addOrder()`, `usedPaymentIntents` (Set)

**Files**: `backend/src/data/orders.ts`

---

### Task 8: Add `formatUserId` — `utils/formatters.ts`

Add one function to existing file:

```typescript
export function formatUserId(id: number): string {
  return `usr_${id}`;
}
```

**Files**: `backend/src/utils/formatters.ts`

---

### Task 9: Create Express app — `app.ts`

```typescript
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

// Route mounting (placeholders — filled in PLAN-002+)
// app.use("/auth", authRouter);
// app.use("/products", productsRouter);
// app.use("/dashboard", dashboardRouter);
// app.use("/orders", ordersRouter);
// app.use("/stripe", stripeRouter);

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.message);
  res.status(500).json({ error: "Internal server error" });
});

export { app };
```

**Files**: `backend/src/app.ts`

---

### Task 10: Create server entry — `server.ts`

```typescript
import { app } from "./app.js";

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

Separate from `app.ts` so Supertest can import `app` without starting a real server.

**Files**: `backend/src/server.ts`

---

### Task 11: Clean up placeholder utils

Delete: `utils/hello.ts`, `utils/goodbye.ts`, `utils/test-hook.ts` (learning artifacts, unused).

Keep: `utils/formatters.ts`

---

### Task 12: Verify

1. `cd backend && npm install` — succeeds
2. `npm run dev` — server starts on port 3001
3. `curl http://localhost:3001/` — returns `{ "status": "ok" }`
4. `npm run lint` (tsc --noEmit) — no errors
5. Existing `login.service.ts` still compiles with updated types

## Task dependency graph

```
Task 1 (npm init) → Task 2 (tsconfig) → Task 3 (.env)
                                        → Task 4 (types)  → Task 5 (fix users)
                                                           → Task 6 (products)
                                                           → Task 7 (orders, needs Task 6)
                                        → Task 8 (formatUserId)
                                        → Task 9 (app.ts) → Task 10 (server.ts)
Task 11 (cleanup) — independent
Task 12 (verify) — after all above
```
