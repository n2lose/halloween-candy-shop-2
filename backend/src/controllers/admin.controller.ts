import { Request, Response } from "express";
import { getDashboard } from "../services/dashboard.service.js";
import { orderRepository } from "../repositories/orderRepository.js";
import { productRepository } from "../repositories/productRepository.js";

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function getDashboardHandler(_req: Request, res: Response): void {
  res.json(getDashboard());
}

// ─── Orders (admin — all orders) ─────────────────────────────────────────────

export function listOrdersHandler(req: Request, res: Response): void {
  const page = Math.max(1, parseInt(String(req.query.page ?? "1")));
  const q    = String(req.query.q ?? "");
  res.json(orderRepository.listAll(page, q));
}

export function getOrderHandler(req: Request, res: Response): void {
  const order = orderRepository.findById(req.params.id);
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }
  res.json(order);
}

const VALID_STATUSES = ["processing", "shipped", "delivered"] as const;

export function updateOrderStatusHandler(req: Request, res: Response): void {
  const { status } = req.body as Record<string, unknown>;
  if (!status || typeof status !== "string") {
    res.status(400).json({ error: "status is required" });
    return;
  }
  if (!(VALID_STATUSES as readonly string[]).includes(status)) {
    res.status(400).json({ error: "status must be one of: processing, shipped, delivered" });
    return;
  }
  const order = orderRepository.updateStatus(req.params.id, status as import("../types/index.js").OrderStatus);
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }
  res.json(order);
}

// ─── Products (admin CRUD) ────────────────────────────────────────────────────

function parsePrice(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseStock(value: unknown): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

export function createProductHandler(req: Request, res: Response): void {
  const { name, price, stock } = req.body as Record<string, unknown>;
  if (!name || price === undefined || stock === undefined) {
    res.status(400).json({ error: "name, price and stock are required" });
    return;
  }
  const priceNum = parsePrice(price);
  const stockNum = parseStock(stock);
  if (priceNum === null) { res.status(400).json({ error: "price must be a positive number" }); return; }
  if (stockNum === null) { res.status(400).json({ error: "stock must be a non-negative integer" }); return; }
  const product = productRepository.create({ name: String(name), price: priceNum, stock: stockNum });
  res.status(201).json(product);
}

export function updateProductHandler(req: Request, res: Response): void {
  const { name, price, stock } = req.body as Record<string, unknown>;
  if (price !== undefined && parsePrice(price) === null) {
    res.status(400).json({ error: "price must be a positive number" }); return;
  }
  if (stock !== undefined && parseStock(stock) === null) {
    res.status(400).json({ error: "stock must be a non-negative integer" }); return;
  }
  const updated = productRepository.update(req.params.id, {
    ...(name  !== undefined && { name:  String(name)  }),
    ...(price !== undefined && { price: parsePrice(price)! }),
    ...(stock !== undefined && { stock: parseStock(stock)! }),
  });
  if (!updated) { res.status(404).json({ error: "Product not found" }); return; }
  res.json(updated);
}

export function deleteProductHandler(req: Request, res: Response): void {
  const deleted = productRepository.delete(req.params.id);
  if (!deleted) { res.status(404).json({ error: "Product not found" }); return; }
  res.status(204).send();
}
