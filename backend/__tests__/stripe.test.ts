import { jest } from "@jest/globals";

// ESM-compatible mock — must use unstable_mockModule + dynamic import
jest.unstable_mockModule("stripe", () => {
  const mockCreate = jest.fn().mockResolvedValue({
    client_secret: "pi_test_secret_mock",
    id: "pi_test",
  });
  const MockStripe = jest.fn().mockImplementation(() => ({
    paymentIntents: { create: mockCreate },
  }));
  return { default: MockStripe };
});

const { app } = await import("../src/app.js");
import request from "supertest";

async function getToken(): Promise<string> {
  const res = await request(app).post("/auth/login")
    .send({ email: "freddy@halloween.shop", password: process.env.SEED_USER_PASSWORD ?? "dev-seed-only" });
  return res.body.access_token;
}

describe("POST /stripe/create-payment-intent", () => {
  it("returns 200 with clientSecret and correct amount in cents", async () => {
    const token = await getToken();
    // prod_1 x2 = Math.round(2.99*100)*2 = 299*2 = 598¢
    // prod_3 x1 = Math.round(4.99*100)*1 = 499¢
    // total = 1097¢
    const res = await request(app).post("/stripe/create-payment-intent")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [{ productId: "prod_1", quantity: 2 }, { productId: "prod_3", quantity: 1 }] });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("clientSecret");
    expect(res.body.amount).toBe(1097);
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

  it("returns 400 for zero quantity", async () => {
    const token = await getToken();
    const res = await request(app).post("/stripe/create-payment-intent")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [{ productId: "prod_1", quantity: 0 }] });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid items" });
  });

  it("returns 401 without token", async () => {
    const res = await request(app).post("/stripe/create-payment-intent")
      .send({ items: [{ productId: "prod_1", quantity: 1 }] });
    expect(res.status).toBe(401);
  });
});
