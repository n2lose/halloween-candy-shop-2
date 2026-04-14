import dotenv from "dotenv";
// Must run before any import that reads process.env at module-level.
// Stripe uses lazy init (getStripe()) because ESM hoists static imports before this line.
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { authRouter } from "./auth/auth.router.js";
import { productsRouter } from "./products/products.router.js";
import { dashboardRouter } from "./dashboard/dashboard.router.js";
import { stripeRouter } from "./stripe/stripe.router.js";
import { ordersRouter } from "./orders/orders.router.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/dashboard", dashboardRouter);
app.use("/stripe", stripeRouter);
app.use("/orders", ordersRouter);

// Global error handler — must have 4 params to be recognised by Express
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.message);
  res.status(500).json({ error: "Internal server error" });
});

export { app };
