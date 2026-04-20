# PLAN-006: Integration Tests

**Status**: DONE

## Context

Final Sprint 1 plan — adds integration tests covering all 11 endpoints via Supertest. Tests import `app` directly (no server start). Stripe's `verifyPaymentIntent` is mocked so `POST /orders` can be tested without a live Stripe key.

**Stack**: Jest + ts-jest + Supertest. Project uses `"type": "module"` (ESM), so Jest needs `--experimental-vm-modules` and ts-jest ESM mode.

## Tasks

### Task 1: Configure Jest for ESM

**`backend/jest.config.ts`**:
```typescript
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    // Strip .js extensions from imports so Jest can resolve .ts files
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
  clearMocks: true,
};

export default config;
```

Update `package.json` test script:
```json
"test": "NODE_OPTIONS='--experimental-vm-modules' jest"
```

**Files**: `backend/jest.config.ts`, `backend/package.json`

---

### Task 2: Auth test — `__tests__/auth.test.ts`

Covers: register, login, refresh, me + all error cases.

```typescript
import request from "supertest";
import { app } from "../src/app.js";

describe("POST /auth/register", () => {
  it("returns 201 with tokens for valid input", async () => {
    const res = await request(app).post("/auth/register")
      .send({ name: "Jane", email: "jane@test.com", password: "secret123" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("access_token");
    expect(res.body).toHaveProperty("refresh_token");
  });

  it("returns 400 if email already registered", async () => {
    await request(app).post("/auth/register")
      .send({ name: "Jane", email: "duplicate@test.com", password: "secret123" });
    const res = await request(app).post("/auth/register")
      .send({ name: "Jane", email: "duplicate@test.com", password: "secret123" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Email already registered");
  });

  it("returns 400 if password too short", async () => {
    const res = await request(app).post("/auth/register")
      .send({ name: "Jane", email: "short@test.com", password: "abc" });
    expect(res.status).toBe(400);
  });

  it("returns 400 if required fields missing", async () => {
    const res = await request(app).post("/auth/register").send({ email: "x@x.com" });
    expect(res.status).toBe(400);
  });
});

describe("POST /auth/login", () => {
  it("returns 200 with tokens for valid Freddy credentials", async () => {
    const res = await request(app).post("/auth/login")
      .send({ email: "freddy@halloween.shop", password: "ElmStreet2019" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("access_token");
    expect(res.body).toHaveProperty("refresh_token");
  });

  it("returns 401 for wrong password", async () => {
    const res = await request(app).post("/auth/login")
      .send({ email: "freddy@halloween.shop", password: "wrong" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });

  it("returns 401 for unknown email", async () => {
    const res = await request(app).post("/auth/login")
      .send({ email: "nobody@test.com", password: "secret123" });
    expect(res.status).toBe(401);
  });
});

describe("POST /auth/refresh", () => {
  it("returns 200 with new access token", async () => {
    const login = await request(app).post("/auth/login")
      .send({ email: "freddy@halloween.shop", password: "ElmStreet2019" });
    const res = await request(app).post("/auth/refresh")
      .set("Authorization", `Bearer ${login.body.refresh_token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("access_token");
    expect(res.body).not.toHaveProperty("refresh_token");
  });

  it("returns 401 for invalid token", async () => {
    const res = await request(app).post("/auth/refresh")
      .set("Authorization", "Bearer bad.token.here");
    expect(res.status).toBe(401);
  });
});

