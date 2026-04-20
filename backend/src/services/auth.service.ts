import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository.js";
import type { TokenPair, AccessTokenPayload, RefreshTokenPayload } from "../types/index.js";

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET  ?? "dev-access-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret";

type UserProfile = { id: string; name: string; email: string; role: "admin" | "customer" };
type AuthResult  = TokenPair & { user: UserProfile };

function generateTokenPair(userId: string, role: "admin" | "customer", email: string, name: string): TokenPair {
  const accessPayload: AccessTokenPayload   = { userId, role, email, name };
  const refreshPayload: RefreshTokenPayload = { userId, type: "refresh" };
  return {
    access_token:  jwt.sign(accessPayload,  ACCESS_SECRET,  { expiresIn: "15m" }),
    refresh_token: jwt.sign(refreshPayload, REFRESH_SECRET, { expiresIn: "30d" }),
  };
}

export async function register(name: string, email: string, password: string): Promise<AuthResult> {
  if (userRepository.findByEmail(email)) throw new Error("Email already registered");
  const hashed = await bcrypt.hash(password, 10);
  const user = userRepository.create({ name, email: email.toLowerCase(), password: hashed });
  const tokens = generateTokenPair(user.id, user.role, user.email, user.name);
  return { ...tokens, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const user = userRepository.findByEmail(email.toLowerCase());
  if (!user) throw new Error("Invalid credentials");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");
  const tokens = generateTokenPair(user.id, user.role, user.email, user.name);
  return { ...tokens, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

export function refresh(token: string): { access_token: string } {
  const payload = jwt.verify(token, REFRESH_SECRET, { algorithms: ["HS256"] }) as unknown as RefreshTokenPayload;
  if (payload.type !== "refresh") throw new Error("Invalid token type");
  const user = userRepository.findById(payload.userId);
  if (!user) throw new Error("User not found");
  const accessPayload: AccessTokenPayload = { userId: user.id, role: user.role, email: user.email, name: user.name };
  return { access_token: jwt.sign(accessPayload, ACCESS_SECRET, { expiresIn: "15m" }) };
}

export function getMe(userId: string): UserProfile {
  const user = userRepository.findById(userId);
  if (!user) throw new Error("User not found");
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
