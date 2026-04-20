# Implementation Plans — Index

Each major feature has its own plan file. A plan must be **APPROVED** before implementation begins.

---

## Workflow

### Plan lifecycle

```
DRAFT → (human review + corrections) → APPROVED → IN PROGRESS → DONE
```

### Implementation flow — one plan at a time, sequential

```
PLAN-012: detail breakdown → approve → implement → done
    ↓
PLAN-013: detail breakdown → approve → implement → done
    ↓
... (do not detail all plans upfront — context changes after each plan)
```

### Plan file template

```markdown
# PLAN-00X: [Feature Name]
**Status**: DRAFT | APPROVED | IN PROGRESS | DONE

## Context
Why this feature is needed, dependencies from previous plans.

## Tasks
Detailed tasks: files to create/modify, logic to implement.

## Verification
How to test the feature works correctly (curl commands, browser test, npm test).
```

---

## Plans

### Sprint 1 — Backend API ✅ COMPLETE

| Plan | Feature | Status | Branch |
|------|---------|--------|--------|
| [PLAN-001](./PLAN-001-backend-foundation.md) | Backend setup (Express + TypeScript + mock data) | DONE | `feat/PLAN-001-backend-foundation` |
| [PLAN-002](./PLAN-002-auth.md) | Auth endpoints (`/register`, `/login`, `/refresh`, `/me`) | DONE | `feat/PLAN-002-auth` |
| [PLAN-003](./PLAN-003-products.md) | Products endpoints (`GET /products`, `GET /products/:id`) | DONE | `feat/PLAN-003-products` |
| [PLAN-004](./PLAN-004-dashboard.md) | Dashboard endpoint (`GET /dashboard`) | DONE | `feat/PLAN-004-dashboard` |
| [PLAN-005](./PLAN-005-stripe-orders.md) | Stripe + Orders endpoints | DONE | `feat/PLAN-005-stripe-orders` |
| [PLAN-006](./PLAN-006-integration-tests.md) | Integration tests — 42 tests passing | DONE | `feat/PLAN-006-integration-tests` |

---

### Sprint 2 — Backend Refactor (Multi-role + SQLite)

> **Scope change (2026-04-20)**: Refactored to multi-role system (admin/customer) with SQLite persistence,
> role-based access control, admin API (`/admin/*`), and product CRUD.
> Architecture updated to Controller/Service/Repository pattern.

| Plan | Feature | Status | Branch |
|------|---------|--------|--------|
| [PLAN-007](./PLAN-007-frontend-setup.md) | Frontend scaffold (Vite + React + Tailwind + Axios + stores) | DONE | `feat/PLAN-007-frontend-setup` |
| [PLAN-012](./PLAN-012-backend-sqlite.md) | SQLite foundation + repositories + types refactor | DONE | `feat/PLAN-012-backend-sqlite` |
| PLAN-013 | Auth refactor — role-based JWT, middleware, Controller/Service/Repo | TODO | `feat/PLAN-013-auth-refactor` |
| PLAN-014 | Admin API — `/admin/dashboard`, `/admin/orders`, `/admin/products` | TODO | `feat/PLAN-014-admin-api` |
| PLAN-015 | Customer API — products (public), orders (own), Stripe | TODO | `feat/PLAN-015-customer-api` |
| PLAN-016 | Integration tests rewrite (SQLite `:memory:`) | TODO | `feat/PLAN-016-tests` |

---

### Sprint 3 — Frontend

> **Role-aware routing**: Admin login → `/admin/dashboard`. Customer login → `/products`.
> Design reference: `docs/designs/` — Login, Dashboard, Orders wireframes.

| Plan | Feature | Status | Branch |
|------|---------|--------|--------|
| PLAN-017 | Login + Register (role redirect) + ProtectedRoute + AdminLayout + StorefrontLayout | TODO | `feat/PLAN-017-auth-layouts` |
| PLAN-018 | Admin pages — Dashboard, Orders (all), Products CRUD | TODO | `feat/PLAN-018-admin-pages` |
| PLAN-019 | Storefront — Products gallery + Cart + Checkout (Stripe) + Confirmation | TODO | `feat/PLAN-019-storefront` |
| PLAN-020 | Customer Orders — own orders list + detail | TODO | `feat/PLAN-020-customer-orders` |
