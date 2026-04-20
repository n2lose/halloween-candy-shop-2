import request from "supertest";
import { app } from "../src/app.js";

describe("POST /auth/register", () => {
  it("returns 201 with tokens for valid input", async () => {
    const res = await request(app).post("/auth/register")
      .send({ name: "Jane", email: "jane@register-test.com", password: "secret123" });
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

  it("is case-insensitive for email", async () => {
    const res = await request(app).post("/auth/login")
      .send({ email: "FREDDY@HALLOWEEN.SHOP", password: "ElmStreet2019" });
    expect(res.status).toBe(200);
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

  it("returns 400 if fields missing", async () => {
    const res = await request(app).post("/auth/login").send({ email: "x@x.com" });
    expect(res.status).toBe(400);
  });
});

describe("POST /auth/refresh", () => {
  it("returns 200 with new access token only", async () => {
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

  it("returns 401 if no Authorization header", async () => {
    const res = await request(app).post("/auth/refresh");
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
    expect(res.body).toEqual({ error: "Missing or invalid Authorization header" });
  });
});
