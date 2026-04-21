import request from "supertest";
import { app } from "../src/app.js";

async function getAdminToken(): Promise<string> {
  const password = process.env.SEED_ADMIN_PASSWORD ?? "dev-seed-only";
  const res = await request(app).post("/auth/login")
    .send({ email: "admin@halloween.shop", password });
  return res.body.access_token;
}

async function getCustomerToken(): Promise<string> {
  const res = await request(app).post("/auth/login")
    .send({ email: "freddy@halloween.shop", password: process.env.SEED_USER_PASSWORD ?? "dev-seed-only" });
  return res.body.access_token;
}

describe("GET /admin/orders", () => {
  it("returns all 30 orders paginated for admin", async () => {
    const token = await getAdminToken();
    const res = await request(app).get("/admin/orders")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(30);
    expect(res.body.orders).toHaveLength(10);
    expect(res.body.total_pages).toBe(3);
  });

  it("searches orders by customer name", async () => {
    const token = await getAdminToken();
    const res = await request(app).get("/admin/orders?q=Freddy")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(30);
  });

  it("returns 403 for customer role", async () => {
    const token = await getCustomerToken();
    const res = await request(app).get("/admin/orders")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get("/admin/orders");
    expect(res.status).toBe(401);
  });
});

describe("GET /admin/orders/:id", () => {
  it("returns full order detail", async () => {
    const token = await getAdminToken();
    const res = await request(app).get("/admin/orders/ORD-0001")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.orderId).toBe("ORD-0001");
    expect(res.body).toHaveProperty("items");
    expect(res.body).toHaveProperty("shipping");
  });

  it("returns 404 for unknown order", async () => {
    const token = await getAdminToken();
    const res = await request(app).get("/admin/orders/ORD-9999")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

describe("PATCH /admin/orders/:id/status", () => {
  it("updates order status and returns updated order", async () => {
    const token = await getAdminToken();
    const res = await request(app).patch("/admin/orders/ORD-0001/status")
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "shipped" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("shipped");
    expect(res.body.orderId).toBe("ORD-0001");
  });

  it("returns 400 if status missing", async () => {
    const token = await getAdminToken();
    const res = await request(app).patch("/admin/orders/ORD-0001/status")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "status is required" });
  });
});

describe("POST /admin/products", () => {
  it("creates a product and returns 201", async () => {
    const token = await getAdminToken();
    const res = await request(app).post("/admin/products")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Candy", price: 3.99, stock: 50 });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: "Test Candy", price: 3.99, stock: 50 });
    expect(res.body).toHaveProperty("id");
  });

  it("returns 400 if required fields missing", async () => {
    const token = await getAdminToken();
    const res = await request(app).post("/admin/products")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Candy" });
    expect(res.status).toBe(400);
  });

  it("returns 403 for customer role", async () => {
    const token = await getCustomerToken();
    const res = await request(app).post("/admin/products")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Candy", price: 3.99, stock: 50 });
    expect(res.status).toBe(403);
  });
});

describe("PUT /admin/products/:id", () => {
  it("updates a product and returns updated data", async () => {
    const token = await getAdminToken();
    const res = await request(app).put("/admin/products/prod_1")
      .set("Authorization", `Bearer ${token}`)
      .send({ price: 3.49, stock: 80 });
    expect(res.status).toBe(200);
    expect(res.body.price).toBe(3.49);
    expect(res.body.stock).toBe(80);
    expect(res.body.id).toBe("prod_1");
  });

  it("returns 404 for unknown product", async () => {
    const token = await getAdminToken();
    const res = await request(app).put("/admin/products/prod_999")
      .set("Authorization", `Bearer ${token}`)
      .send({ price: 1.99 });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /admin/products/:id", () => {
  it("deletes a product and returns 204", async () => {
    const token = await getAdminToken();
    const res = await request(app).delete("/admin/products/prod_10")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

  it("returns 404 for unknown product", async () => {
    const token = await getAdminToken();
    const res = await request(app).delete("/admin/products/prod_999")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
