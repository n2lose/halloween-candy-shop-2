# PLAN-007: Frontend Setup + Backend Patch

**Status**: DONE

## Context

First Sprint 2 plan. Before touching the frontend, patch the backend so the Orders table can show customer names. Then scaffold the React app with Tailwind CSS (matching the Haunted Atelier design tokens), set up the Axios client with concurrent-refresh handling, and create auth + cart stores.

**Dependencies**: PLAN-006 DONE (all backend endpoints working).

---

## Tasks

### Task 0 (Backend patch): Add `customerName` to `GET /orders` list response

The Orders design shows a customer name column. Current list response only has `{orderId, total, status, createdAt}`.

**`backend/src/types/index.ts`** — update `PaginatedOrdersResponse.orders` array shape:
```typescript
orders: Array<{
  orderId: string;
  customerName: string;   // ← add this
  total: number;
  status: OrderStatus;
  createdAt: string;
}>;
```

**`backend/src/orders/orders.service.ts`** — update `listOrders` mapping:
```typescript
orders: paginated.map((o) => ({
  orderId: o.orderId,
  customerName: o.shipping.name,  // ← add this
  total: o.total,
  status: o.status,
  createdAt: o.createdAt,
})),
```

Update integration test `__tests__/orders.test.ts` — add `customerName` to GET /orders shape check.

**Files**: `backend/src/types/index.ts`, `backend/src/orders/orders.service.ts`, `backend/__tests__/orders.test.ts`

---

### Task 1: Scaffold Vite + React + TypeScript

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend && npm install
```

Install all dependencies:
```bash
# Core
npm install react-router-dom axios

# Charts + Stripe
npm install recharts @stripe/react-stripe-js @stripe/stripe-js

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**`frontend/.env`**:
```
VITE_API_URL=http://localhost:3001
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

**`frontend/.env.example`**: same with placeholder values.

**Files**: `frontend/` scaffold, `frontend/.env`, `frontend/.env.example`

---

### Task 2: Configure Tailwind with design tokens

**`frontend/tailwind.config.ts`**:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "surface":                  "#131313",
        "surface-dim":              "#131313",
        "surface-bright":           "#393939",
        "surface-container":        "#201f1f",
        "surface-container-low":    "#1c1b1b",
        "surface-container-high":   "#2a2a2a",
        "surface-container-highest":"#353534",
        "surface-container-lowest": "#0e0e0e",
        "surface-variant":          "#353534",
        "surface-tint":             "#ffb783",
        "primary":                  "#ffb783",
        "primary-container":        "#db7619",
        "primary-fixed":            "#ffdcc5",
        "primary-fixed-dim":        "#ffb783",
        "on-primary":               "#4f2500",
        "on-primary-container":     "#451f00",
        "on-primary-fixed":         "#301400",
        "on-primary-fixed-variant": "#713700",
        "secondary":                "#b5c8df",
        "secondary-container":      "#36485b",
        "secondary-fixed":          "#d1e4fb",
        "secondary-fixed-dim":      "#b5c8df",
        "on-secondary":             "#203243",
        "on-secondary-container":   "#a4b7cd",
        "on-secondary-fixed":       "#091d2e",
        "on-secondary-fixed-variant":"#36485b",
        "tertiary":                 "#8adb4d",
        "tertiary-container":       "#56a315",
        "tertiary-fixed":           "#a5f866",
        "tertiary-fixed-dim":       "#8adb4d",
        "on-tertiary":              "#183800",
        "on-tertiary-container":    "#143000",
        "on-tertiary-fixed":        "#0b2000",
        "on-tertiary-fixed-variant":"#255100",
        "background":               "#131313",
        "on-background":            "#e5e2e1",
        "on-surface":               "#e5e2e1",
        "on-surface-variant":       "#e0c0b2",
        "outline":                  "#a88a7e",
        "outline-variant":          "#594238",
        "inverse-primary":          "#944a00",
        "inverse-surface":          "#e5e2e1",
        "inverse-on-surface":       "#313030",
        "error":                    "#ffb4ab",
        "error-container":          "#93000a",
        "on-error":                 "#690005",
        "on-error-container":       "#ffdad6",
      },
      fontFamily: {
        headline: ["Newsreader", "serif"],
        body:     ["Manrope", "sans-serif"],
        label:    ["Manrope", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
```

