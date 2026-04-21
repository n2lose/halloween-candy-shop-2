import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getOrders } from "../../api/orders";
import type { PaginatedOrders, OrderSummary } from "../../types/index";
import Badge from "../../components/ui/Badge";
import Pagination from "../../components/ui/Pagination";
import SearchBar from "../../components/ui/SearchBar";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function CustomerOrdersPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const [result, setResult] = useState<PaginatedOrders | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [page, setPage] = useState(() => {
    const raw = parseInt(params.get("page") ?? "", 10);
    return Number.isFinite(raw) && raw > 0 ? raw : 1;
  });

  useEffect(() => {
    let cancelled = false;
    getOrders(page, search)
      .then(r => { if (!cancelled) setResult(r.data); })
      .catch(() => { if (!cancelled) setResult(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page, search]);

  const handleSearch = (v: string) => {
    setLoading(true);
    setSearch(v);
    setPage(1);
    setParams(v ? { q: v } : {});
  };

  const handlePage = (p: number) => {
    setLoading(true);
    setPage(p);
    setParams(search ? { q: search, page: String(p) } : { page: String(p) });
  };

  return (
    <div className="px-8 py-12 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-headline italic font-bold text-on-surface">My Orders</h1>
        <SearchBar value={search} onChange={handleSearch} placeholder="Search by order ID or product..." className="w-72" />
      </div>

      <div className="bg-surface-container-high rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
        ) : !result || result.orders.length === 0 ? (
          <EmptyState icon="📜" title="No orders yet" description="Your manifestations will appear here." />
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-surface-container-lowest">
                <tr>
                  {["Order ID", "Date", "Total", "Status", ""].map(c => (
                    <th key={c} className="text-left px-6 py-4 font-label text-xs uppercase tracking-widest text-secondary/40 font-medium">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.orders.map((order: OrderSummary) => (
                  <tr
                    key={order.orderId}
                    onClick={() => navigate(`/orders/${order.orderId}`)}
                    className="border-t border-white/[0.04] hover:bg-surface-container-highest/60 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-primary font-label">{order.orderId}</td>
                    <td className="px-6 py-4 font-label text-secondary/60">{fmtDate(order.createdAt)}</td>
                    <td className="px-6 py-4 font-label font-semibold text-on-surface">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4"><Badge status={order.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <span className="material-symbols-outlined text-secondary/20 group-hover:text-secondary/60 transition-colors text-xl">
                        arrow_forward_ios
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 pb-6">
              <Pagination page={page} totalPages={result.total_pages} onPageChange={handlePage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
