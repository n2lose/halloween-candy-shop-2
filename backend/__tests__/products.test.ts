import request from "supertest";
import { app } from "../src/app.js";

describe("GET /products", () => {
  it("returns 200 with 10 products", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(10);
  });

  it("each product has required fields", async () => {
    const res = await request(app).get("/products");
    expect(res.body[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      emoji: expect.any(String),
      price: expect.any(Number),
      stock: expect.any(Number),
    });
  });

  it("does not require auth", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
  });
});

describe("GET /products/:id", () => {
  it("returns 200 with correct product", async () => {
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
