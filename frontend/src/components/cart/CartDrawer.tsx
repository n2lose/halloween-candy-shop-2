import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../store/cartStore";
import { useAuth } from "../../store/authStore";
import { getProducts } from "../../api/products";
import type { Product } from "../../types/index";

type Props = { open: boolean; onClose: () => void };

export default function CartDrawer({ open, onClose }: Props) {
  const { items, updateQty, removeItem, clearCart, totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch product catalog once when drawer opens
  useEffect(() => {
    if (!open) return;
    getProducts()
      .then(r => setProducts(r.data))
      .catch(() => setProducts([]));
  }, [open]);

  const enrich = (productId: string) => products.find(p => p.id === productId);

  const subtotal = items.reduce((sum, item) => {
    const p = enrich(item.productId);
    return sum + (p?.price ?? 0) * item.quantity;
  }, 0);

  const handleCheckout = () => {
    onClose();
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-96 bg-surface-container flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div>
            <h2 className="font-headline text-xl italic font-bold text-on-surface">
              Casket of Curiosities
            </h2>
            <p className="text-xs font-label text-secondary/40 mt-0.5">
              Your selected confections
            </p>
          </div>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-secondary hover:text-on-surface transition-colors"
          >
            close
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {totalItems === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <span className="text-5xl">🕸️</span>
              <p className="font-headline italic text-on-surface/50">Your cart is empty</p>
              <button
                onClick={onClose}
                className="text-sm font-label text-primary hover:underline"
              >
                Browse the Collection →
              </button>
            </div>
          ) : (
            items.map(item => {
              const product = enrich(item.productId);
              const lineTotal = (product?.price ?? 0) * item.quantity;
              return (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 bg-surface-container-high rounded-xl p-4"
                >
                  {/* Emoji */}
                  <div className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {product?.emoji ?? "🍬"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-label font-semibold text-sm text-on-surface truncate">
                      {product?.name ?? item.productId}
                    </p>
                    <p className="text-xs text-secondary/60 font-label mt-0.5">
                      ${product?.price.toFixed(2)} each
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateQty(item.productId, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface
                                 hover:bg-primary-container hover:text-on-primary-fixed
                                 transition-colors flex items-center justify-center text-sm font-bold"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-label font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.productId, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface
                                 hover:bg-primary-container hover:text-on-primary-fixed
                                 transition-colors flex items-center justify-center text-sm font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Line total */}
                  <p className="text-sm font-label font-semibold text-on-surface w-14 text-right flex-shrink-0">
                    ${lineTotal.toFixed(2)}
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="material-symbols-outlined text-secondary/30 hover:text-error transition-colors text-lg flex-shrink-0"
                  >
                    delete
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {totalItems > 0 && (
          <div className="px-6 py-5 border-t border-white/5 space-y-4">
            {/* Subtotal */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-label text-secondary/60">
                <span>Artifact Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-label text-secondary/60">
                <span>Ritual Transport</span>
                <span>$10.00</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-white/5">
              <span className="text-xs font-label uppercase tracking-wider text-secondary/40">
                Final Offering
              </span>
              <span className="text-2xl font-headline italic font-bold text-primary">
                ${(subtotal + 10).toFixed(2)}
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-gradient-to-br from-primary to-primary-container
                         text-on-primary-fixed font-bold font-headline italic rounded-xl
                         shadow-[0_4px_20px_rgba(255,183,131,0.2)]
                         hover:shadow-[0_8px_30px_rgba(255,183,131,0.35)]
                         active:scale-[0.98] transition-all"
            >
              Proceed to Ritual →
            </button>

            <button
              onClick={clearCart}
              className="w-full text-xs font-label text-secondary/40 hover:text-error transition-colors"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
