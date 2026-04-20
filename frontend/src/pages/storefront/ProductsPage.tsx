import { useEffect, useState } from "react";
import { getProducts } from "../../api/products";
import type { Product } from "../../types/index";
import { useCart } from "../../store/cartStore";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";

function ProductCard({ product }: { product: Product }) {
  const { addItem, items, updateQty } = useCart();

  const cartItem = items.find(i => i.productId === product.id);
  const qty = cartItem?.quantity ?? 0;
  const outOfStock = product.stock === 0;

  return (
    <div className="bg-surface-container-high rounded-xl overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300">
      {/* Product visual */}
      <div className="bg-surface-container-highest h-48 flex items-center justify-center relative">
        <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
          {product.emoji}
        </span>
        {outOfStock && (
          <div className="absolute inset-0 bg-surface/60 flex items-center justify-center">
            <span className="text-xs font-label uppercase tracking-widest text-error">Out of Stock</span>
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="absolute top-3 right-3 text-[10px] font-label uppercase tracking-wider
                           bg-primary/10 text-primary px-2 py-1 rounded-full">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-headline italic font-semibold text-on-surface leading-tight">{product.name}</h3>
        <p className="text-xl font-headline italic text-primary mt-2">${product.price.toFixed(2)}</p>

        <div className="mt-4">
          {outOfStock ? (
            <button disabled className="w-full py-2.5 rounded-lg bg-surface-container text-secondary/30 text-sm font-label cursor-not-allowed">
              Out of Stock
            </button>
          ) : qty === 0 ? (
            <button
              onClick={() => addItem(product.id)}
              className="w-full py-2.5 rounded-lg bg-gradient-to-br from-primary to-primary-container
                         text-on-primary-fixed text-sm font-label font-bold
                         shadow-[0_4px_12px_rgba(255,183,131,0.15)]
                         hover:shadow-[0_8px_24px_rgba(255,183,131,0.3)]
                         active:scale-[0.98] transition-all"
            >
              Add to Coven
            </button>
          ) : (
            <div className="flex items-center justify-between bg-surface-container rounded-lg px-3 py-2">
              <button
                onClick={() => updateQty(product.id, qty - 1)}
                className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface hover:bg-primary-container hover:text-on-primary-fixed transition-colors flex items-center justify-center font-bold"
              >
                −
              </button>
              <span className="text-sm font-label font-semibold text-on-surface">{qty} in cart</span>
              <button
                onClick={() => addItem(product.id)}
                className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface hover:bg-primary-container hover:text-on-primary-fixed transition-colors flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(r => setProducts(r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="relative px-8 pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container/10 via-transparent to-tertiary/5 pointer-events-none" />
        <div className="max-w-2xl relative">
          <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary/60 mb-4">
            The Haunted Atelier
          </p>
          <h1 className="font-headline text-6xl font-bold italic text-on-surface leading-tight">
            Ethereal<br />Indulgence
          </h1>
          <p className="font-body text-secondary/70 mt-6 text-lg max-w-md">
            Hand-crafted in the shadows of the old city. Each confection a whispered secret,
            each bite an invitation to the beyond.
          </p>
        </div>
      </div>

      {/* Product grid */}
      <div className="px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline text-2xl italic font-bold text-on-surface">Curated Artifacts</h2>
          <p className="text-xs font-label text-secondary/40 uppercase tracking-widest">
            {products.length} confections
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
        ) : products.length === 0 ? (
          <EmptyState icon="🕯️" title="No artifacts found" description="The atelier is restocking." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      {/* Footer accent */}
      <div className="border-t border-white/5 px-8 py-10 flex justify-between items-center">
        <p className="font-headline italic text-on-surface/30 text-sm">Crafted in the shadows of the old city</p>
        <div className="flex gap-8">
          {["Privacy", "Terms", "Shipping", "Ingredients"].map(l => (
            <a key={l} href="#" className="text-[10px] font-label uppercase tracking-widest text-outline/40 hover:text-primary transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </div>
  );
}
