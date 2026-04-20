import { useEffect, useState } from "react";
import { getProducts } from "../../api/products";
import type { Product } from "../../types/index";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Card from "../../components/ui/Card";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(r => setProducts(r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-label text-xs uppercase tracking-widest text-secondary/40">Command Center</p>
          <h1 className="text-4xl font-headline italic font-bold text-on-surface mt-1">Inventory</h1>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container
                           text-on-primary-fixed text-sm font-bold font-label rounded-xl
                           shadow-[0_4px_20px_rgba(255,183,131,0.2)] hover:shadow-[0_8px_30px_rgba(255,183,131,0.35)]
                           active:scale-[0.98] transition-all">
          <span className="material-symbols-outlined text-base">add</span>
          New Batch
        </button>
      </div>

      {products.length === 0 ? (
        <EmptyState icon="🧪" title="No products found" />
      ) : (
        <Card padding="lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["#", "Product", "Emoji", "Price", "Stock", "Actions"].map(c => (
                  <th key={c} className="text-left pb-3 font-label text-xs uppercase tracking-widest text-secondary/40 font-medium">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} className="border-b border-white/[0.03] hover:bg-surface-container-highest/40 transition-colors group">
                  <td className="py-4 text-secondary/30 font-label text-xs">{i + 1}</td>
                  <td className="py-4 font-headline italic font-semibold text-on-surface">{p.name}</td>
                  <td className="py-4 text-2xl">{p.emoji}</td>
                  <td className="py-4 font-label text-secondary/80">${p.price.toFixed(2)}</td>
                  <td className="py-4">
                    <span className={`font-label text-sm font-semibold ${p.stock > 10 ? "text-tertiary" : p.stock > 0 ? "text-primary" : "text-error"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="material-symbols-outlined text-secondary hover:text-primary transition-colors text-xl">
                        edit
                      </button>
                      <button className="material-symbols-outlined text-secondary hover:text-error transition-colors text-xl">
                        delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
