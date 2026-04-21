import { Request, Response } from "express";
import * as authService from "../services/auth.service.js";

export async function registerHandler(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body as Record<string, unknown>;
  if (!name || !email || !password) {
    res.status(400).json({ error: "name, email and password are required" });
    return;
  }
  if (typeof name !== "string" || name.trim().length === 0 || name.length > 100) {
    res.status(400).json({ error: "name must be 1–100 characters" });
    return;
  }
  if (typeof email !== "string" || !/.+@.+\..+/.test(email)) {
    res.status(400).json({ error: "Invalid email format" });
    return;
  }
  if (typeof password !== "string" || password.length < 6 || password.length > 100) {
    res.status(400).json({ error: "Password must be 6–100 characters" });
    return;
  }
  try {
    const result = await authService.register(String(name), String(email), String(password));
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as Record<string, unknown>;
  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }
  try {
    const result = await authService.login(String(email), String(password));
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: (err as Error).message });
  }
}

export function refreshHandler(req: Request, res: Response): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Refresh token required in Authorization header" });
    return;
  }
  try {
    res.status(200).json(authService.refresh(header.slice(7)));
  } catch {
    res.status(401).json({ error: "Invalid or expired refresh token" });
  }
}

export function getMeHandler(req: Request, res: Response): void {
  try {
    res.status(200).json(authService.getMe(req.user!.userId));
  } catch {
    res.status(401).json({ error: "User not found" });
  }
}
