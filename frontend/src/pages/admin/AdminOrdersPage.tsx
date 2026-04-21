import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAdminOrders } from "../../api/admin";
import type { AdminOrderSummary, PaginatedOrders } from "../../types/index";
import Badge from "../../components/ui/Badge";
import Pagination from "../../components/ui/Pagination";
import SearchBar from "../../components/ui/SearchBar";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const [result, setResult] = useState<PaginatedOrders<AdminOrderSummary> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [page, setPage] = useState(() => {
    const raw = parseInt(params.get("page") ?? "", 10);
    return Number.isFinite(raw) && raw > 0 ? raw : 1;
  });

  // Fetch runs when page/search changes; setLoading(true) is set in handlers (not in effect)
  useEffect(() => {
    let cancelled = false;
    getAdminOrders(page, search)
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-label text-xs uppercase tracking-widest text-secondary/40">Command Center</p>
          <h1 className="text-4xl font-headline italic font-bold text-on-surface mt-1">Order Manifest</h1>
        </div>
        <div className="w-72">
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Search orders, ingredients, or spirits..."
          />
        </div>
      </div>

      {/* Stats strip */}
      {result && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Orders", value: result.total, icon: "receipt_long" },
            { label: "Pages", value: result.total_pages, icon: "pages" },
            { label: "Per Page", value: result.per_page, icon: "view_list" },
            { label: "Showing", value: result.orders.length, icon: "visibility" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-surface-container p-4 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary/40">{icon}</span>
              <div>
                <p className="text-xs font-label uppercase tracking-wider text-secondary/40">{label}</p>
                <p className="text-xl font-headline italic font-bold text-on-surface">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-surface-container-high rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
        ) : !result || result.orders.length === 0 ? (
          <EmptyState icon="📜" title="No orders found" description="Try a different search term." />
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-surface-container-lowest">
                <tr>
                  {["Order ID", "Customer", "Date", "Total", "Status", ""].map(col => (
                    <th key={col} className="text-left px-6 py-4 font-label text-xs uppercase tracking-widest text-secondary/40 font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.orders.map(order => (
                  <tr
                    key={order.orderId}
                    onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                    className="border-t border-white/[0.04] hover:bg-surface-container-highest/60 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4 font-label font-mono text-xs text-primary">{order.orderId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center text-on-primary-fixed text-[10px] font-bold flex-shrink-0">
                          {(order.customerName ?? "?")[0].toUpperCase()}
                        </div>
                        <span className="font-label text-on-surface/90">{order.customerName ?? "—"}</span>
                      </div>
                    </td>
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

            <div className="px-6 pb-6 flex items-center justify-between pt-4">
              <p className="text-xs font-label text-secondary/40">
                Showing {result.orders.length} of {result.total} orders
              </p>
              <Pagination page={page} totalPages={result.total_pages} onPageChange={handlePage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
