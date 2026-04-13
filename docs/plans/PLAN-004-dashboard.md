# PLAN-004: Dashboard Endpoint

**Status**: DONE

## Context

The most complex backend plan — computes all analytics from mock orders data in a single protected endpoint.

**Endpoint**: `GET /dashboard` (access token required)

**Response shape**:
```json
{
  "stats": {
    "today":      { "revenue": number, "orders": number },
    "last_week":  { "revenue": number, "orders": number },
    "last_month": { "revenue": number, "orders": number }
  },
  "sales_overview": {
    "weekly": [ { "label": "today", "revenue": number }, ...7 items ],
    "yearly": [ { "label": "this month", "revenue": number }, ...12 items ]
  },
  "bestsellers": [
    { "name": string, "price": number, "units_sold": number, "revenue": number }
  ]
}
```

**Rules from api-spec.md clarifications**:
- Timezone: server local timezone — all date comparisons use local date
- `stats.today.revenue` === `sales_overview.weekly[0].revenue` (same computation)
- Bestsellers: all-time, top 5 by revenue, sorted descending
- Weekly labels: `"today"`, `"yesterday"`, `"day 3"` ... `"day 7"` (index 0 = today)
- Yearly labels: `"this month"`, `"last month"`, then `"MMM"` (e.g. `"Feb"`) for older months

**Functions must stay ≤ 30 lines — split into focused helpers.**

## Tasks

### Task 1: Create `dashboard.service.ts`

Split into 5 focused helpers + 1 main export:

```typescript
// backend/src/dashboard/dashboard.service.ts

import { orders } from "../data/orders.js";
import { products } from "../data/products.js";
import type { DashboardResponse, StatsBlock, SalesDataPoint, Bestseller } from "../types/index.js";

// ─── Date helpers ─────────────────────────────────────────────────────────────

function toLocalDate(iso: string): Date {
  return new Date(iso);
}

function sameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function daysBeforeToday(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function computeStats(): DashboardResponse["stats"] {
  const now = new Date();
  const weekAgo = daysBeforeToday(7);
  const monthAgo = daysBeforeToday(30);

  const reduce = (filter: (d: Date) => boolean): StatsBlock =>
    orders.reduce(
      (acc, o) => {
        const d = toLocalDate(o.createdAt);
        if (!filter(d)) return acc;
        return { revenue: acc.revenue + o.total, orders: acc.orders + 1 };
      },
      { revenue: 0, orders: 0 }
    );

  return {
    today:      reduce((d) => sameLocalDay(d, now)),
    last_week:  reduce((d) => d >= weekAgo),
    last_month: reduce((d) => d >= monthAgo),
  };
}

// ─── Weekly chart (last 7 days, index 0 = today) ─────────────────────────────

function computeWeekly(): SalesDataPoint[] {
  return Array.from({ length: 7 }, (_, i) => {
    const target = daysBeforeToday(i);
    const revenue = orders
      .filter((o) => sameLocalDay(toLocalDate(o.createdAt), target))
      .reduce((sum, o) => sum + o.total, 0);

    const label = i === 0 ? "today" : i === 1 ? "yesterday" : `day ${i + 1}`;
    return { label, revenue: Math.round(revenue * 100) / 100 };
  });
}

// ─── Yearly chart (last 12 months, index 0 = current month) ──────────────────

function computeYearly(): SalesDataPoint[] {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const target = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const revenue = orders
      .filter((o) => {
        const d = toLocalDate(o.createdAt);
        return d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth();
      })
      .reduce((sum, o) => sum + o.total, 0);

    const label =
      i === 0 ? "this month" :
      i === 1 ? "last month" :
      target.toLocaleString("en-US", { month: "short" });
    return { label, revenue: Math.round(revenue * 100) / 100 };
  });
}

// ─── Bestsellers (all-time, top 5 by revenue) ─────────────────────────────────

function computeBestsellers(): Bestseller[] {
  const map = new Map<string, { units_sold: number; revenue: number }>();

  for (const order of orders) {
    for (const item of order.items) {
      const existing = map.get(item.productId) ?? { units_sold: 0, revenue: 0 };
      map.set(item.productId, {
        units_sold: existing.units_sold + item.quantity,
        revenue: Math.round((existing.revenue + item.subtotal) * 100) / 100,
      });
    }
  }

  return Array.from(map.entries())
    .map(([productId, agg]) => {
      const product = products.find((p) => p.id === productId);
      return { name: product?.name ?? productId, price: product?.price ?? 0, ...agg };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function getDashboard(): DashboardResponse {
  return {
    stats: computeStats(),
    sales_overview: { weekly: computeWeekly(), yearly: computeYearly() },
    bestsellers: computeBestsellers(),
  };
}
```

**Files**: `backend/src/dashboard/dashboard.service.ts`

---

### Task 2: Create `dashboard.router.ts`

```typescript
// backend/src/dashboard/dashboard.router.ts

import { Router, Request, Response } from "express";
import { verifyAccessToken } from "../auth/auth.middleware.js";
import { getDashboard } from "./dashboard.service.js";

const router = Router();

// GET /dashboard (protected)
router.get("/", verifyAccessToken, (_req: Request, res: Response) => {
  res.status(200).json(getDashboard());
});

export { router as dashboardRouter };
```

**Files**: `backend/src/dashboard/dashboard.router.ts`

---

### Task 3: Mount router in `app.ts`

```typescript
import { dashboardRouter } from "./dashboard/dashboard.router.js";
// ...
app.use("/dashboard", dashboardRouter);
```

**Files**: `backend/src/app.ts`

## Verification

```bash
# Login first, grab access token
TOKEN=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"freddy@halloween.shop","password":"ElmStreet2019"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

# Fetch dashboard
curl -s http://localhost:3001/dashboard \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

# Manual checks:
# ✓ stats.today.revenue === sales_overview.weekly[0].revenue
# ✓ sales_overview.weekly has 7 items, index 0 label = "today"
# ✓ sales_overview.yearly has 12 items, index 0 label = "this month"
# ✓ bestsellers has 5 items, sorted by revenue descending
# ✓ 401 without token
```

## Task dependency graph

```
Task 1 (dashboard.service.ts) → Task 2 (dashboard.router.ts) → Task 3 (mount in app.ts)
```
