# PLAN-016: Integration Tests — Rewrite for SQLite + Roles

**Status**: DONE

## Context

Sprint 1 tests (42 tests) were written for in-memory arrays. After the SQLite refactor (PLAN-012–015),
all tests are broken: routes changed, mock paths changed, products lost emoji, dashboard moved to
`/admin/dashboard`, Freddy is now `usr_2` not `usr_1`, duplicate-order returns 409 not 400.

Goal: make all tests pass on a fresh `:memory:` SQLite DB (no file I/O, fully isolated).

**Dependencies**: PLAN-015 DONE (all routes in place).

---

## Strategy

- `sqlite.ts` reads `DATABASE_PATH` env var; tests set it to `:memory:` via `jest.setup.ts`
- Each Jest worker gets a fresh process → fresh `:memory:` DB → seed runs once per file
- No test file touches the file-based DB

---

## Tasks

- [x] Task 1: `sqlite.ts` — support `DATABASE_PATH` env var
- [x] Task 2: `jest.setup.ts` (new) — set `DATABASE_PATH=:memory:`
- [x] Task 3: `jest.config.ts` — add `setupFiles: ["./jest.setup.ts"]`
- [x] Task 4: `auth.test.ts` — fix `usr_1` → `usr_2` for Freddy; add `role` to `/me` check
- [x] Task 5: `dashboard.test.ts` — `/dashboard` → `/admin/dashboard`; admin token
- [x] Task 6: `products.test.ts` — remove `emoji` field check
- [x] Task 7: `orders.test.ts` — fix mock path; fix customer-name search; 400→409 for duplicate
- [x] Task 8: `admin.test.ts` (new) — dashboard, orders, status update, product CRUD

---

## Test Count Target

| File | Tests |
|------|-------|
| auth.test.ts | 11 |
| dashboard.test.ts | 6 |
| products.test.ts | 5 |
| stripe.test.ts | 5 |
| orders.test.ts | 9 |
| admin.test.ts | 14 |
| **Total** | **50** |
