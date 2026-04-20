import { jest } from "@jest/globals";

// ESM-compatible mock — must use unstable_mockModule + dynamic import
jest.unstable_mockModule("../src/services/stripe.service.js", () => ({
  createPaymentIntent: jest.fn(),
  verifyPaymentIntent: jest.fn().mockResolvedValue({ last4: "4242" }),
}));

const { app } = await import("../src/app.js");
import request from "supertest";

async function getToken(): Promise<string> {
  const res = await request(app).post("/auth/login")
    .send({ email: "freddy@halloween.shop", password: process.env.SEED_USER_PASSWORD ?? "dev-seed-only" });
  return res.body.access_token;
}

describe("GET /orders", () => {
  it("returns 200 with 10 orders on page 1 (30 total)", async () => {
    const token = await getToken();
    const res = await request(app).get("/orders")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.orders).toHaveLength(10);
    expect(res.body.total).toBe(30);
    expect(res.body.total_pages).toBe(3);
    expect(res.body.per_page).toBe(10);
    expect(res.body.page).toBe(1);
    expect(res.body.orders[0]).toHaveProperty("customerName");
  });

  it("returns page 2 correctly", async () => {
    const token = await getToken();
    const res = await request(app).get("/orders?page=2")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.orders).toHaveLength(10);
  });

  it("returns empty orders for page beyond total", async () => {
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

  it("searches by order id", async () => {
    const token = await getToken();
    const res = await request(app).get("/orders?q=ORD-0001")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
  });

  it("returns empty for unmatched search term", async () => {
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
  it("returns 200 with full order detail for ORD-0001", async () => {
    const token = await getToken();
    const res = await request(app).get("/orders/ORD-0001")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.orderId).toBe("ORD-0001");
    expect(res.body).toHaveProperty("items");
    expect(res.body).toHaveProperty("shipping");
    expect(res.body).toHaveProperty("payment");
    expect(res.body).toHaveProperty("total");
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
  it("creates order and returns 201 with correct total", async () => {
    const token = await getToken();
    const res = await request(app).post("/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        paymentIntentId: "pi_test_create_unique",
        customer: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St, Springfield" },
        items: [{ productId: "prod_1", quantity: 2 }],
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("orderId");
    expect(res.body.payment.last4).toBe("4242");
    expect(res.body.total).toBe(5.98);
    expect(res.body.status).toBe("processing");
  });

  it("returns 409 for duplicate paymentIntentId", async () => {
    const token = await getToken();
    const body = {
      paymentIntentId: "pi_test_dup_check_unique",
      customer: { name: "Freddy", email: "freddy@halloween.shop", address: "13 Elm St, Springfield" },
      items: [{ productId: "prod_1", quantity: 1 }],
    };
    const first = await request(app).post("/orders").set("Authorization", `Bearer ${token}`).send(body);
    expect(first.status).toBe(201);
    const second = await request(app).post("/orders").set("Authorization", `Bearer ${token}`).send(body);
    expect(second.status).toBe(409);
    expect(second.body.error).toBe("Payment already used");
  });

  it("returns 401 without token", async () => {
    const res = await request(app).post("/orders").send({});
    expect(res.status).toBe(401);
  });
});
