import { Router, Request, Response } from "express";
import { register, login, refresh, getMe } from "./auth.service.js";
import { verifyAccessToken } from "./auth.middleware.js";

const router = Router();

// POST /auth/register
router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body as Record<string, unknown>;
  if (!name || !email || !password) {
    res.status(400).json({ error: "name, email and password are required" });
    return;
  }
  if (typeof password !== "string" || password.length < 6 || password.length > 100) {
    res.status(400).json({ error: "Password must be 6–100 characters" });
    return;
  }
  try {
    const tokens = await register(String(name), String(email), String(password));
    res.status(201).json(tokens);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// POST /auth/login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as Record<string, unknown>;
  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }
  try {
    const tokens = await login(String(email), String(password));
    res.status(200).json(tokens);
  } catch (err) {
    res.status(401).json({ error: (err as Error).message });
  }
});

// POST /auth/refresh  (refresh token in Authorization: Bearer header)
router.post("/refresh", (req: Request, res: Response) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Refresh token required in Authorization header" });
    return;
  }
  try {
    const result = refresh(header.slice(7));
    res.status(200).json(result);
  } catch {
    res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

// GET /auth/me  (protected)
router.get("/me", verifyAccessToken, (req: Request, res: Response) => {
  try {
    const profile = getMe(req.user!.sub);
    res.status(200).json(profile);
  } catch {
    res.status(401).json({ error: "User not found" });
  }
});

export { router as authRouter };
