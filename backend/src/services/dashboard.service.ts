import db from "../db/sqlite.js";
import type { DashboardResponse, StatsBlock, SalesDataPoint, Bestseller } from "../types/index.js";

interface OrderRow    { total: number; created_at: string; }
interface BestsellerRow { name: string; price: number; units_sold: number; revenue: number; }

function sameLocalDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
}

function daysBeforeToday(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

const stmts = {
  allOrders: db.prepare("SELECT total, created_at FROM orders ORDER BY created_at"),
  bestsellers: db.prepare(`
    SELECT oi.name,
           p.price,
           SUM(oi.quantity)                       AS units_sold,
           ROUND(SUM(oi.quantity * oi.price), 2)  AS revenue
    FROM   order_items oi
    JOIN   products p ON p.id = oi.product_id
    GROUP  BY oi.product_id, oi.name
    ORDER  BY revenue DESC
    LIMIT  5
  `),
};

function computeStats(orders: OrderRow[]): DashboardResponse["stats"] {
  const now      = new Date();
  const weekAgo  = daysBeforeToday(7);
  const monthAgo = daysBeforeToday(30);

  const reduce = (filter: (d: Date) => boolean): StatsBlock =>
    orders.reduce((acc, o) => {
      if (!filter(new Date(o.created_at))) return acc;
      return { revenue: Math.round((acc.revenue + o.total) * 100) / 100, orders: acc.orders + 1 };
    }, { revenue: 0, orders: 0 });

  return {
    today:      reduce((d) => sameLocalDay(d, now)),
    last_week:  reduce((d) => d >= weekAgo),
    last_month: reduce((d) => d >= monthAgo),
  };
}

function computeWeekly(orders: OrderRow[]): SalesDataPoint[] {
  return Array.from({ length: 7 }, (_, i) => {
    const target  = daysBeforeToday(i);
    const revenue = orders
      .filter((o) => sameLocalDay(new Date(o.created_at), target))
      .reduce((sum, o) => sum + o.total, 0);
    const label = i === 0 ? "today" : i === 1 ? "yesterday" : `day ${i + 1}`;
    return { label, revenue: Math.round(revenue * 100) / 100 };
  });
}

function computeYearly(orders: OrderRow[]): SalesDataPoint[] {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const target  = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const revenue = orders
      .filter((o) => {
        const d = new Date(o.created_at);
        return d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth();
      })
      .reduce((sum, o) => sum + o.total, 0);
    const label = i === 0 ? "this month" : i === 1 ? "last month"
                : target.toLocaleString("en-US", { month: "short" });
    return { label, revenue: Math.round(revenue * 100) / 100 };
  });
}

export function getDashboard(): DashboardResponse {
  const orders      = stmts.allOrders.all()    as OrderRow[];
  const bestsellers = stmts.bestsellers.all()  as BestsellerRow[];
  return {
    stats:          computeStats(orders),
    sales_overview: { weekly: computeWeekly(orders), yearly: computeYearly(orders) },
    bestsellers:    bestsellers as Bestseller[],
  };
}
