import { Router } from "express";
import { listProductsHandler, getProductHandler } from "../controllers/products.controller.js";

const router = Router();

router.get("/",    listProductsHandler);
router.get("/:id", getProductHandler);

export { router as productsRouter };
