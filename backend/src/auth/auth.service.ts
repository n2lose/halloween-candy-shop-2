import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail, findUserById, addUser } from "../data/users.js";
import { formatUserId } from "../utils/formatters.js";
import type { TokenPair, AccessTokenPayload, RefreshTokenPayload } from "../types/index.js";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "dev-access-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret";

// ─── Token generation ────────────────────────────────────────────────────────

export function generateTokenPair(userId: number, email: string, name: string): TokenPair {
  const accessPayload: AccessTokenPayload = { sub: userId, email, name };
  const refreshPayload: RefreshTokenPayload = { sub: userId, type: "refresh" };
  return {
    access_token: jwt.sign(accessPayload, ACCESS_SECRET, { expiresIn: "15m" }),
    refresh_token: jwt.sign(refreshPayload, REFRESH_SECRET, { expiresIn: "30d" }),
  };
}

// ─── Register ────────────────────────────────────────────────────────────────

export async function register(name: string, email: string, password: string): Promise<TokenPair> {
  if (findUserByEmail(email)) throw new Error("Email already registered");
  const hashed = await bcrypt.hash(password, 10);
  const user = addUser(name, email, hashed);
  return generateTokenPair(user.id, user.email, user.name);
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<TokenPair> {
  const user = findUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");
  return generateTokenPair(user.id, user.email, user.name);
}

// ─── Refresh ─────────────────────────────────────────────────────────────────

export function refresh(token: string): { access_token: string } {
  const payload = jwt.verify(token, REFRESH_SECRET, { algorithms: ["HS256"] }) as unknown as RefreshTokenPayload;
  if (payload.type !== "refresh") throw new Error("Invalid token type");
  const user = findUserById(payload.sub);
  if (!user) throw new Error("User not found");
  const accessPayload: AccessTokenPayload = { sub: user.id, email: user.email, name: user.name };
  return { access_token: jwt.sign(accessPayload, ACCESS_SECRET, { expiresIn: "15m" }) };
}

// ─── Me ──────────────────────────────────────────────────────────────────────

export function getMe(userId: number): { id: string; name: string; email: string } {
  const user = findUserById(userId);
  if (!user) throw new Error("User not found");
  return { id: formatUserId(user.id), name: user.name, email: user.email };
}
