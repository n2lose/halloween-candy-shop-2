# Testing Guide — Halloween Candy Shop Backend

## Stack

| Tool | Role |
|------|------|
| `jest` + `ts-jest` | Test runner (ESM mode) |
| `supertest` | HTTP assertions against Express app |
| In-memory SQLite | Isolated DB per test suite |

---

## Run Tests

```bash
cd backend

npm test                        # all tests
npx jest auth                   # single file/folder
npx jest --watch                # watch mode
npx jest --coverage             # coverage report
npx jest orders --verbose       # verbose output
```

---

## File Structure

```
backend/
  __tests__/
    auth.test.ts          # POST /auth/register, /login, /refresh, GET /auth/me
    orders.test.ts        # GET /orders, GET /orders/:id, POST /orders
    products.test.ts      # GET /products, GET /products/:id
    dashboard.test.ts     # GET /admin/dashboard
    stripe.test.ts        # POST /stripe/create-payment-intent
    admin.test.ts         # Admin order + product management
  jest.config.ts
  jest.setup.ts           # sets DATABASE_PATH=":memory:", SEED_ADMIN_PASSWORD
```

---

## Test Anatomy

### Basic integration test

```typescript
import request from "supertest";
import { app } from "../src/app.js";

describe("GET /products", () => {
  it("returns 10 products", async () => {
    const res = await request(app).get("/products");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(10);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("price");
  });
});
```

### Authenticated test

```typescript
let token: string;

beforeAll(async () => {
  const res = await request(app)
    .post("/auth/login")
    .send({ email: "freddy@halloween.shop", password: process.env.SEED_USER_PASSWORD });
  token = res.body.access_token;
});

it("GET /auth/me returns user profile", async () => {
  const res = await request(app)
    .get("/auth/me")
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(200);
  expect(res.body).toMatchObject({ email: "freddy@halloween.shop" });
});
```

---

## Service Functions — What to Test

### `auth.service.ts`

| Function | Happy path | Error cases |
|----------|-----------|-------------|
| `register()` | Creates user, returns `{ access_token, refresh_token }` | Duplicate email → 409 |
| `login()` | Returns token pair | Wrong password → 401, unknown email → 401 |
| `refresh()` | Returns new `access_token` | Expired/invalid token → 401 |
| `getMe()` | Returns `{ id, name, email }` | No/invalid token → 401 |

```typescript
// register — happy path
it("registers a new user", async () => {
  const res = await request(app).post("/auth/register").send({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  });
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("access_token");
  expect(res.body).toHaveProperty("refresh_token");
});

// login — wrong password
it("rejects wrong password", async () => {
  const res = await request(app).post("/auth/login").send({
    email: "freddy@halloween.shop",
    password: "wrongpassword",
  });
  expect(res.status).toBe(401);
  expect(res.body).toEqual({ error: expect.any(String) });
});
```

---

### `orders.service.ts`

| Function | Happy path | Error cases |
|----------|-----------|-------------|
| `createOrder()` | Creates order, returns order detail | Invalid paymentIntentId → 400, reused intent → 409, out-of-stock → 400 |
| `listOrders()` | Paginated list, only user's own orders | Search with `q` filters by product name |
| `getOrder()` | Returns single order | Other user's order → 403, not found → 404 |

```typescript
// listOrders — pagination
it("paginates orders", async () => {
  const res = await request(app)
    .get("/orders?page=1")
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("data");
  expect(res.body).toHaveProperty("total");
  expect(res.body).toHaveProperty("page", 1);
});

// getOrder — authorization
it("returns 403 for another user's order", async () => {
  const res = await request(app)
    .get("/orders/some-other-users-order-id")
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(403);
});
```

---

### `stripe.service.ts`

The Stripe SDK must be mocked — never call the real API in tests.

