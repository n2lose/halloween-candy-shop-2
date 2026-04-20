# PLAN-012: Backend Refactor — SQLite Foundation + Repositories

**Status**: DONE

## Context

Full backend refactor: replace in-memory arrays with SQLite (better-sqlite3).
Introduces Controller/Service/Repository architecture and role-based user model.

**Dependencies**: PLAN-006 DONE (existing tests will be rewritten in PLAN-016).

---

## Schema (finalized)

- `price REAL` (dollars, not cents)
- `emoji` removed from products
- `order_items.name` snapshot included
- `payment_last4` kept in orders
- Stock: validate only (no decrement)
- Status transitions: free-form

---

## Tasks

- [x] Task 1: Install better-sqlite3
- [x] Task 2: db/sqlite.ts — singleton + PRAGMA
- [x] Task 3: db/schema.ts — CREATE TABLE IF NOT EXISTS
- [x] Task 4: db/seed.ts — admin + customer + 10 products + 30 orders
- [x] Task 5: repositories/ — UserRepository, ProductRepository, OrderRepository
- [x] Task 6: types/index.ts — add role, remove emoji, userId → string
- [x] Task 7: app.ts — call initDb() + seedDb() at startup

## Verification

```bash
cd backend && npm run dev
# Server starts, DB created, seed runs
curl http://localhost:3001/products
# Returns 10 products (no emoji)
```