describe("GET /auth/me", () => {
  it("returns 200 with user profile", async () => {
    const login = await request(app).post("/auth/login")
      .send({ email: "freddy@halloween.shop", password: "ElmStreet2019" });
    const res = await request(app).get("/auth/me")
      .set("Authorization", `Bearer ${login.body.access_token}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: "usr_1", name: "Freddy", email: "freddy@halloween.shop" });
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.status).toBe(401);
  });
});
```

**Files**: `backend/__tests__/auth.test.ts`

---

### Task 3: Products test — `__tests__/products.test.ts`

```typescript
import request from "supertest";
import { app } from "../src/app.js";

describe("GET /products", () => {
  it("returns 200 with 10 products", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(10);
    expect(res.body[0]).toMatchObject({ id: expect.any(String), name: expect.any(String), price: expect.any(Number) });
  });

  it("does not require auth", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
  });
});

describe("GET /products/:id", () => {
  it("returns 200 with product for valid id", async () => {
    const res = await request(app).get("/products/prod_1");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: "prod_1", name: "Pumpkin Spice Lollipop", price: 2.99 });
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app).get("/products/prod_999");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Product not found" });
  });
});
```

**Files**: `backend/__tests__/products.test.ts`

---

### Task 4: Dashboard test — `__tests__/dashboard.test.ts`

```typescript
import request from "supertest";
import { app } from "../src/app.js";

async function getToken(): Promise<string> {
  const res = await request(app).post("/auth/login")
    .send({ email: "freddy@halloween.shop", password: "ElmStreet2019" });
  return res.body.access_token;
}

describe("GET /dashboard", () => {
  it("returns 200 with full dashboard shape", async () => {
    const token = await getToken();
    const res = await request(app).get("/dashboard")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.stats).toHaveProperty("today");
    expect(res.body.stats).toHaveProperty("last_week");
    expect(res.body.stats).toHaveProperty("last_month");
    expect(res.body.sales_overview.weekly).toHaveLength(7);
    expect(res.body.sales_overview.yearly).toHaveLength(12);
    expect(res.body.bestsellers).toHaveLength(5);
  });

  it("weekly[0] label is 'today'", async () => {
    const token = await getToken();
    const res = await request(app).get("/dashboard")
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.sales_overview.weekly[0].label).toBe("today");
  });

  it("stats.today.revenue equals weekly[0].revenue", async () => {
    const token = await getToken();
    const res = await request(app).get("/dashboard")
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.stats.today.revenue).toBe(res.body.sales_overview.weekly[0].revenue);
  });

  it("bestsellers sorted by revenue descending", async () => {
    const token = await getToken();
    const res = await request(app).get("/dashboard")
      .set("Authorization", `Bearer ${token}`);
    const revenues = res.body.bestsellers.map((b: { revenue: number }) => b.revenue);
    expect(revenues).toEqual([...revenues].sort((a, b) => b - a));
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get("/dashboard");
    expect(res.status).toBe(401);
  });
});
```

**Files**: `backend/__tests__/dashboard.test.ts`

---

### Task 5: Orders test — `__tests__/orders.test.ts`

Mock `verifyPaymentIntent` so POST /orders doesn't hit Stripe:

```typescript
import request from "supertest";
import { app } from "../src/app.js";

// Mock Stripe verify so POST /orders works without live API key
jest.mock("../src/stripe/stripe.service.js", () => ({
  createPaymentIntent: jest.fn(),
  verifyPaymentIntent: jest.fn().mockResolvedValue({ last4: "4242" }),
}));

async function getToken(): Promise<string> {
  const res = await request(app).post("/auth/login")
    .send({ email: "freddy@halloween.shop", password: "ElmStreet2019" });
  return res.body.access_token;
}

describe("GET /orders", () => {
  it("returns 200 with paginated orders", async () => {
    const token = await getToken();
    const res = await request(app).get("/orders")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.orders).toHaveLength(10);
    expect(res.body.total).toBe(30);
    expect(res.body.total_pages).toBe(3);
    expect(res.body.per_page).toBe(10);
  });

  it("paginates correctly on page 2", async () => {
    const token = await getToken();
    const res = await request(app).get("/orders?page=2")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.orders).toHaveLength(10);
  });

  it("returns empty for page beyond total", async () => {
    const token = await getToken();
    const res = await request(app).get("/orders?page=99")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.orders).toHaveLength(0);
  });

  it("searches by product name (case-insensitive)", async () => {
    const token = await getToken();
    const res = await request(app).get("/orders?q=PUMPKIN")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThan(0);
  });

  it("searches by customer name", async () => {
    const token = await getToken();
    const res = await request(app).get("/orders?q=freddy")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(30);
  });

  it("returns empty for unmatched search", async () => {
    const token = await getToken();
    const res = await request(app).get("/orders?q=xyzxyzxyz")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(0);
    expect(res.body.orders).toHaveLength(0);
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get("/orders");
    expect(res.status).toBe(401);
  });
});

describe("GET /orders/:id", () => {
  it("returns 200 with full order detail", async () => {
    const token = await getToken();
    const res = await request(app).get("/orders/ORD-0001")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.orderId).toBe("ORD-0001");
    expect(res.body).toHaveProperty("items");
    expect(res.body).toHaveProperty("shipping");
    expect(res.body).toHaveProperty("payment");
  });

  it("returns 404 for unknown order", async () => {
    const token = await getToken();
    const res = await request(app).get("/orders/ORD-9999")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Order not found" });
  });
});

describe("POST /orders", () => {
  it("creates order and returns 201", async () => {
    const token = await getToken();
    const res = await request(app).post("/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        paymentIntentId: "pi_test_unique_1",
        customer: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St, Springfield" },
        items: [{ productId: "prod_1", quantity: 2 }],
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("orderId");
    expect(res.body.payment.last4).toBe("4242");
    expect(res.body.total).toBe(5.98);
  });

  it("returns 400 for duplicate paymentIntentId", async () => {
    const token = await getToken();
    const body = {
      paymentIntentId: "pi_test_duplicate",
      customer: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St, Springfield" },
      items: [{ productId: "prod_1", quantity: 1 }],
    };
    await request(app).post("/orders").set("Authorization", `Bearer ${token}`).send(body);
    const res = await request(app).post("/orders").set("Authorization", `Bearer ${token}`).send(body);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Payment already used");
  });
});
```

**Files**: `backend/__tests__/orders.test.ts`

---

### Task 6: Stripe validation test — `__tests__/stripe.test.ts`

Tests items validation only (no live Stripe calls):

```typescript
import request from "supertest";
import { app } from "../src/app.js";

// Mock Stripe SDK entirely
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({ client_secret: "pi_test_secret", id: "pi_test" }),
    },
  }));
});

async function getToken(): Promise<string> {
  const res = await request(app).post("/auth/login")
    .send({ email: "freddy@halloween.shop", password: "ElmStreet2019" });
  return res.body.access_token;
}

describe("POST /stripe/create-payment-intent", () => {
  it("returns 200 with clientSecret and correct amount in cents", async () => {
    const token = await getToken();
    const res = await request(app).post("/stripe/create-payment-intent")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [{ productId: "prod_1", quantity: 2 }, { productId: "prod_3", quantity: 1 }] });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("clientSecret");
    expect(res.body.amount).toBe(1097); // prod_1 x2 (598¢) + prod_3 x1 (499¢)
  });

  it("returns 400 for empty items array", async () => {
    const token = await getToken();
    const res = await request(app).post("/stripe/create-payment-intent")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [] });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid items" });
  });

  it("returns 400 for unknown productId", async () => {
    const token = await getToken();
    const res = await request(app).post("/stripe/create-payment-intent")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [{ productId: "prod_999", quantity: 1 }] });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid items" });
  });

  it("returns 400 for invalid quantity", async () => {
    const token = await getToken();
    const res = await request(app).post("/stripe/create-payment-intent")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [{ productId: "prod_1", quantity: 0 }] });
    expect(res.status).toBe(400);
  });

  it("returns 401 without token", async () => {
    const res = await request(app).post("/stripe/create-payment-intent")
      .send({ items: [{ productId: "prod_1", quantity: 1 }] });
    expect(res.status).toBe(401);
  });
});
```

**Files**: `backend/__tests__/stripe.test.ts`

## Verification

```bash
cd backend && npm test
# Expected: all test suites pass, 0 failures
```

## Task dependency graph

```
Task 1 (jest config) → Task 2 (auth tests)
                     → Task 3 (products tests)
                     → Task 4 (dashboard tests)
                     → Task 5 (orders tests)
                     → Task 6 (stripe tests)
All tasks 2-6 depend on Task 1.
```
