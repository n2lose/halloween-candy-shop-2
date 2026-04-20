import request from "supertest";
import { app } from "../src/app.js";

async function getAdminToken(): Promise<string> {
  const res = await request(app).post("/auth/login")
    .send({ email: "admin@halloween.shop", password: "Halloween2024!" });
  return res.body.access_token;
}

async function getCustomerToken(): Promise<string> {
  const res = await request(app).post("/auth/login")
    .send({ email: "freddy@halloween.shop", password: process.env.SEED_USER_PASSWORD ?? "dev-seed-only" });
  return res.body.access_token;
}

describe("GET /admin/dashboard", () => {
  it("returns 200 with full dashboard shape for admin", async () => {
    const token = await getAdminToken();
    const res = await request(app).get("/admin/dashboard")
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
    const token = await getAdminToken();
    const res = await request(app).get("/admin/dashboard")
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.sales_overview.weekly[0].label).toBe("today");
  });

  it("yearly[0] label is 'this month'", async () => {
    const token = await getAdminToken();
    const res = await request(app).get("/admin/dashboard")
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.sales_overview.yearly[0].label).toBe("this month");
  });

  it("stats.today.revenue equals weekly[0].revenue", async () => {
    const token = await getAdminToken();
    const res = await request(app).get("/admin/dashboard")
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.stats.today.revenue).toBe(res.body.sales_overview.weekly[0].revenue);
  });

  it("bestsellers sorted by revenue descending", async () => {
    const token = await getAdminToken();
    const res = await request(app).get("/admin/dashboard")
      .set("Authorization", `Bearer ${token}`);
    const revenues: number[] = res.body.bestsellers.map((b: { revenue: number }) => b.revenue);
    expect(revenues).toEqual([...revenues].sort((a, b) => b - a));
  });

  it("returns 403 for customer role", async () => {
    const token = await getCustomerToken();
    const res = await request(app).get("/admin/dashboard")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get("/admin/dashboard");
    expect(res.status).toBe(401);
  });
});
