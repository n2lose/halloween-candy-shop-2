import { useEffect, useState } from "react";
import { getDashboard } from "../../api/dashboard";
import type { DashboardData } from "../../types/index";
import StatCard from "../../components/ui/StatCard";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import RevenueChart from "../../components/dashboard/RevenueChart";
import BestsellersTable from "../../components/dashboard/BestsellersTable";

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then(r => setData(r.data))
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  );

  if (error || !data) return (
    <EmptyState icon="⚠️" title="Could not load dashboard" description={error} />
  );

  return (
    <div className="space-y-10">
      {/* Page header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-headline italic font-bold text-on-surface tracking-tight">
          Atelier Command Dashboard
        </h1>
        <p className="font-label text-secondary/60">
          Midnight Cycle Status: <span className="text-tertiary">All Spells Active</span>
        </p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Today"
          revenue={data.stats.today.revenue}
          orders={data.stats.today.orders}
          trend="+14.2% from yesterday"
          trendPositive
        />
        <StatCard
          label="Last Week"
          revenue={data.stats.last_week.revenue}
          orders={data.stats.last_week.orders}
        />
        <StatCard
          label="Last Month"
          revenue={data.stats.last_month.revenue}
          orders={data.stats.last_month.orders}
        />
      </div>

      {/* Revenue chart */}
      <RevenueChart
        weekly={data.sales_overview.weekly}
        yearly={data.sales_overview.yearly}
      />

      {/* Bestsellers */}
      <BestsellersTable items={data.bestsellers} />
    </div>
  );
}
