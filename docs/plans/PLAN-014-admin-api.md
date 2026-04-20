# PLAN-014: Admin API

**Status**: IN PROGRESS

## Context

Implement all `/admin/*` endpoints protected by `verifyAccessToken + requireRole("admin")`.
Uses repositories directly in services. Follows Controller/Service/Repository pattern
established in PLAN-013.

**Dependencies**: PLAN-013 DONE (middleware + repositories available).

---

## Tasks

- [x] Task 1: `services/dashboard.service.ts` — migrate from SQLite via OrderRepository
- [x] Task 2: `controllers/admin.dashboard.controller.ts` + `routes/admin.routes.ts` (GET /admin/dashboard)
- [x] Task 3: Admin orders — GET /admin/orders, GET /admin/orders/:id, PATCH /admin/orders/:id/status
- [x] Task 4: Admin products — POST/PUT/DELETE /admin/products
- [x] Task 5: Mount /admin router in app.ts, delete old dashboard/ folder

## Endpoints

| Method | Path | Guard |
|--------|------|-------|
| GET    | /admin/dashboard | admin |
| GET    | /admin/orders | admin |
| GET    | /admin/orders/:id | admin |
| PATCH  | /admin/orders/:id/status | admin |
| POST   | /admin/products | admin |
| PUT    | /admin/products/:id | admin |
| DELETE | /admin/products/:id | admin |

## Verification

```bash
# Login as admin, get token
TOKEN=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@halloween.shop","password":"Halloween2024!"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

curl -s http://localhost:3001/admin/dashboard -H "Authorization: Bearer $TOKEN"
curl -s "http://localhost:3001/admin/orders?page=1" -H "Authorization: Bearer $TOKEN"
curl -s http://localhost:3001/admin/orders/ORD-0001 -H "Authorization: Bearer $TOKEN"
curl -s -X PATCH http://localhost:3001/admin/orders/ORD-0001/status \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"status":"shipped"}'
curl -s -X POST http://localhost:3001/admin/products \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Test Candy","price":1.99,"stock":50}'
```
