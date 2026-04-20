# PLAN-002: Auth Endpoints

**Status**: DONE

## Context

Implements all 4 auth endpoints on top of the PLAN-001 foundation.

**Existing**: `auth/login.service.ts` has `loginWithPassword()` and `generateTokenPair()` (not exported). Both will be absorbed into `auth.service.ts` — `login.service.ts` is deleted to avoid duplication.

**Endpoints**:
- `POST /auth/register` — create account, return token pair
- `POST /auth/login` — validate credentials, return token pair
- `POST /auth/refresh` — exchange refresh token for new access token
- `GET /auth/me` — return current user profile (protected)

**Key rules from api-spec.md**:
- Email normalized to lowercase before storage and lookup
- Password: min 6, max 100 characters
- User.id exposed as `"usr_{id}"` via `formatUserId()`
- Two separate JWT secrets: `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`
- `POST /auth/refresh` receives refresh token in `Authorization: Bearer` header
- `GET /auth/me` and all protected routes use access token

## Tasks

### Task 1: Create `auth.service.ts`

Consolidates `login.service.ts` logic + adds register, refresh, getMe.

```typescript
// backend/src/auth/auth.service.ts

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
  const payload = jwt.verify(token, REFRESH_SECRET) as RefreshTokenPayload;
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
```

**Files**: `backend/src/auth/auth.service.ts`

---

### Task 2: Create `auth.middleware.ts`

Exports `verifyAccessToken()` middleware — attached to all protected routes.

```typescript
// backend/src/auth/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AccessTokenPayload } from "../types/index.js";

// Extend Express Request to carry decoded token payload
declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "dev-access-secret";

export function verifyAccessToken(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }
  const token = header.slice(7);
  try {
    req.user = jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
```

**Files**: `backend/src/auth/auth.middleware.ts`

---

### Task 3: Create `auth.router.ts`

Thin handlers — validate input, call service, return response.

```typescript
// backend/src/auth/auth.router.ts

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

// POST /auth/refresh  (refresh token in Bearer header)
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
```

**Files**: `backend/src/auth/auth.router.ts`

---

### Task 4: Mount router in `app.ts`

Uncomment the auth route and import the router:

```typescript
import { authRouter } from "./auth/auth.router.js";
// ...
app.use("/auth", authRouter);
```

**Files**: `backend/src/app.ts`

---

### Task 5: Delete `login.service.ts`

All logic now lives in `auth.service.ts`. Delete the old file to avoid confusion.

**Files**: `backend/src/auth/login.service.ts` (delete)

## Verification

```bash
# Register new user
curl -s -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@test.com","password":"secret123"}' | jq

# Login with Freddy
curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"freddy@halloween.shop","password":"<SEED_PASSWORD>"}' | jq

# Use access token to call /me (replace TOKEN)
curl -s http://localhost:3001/auth/me \
  -H "Authorization: Bearer TOKEN" | jq

# Refresh token (replace REFRESH_TOKEN)
curl -s -X POST http://localhost:3001/auth/refresh \
  -H "Authorization: Bearer REFRESH_TOKEN" | jq

# Error cases
curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"freddy@halloween.shop","password":"wrong"}' | jq
# → 401 { "error": "Invalid credentials" }

curl -s http://localhost:3001/auth/me | jq
# → 401 { "error": "Missing or invalid Authorization header" }
```

## Task dependency graph

```
Task 1 (auth.service.ts) → Task 3 (auth.router.ts) → Task 4 (mount in app.ts)
Task 2 (auth.middleware.ts) → Task 3
Task 5 (delete login.service.ts) — after Task 1
```
