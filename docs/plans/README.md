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
PLAN-001: detail breakdown → approve → implement → done
    ↓
PLAN-002: detail breakdown → approve → implement → done
    ↓
... (do not detail all plans upfront — context changes after each plan)
```

**Why sequential, not parallel**:
- Frontend depends on backend API being functional to test
- Later plans may change based on results from earlier plans
- Detailing plans too early leads to outdated specs

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

### Task implementation flow

```
Implement → security-check (auto on auth/) → /write-tests → /review-pr → /commit
```

---

## Plans

### Sprint 1 — Backend API

| Plan | Feature | Status | Branch |
|------|---------|--------|--------|
| [PLAN-001](./PLAN-001-backend-foundation.md) | Backend setup (Express + TypeScript + mock data) | DRAFT | `feat/PLAN-001-backend-foundation` |
| [PLAN-002](./PLAN-002-auth.md) | Auth endpoints (`/register`, `/login`, `/refresh`, `/me`) | DRAFT | `feat/PLAN-002-auth` |
| [PLAN-003](./PLAN-003-products.md) | Products endpoints (`GET /products`, `GET /products/:id`) | DRAFT | `feat/PLAN-003-products` |
| [PLAN-004](./PLAN-004-dashboard.md) | Dashboard endpoint (`GET /dashboard`) | DRAFT | `feat/PLAN-004-dashboard` |
| [PLAN-005](./PLAN-005-stripe-orders.md) | Stripe + Orders endpoints (`POST /stripe`, `POST/GET /orders`) | DRAFT | `feat/PLAN-005-stripe-orders` |
| [PLAN-006](./PLAN-006-integration-tests.md) | Integration tests (register → order full flow) | DRAFT | `feat/PLAN-006-integration-tests` |

### Sprint 2 — Frontend

| Plan | Feature | Status | Branch |
|------|---------|--------|--------|
| [PLAN-007](./PLAN-007-frontend-setup.md) | Frontend setup (Vite + React + Router + Axios client) | DRAFT | `feat/PLAN-007-frontend-setup` |
| [PLAN-008](./PLAN-008-auth-pages.md) | Login + Register pages + token flow + ProtectedRoute | DRAFT | `feat/PLAN-008-auth-pages` |
| [PLAN-009](./PLAN-009-dashboard-page.md) | Dashboard page (stats cards + chart toggle + bestsellers) | DRAFT | `feat/PLAN-009-dashboard-page` |
| [PLAN-010](./PLAN-010-products-cart-checkout.md) | Products page + Cart drawer + Checkout (Stripe) | DRAFT | `feat/PLAN-010-products-cart-checkout` |
| [PLAN-011](./PLAN-011-orders-page.md) | Orders page (table + search + pagination + detail) | DRAFT | `feat/PLAN-011-orders-page` |

## How to Create a Plan

```bash
# 1. Run planning mode to create a detailed breakdown:
claude --permission-mode plan \
  "Create implementation plan for PLAN-00X.
   Read CLAUDE.md and docs/specs/api-spec.md for context.
   Save result to docs/plans/PLAN-00X-[name].md"

# 2. Human review and approve:
# → Change status in plan file to APPROVED
# → Commit: git commit -m "docs(plans): approve PLAN-00X"

# 3. Create branch and implement:
# → git checkout -b feat/PLAN-00X-name
# → Implement each task according to the plan
# → Per task: implement → test → review → commit

# 4. When complete:
# → Change status to DONE
# → Merge branch into main
# → Begin detail breakdown for the next plan
```
