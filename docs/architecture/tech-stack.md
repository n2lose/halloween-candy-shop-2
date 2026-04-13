# Tech Stack Reference — Freddy's Halloween Candy Shop

Detailed reference for every technology used in this project — role, how it works, and dependencies.

---

## System Overview

```
Browser ←── HTTP ──→ Express API ←── SDK ──→ Stripe API
  │                      │
React (port 5173)      Node.js (port 3001)
  │                      │
localStorage           In-memory arrays
(tokens, cart)         (users, products, orders)
```

Two fully independent packages — no shared code, no monorepo tooling. Frontend calls backend via HTTP, backend calls Stripe via SDK.

---

## Backend

### Node.js — Runtime

JavaScript runtime outside the browser, built on Chrome's V8 engine. Runs the Express server, handles HTTP requests, and calls the Stripe API. Same language as frontend (TypeScript) enables shared knowledge and types.

### Express.js — Web Framework

Minimal web framework for Node.js — routing, middleware, request/response handling.

**Middleware chain**:
```
request → CORS → bodyParser → authMiddleware → router → service → response
```

**Feature-based modules** — each feature has `*.router.ts` (receives request, returns response) and `*.service.ts` (business logic). Routers contain no logic; services know nothing about HTTP.

```
src/
├── auth/           # router + service + middleware
├── products/       # router + service
├── dashboard/      # router + service
├── orders/         # router + service
├── stripe/         # router + service
├── data/           # in-memory arrays
└── app.ts          # mount routes, middleware
```

### TypeScript (strict mode) — Language

Superset of JavaScript with static typing — compiles to JS before execution. Catches type errors at compile time, not runtime.

`"strict": true` in tsconfig enables all strict checks: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, etc.

**Project rules**: No `any` (use `unknown` if needed). Functions max 30 lines.

### jsonwebtoken — Authentication

Library to create and verify JSON Web Tokens (RFC 7519).

```
Login → server creates 2 tokens:
  access_token:  { sub: 1, email, name, iat, exp }     ← 15 minutes
  refresh_token: { sub: 1, type: "refresh", iat, exp }  ← 30 days

API call → frontend sends in header:
  Authorization: Bearer <access_token>

Token expired → frontend sends refresh_token → server returns new access_token
```

**2 separate secrets**: `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` — using a shared secret would allow anyone with a refresh token to forge an access token.

### bcryptjs — Password Hashing

Bcrypt algorithm in pure JavaScript — no native build tools required (`node-gyp`, Python, C++ compiler).

```
Register: bcrypt.hash("ElmStreet2019", 10) → "$2a$10$xxxxx..." (stored in data layer)
Login:    bcrypt.compare("ElmStreet2019", "$2a$10$xxxxx...") → true/false
```

Salt rounds = `10` — standard for development. ~30% slower than native `bcrypt`, but negligible for assignment scope (few users).

### Stripe SDK — Payment

Official Stripe library for Node.js — creates PaymentIntents, verifies payment status.

**Payment flow**:
```
1. Frontend sends items → Backend calculates total
2. Backend: stripe.paymentIntents.create({ amount: 598, currency: 'usd' })
3. Backend returns clientSecret → Frontend
4. Frontend: stripe.confirmCardPayment(clientSecret, { card })
   (card data NEVER passes through the backend — PCI compliance)
5. Frontend sends paymentIntentId → Backend verifies with Stripe → Creates order
```

Test mode uses `sk_test_` key — no real charges. Test card: `4242 4242 4242 4242`.

### In-memory Arrays — Data Storage

Data stored in TypeScript variables — lost on server restart (acceptable for assignment).

```typescript
export const users: User[] = [{ id: 1, name: "Freddy", ... }];
export const products: Product[] = [...]; // 10 fixed items
export const orders: Order[] = [...];     // ~30 mock + push new orders
export const usedPaymentIntents = new Set<string>(); // prevent duplicates
```

Helpers: `findUserByEmail()`, `findProductById()`, `findOrdersByUserId()`, `addOrder()` — similar to repository pattern but simplified.

### Jest + Supertest — Testing

- **Jest**: Testing framework — `describe()`, `it()`, `expect()`, mocking, coverage
- **Supertest**: HTTP assertions — sends requests to Express app without starting a real server
- **ts-jest**: Transformer that lets Jest understand TypeScript

**Separate app.ts / server.ts for testability**:
```typescript
// app.ts — exports app (does NOT listen)
export const app = express();

// server.ts — only this file listens
app.listen(3001);

// test — imports app, no server started
const res = await request(app).get('/products');
```

### cors + dotenv — Utilities

- **cors**: Allows frontend (port 5173) to call backend (port 3001) — different origins
- **dotenv**: Loads `.env` file into `process.env` — secrets never hardcoded in source

---

## Frontend

### Vite — Build Tool

Next-generation build tool — ultra-fast dev server (HMR < 50ms), production builds via Rollup. Output goes to `public/` folder.

CRA (Create React App) is deprecated. Vite is 10-100x faster in dev mode because it uses native ES modules — no bundling during development.

### React — UI Library

Component-based UI library — build interfaces from reusable functional components + hooks (`useState`, `useEffect`, `useContext`).

