import { Router, Request, Response } from "express";
import { verifyAccessToken } from "../auth/auth.middleware.js";
import { createOrder, listOrders, getOrder } from "./orders.service.js";
import type { CreateOrderRequest } from "../types/index.js";

const router = Router();

// POST /orders (protected)
router.post("/", verifyAccessToken, async (req: Request, res: Response) => {
  try {
    const order = await createOrder(req.user!.userId, req.body as CreateOrderRequest);
    res.status(201).json(order);
  } catch (err) {
    const msg = (err as Error).message;
    const status = msg === "Forbidden" ? 403 : msg === "Order not found" ? 404 : 400;
    res.status(status).json({ error: msg });
  }
});

// GET /orders (protected)
router.get("/", verifyAccessToken, (req: Request, res: Response) => {
  const page = parseInt(String(req.query.page ?? "1"), 10) || 1;
  const q = String(req.query.q ?? "");
  res.status(200).json(listOrders(req.user!.userId, page, q));
});

// GET /orders/:id (protected)
router.get("/:id", verifyAccessToken, (req: Request, res: Response) => {
  try {
    res.status(200).json(getOrder(req.params.id, req.user!.userId));
  } catch (err) {
    const msg = (err as Error).message;
    const status = msg === "Forbidden" ? 403 : 404;
    res.status(status).json({ error: msg });
  }
});

export { router as ordersRouter };
