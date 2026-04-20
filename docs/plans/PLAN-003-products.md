# PLAN-003: Products Endpoints

**Status**: DONE

## Context

Implements 2 public product endpoints — no auth required. Mock data already exists in `data/products.ts` from PLAN-001.

**Endpoints**:
- `GET /products` — list all 10 Halloween candy products
- `GET /products/:id` — single product, 404 if not found

## Tasks

### Task 1: Create `products.service.ts`

```typescript
// backend/src/products/products.service.ts

import { getAllProducts, findProductById } from "../data/products.js";
import type { Product } from "../types/index.js";

export function listProducts(): Product[] {
  return getAllProducts();
}

export function getProduct(id: string): Product {
  const product = findProductById(id);
  if (!product) throw new Error("Product not found");
  return product;
}
```

**Files**: `backend/src/products/products.service.ts`

---

### Task 2: Create `products.router.ts`

```typescript
// backend/src/products/products.router.ts

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
```

**Files**: `backend/src/products/products.router.ts`

---

### Task 3: Mount router in `app.ts`

```typescript
import { productsRouter } from "./products/products.router.js";
// ...
app.use("/products", productsRouter);
```

**Files**: `backend/src/app.ts`

## Verification

```bash
# List all products
curl -s http://localhost:3001/products | python3 -m json.tool

# Single product
curl -s http://localhost:3001/products/prod_1 | python3 -m json.tool

# Not found
curl -s http://localhost:3001/products/prod_999 | python3 -m json.tool
# → 404 { "error": "Product not found" }
```

## Task dependency graph

```
Task 1 (products.service.ts) → Task 2 (products.router.ts) → Task 3 (mount in app.ts)
```
