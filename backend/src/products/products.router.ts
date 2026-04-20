import { Router, Request, Response } from "express";
import { listProducts, getProduct } from "./products.service.js";

const router = Router();

// GET /products
router.get("/", (_req: Request, res: Response) => {
  res.status(200).json(listProducts());
});

// GET /products/:id
router.get("/:id", (req: Request, res: Response) => {
  try {
    res.status(200).json(getProduct(req.params.id));
  } catch {
    res.status(404).json({ error: "Product not found" });
  }
});

export { router as productsRouter };
