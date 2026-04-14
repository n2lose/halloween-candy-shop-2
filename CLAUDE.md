# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack Halloween candy shop with analytics dashboard and storefront. **Assignment project** — no production database, uses in-memory TypeScript arrays. Backend is complete (Sprint 1 DONE). Frontend is next (Sprint 2).

**Brand**: "The Haunted Atelier" — dark luxury aesthetic, artisanal Halloween confections.

**User flow**: Login/Register → Dashboard (stats + chart + bestsellers) → Orders (manifest + search + pagination + detail) → Products (gallery + cart) → Checkout (Stripe)

**Pages in scope** (Option 2 confirmed):
- Login + Register
- Dashboard (Atelier Overview)
- Orders (Order Manifest)
- Products (Product Gallery) + Cart (Grimoire Cart) + Checkout
- ~~Customers~~ — excluded (no API, beyond assignment scope)

---

## Commands

```bash
# Backend (port 3001)
cd backend && npm run dev       # dev server (tsx watch)
cd backend && npm test          # all tests
cd backend && npx jest auth     # run single test file/folder
cd backend && npm run lint
cd backend && npm run build

# Frontend (port 5173)
cd frontend && npm run dev
cd frontend && npm run build    # outputs to public/
cd frontend && npm run lint
```

---

## Architecture

Two independent packages: `backend/` and `frontend/` (neither exists yet — create both).

### Backend (`backend/src/`)

Each feature follows the pattern `*.router.ts` (Express routes) + `*.service.ts` (business logic):

```
auth/           auth.router.ts, auth.service.ts, auth.middleware.ts
products/       products.router.ts, products.service.ts
dashboard/      dashboard.router.ts, dashboard.service.ts
orders/         orders.router.ts, orders.service.ts
stripe/         stripe.router.ts, stripe.service.ts
data/           orders.ts, products.ts, users.ts  ← in-memory mock arrays
types/          index.ts  ← shared interfaces
app.ts          Express setup, CORS, route mounting
```

`auth.middleware.ts` exports `verifyAccessToken()` — applied to all routes except `/auth/register`, `/auth/login`, `/auth/refresh`, and `/products`.

### Frontend (`frontend/src/`)

```
pages/          LoginPage.tsx, DashboardPage.tsx, OrdersPage.tsx,
                ProductsPage.tsx, CartPage.tsx, CheckoutPage.tsx
components/     Layout/{Sidebar,ProtectedRoute,Topbar}
                Dashboard/{StatsCard,RevenueChart,BestsellersTable}
                Orders/{OrdersTable,SearchBar,Pagination}
                Products/{ProductCard,CartDrawer}
                Checkout/{ShippingForm,PaymentForm,OrderSummary}
api/            client.ts (axios instance), auth.ts, dashboard.ts, orders.ts, products.ts
store/          authStore.ts, cartStore.ts  ← tokens + cart in localStorage
types/          index.ts
```

`api/client.ts` is the single axios instance with two interceptors:
1. **Request**: attach `Authorization: Bearer <access_token>`
2. **Response**: on 401 → call `POST /refresh` → retry original request → on refresh failure → logout + redirect `/login`

The Dashboard `RevenueChart` uses a single Recharts `BarChart` with a weekly/yearly toggle that swaps the data source.

---

## API Contracts (v2.1 — approved 2026-04-13)

**Public** (no token required):
| Method | Path | Notes |
|--------|------|-------|
| POST | `/auth/register` | `{ name, email, password }` → tokens |
| POST | `/auth/login` | `{ email, password }` → tokens |
| POST | `/auth/refresh` | Refresh token in Bearer header → `{ access_token }` |
| GET | `/products` | List all 10 Halloween candy products (with emoji, price, stock) |
| GET | `/products/:id` | Single product, 404 if not found |

**Protected** (access token required):
| Method | Path | Notes |
|--------|------|-------|
| GET | `/auth/me` | Returns `{ id, name, email }` — used by sidebar |
| GET | `/dashboard` | Returns `{ stats, sales_overview, bestsellers }` |
| POST | `/stripe/create-payment-intent` | `{ items }` → `{ clientSecret, amount }` |
| POST | `/orders` | `{ paymentIntentId, customer, items }` → order detail (verify Stripe first) |
| GET | `/orders` | User's order history (paginated) |
| GET | `/orders/:id` | Single order detail, 403 if not owner |

