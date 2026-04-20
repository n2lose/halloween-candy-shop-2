import { Request, Response } from "express";
import { createPaymentIntent } from "../services/stripe.service.js";
import { createOrder, listOrders, getOrder } from "../services/orders.service.js";
import type { CreateOrderRequest } from "../types/index.js";

export async function createPaymentIntentHandler(req: Request, res: Response): Promise<void> {
  const { items } = req.body as Record<string, unknown>;
  if (!items) { res.status(400).json({ error: "items is required" }); return; }
  try {
    res.json(await createPaymentIntent(items as CreateOrderRequest["items"]));
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

export async function createOrderHandler(req: Request, res: Response): Promise<void> {
  try {
    const order = await createOrder(req.user!.userId, req.body as CreateOrderRequest);
    res.status(201).json(order);
  } catch (err) {
    const msg = (err as Error).message;
    const status = msg === "Payment already used" ? 409
                 : msg === "Payment not confirmed" ? 402
                 : 400;
    res.status(status).json({ error: msg });
  }
}

export function listOrdersHandler(req: Request, res: Response): void {
  const page = Math.max(1, parseInt(String(req.query.page ?? "1")));
  const q    = String(req.query.q ?? "");
  res.json(listOrders(req.user!.userId, page, q));
}

export function getOrderHandler(req: Request, res: Response): void {
  try {
    res.json(getOrder(req.params.id, req.user!.userId));
  } catch (err) {
    const msg = (err as Error).message;
    res.status(msg === "Forbidden" ? 403 : 404).json({ error: msg });
  }
}
