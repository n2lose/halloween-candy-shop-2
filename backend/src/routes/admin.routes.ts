import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import { requireRole }       from "../middleware/role.middleware.js";
import {
  getDashboardHandler,
  listOrdersHandler,
  getOrderHandler,
  updateOrderStatusHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from "../controllers/admin.controller.js";

const router     = Router();
const adminGuard = [verifyAccessToken, requireRole("admin")] as const;

router.get("/dashboard",           ...adminGuard, getDashboardHandler);
router.get("/orders",              ...adminGuard, listOrdersHandler);
router.get("/orders/:id",          ...adminGuard, getOrderHandler);
router.patch("/orders/:id/status", ...adminGuard, updateOrderStatusHandler);
router.post("/products",           ...adminGuard, createProductHandler);
router.put("/products/:id",        ...adminGuard, updateProductHandler);
router.delete("/products/:id",     ...adminGuard, deleteProductHandler);

export { router as adminRouter };
