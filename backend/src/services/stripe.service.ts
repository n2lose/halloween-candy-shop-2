import Stripe from "stripe";
import { productRepository } from "../repositories/productRepository.js";
import type { CreatePaymentIntentRequest } from "../types/index.js";

let _stripe: Stripe | undefined;
function getStripe(): Stripe {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", { apiVersion: "2023-10-16" });
  return _stripe;
}

export async function createPaymentIntent(
  items: CreatePaymentIntentRequest["items"]
): Promise<{ clientSecret: string; amount: number }> {
  if (!Array.isArray(items) || items.length === 0) throw new Error("Invalid items");

  let amount = 0;
  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) throw new Error("Invalid items");
    const product = productRepository.findById(item.productId);
    if (!product) throw new Error("Invalid items");
    amount += Math.round(product.price * 100) * item.quantity;
  }

  const intent = await getStripe().paymentIntents.create({ amount, currency: "usd" });
  return { clientSecret: intent.client_secret!, amount };
}

export async function verifyPaymentIntent(paymentIntentId: string): Promise<{ last4: string }> {
  const intent = await getStripe().paymentIntents.retrieve(paymentIntentId, {
    expand: ["payment_method"],
  });
  if (intent.status !== "succeeded") throw new Error("Payment not confirmed");
  const pm   = intent.payment_method as Stripe.PaymentMethod | null;
  const last4 = pm?.card?.last4;
  if (!last4) throw new Error("Payment method has no card information");
  return { last4 };
}
