import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrder } from "../../api/orders";
import type { Order } from "../../types/index";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";

export default function CustomerOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getOrder(id)
      .then(r => setOrder(r.data))
      .catch(() => setError("Order not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;
  if (error || !order) return (
    <div className="px-8 py-12">
      <EmptyState icon="⚠️" title="Order not found" description={error} />
    </div>
  );

  return (
    <div className="px-8 py-12 max-w-5xl mx-auto space-y-8">
      <div>
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-sm font-label text-secondary/60 hover:text-primary transition-colors mb-4"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to My Orders
        </button>
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-headline italic font-bold text-on-surface">{order.orderId}</h1>
          <Badge status={order.status} />
        </div>
        <p className="text-sm font-label text-secondary/40 mt-1">
          {new Date(order.createdAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card padding="lg">
            <h2 className="text-lg font-headline italic font-bold mb-5">Your Confections</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["Item", "Qty", "Unit Price", "Subtotal"].map(c => (
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
              <p className="text-2xl font-headline italic font-bold text-primary">${order.total.toFixed(2)}</p>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card padding="md">
            <h3 className="text-sm font-label uppercase tracking-widest text-secondary/40 mb-4">Delivered To</h3>
            <div className="space-y-1 text-sm font-label">
              <p className="font-semibold text-on-surface">{order.shipping.name}</p>
              <p className="text-secondary/60">{order.shipping.email}</p>
              <p className="text-secondary/60">{order.shipping.address}</p>
            </div>
          </Card>
          <Card padding="md">
            <h3 className="text-sm font-label uppercase tracking-widest text-secondary/40 mb-4">Payment</h3>
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
