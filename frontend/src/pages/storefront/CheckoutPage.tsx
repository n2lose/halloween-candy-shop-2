import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "../../store/cartStore";
import { createPaymentIntent, createOrder } from "../../api/orders";
import { getProducts } from "../../api/products";
import { useAuth } from "../../store/authStore";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";
import type { CartItem, Product } from "../../types/index";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

const stripeAppearance = {
  theme: "night" as const,
  variables: {
    colorPrimary: "#db7619",
    colorBackground: "#1e1c1b",
    colorText: "#e5e2e1",
    colorDanger: "#cf6679",
    fontFamily: "Manrope, sans-serif",
    borderRadius: "8px",
  },
};

type ShippingForm = { name: string; email: string; address: string };

function CheckoutForm({ form, setForm }: {
  form: ShippingForm;
  setForm: React.Dispatch<React.SetStateAction<ShippingForm>>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const field = (key: keyof ShippingForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value })),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError("");
    setSubmitting(true);
    try {
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });
      if (confirmError) { setError(confirmError.message ?? "Payment failed."); return; }
      if (!paymentIntent) { setError("Payment was not confirmed."); return; }
      const orderRes = await createOrder({ paymentIntentId: paymentIntent.id, customer: form, items });
      clearCart();
      navigate(`/orders/${orderRes.data.orderId}`, { replace: true });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
      <Card padding="lg">
        <h2 className="text-lg font-headline italic font-bold mb-6">Mortal Details</h2>
        <div className="space-y-5">
          {[
            { label: "Mortal Name", key: "name" as const, type: "text", placeholder: "Your name" },
            { label: "Sanctum Address (Email)", key: "email" as const, type: "email", placeholder: "your@email.com" },
            { label: "Delivery Address", key: "address" as const, type: "text", placeholder: "123 Shadow Lane, Grimwood" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key} className="group/input">
              <label className="block font-label text-xs uppercase tracking-widest text-secondary mb-2 transition-colors group-focus-within/input:text-tertiary">
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                required
                {...field(key)}
                className="w-full bg-surface-container-lowest rounded-lg py-4 px-5 text-on-surface
                           placeholder:text-outline/40 focus:ring-1 focus:ring-tertiary/40 outline-none transition-all"
              />
            </div>
          ))}
        </div>
      </Card>

      <Card padding="lg">
        <h2 className="text-lg font-headline italic font-bold mb-2">Payment Incantations</h2>
        <p className="text-xs font-label text-secondary/40 mb-6">
          Test mode — use card <span className="text-primary font-mono">4242 4242 4242 4242</span>
        </p>
        <PaymentElement />
      </Card>

      {error && <p className="text-sm text-error">{error}</p>}

      <button
        type="submit"
        disabled={submitting || !stripe}
        className="w-full py-5 bg-gradient-to-br from-primary to-primary-container
                   text-on-primary-fixed font-bold rounded-xl flex items-center justify-center gap-2
                   shadow-[0_4px_20px_rgba(255,183,131,0.2)]
                   hover:shadow-[0_8px_30px_rgba(255,183,131,0.4)]
                   active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <><Spinner size="sm" /><span className="font-headline text-lg italic">Completing...</span></>
        ) : (
          <span className="font-headline text-lg italic">Complete the Manifestation ✦</span>
        )}
      </button>
    </form>
  );
}

function CartSummary({ items, products }: { items: CartItem[]; products: Product[] }) {
  const enrich = (id: string) => products.find(p => p.id === id);
  const subtotal = items.reduce((s, i) => s + (enrich(i.productId)?.price ?? 0) * i.quantity, 0);

  return (
    <Card padding="lg" className="sticky top-24">
      <h2 className="text-lg font-headline italic font-bold mb-6">Cart Manifest</h2>
      <div className="space-y-4 mb-6">
        {items.map(item => {
          const p = enrich(item.productId);
          return (
            <div key={item.productId} className="flex justify-between items-center text-sm font-label">
              <span className="text-secondary/70">{p?.emoji ?? "🍬"} × {item.quantity}</span>
              <span className="text-on-surface">{p?.name ?? item.productId}</span>
              <span className="text-secondary/60">${((p?.price ?? 0) * item.quantity).toFixed(2)}</span>
            </div>
          );
        })}
      </div>
      <div className="border-t border-white/5 pt-4 space-y-2">
        {/* TODO: include shipping in createPaymentIntent payload when backend supports it */}
        <div className="flex justify-between text-sm font-label text-secondary/60">
          <span>Ritual Transport</span><span>$10.00</span>
        </div>
      </div>
      <div className="border-t border-white/5 mt-4 pt-4 flex justify-between items-baseline">
        <span className="text-sm font-label uppercase tracking-wider text-secondary/40">Final Offering</span>
        <span className="text-2xl font-headline italic font-bold text-primary">
          {products.length > 0 ? `$${(subtotal + 10).toFixed(2)}` : "—"}
        </span>
      </div>
      <p className="text-[10px] font-label text-secondary/20 text-center mt-4">
        TRANSACTIONS SECURED BY THE SHADOW COVEN
      </p>
    </Card>
  );
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState<ShippingForm>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    address: "",
  });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [piError, setPiError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  // Capture items at mount — cart shouldn't change during checkout
  const [itemsSnapshot] = useState(items);

  useEffect(() => {
    if (itemsSnapshot.length === 0) return;
    createPaymentIntent(itemsSnapshot)
      .then(r => setClientSecret(r.data.clientSecret))
      .catch(() => setPiError("Could not initialise payment. Please refresh."));
    getProducts()
      .then(r => setProducts(r.data))
      .catch(() => setProducts([]));
  }, [itemsSnapshot]);

  if (itemsSnapshot.length === 0) {
    return (
      <div className="px-8 py-20 text-center">
        <p className="text-4xl mb-4">🕸️</p>
        <p className="font-headline italic text-xl text-on-surface">Your cart is empty</p>
        <button onClick={() => navigate("/products")} className="mt-6 text-sm text-primary hover:underline font-label">
          Browse the Collection →
        </button>
      </div>
    );
  }

  return (
    <div className="px-8 py-12 max-w-6xl mx-auto">
      <h1 className="text-4xl font-headline italic font-bold text-on-surface mb-10">Shipping Rituals</h1>
      {piError && <p className="mb-6 text-sm text-error">{piError}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
            <CheckoutForm form={form} setForm={setForm} />
          </Elements>
        ) : (
          <div className="lg:col-span-3 flex items-center justify-center py-32">
            <Spinner size="lg" />
          </div>
        )}

        <div className="lg:col-span-2">
          <CartSummary items={itemsSnapshot} products={products} />
        </div>
      </div>
    </div>
  );
}
