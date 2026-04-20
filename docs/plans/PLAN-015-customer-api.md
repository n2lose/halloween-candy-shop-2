# PLAN-015: Customer API — Products, Stripe, Orders

**Status**: IN PROGRESS

## Context

Migrate remaining customer-facing endpoints to new architecture.
Replace in-memory `data/products.ts` + `data/orders.ts` with repositories.
Delete all old feature folders (products/, orders/, stripe/).

**Dependencies**: PLAN-014 DONE (repositories + admin routes working).

---

## Tasks

- [x] Task 1: `services/stripe.service.ts` — use ProductRepository, keep lazy Stripe init
- [x] Task 2: `services/orders.service.ts` — stock validation + OrderRepository
- [x] Task 3: `controllers/products.controller.ts` + `routes/products.routes.ts` (public)
- [x] Task 4: `controllers/customer.controller.ts` + `routes/customer.routes.ts` (protected)
- [x] Task 5: Update `orderRepository.listByUserId` — search by orderId + item name
- [x] Task 6: app.ts — replace old routers with new routes
- [x] Task 7: Delete products/, orders/, stripe/, data/products.ts, data/orders.ts

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| GET    | /products | public |
| GET    | /products/:id | public |
| POST   | /stripe/create-payment-intent | verifyAccessToken |
| POST   | /orders | verifyAccessToken |
| GET    | /orders | verifyAccessToken |
| GET    | /orders/:id | verifyAccessToken |

## Verification

```bash
curl http://localhost:3001/products
curl http://localhost:3001/products/prod_1
# Orders require token — tested in smoke test
```