**`frontend/src/index.css`**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { @apply dark; }
  body { @apply bg-surface font-body text-on-surface; }
}
```

**`frontend/index.html`** — add Google Fonts + Material Symbols in `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Manrope:wght@200..800&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

**Files**: `frontend/tailwind.config.ts`, `frontend/src/index.css`, `frontend/index.html`

---

### Task 3: Router setup — `src/main.tsx` + `src/App.tsx`

**`src/main.tsx`**:
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

**`src/App.tsx`** — placeholder routes (filled in PLAN-008+):
```tsx
import { Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      {/* Routes added in PLAN-008+ */}
    </Routes>
  );
}
```

**Files**: `frontend/src/main.tsx`, `frontend/src/App.tsx`

---

### Task 4: Shared TypeScript types — `src/types/index.ts`

Mirror backend types needed on the frontend:

```typescript
// Auth
export interface TokenPair { access_token: string; refresh_token: string; }
export interface UserProfile { id: string; name: string; email: string; }

// Products
export interface Product { id: string; name: string; emoji: string; price: number; stock: number; }

// Orders
export type OrderStatus = "processing" | "shipped" | "delivered";
export interface OrderItem { productId: string; name: string; quantity: number; unitPrice: number; subtotal: number; }
export interface ShippingInfo { name: string; email: string; address: string; }
export interface PaymentInfo { last4: string; status: string; }
export interface Order {
  orderId: string; items: OrderItem[]; shipping: ShippingInfo;
  payment: PaymentInfo; total: number; status: OrderStatus; createdAt: string;
}
export interface OrderSummary {
  orderId: string; customerName: string; total: number; status: OrderStatus; createdAt: string;
}
export interface PaginatedOrders {
  orders: OrderSummary[]; total: number; page: number; per_page: number; total_pages: number;
}

// Dashboard
export interface StatsBlock { revenue: number; orders: number; }
export interface SalesDataPoint { label: string; revenue: number; }
export interface Bestseller { name: string; price: number; units_sold: number; revenue: number; }
export interface DashboardData {
  stats: { today: StatsBlock; last_week: StatsBlock; last_month: StatsBlock; };
  sales_overview: { weekly: SalesDataPoint[]; yearly: SalesDataPoint[]; };
  bestsellers: Bestseller[];
}

// Cart
export interface CartItem { productId: string; quantity: number; }
```

**Files**: `frontend/src/types/index.ts`

---

### Task 5: Axios client with concurrent-refresh handling — `src/api/client.ts`

