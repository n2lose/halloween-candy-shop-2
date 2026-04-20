# PLAN-020: Customer Orders

**Status**: DONE  
**Branch**: `feat/PLAN-017-auth-layouts`  
**Completed**: 2026-04-20

---

## Context

Customer order history and order detail, protected by auth.  
**Design reference**: Adapted from admin orders design — no separate Stitch screen for customer orders.

---

## Tasks

- [x] Task 1: `pages/storefront/CustomerOrdersPage.tsx` — paginated order table (Order ID, Date, Total, Status badge), search, click-to-detail
- [x] Task 2: `pages/storefront/CustomerOrderDetailPage.tsx` — items table + shipping card + payment card (read-only, no status change)

## API mapping

| Page | Endpoint |
|------|----------|
| Orders list | `GET /orders?page=N&q=query` |
| Order detail | `GET /orders/:id` (403 if not owner) |

## Notes

- No status change action (customer is read-only)
- Search scoped to user's own orders via backend
- Same pagination pattern as admin orders (setLoading in handlers, not in effect)
