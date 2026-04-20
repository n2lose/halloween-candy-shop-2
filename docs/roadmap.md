# Project Roadmap — Freddy's Halloween Candy Shop

## Sprint Overview

```
Sprint 1 — Backend API        Sprint 2 — Backend Refactor      Sprint 3 — Frontend
──────────────────────        ───────────────────────────      ───────────────────
PLAN-001 Foundation      →    PLAN-012 SQLite + Repos      →   PLAN-007 Scaffold ✅
PLAN-002 Auth            →    PLAN-013 Auth + Roles        →   PLAN-017 Auth + Layouts
PLAN-003 Products        →    PLAN-014 Admin API           →   PLAN-018 Admin Pages
PLAN-004 Dashboard       →    PLAN-015 Customer API        →   PLAN-019 Storefront
PLAN-005 Stripe + Orders →    PLAN-016 Tests (rewrite)     →   PLAN-020 Orders
PLAN-006 Integration Tests
```

---

## Sprint 1 — Backend API ✅ COMPLETE

**Goal**: All 11 endpoints working, in-memory data, integration tests passing

| Task | Plan | Status |
|------|------|--------|
| Express + TypeScript project setup | PLAN-001 | DONE |
| Mock data: users, products, orders | PLAN-001 | DONE |
| Types/interfaces | PLAN-001 | DONE |
| `POST /auth/register` | PLAN-002 | DONE |
| `POST /auth/login` | PLAN-002 | DONE |
| `POST /auth/refresh` | PLAN-002 | DONE |
| `GET /auth/me` + JWT middleware | PLAN-002 | DONE |
| `GET /products` | PLAN-003 | DONE |
| `GET /products/:id` | PLAN-003 | DONE |
| `GET /dashboard` | PLAN-004 | DONE |
| `POST /stripe/create-payment-intent` | PLAN-005 | DONE |
| `POST /orders` (verify Stripe → persist) | PLAN-005 | DONE |
| `GET /orders` (user's history, paginated) | PLAN-005 | DONE |
| `GET /orders/:id` (detail, 403 guard) | PLAN-005 | DONE |
| Integration tests (42/42 passing) | PLAN-006 | DONE |

---

## Sprint 2 — Backend Refactor (Multi-role + SQLite)

**Goal**: Role-based system (admin/customer), SQLite persistence, clean architecture, admin API

| Task | Plan | Status |
|------|------|--------|
| Install better-sqlite3, create db/sqlite.ts | PLAN-012 | DONE |
| Schema: users, products, orders, order_items tables | PLAN-012 | DONE |
| Seed: admin + customer + 10 products + 30 orders | PLAN-012 | DONE |
| Repositories: UserRepository, ProductRepository, OrderRepository | PLAN-012 | DONE |
| types/index.ts: add role, remove emoji, userId → string | PLAN-012 | DONE |
| Auth service → UserRepository (remove data/users.ts) | PLAN-013 | DONE |
| JWT payload: `{ userId, role, email, name }` | PLAN-013 | DONE |
| `authMiddleware` — verify token, attach req.user | PLAN-013 | DONE |
| `roleMiddleware("admin")` — 403 if wrong role | PLAN-013 | DONE |
| Controller/Service/Repository architecture | PLAN-013 | DONE |
| `GET /admin/dashboard` — admin only | PLAN-014 | DONE |
| `GET /admin/orders` — ALL orders, paginated + search | PLAN-014 | DONE |
| `GET /admin/orders/:id` | PLAN-014 | DONE |
| `PATCH /admin/orders/:id/status` — free-form update | PLAN-014 | DONE |
| `POST /admin/products` | PLAN-014 | DONE |
| `PUT /admin/products/:id` | PLAN-014 | DONE |
| `DELETE /admin/products/:id` | PLAN-014 | DONE |
| `GET /products` + `GET /products/:id` → ProductRepository | PLAN-015 | DONE |
| `POST /stripe/create-payment-intent` (customer) | PLAN-015 | DONE |
| `POST /orders` — validate stock + atomic transaction | PLAN-015 | DONE |
| `GET /orders` + `GET /orders/:id` — own only | PLAN-015 | DONE |
| Remove data/*.ts (in-memory arrays deleted) | PLAN-015 | DONE |
| Rewrite integration tests for SQLite (in-memory :memory:) | PLAN-016 | DONE |
| Test: auth with role, admin routes, customer routes | PLAN-016 | DONE |

**Done criteria**: Role-based API working, SQLite persists across restarts, all tests pass

---

## Sprint 3 — Frontend ⏳ IN PROGRESS

**Goal**: React app connected to refactored backend, role-aware routing, full checkout flow

| Task | Plan | Status |
|------|------|--------|
| Vite + React + TypeScript + Router scaffold | PLAN-007 | DONE |
| Tailwind CSS v3 + Haunted Atelier design tokens | PLAN-007 | DONE |
| Axios client + concurrent-refresh interceptor | PLAN-007 | DONE |
| Auth store + Cart store (localStorage) | PLAN-007 | DONE |
| Stitch design review + FRONTEND_DESIGN.md | — | DONE |
| UI primitives (Button, Input, Badge, Card, StatCard, Spinner, EmptyState, Pagination, SearchBar) | PLAN-017 | DONE |
| Login page — Stitch design faithful, role-aware redirect | PLAN-017 | DONE |
| Register page (role = customer by default) | PLAN-017 | DONE |
| ProtectedRoute — handles hydration spinner + role guard | PLAN-017 | DONE |
| AdminLayout (glassmorphism topbar + sidebar rounded-r-full active) | PLAN-017 | DONE |
| StorefrontLayout (sticky topnav, cart badge, drawer stub, user actions) | PLAN-017 | DONE |
| AppRoutes — all routes wired with role-based guards | PLAN-017 | DONE |
| Admin Dashboard — 3 StatCards + RevenueChart (Recharts) + BestsellersTable | PLAN-018 | DONE |
| Admin Orders — table, search, pagination, click-to-detail | PLAN-018 | DONE |
| Admin Order Detail — items, shipping, payment cards + status select | PLAN-018 | DONE |
| Admin Products — inventory table, stock indicators | PLAN-018 | DONE |
| PATCH /admin/orders/:id/status — wire status dropdown | PLAN-018 | DONE |
| Admin Products CRUD modals (create, edit, delete) | PLAN-018 | DONE |
| Products gallery — hero, 5-col grid, qty controls, out-of-stock | PLAN-019 | DONE |
| Cart drawer — open/close, empty state, count badge | PLAN-019 | DONE |
| Checkout — shipping form + simulated payment + order create | PLAN-019 | DONE |
| Cart drawer — show product names + prices from API | PLAN-019 | TODO |
| Checkout — wire real Stripe PaymentElement | PLAN-019 | TODO |
| Customer Orders — own orders table, search, pagination | PLAN-020 | DONE |
| Customer Order Detail — items, shipping, payment (read-only) | PLAN-020 | DONE |

**Done criteria**: Admin flow + customer flow end-to-end, Stripe test payment works

---

## Milestones

| Milestone | Condition | Status |
|-----------|-----------|--------|
| **M1: API Ready** | Sprint 1 done, 11 endpoints + 42 tests | ✅ DONE |
| **M2: Backend Production-Ready** | Role-based, SQLite, admin API, tests rewritten | ✅ DONE |
| **M3: App Working** | Admin + customer full flow end-to-end in browser | ⏳ ~80% — Stripe + CartDrawer remaining |
| **M4: Deliverable** | README complete, `public/` built, credentials documented | ⏳ Sprint 3 |

---

## Dev Credentials (documented in README)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@halloween.shop | Halloween2024! |
| Customer | freddy@halloween.shop | see `.env SEED_USER_PASSWORD` |
