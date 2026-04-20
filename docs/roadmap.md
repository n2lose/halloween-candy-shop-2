# Project Roadmap — Freddy's Halloween Candy Shop

## Sprint Overview

```
Sprint 1 — Backend API          Sprint 2 — Frontend             Deliverable
─────────────────────           ────────────────────            ──────────
PLAN-001 Backend setup     →    PLAN-007 Frontend setup    →    Full-stack working
PLAN-002 Auth API          →    PLAN-008 Auth pages        →    Manual tested
PLAN-003 Products API      →    PLAN-009 Dashboard page    →    README written
PLAN-004 Dashboard API     →    PLAN-010 Products+Cart+Pay →    public/ built
PLAN-005 Stripe+Orders API →    PLAN-011 Order history
PLAN-006 Integration tests
```

## Sprint 1 — Backend API

**Goal**: All 11 endpoints working, testable via curl

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

**Done criteria**: All 11 endpoints tested with curl, error cases handled, integration tests pass ✅

---

## Sprint 2 — Frontend

**Goal**: React app connected to backend, matches designs, full checkout flow

| Task | Plan | Status |
|------|------|--------|
| Vite + React + TypeScript + Router setup | PLAN-007 | DONE |
| Tailwind CSS v3 + design tokens (Haunted Atelier) | PLAN-007 | DONE |
| Axios client + token interceptors (auto-refresh) | PLAN-007 | DONE |
| Auth store (Context + localStorage) + Cart store | PLAN-007 | DONE |
| Backend patch: `customerName` in `GET /orders` | PLAN-007 | DONE |
| Login page — match `Freddys_Login.png` | PLAN-008 | TODO |
| Register page | PLAN-008 | TODO |
| ProtectedRoute + Sidebar layout | PLAN-008 | TODO |
| Storefront Topnav layout | PLAN-008 | TODO |
| Dashboard — stats cards (Today/Week/Month) | PLAN-009 | TODO |
| Dashboard — bar chart with weekly/yearly toggle | PLAN-009 | TODO |
| Dashboard — bestsellers table | PLAN-009 | TODO |
| Products page — grid with "Add to Cart" | PLAN-010 | TODO |
| Cart page — qty +/−, subtotal | PLAN-010 | TODO |
| Checkout page — shipping + Stripe Card Element | PLAN-010 | TODO |
| Order confirmation page | PLAN-010 | TODO |
| Orders history — paginated table + search | PLAN-011 | TODO |
| Order detail page (403 guard) | PLAN-011 | TODO |

**Done criteria**: All screens match designs, Stripe test payment works, token auto-refresh works

---

## Bonus (if time permits)

| Item | Priority |
|------|----------|
| Unit tests for backend services (PLAN-002 → 005) | HIGH |
| Loading & error states on frontend | MEDIUM |
| Docker setup (docker-compose.yml) | LOW |

---

## Milestones

| Milestone | Condition |
|-----------|-----------|
| **M1: API Ready** | Sprint 1 done, all 11 endpoints tested with curl |
| **M2: App Working** | Register → Browse → Cart → Checkout → Order History flow end-to-end |
| **M3: Deliverable** | README complete, `public/` folder contains production build |
