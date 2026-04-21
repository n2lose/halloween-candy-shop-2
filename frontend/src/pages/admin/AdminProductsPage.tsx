import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { getProducts } from "../../api/products";
import { createProduct, updateProduct, deleteProduct } from "../../api/admin";
import type { Product } from "../../types/index";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Card from "../../components/ui/Card";

// ─── Modal ────────────────────────────────────────────────────────────────────

type ModalField = { label: string; key: "name" | "price" | "stock"; type: string; placeholder: string };
const FIELDS: ModalField[] = [
  { label: "Product Name", key: "name",  type: "text",   placeholder: "Pumpkin Spice Lollipop" },
  { label: "Price ($)",    key: "price", type: "number", placeholder: "2.99" },
  { label: "Stock",        key: "stock", type: "number", placeholder: "100" },
];

type FormValues = { name: string; price: string; stock: string };
const EMPTY_FORM: FormValues = { name: "", price: "", stock: "" };

function productToForm(p: Product): FormValues {
  return { name: p.name, price: String(p.price), stock: String(p.stock) };
}

interface ProductModalProps {
  mode: "create" | "edit";
  initial?: FormValues;
  onSave: (values: FormValues) => Promise<void>;
  onClose: () => void;
}

function ProductModal({ mode, initial = EMPTY_FORM, onSave, onClose }: ProductModalProps) {
  const [form, setForm] = useState<FormValues>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave(form);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface-container rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-headline italic font-bold text-on-surface mb-6">
          {mode === "create" ? "New Batch" : "Edit Confection"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {FIELDS.map(({ label, key, type, placeholder }) => (
            <div key={key} className="group/input">
              <label className="block font-label text-xs uppercase tracking-widest text-secondary mb-2 transition-colors group-focus-within/input:text-primary">
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                required
                min={type === "number" ? 0 : undefined}
                step={key === "price" ? "0.01" : key === "stock" ? "1" : undefined}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full bg-surface-container-lowest rounded-lg py-3 px-4 text-on-surface
                           placeholder:text-outline/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all"
              />
            </div>
          ))}
          {error && <p className="text-sm text-error">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-surface-container-high text-secondary font-label font-semibold
                         hover:text-on-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed
                         font-bold font-label rounded-xl shadow-[0_4px_20px_rgba(255,183,131,0.2)]
                         hover:shadow-[0_8px_30px_rgba(255,183,131,0.35)] active:scale-[0.98]
                         transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? <><Spinner size="sm" /><span>Saving...</span></> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteModalProps {
  product: Product;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

function DeleteModal({ product, onConfirm, onClose }: DeleteModalProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setDeleting(true);
    setError("");
    try {
      await onConfirm();
    } catch {
      setError("Failed to delete. Try again.");
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-surface-container rounded-2xl p-8 shadow-2xl text-center">
        <span className="text-4xl mb-4 block">🗑️</span>
        <h2 className="text-xl font-headline italic font-bold text-on-surface mb-2">Delete Confection?</h2>
        <p className="text-sm font-label text-secondary/60 mb-6">
          <span className="text-on-surface font-semibold">{product.name}</span> will be removed permanently.
        </p>
        {error && <p className="text-sm text-error mb-4">{error}</p>}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-surface-container-high text-secondary font-label font-semibold
                       hover:text-on-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 py-3 bg-error text-on-error font-bold font-label rounded-xl
                       hover:opacity-90 active:scale-[0.98] transition-all
                       disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {deleting ? <><Spinner size="sm" /><span>Deleting...</span></> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; product: Product }
  | { type: "delete"; product: Product };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ type: "none" });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const r = await getProducts();
      setProducts(r.data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchProducts(); }, [fetchProducts]);

  const handleCreate = async (form: FormValues) => {
    await createProduct({ name: form.name, price: Number(form.price), stock: Number(form.stock) });
    setModal({ type: "none" });
    await fetchProducts();
  };

  const handleEdit = async (form: FormValues) => {
    if (modal.type !== "edit") return;
    await updateProduct(modal.product.id, { name: form.name, price: Number(form.price), stock: Number(form.stock) });
    setModal({ type: "none" });
    await fetchProducts();
  };

  const handleDelete = async () => {
    if (modal.type !== "delete") return;
    await deleteProduct(modal.product.id);
    setModal({ type: "none" });
    await fetchProducts();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-label text-xs uppercase tracking-widest text-secondary/40">Command Center</p>
            <h1 className="text-4xl font-headline italic font-bold text-on-surface mt-1">Inventory</h1>
          </div>
          <button
            onClick={() => setModal({ type: "create" })}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container
                       text-on-primary-fixed text-sm font-bold font-label rounded-xl
                       shadow-[0_4px_20px_rgba(255,183,131,0.2)] hover:shadow-[0_8px_30px_rgba(255,183,131,0.35)]
                       active:scale-[0.98] transition-all"
          >
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
                    <td className="py-4">
                      {p.imageUrl
                        ? <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        : <span className="text-2xl">🍬</span>
                      }
                    </td>
                    <td className="py-4 font-label text-secondary/80">${p.price.toFixed(2)}</td>
                    <td className="py-4">
                      <span className={`font-label text-sm font-semibold ${p.stock > 10 ? "text-tertiary" : p.stock > 0 ? "text-primary" : "text-error"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setModal({ type: "edit", product: p })}
                          className="material-symbols-outlined text-secondary hover:text-primary transition-colors text-xl"
                        >
                          edit
                        </button>
                        <button
                          onClick={() => setModal({ type: "delete", product: p })}
                          className="material-symbols-outlined text-secondary hover:text-error transition-colors text-xl"
                        >
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

      {modal.type === "create" && (
        <ProductModal mode="create" onSave={handleCreate} onClose={() => setModal({ type: "none" })} />
      )}
      {modal.type === "edit" && (
        <ProductModal
          mode="edit"
          initial={productToForm(modal.product)}
          onSave={handleEdit}
          onClose={() => setModal({ type: "none" })}
        />
      )}
      {modal.type === "delete" && (
        <DeleteModal
          product={modal.product}
          onConfirm={handleDelete}
          onClose={() => setModal({ type: "none" })}
        />
      )}
    </>
  );
}
