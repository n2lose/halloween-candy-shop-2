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

## Sprint 3 — Frontend

**Goal**: React app connected to refactored backend, role-aware routing, full checkout flow

| Task | Plan | Status |
|------|------|--------|
| Vite + React + TypeScript + Router scaffold | PLAN-007 | DONE |
| Tailwind CSS v3 + Haunted Atelier design tokens | PLAN-007 | DONE |
| Axios client + concurrent-refresh interceptor | PLAN-007 | DONE |
| Auth store + Cart store (localStorage) | PLAN-007 | DONE |
| Login page — role-aware redirect (admin → /admin/dashboard, customer → /products) | PLAN-017 | TODO |
| Register page (role = customer by default) | PLAN-017 | TODO |
| ProtectedRoute + AdminRoute (role guard) | PLAN-017 | TODO |
| AdminLayout (sidebar: Dashboard, Orders, Products, Logout) | PLAN-017 | TODO |
| StorefrontLayout (topnav: Products, Cart badge, My Orders) | PLAN-017 | TODO |
| Admin Dashboard — stats cards, revenue chart, bestsellers | PLAN-018 | TODO |
| Admin Orders — ALL orders table, search, pagination, status update | PLAN-018 | TODO |
| Admin Products — CRUD table (create, edit, delete) | PLAN-018 | TODO |
| Products gallery — grid, "Add to Cart" | PLAN-019 | TODO |
| Cart page — qty controls, subtotal, proceed to checkout | PLAN-019 | TODO |
| Checkout — shipping form + Stripe Card Element | PLAN-019 | TODO |
| Order confirmation page | PLAN-019 | TODO |
| Customer Orders page — own orders, paginated | PLAN-020 | TODO |
| Customer Order detail page | PLAN-020 | TODO |

**Done criteria**: Admin flow + customer flow end-to-end, Stripe test payment works

---

## Milestones

| Milestone | Condition | Status |
|-----------|-----------|--------|
| **M1: API Ready** | Sprint 1 done, 11 endpoints + 42 tests | ✅ DONE |
| **M2: Backend Production-Ready** | Role-based, SQLite, admin API, tests rewritten | ✅ DONE |
| **M3: App Working** | Admin + customer full flow end-to-end in browser | ⏳ Sprint 3 |
| **M4: Deliverable** | README complete, `public/` built, credentials documented | ⏳ Sprint 3 |

---

## Dev Credentials (documented in README)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@halloween.shop | Halloween2024! |
| Customer | freddy@halloween.shop | see `.env SEED_USER_PASSWORD` |