```typescript
// Mock before importing the app
jest.unstable_mockModule("stripe", () => ({
  default: jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({
        client_secret: "pi_test_secret_123",
        amount: 1499,
        id: "pi_test_123",
      }),
    },
  })),
}));

const { app } = await import("../src/app.js");

it("creates payment intent", async () => {
  const res = await request(app)
    .post("/stripe/create-payment-intent")
    .set("Authorization", `Bearer ${token}`)
    .send({ items: [{ productId: "prod_1", quantity: 2 }] });

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("clientSecret");
  expect(res.body).toHaveProperty("amount");
  expect(res.body.amount).toBeGreaterThan(0);
});
```

---

### `dashboard.service.ts`

| Function | What to verify |
|----------|---------------|
| `getDashboard()` | Shape: `{ stats, sales_overview, bestsellers }` |
| | `stats.totalOrders` >= 0 |
| | `bestsellers` sorted by quantity desc, max 5 items |
| | `sales_overview.weekly` has 7 entries, `yearly` has 12 entries |

```typescript
it("returns dashboard with correct shape", async () => {
  const res = await request(app)
    .get("/dashboard")
    .set("Authorization", `Bearer ${adminToken}`);

  expect(res.status).toBe(200);
  expect(res.body.stats).toHaveProperty("totalOrders");
  expect(res.body.stats).toHaveProperty("totalRevenue");
  expect(res.body.bestsellers).toHaveLength(5);
  expect(res.body.sales_overview.weekly).toHaveLength(7);
  expect(res.body.sales_overview.yearly).toHaveLength(12);
});
```

---

## Mocking Strategies

### Mock an external module (ESM)

```typescript
// MUST be called before dynamic import of app
jest.unstable_mockModule("../src/services/stripe.service.js", () => ({
  verifyPaymentIntent: jest.fn().mockResolvedValue({ last4: "4242" }),
  createPaymentIntent: jest.fn(),
}));

const { app } = await import("../src/app.js");
```

### Override mock implementation per test

```typescript
const { verifyPaymentIntent } = await import("../src/services/stripe.service.js");
const mockVerify = verifyPaymentIntent as jest.MockedFunction<typeof verifyPaymentIntent>;

it("handles stripe failure", async () => {
  mockVerify.mockRejectedValueOnce(new Error("Payment not completed"));
  // ...
});
```

---

## Assertion Patterns

```typescript
// Object has property
expect(res.body).toHaveProperty("access_token");

// Partial match
expect(res.body).toMatchObject({ email: "freddy@halloween.shop", name: "Freddy" });

// Error shape
expect(res.body).toEqual({ error: expect.any(String) });

// Array length
expect(res.body.bestsellers).toHaveLength(5);

// Regex match
expect(res.body.error).toMatch(/insufficient stock/i);

// Floating-point (money)
expect(res.body.amount).toBeCloseTo(14.99, 2);

// Sorted order check
const quantities = res.body.bestsellers.map((b: any) => b.quantity);
expect(quantities).toEqual([...quantities].sort((a, b) => b - a));
```

---

## Seed Data (pre-seeded per test suite)

| Entity | Value |
|--------|-------|
| Admin | `admin@halloween.shop` / `Halloween2024!` |
| Customer | `freddy@halloween.shop` / `<SEED_USER_PASSWORD>` |
| Products | 10 products, IDs `prod_1`…`prod_10` |
| `prod_1` | Pumpkin Spice Lollipop — $2.99 |
| `prod_3` | Skull Chocolate Bar — $4.99 |
| Orders | ~30 mock orders (last 7 days + 12 months) |

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using `jest.mock()` instead of `jest.unstable_mockModule()` | Use `unstable_mockModule` for ESM |
| Importing app before mocking | Mock first, then `await import()` |
| Tests depending on execution order | Each test must be independent; use `beforeEach` to reset state |
| Hardcoding tokens | Always obtain tokens via `/auth/login` in `beforeAll` |
| Not asserting error shape | Always assert `res.body` has `{ error: string }` when status >= 400 |

---

## Coverage Target

```bash
npx jest --coverage --coverageThreshold='{"global":{"lines":80}}'
```

Coverage priority: `auth.service.ts` > `orders.service.ts` > `dashboard.service.ts` > `stripe.service.ts`
