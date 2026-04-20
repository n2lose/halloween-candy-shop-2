# PLAN-019: Storefront — Products, Cart, Checkout

**Status**: IN PROGRESS  
**Branch**: `feat/PLAN-017-auth-layouts`  
**Updated**: 2026-04-20

---

## Context

Customer-facing storefront: browse products, manage cart, checkout with Stripe.  
**Design reference**: `docs/designs/stitch/product_gallery_the_haunted_atelier/`, `your_grimoire_cart_the_haunted_atelier/`, `checkout_the_haunted_atelier/`

---

## Tasks

- [x] Task 1: `pages/storefront/ProductsPage.tsx` — hero section, 5-col product grid, `ProductCard` with emoji, qty controls, out-of-stock state
- [x] Task 2: Cart drawer stub in `StorefrontLayout` — open/close, empty state, item count, "Proceed to Ritual" → `/checkout`
- [x] Task 3: `pages/storefront/CheckoutPage.tsx` — shipping form + payment section + order summary panel, submit flow (createPaymentIntent → createOrder → navigate to order detail)
- [ ] Task 4: Full `CartDrawer` — display product names + prices (requires fetching product data from API or storing in cartStore)
- [ ] Task 5: Wire Stripe `PaymentElement` in CheckoutPage (requires `@stripe/react-stripe-js` Elements wrapper with real clientSecret)
- [ ] Task 6: Order confirmation page after successful checkout (currently redirects directly to `/orders/:id`)

## Design decisions vs Stitch

| Stitch shows | Implemented |
|---|---|
| Real AI product images | Emoji (API has no image URLs) |
| Collections/Artifacts/The Vault nav | Simplified to Products + My Orders |
| Tax + Shipping calculated | Hardcoded display only (no backend calc) |
| "Suggested Artifacts" in cart | Not implemented |
| Full cart page (`/cart` route) | Drawer only; `/cart` redirects to products |

## Remaining TODO

- [ ] CartDrawer: fetch product details on open to show names + prices (store only has productId + qty)
- [ ] Stripe Elements integration: wrap CheckoutPage in `<Elements stripe={stripePromise} options={{clientSecret}}>`, use `<PaymentElement>`, call `stripe.confirmPayment()` before `createOrder`
- [ ] Remove simulated payment shortcut in `handleSubmit`
