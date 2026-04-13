import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./auth/auth.router.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);

// Route mounting (filled in PLAN-003 through PLAN-005)
// app.use("/products", productsRouter);
// app.use("/dashboard", dashboardRouter);
// app.use("/orders", ordersRouter);
// app.use("/stripe", stripeRouter);

// Global error handler — must have 4 params to be recognised by Express
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.message);
  res.status(500).json({ error: "Internal server error" });
});

export { app };
