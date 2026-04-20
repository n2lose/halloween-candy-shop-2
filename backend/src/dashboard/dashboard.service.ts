import { orders } from "../data/orders.js";
import { products } from "../data/products.js";
import type { DashboardResponse, StatsBlock, SalesDataPoint, Bestseller } from "../types/index.js";

// ─── Date helpers ─────────────────────────────────────────────────────────────

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
        const d = new Date(o.createdAt);
        if (!filter(d)) return acc;
        return { revenue: Math.round((acc.revenue + o.total) * 100) / 100, orders: acc.orders + 1 };
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
      .filter((o) => sameLocalDay(new Date(o.createdAt), target))
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
        const d = new Date(o.createdAt);
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

// ─── Bestsellers (all-time, top 5 by revenue) ────────────────────────────────

function computeBestsellers(): Bestseller[] {
  const map = new Map<string, { units_sold: number; revenue: number }>();

  for (const order of orders) {
    for (const item of order.items) {
      const prev = map.get(item.productId) ?? { units_sold: 0, revenue: 0 };
      map.set(item.productId, {
        units_sold: prev.units_sold + item.quantity,
        revenue: Math.round((prev.revenue + item.subtotal) * 100) / 100,
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
