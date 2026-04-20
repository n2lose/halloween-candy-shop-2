# PLAN-018: Admin Pages

**Status**: DONE  
**Branch**: `feat/PLAN-017-auth-layouts` (implemented together)  
**Completed**: 2026-04-20

---

## Context

Admin-facing pages wrapped in `AdminLayout`. Data wired to `/admin/*` endpoints from PLAN-014.

**Design reference**: `docs/designs/stitch/full_dashboard_the_haunted_atelier/`, `full_orders_the_haunted_atelier_1/`

---

## Tasks

- [x] Task 1: `components/dashboard/RevenueChart.tsx` — Recharts BarChart, weekly/yearly toggle, custom tooltip, orange bars
- [x] Task 2: `components/dashboard/BestsellersTable.tsx` — top 5 products, revenue in tertiary color
- [x] Task 3: `pages/admin/AdminDashboardPage.tsx` — 3 StatCards (Today/Week/Month) + RevenueChart + BestsellersTable
- [x] Task 4: `pages/admin/AdminOrdersPage.tsx` — table with customer avatar, date, total, Badge status, click-to-detail, search + pagination
- [x] Task 5: `pages/admin/AdminOrderDetailPage.tsx` — items table, shipping card, payment card, status `<select>` (PATCH wiring TODO)
- [x] Task 6: `pages/admin/AdminProductsPage.tsx` — read-only inventory table, stock color-coded (green/orange/red), edit/delete icons (modal TODO)

## API mapping

| Page | Endpoint |
|------|----------|
| Dashboard | `GET /admin/dashboard` |
| Orders list | `GET /admin/orders?page=N&q=query` |
| Order detail | `GET /admin/orders/:id` |
| Products | `GET /products` (public endpoint — no admin products list endpoint) |

## Design decisions vs Stitch

| Stitch shows | Implemented |
|---|---|
| 4 stat cards (Souls, Batches, Revenue, Stock) | 3 stat cards (Today/Week/Month from API) |
| Hourly chart (20:00–04:00) | Weekly/Yearly toggle (per spec) |
| Bulk actions (Export CSV, Print Labels) | Removed — no API support |
| Status/Customer/Timeframe filters | Simplified to SearchBar only |
| "IN TRANSIT" status | Not implemented — API has processing/shipped/delivered |
| Essence Breakdown, Retention donut | Removed — no API support |

## Remaining TODO

- [ ] Wire `PATCH /admin/orders/:id/status` in `AdminOrderDetailPage` status dropdown
- [ ] Admin Products CRUD: create modal, edit modal, delete confirm dialog (`POST/PUT/DELETE /admin/products`)