### React Router v6 — Routing

Client-side routing — navigates between pages without browser reload.

**Key features used in this project**:

```tsx
// Nested layout: Sidebar wraps all protected pages
<Route element={<Sidebar />}>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/orders" element={<OrdersPage />} />
</Route>

// ProtectedRoute: redirects to /login if not authenticated
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" ... />
</Route>

// NavLink: automatically adds "active" class when URL matches
<NavLink to="/dashboard">Dashboard</NavLink>
```

### Axios — HTTP Client

Promise-based HTTP client with interceptor support — single instance in `api/client.ts`.

**2 interceptors**:

```typescript
// Request: automatically attaches token to EVERY request
axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getAccessToken()}`;
  return config;
});

// Response: automatically refreshes on 401
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      await refreshToken();       // POST /auth/refresh
      return axios(error.config); // Retry original request
    }
  }
);
```

**Concurrent refresh**: If 3 requests all receive 401, only one refresh call is made. The other 2 are queued and replayed after the new token arrives.

### React Context + localStorage — State Management

- **React Context**: Shares state across components without prop drilling
- **localStorage**: Browser storage that persists across page refreshes

**2 stores**:

```
authStore (Context + localStorage)
├── access_token, refresh_token    ← persisted in localStorage
├── user: { id, name, email }     ← from GET /auth/me
├── login(), logout(), refresh()
└── Cleared on logout

cartStore (Context + localStorage)
├── items: [{ productId, quantity }]  ← stores id + qty ONLY, not prices
├── addItem(), removeItem(), updateQty()
├── Cleared on logout (per-user scope)
└── Prices fetched from /products on render (ensures freshness)
```

### Recharts — Charts

React charting library — builds charts using declarative React components, TypeScript-first.

```tsx
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={isWeekly ? weeklyData : yearlyData}>
    <XAxis dataKey="label" />
    <YAxis />
    <Bar dataKey="revenue" />
  </BarChart>
</ResponsiveContainer>
```

Weekly/yearly toggle only swaps the data source — no re-fetch from API (data is already in the `/dashboard` response).

### @stripe/react-stripe-js — Payment UI

React components for Stripe: `<Elements>`, `<CardElement>`, `useStripe()`, `useElements()`.

```tsx
<Elements stripe={stripePromise}>
  <CheckoutForm />
</Elements>

// Inside CheckoutForm:
const stripe = useStripe();
const elements = useElements();
const card = elements.getElement(CardElement);
await stripe.confirmCardPayment(clientSecret, {
  payment_method: { card }
});
```

Card data flow: User enters card into `<CardElement>` → Stripe.js tokenizes client-side → only the token travels over the network → **backend never sees the card number**.

### CSS Modules — Styling

CSS files are automatically scoped — class names become unique (`.button` → `.button_a1b2c3`). Each component has isolated styles, no conflicts.

```tsx
// DashboardPage.module.css
.statsGrid { display: grid; gap: 1rem; }

// DashboardPage.tsx
import styles from './DashboardPage.module.css';
<div className={styles.statsGrid}>...</div>
```

Zero config with Vite — just name the file `*.module.css`.

---

## Dependencies

### Backend

| Package | Type | Role |
|---------|------|------|
| `express` | prod | Web framework |
| `cors` | prod | Cross-origin requests |
| `jsonwebtoken` | prod | JWT sign/verify |
| `bcryptjs` | prod | Password hashing |
| `stripe` | prod | Stripe API SDK |
| `dotenv` | prod | Load .env vars |
| `typescript` | dev | TypeScript compiler |
| `ts-node-dev` | dev | Dev server + hot reload |
| `jest` | dev | Test runner |
| `ts-jest` | dev | Jest TypeScript transformer |
| `supertest` | dev | HTTP testing for Express |
| `@types/*` | dev | Type definitions (express, cors, jsonwebtoken, bcryptjs, jest, supertest) |

### Frontend

| Package | Type | Role |
|---------|------|------|
| `react` + `react-dom` | prod | UI library |
| `react-router-dom` | prod | Client-side routing |
| `axios` | prod | HTTP client + interceptors |
| `recharts` | prod | Bar charts |
| `@stripe/react-stripe-js` | prod | Stripe React components |
| `@stripe/stripe-js` | prod | Stripe.js loader |
| `typescript` | dev | TypeScript compiler |
| `vite` | dev | Build tool + dev server |
| `@vitejs/plugin-react` | dev | Vite React plugin |
| `@types/react` + `@types/react-dom` | dev | React type definitions |

---

## Environment Variables

| Variable | Package | File | Role |
|----------|---------|------|------|
| `JWT_ACCESS_SECRET` | backend | `.env` | Sign/verify access tokens |
| `JWT_REFRESH_SECRET` | backend | `.env` | Sign/verify refresh tokens (separate secret) |
| `STRIPE_SECRET_KEY` | backend | `.env` | `sk_test_...` — calls Stripe API server-side |
| `VITE_STRIPE_PUBLISHABLE_KEY` | frontend | `.env` | `pk_test_...` — loads Stripe.js client-side |

> The `VITE_` prefix is required for frontend env vars — Vite only exposes variables with this prefix to client code. Never use `VITE_` prefix for secret keys.
