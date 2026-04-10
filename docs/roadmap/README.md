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

**Goal**: Tất cả 11 endpoints hoạt động, test được bằng curl

| Task | Plan | Status |
|------|------|--------|
| Express + TypeScript project setup | PLAN-001 | TODO |
| Mock data: users, products, orders | PLAN-001 | TODO |
| Types/interfaces | PLAN-001 | TODO |
| `POST /auth/register` | PLAN-002 | TODO |
| `POST /auth/login` | PLAN-002 | TODO |
| `POST /auth/refresh` | PLAN-002 | TODO |
| `GET /auth/me` + JWT middleware | PLAN-002 | TODO |
| `GET /products` | PLAN-003 | TODO |
| `GET /products/:id` | PLAN-003 | TODO |
| `GET /dashboard` | PLAN-004 | TODO |
| `POST /stripe/create-payment-intent` | PLAN-005 | TODO |
| `POST /orders` (verify Stripe → persist) | PLAN-005 | TODO |
| `GET /orders` (user's history, paginated) | PLAN-005 | TODO |
| `GET /orders/:id` (detail, 403 guard) | PLAN-005 | TODO |
| Integration tests (register → order flow) | PLAN-006 | TODO |

**Done criteria**: All 11 endpoints tested với curl, error cases handled, integration tests pass

---

## Sprint 2 — Frontend

**Goal**: React app kết nối backend, match designs, full checkout flow

| Task | Plan | Status |
|------|------|--------|
| Vite + React + TypeScript + Router setup | PLAN-007 | TODO |
| Axios client + token interceptors (auto-refresh) | PLAN-007 | TODO |
| Auth store (Context + localStorage) + Cart store | PLAN-007 | TODO |
| Login page — match `Freddys_Login.png` | PLAN-008 | TODO |
| Register page | PLAN-008 | TODO |
| ProtectedRoute + Sidebar layout | PLAN-008 | TODO |
| Dashboard — stats cards (Today/Week/Month) | PLAN-009 | TODO |
| Dashboard — bar chart with weekly/yearly toggle | PLAN-009 | TODO |
| Dashboard — bestsellers table | PLAN-009 | TODO |
| Products page — grid with "Add to Cart" | PLAN-010 | TODO |
| Cart drawer — qty +/−, subtotal | PLAN-010 | TODO |
| Checkout page — shipping + Stripe Card Element | PLAN-010 | TODO |
| Order confirmation page | PLAN-010 | TODO |
| Orders history — paginated table | PLAN-011 | TODO |
| Order detail page (403 guard) | PLAN-011 | TODO |

**Done criteria**: All screens match designs, Stripe test payment works, token auto-refresh works

---

## Bonus (nếu có thời gian)

| Item | Priority |
|------|----------|
| Unit tests cho backend services (PLAN-002 → 005) | HIGH |
| Loading & error states trên frontend | MEDIUM |
| Docker setup (docker-compose.yml) | LOW |

---

## Milestones

| Milestone | Condition |
|-----------|-----------|
| **M1: API Ready** | Sprint 1 done, all 11 endpoints tested với curl |
| **M2: App Working** | Register → Browse → Cart → Checkout → Order History flow end-to-end |
| **M3: Deliverable** | README xong, `public/` folder có production build |
