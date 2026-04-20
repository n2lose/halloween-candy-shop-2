type StatCardProps = {
  label: string;
  revenue: number;
  orders: number;
  trend?: string;
  trendPositive?: boolean;
};

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function StatCard({ label, revenue, orders, trend, trendPositive }: StatCardProps) {
  return (
    <div className="bg-surface-container-high p-6 rounded-xl relative overflow-hidden group">
      <p className="text-xs font-label uppercase tracking-widest text-secondary/60 mb-1">{label}</p>
      <h3 className="text-3xl font-headline font-bold italic text-primary">{fmt(revenue)}</h3>
      <p className="text-sm text-on-surface/60 mt-1">{orders.toLocaleString()} orders</p>
      {trend && (
        <p className={`text-xs mt-2 flex items-center gap-1 ${trendPositive ? "text-tertiary" : "text-error"}`}>
          <span className="material-symbols-outlined text-xs">{trendPositive ? "trending_up" : "trending_down"}</span>
          {trend}
        </p>
      )}
      <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <span className="material-symbols-outlined text-8xl">payments</span>
      </div>
    </div>
  );
}
