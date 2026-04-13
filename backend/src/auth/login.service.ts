import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../data/users.js";
import { AccessTokenPayload, RefreshTokenPayload, TokenPair } from "../types/index.js";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "dev-access-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret";
const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "30d";

function generateTokenPair(userId: number, email: string, name: string): TokenPair {
  const accessPayload: AccessTokenPayload = { sub: userId, email, name };
  const refreshPayload: RefreshTokenPayload = { sub: userId, type: "refresh" };

  const access_token = jwt.sign(accessPayload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
  const refresh_token = jwt.sign(refreshPayload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

  return { access_token, refresh_token };
}

export async function loginWithPassword(email: string, password: string): Promise<TokenPair> {
  const user = findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  return generateTokenPair(user.id, user.email, user.name);
}
