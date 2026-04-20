import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import {
  createPaymentIntentHandler,
  createOrderHandler,
  listOrdersHandler,
  getOrderHandler,
} from "../controllers/customer.controller.js";

const router = Router();
const guard  = verifyAccessToken;

router.post("/stripe/create-payment-intent", guard, createPaymentIntentHandler);
router.post("/orders",                        guard, createOrderHandler);
router.get("/orders",                         guard, listOrdersHandler);
router.get("/orders/:id",                     guard, getOrderHandler);

export { router as customerRouter };
