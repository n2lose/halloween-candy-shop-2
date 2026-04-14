import Stripe from "stripe";
import { findProductById } from "../data/products.js";
import type { CreatePaymentIntentRequest } from "../types/index.js";

// Lazy init — ensures dotenv has loaded before Stripe client is created
let _stripe: Stripe | undefined;
function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", { apiVersion: "2023-10-16" });
  }
  return _stripe;
}

function validateItems(items: CreatePaymentIntentRequest["items"]): void {
  if (!Array.isArray(items) || items.length === 0) throw new Error("Invalid items");
  for (const item of items) {
    if (!findProductById(item.productId)) throw new Error("Invalid items");
    if (!Number.isInteger(item.quantity) || item.quantity < 1) throw new Error("Invalid items");
  }
}

function calcAmountCents(items: CreatePaymentIntentRequest["items"]): number {
  return items.reduce((total, item) => {
    const product = findProductById(item.productId)!;
    return total + Math.round(product.price * 100) * item.quantity;
  }, 0);
}

export async function createPaymentIntent(
  items: CreatePaymentIntentRequest["items"]
): Promise<{ clientSecret: string; amount: number }> {
  validateItems(items);
  const amount = calcAmountCents(items);
  const intent = await getStripe().paymentIntents.create({ amount, currency: "usd" });
  return { clientSecret: intent.client_secret!, amount };
}

export async function verifyPaymentIntent(paymentIntentId: string): Promise<{ last4: string }> {
  const intent = await getStripe().paymentIntents.retrieve(paymentIntentId, {
    expand: ["payment_method"],
  });
  if (intent.status !== "succeeded") throw new Error("Payment not confirmed");
  const pm = intent.payment_method as Stripe.PaymentMethod | null;
  const last4 = pm?.card?.last4 ?? "4242";
  return { last4 };
}