**11 endpoints total.** Token specs: access 15min, refresh 30 days. Stripe test mode. Full request/response shapes: `docs/specs/api-spec.md`.

---

## Coding Conventions

- TypeScript strict mode — no `any`, use `unknown` if needed
- Functions max 30 lines — split if longer
- Error responses always: `{ "error": "message" }`
- File naming: camelCase for TS files (`authService.ts`), PascalCase for React components (`LoginPage.tsx`)

---

## Implementation Workflow

Plans live in `docs/plans/` (PLAN-001 through PLAN-011, currently DRAFT). Work on a feature only after its plan is **APPROVED**:

```
1. Read specs + designs → 2. Create plan (--permission-mode plan) → 3. Human review + approve
→ 4. Implement each task → 5. /write-tests → 6. /review-pr → 7. /commit → 8. Update plan → DONE
```

### Git

- Branch per plan: `feat/PLAN-00X-short-description`
- Commits: `type(scope): description` — types: `feat`, `fix`, `test`, `refactor`, `docs`, `chore`
- Scopes: `auth`, `dashboard`, `orders`, `products`, `stripe`, `frontend`, `backend`, `docs`

### Tools

| Situation | Tool |
|-----------|------|
| New task | `claude --permission-mode plan` |
| Commit | `/commit` |
| Before PR | `/review-pr` |
| Bug > 15 min | `debugger` subagent |
| Write tests | `/write-tests` or `test-engineer` subagent |

### Definition of Done

- Code implements requirements correctly
- Tests written and passing
- `/review-pr` has no CRITICAL/HIGH issues
- `npm run lint` passes
- Manual test on local browser
- Plan file status → DONE

---

## Mock Data

- **Default user**: `{ name: "Freddy", email: "freddy@halloween.shop", password: "ElmStreet2019" }` (pre-seeded, registration also available)
- **Products**: Pumpkin Spice Lollipop, Witch Finger Gummy, Skull Chocolate Bar, Spider Web Cotton Candy, Ghost Marshmallow, Cauldron Caramel Apple, Vampire Fang Candy Corn, Black Cat Licorice, Frankenstein Fudge, Zombie Brain Gummy
- **Orders**: ~30 mock orders spread across last 7 days and 12 months (for chart data)

---

## Key Constraints

- In-memory data resets on server restart (acceptable for assignment)
- Token storage in localStorage (acceptable for assignment)
- Stripe test mode only — never charge real money; test card `4242 4242 4242 4242`
- Card details never touch backend — Stripe handles tokenisation via `@stripe/react-stripe-js`
- Env vars: `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- UI designs: `docs/designs/stitch/` — each page has `screen.png` + `code.html`
  - `login_freddy_s_candy_shop/` — Login page
  - `dashboard_freddy_s_candy_shop/` — Dashboard (compact)
  - `full_dashboard_the_haunted_atelier/` — Dashboard (full)
  - `orders_freddy_s_candy_shop_1/`, `orders_freddy_s_candy_shop_2/` — Orders table
  - `full_orders_the_haunted_atelier_1/`, `full_orders_the_haunted_atelier_2/` — Orders (full)
  - `product_gallery_the_haunted_atelier/` — Products page
  - `your_grimoire_cart_the_haunted_atelier/` — Cart page
  - `checkout_the_haunted_atelier/` — Checkout page
  - `inventory_the_haunted_atelier/` — Inventory (reference only, not in scope)
- Design system: `docs/designs/stitch/gilded_ghouls_confections/DESIGN.md`
  - Colors: `#131313` base, `#db7619` primary, `#8adb4d` success/tertiary, `#e5e2e1` text
  - Fonts: Newsreader (headings/serif) + Manrope (body/UI)
  - No 1px borders — depth via color shifts only
  - Status: processing=orange pulse, shipped=blue, delivered=eerie green
