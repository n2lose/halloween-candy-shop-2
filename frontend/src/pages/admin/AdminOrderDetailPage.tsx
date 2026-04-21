import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminOrder, updateOrderStatus } from "../../api/admin";
import type { Order, OrderStatus } from "../../types/index";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

const STATUSES: OrderStatus[] = ["processing", "shipped", "delivered"];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    if (!id) return;
    getAdminOrder(id)
      .then(r => setOrder(r.data))
      .catch(() => setError("Order not found or access denied."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (status: OrderStatus) => {
    if (!order) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await updateOrderStatus(order.orderId, status);
      setOrder(res.data);
      setSaveMsg("Saved");
      setTimeout(() => setSaveMsg(""), 2000);
    } catch {
      setSaveMsg("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;
  if (error || !order) return <EmptyState icon="⚠️" title="Order not found" description={error} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-2 text-sm font-label text-secondary/60 hover:text-primary transition-colors mb-3"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Orders
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-headline italic font-bold text-on-surface">{order.orderId}</h1>
            <Badge status={order.status} />
          </div>
          <p className="text-sm font-label text-secondary/40 mt-1">{fmtDate(order.createdAt)}</p>
        </div>

        {/* Status change */}
        <div className="flex items-center gap-3">
          {saveMsg && (
            <span className={`text-xs font-label ${saveMsg === "Saved" ? "text-tertiary" : "text-error"}`}>
              {saveMsg}
            </span>
          )}
          {saving && <Spinner size="sm" />}
          <select
            value={order.status}
            onChange={e => handleStatusChange(e.target.value as OrderStatus)}
            disabled={saving}
            className="bg-surface-container-high border-none rounded-xl px-4 py-2.5 text-sm font-label
                       text-on-surface focus:ring-1 focus:ring-primary/40 outline-none cursor-pointer
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items — wide */}
        <div className="lg:col-span-2">
          <Card padding="lg">
            <h2 className="text-lg font-headline italic font-bold mb-5">Items</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["Product", "Qty", "Unit Price", "Subtotal"].map(c => (
                    <th key={c} className="text-left pb-3 text-xs font-label uppercase tracking-widest text-secondary/40 font-medium">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-white/[0.03]">
                    <td className="py-3 font-label text-on-surface/90">{item.name}</td>
                    <td className="py-3 font-label text-secondary/60">×{item.quantity}</td>
                    <td className="py-3 font-label text-secondary/60">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-3 font-label font-semibold text-on-surface">${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4 pt-4 border-t border-white/5">
              <div className="text-right">
                <p className="text-xs font-label text-secondary/40 uppercase tracking-wider">Total Offering</p>
                <p className="text-2xl font-headline italic font-bold text-primary">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <Card padding="md">
            <h3 className="text-sm font-label uppercase tracking-widest text-secondary/40 mb-4">Shipping Ritual</h3>
            <div className="space-y-2 text-sm font-label">
              <p className="font-semibold text-on-surface">{order.shipping.name}</p>
              <p className="text-secondary/60">{order.shipping.email}</p>
              <p className="text-secondary/60">{order.shipping.address}</p>
            </div>
          </Card>

          <Card padding="md">
            <h3 className="text-sm font-label uppercase tracking-widest text-secondary/40 mb-4">Payment Incantation</h3>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary/40">credit_card</span>
              <div>
                <p className="text-sm font-label text-on-surface">•••• {order.payment.last4}</p>
                <p className="text-xs font-label text-tertiary capitalize">{order.payment.status}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
