import { Router, Request, Response } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import { createPaymentIntent } from "./stripe.service.js";
import type { CreatePaymentIntentRequest } from "../types/index.js";

const router = Router();

// POST /stripe/create-payment-intent (protected)
router.post("/create-payment-intent", verifyAccessToken, async (req: Request, res: Response) => {
  const { items } = req.body as CreatePaymentIntentRequest;
  try {
    const result = await createPaymentIntent(items);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export { router as stripeRouter };