```typescript
import axios from "axios";
import { getTokens, setAccessToken, clearTokens } from "../store/authStore";

const client = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Request: attach access token
client.interceptors.request.use((config) => {
  const { access_token } = getTokens();
  if (access_token) config.headers.Authorization = `Bearer ${access_token}`;
  return config;
});

// Response: handle 401 with concurrent refresh queue
let isRefreshing = false;
let queue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token!)));
  queue = [];
};

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) return Promise.reject(error);

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return client(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { refresh_token } = getTokens();
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${refresh_token}` } }
      );
      setAccessToken(data.access_token);
      processQueue(null, data.access_token);
      original.headers.Authorization = `Bearer ${data.access_token}`;
      return client(original);
    } catch (err) {
      processQueue(err, null);
      clearTokens();
      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default client;
```

**Files**: `frontend/src/api/client.ts`

---

### Task 6: Auth store — `src/store/authStore.ts`

```typescript
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { UserProfile, TokenPair } from "../types/index";

// Token helpers (used by axios client — must be plain functions, not hooks)
export const getTokens = () => ({
  access_token:  localStorage.getItem("access_token") ?? "",
  refresh_token: localStorage.getItem("refresh_token") ?? "",
});
export const setAccessToken = (token: string) => localStorage.setItem("access_token", token);
export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

interface AuthState {
  user: UserProfile | null;
  login: (tokens: TokenPair, user: UserProfile) => void;
  logout: () => void;
  setUser: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (tokens: TokenPair, profile: UserProfile) => {
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    setUser(profile);
  };

  const logout = () => {
    clearTokens();
    localStorage.removeItem(`cart_${user?.id}`);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
```

**Files**: `frontend/src/store/authStore.ts`

---

### Task 7: Cart store — `src/store/cartStore.ts`

Cart is per-user — stored as `cart_{userId}` in localStorage. Prices NOT stored, only id+qty.

```typescript
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { CartItem } from "../types/index";

interface CartState {
  items: CartItem[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children, userId }: { children: ReactNode; userId: string | null }) {
  const storageKey = userId ? `cart_${userId}` : null;

  const loadCart = (): CartItem[] => {
    if (!storageKey) return [];
    try { return JSON.parse(localStorage.getItem(storageKey) ?? "[]"); }
    catch { return []; }
  };

  const [items, setItems] = useState<CartItem[]>(loadCart);

  const save = useCallback((next: CartItem[]) => {
    setItems(next);
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
  }, [storageKey]);

  const addItem = (productId: string) => {
    const existing = items.find((i) => i.productId === productId);
    if (existing) save(items.map((i) => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i));
    else save([...items, { productId, quantity: 1 }]);
  };

  const removeItem = (productId: string) => save(items.filter((i) => i.productId !== productId));

  const updateQty = (productId: string, quantity: number) => {
    if (quantity < 1) return removeItem(productId);
    save(items.map((i) => i.productId === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => save([]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems: items.reduce((s, i) => s + i.quantity, 0) }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
```

**Files**: `frontend/src/store/cartStore.ts`

---

### Task 8: API modules — `src/api/auth.ts`, `products.ts`, `dashboard.ts`, `orders.ts`

Thin wrappers around the axios client:

```typescript
// src/api/auth.ts
export const register = (data) => client.post("/auth/register", data);
export const login = (data) => client.post("/auth/login", data);
export const getMe = () => client.get("/auth/me");

// src/api/products.ts
export const getProducts = () => client.get<Product[]>("/products");
export const getProduct = (id: string) => client.get<Product>(`/products/${id}`);

// src/api/dashboard.ts
export const getDashboard = () => client.get<DashboardData>("/dashboard");

// src/api/orders.ts
export const getOrders = (page = 1, q = "") =>
  client.get<PaginatedOrders>(`/orders?page=${page}&q=${encodeURIComponent(q)}`);
export const getOrder = (id: string) => client.get<Order>(`/orders/${id}`);
export const createOrder = (data) => client.post<Order>("/orders", data);
export const createPaymentIntent = (items) =>
  client.post<{ clientSecret: string; amount: number }>("/stripe/create-payment-intent", { items });
```

**Files**: `frontend/src/api/auth.ts`, `frontend/src/api/products.ts`, `frontend/src/api/dashboard.ts`, `frontend/src/api/orders.ts`

---

### Task 9: Wrap providers in `main.tsx`, verify dev server

Update `main.tsx` to wrap app with `AuthProvider` + `CartProvider`.
Run `npm run dev` — confirm app loads at `http://localhost:5173` with dark background.

## Verification

```bash
# Backend patch
cd backend && npm test  # all 42 tests still pass + updated orders test

# Frontend
cd frontend && npm run dev
# → http://localhost:5173 loads, dark background (#131313), Manrope font visible
cd frontend && npm run lint  # no errors
```

## Task dependency graph

```
Task 0 (backend patch) → run tests → confirm
Task 1 (scaffold) → Task 2 (tailwind) → Task 3 (router)
                  → Task 4 (types)
                  → Task 5 (axios client)   ← depends on Task 6 (auth store) for getTokens
                  → Task 6 (auth store)
                  → Task 7 (cart store)
                  → Task 8 (api modules)    ← depends on Task 5
                  → Task 9 (verify)         ← after all above
```
