import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import { registerHandler, loginHandler, refreshHandler, getMeHandler } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", registerHandler);
router.post("/login",    loginHandler);
router.post("/refresh",  refreshHandler);
router.get("/me",        verifyAccessToken, getMeHandler);

export { router as authRouter };
