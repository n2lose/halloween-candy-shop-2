import { Router, Request, Response } from "express";
import { verifyAccessToken } from "../auth/auth.middleware.js";
import { getDashboard } from "./dashboard.service.js";

const router = Router();

// GET /dashboard (protected)
router.get("/", verifyAccessToken, (_req: Request, res: Response) => {
  res.status(200).json(getDashboard());
});

export { router as dashboardRouter };
