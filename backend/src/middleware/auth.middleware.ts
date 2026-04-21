import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AccessTokenPayload } from "../types/index.js";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

if (!process.env.JWT_ACCESS_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_ACCESS_SECRET must be set in production");
}
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "dev-access-secret";

export function verifyAccessToken(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }
  try {
    req.user = jwt.verify(header.slice(7), ACCESS_SECRET, { algorithms: ["HS256"] }) as unknown as AccessTokenPayload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
