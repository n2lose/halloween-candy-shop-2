# Implementation Plans — Index

Mỗi feature lớn có một plan file riêng. Plan phải ở status **APPROVED** trước khi bắt đầu code.

## Quy Trình

```
DRAFT → (human review + corrections) → APPROVED → IN PROGRESS → DONE
```

## Plans

| Plan | Feature | Status | Sprint |
|------|---------|--------|--------|
| [PLAN-001](./PLAN-001-backend-foundation.md) | Backend foundation (Express setup + mock data + JWT) | DRAFT | Sprint 1 |
| [PLAN-002](./PLAN-002-auth.md) | Auth endpoints (/login, /refresh, middleware) | DRAFT | Sprint 1 |
| [PLAN-003](./PLAN-003-dashboard-api.md) | Dashboard API (/dashboard) | DRAFT | Sprint 1 |
| [PLAN-004](./PLAN-004-orders-api.md) | Orders API (/orders, search, pagination) | DRAFT | Sprint 1 |
| [PLAN-005](./PLAN-005-frontend-setup.md) | Frontend setup (Vite + React + routing + axios client) | DRAFT | Sprint 2 |
| [PLAN-006](./PLAN-006-login-page.md) | Login page + token flow | DRAFT | Sprint 2 |
| [PLAN-007](./PLAN-007-dashboard-page.md) | Dashboard page (stats + chart + bestsellers) | DRAFT | Sprint 2 |
| [PLAN-008](./PLAN-008-orders-page.md) | Orders page (table + search + pagination) | DRAFT | Sprint 2 |

## Cách Tạo Plan Mới

```bash
# Trong Claude Code session:
claude --permission-mode plan
  "Đọc requirements tại docs/specs/api-spec.md và architecture tại 
   docs/architecture/overview.md, tạo implementation plan cho [feature].
   Lưu vào docs/plans/PLAN-00X-[name].md"
```

## Ghi Chú

- Plans được commit vào git — lịch sử thay đổi = audit trail
- Khi requirements thay đổi: update plan file TRƯỚC khi code
- Sau khi DONE: giữ lại plan file để reference
