# Implementation Plans — Index

Mỗi feature lớn có một plan file riêng. Plan phải ở status **APPROVED** trước khi bắt đầu code.

## Quy Trình

```
DRAFT → (human review + corrections) → APPROVED → IN PROGRESS → DONE
```

## Plans

| Plan | Feature | Status | Branch |
|------|---------|--------|--------|
| [PLAN-001](./PLAN-001-backend-foundation.md) | Backend setup (Express + TypeScript + mock data) | DRAFT | `feat/PLAN-001-backend-foundation` |
| [PLAN-002](./PLAN-002-auth.md) | Auth endpoints (`/register`, `/login`, `/refresh`, `/me`) | DRAFT | `feat/PLAN-002-auth` |
| [PLAN-003](./PLAN-003-products.md) | Products endpoints (`GET /products`, `GET /products/:id`) | DRAFT | `feat/PLAN-003-products` |
| [PLAN-004](./PLAN-004-dashboard.md) | Dashboard endpoint (`GET /dashboard`) | DRAFT | `feat/PLAN-004-dashboard` |
| [PLAN-005](./PLAN-005-orders.md) | Orders endpoint (`GET /orders?page&q`) | DRAFT | `feat/PLAN-005-orders` |
| [PLAN-006](./PLAN-006-frontend-setup.md) | Frontend setup (Vite + React + Router + Axios client) | DRAFT | `feat/PLAN-006-frontend-setup` |
| [PLAN-007](./PLAN-007-login-page.md) | Login page + token flow + ProtectedRoute | DRAFT | `feat/PLAN-007-login-page` |
| [PLAN-008](./PLAN-008-dashboard-page.md) | Dashboard page (stats cards + chart toggle + bestsellers) | DRAFT | `feat/PLAN-008-dashboard-page` |
| [PLAN-009](./PLAN-009-orders-page.md) | Orders page (table + search + pagination) | DRAFT | `feat/PLAN-009-orders-page` |

## Cách Tạo Plan

```bash
# Trong project root, chạy planning mode:
claude --permission-mode plan \
  "Tạo implementation plan cho [feature].
   Đọc CLAUDE.md và docs/specs/api-spec.md để hiểu context.
   Lưu kết quả vào docs/plans/PLAN-00X-[name].md"

# Sau khi human review và approve:
# → Đổi status trong file plan thành APPROVED
# → Commit: git commit -m "docs(plans): approve PLAN-00X"
# → Tạo branch: git checkout -b feat/PLAN-00X-name
```
