import { Request, Response } from "express";
import { productRepository } from "../repositories/productRepository.js";

export function listProductsHandler(_req: Request, res: Response): void {
  res.json(productRepository.findAll());
}

export function getProductHandler(req: Request, res: Response): void {
  const product = productRepository.findById(req.params.id);
  if (!product) { res.status(404).json({ error: "Product not found" }); return; }
  res.json(product);
}
