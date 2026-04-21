# Manual Testing Guide — The Haunted Atelier

> Manual QA guide for the entire website.  
> Each test case specifies: **Steps → Expected Result (✅) → Failure Result (❌)**

---

## Setup

### Start servers

```bash
# Terminal 1
cd backend && npm run dev      # → http://localhost:3001

# Terminal 2
cd frontend && npm run dev     # → http://localhost:5173
```

### Test accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@halloween.shop` | `Halloween2024!` |
| Customer | `freddy@halloween.shop` | *(see `SEED_USER_PASSWORD` in backend/.env)* |

### Stripe test card

```
Card number:  4242 4242 4242 4242
Expiry date:  12/34  (any valid future date)
CVC:          123    (any 3 digits)
```

---

## 1. Authentication

### TC-AUTH-01: Register a new account

**Precondition:** Not logged in, open `http://localhost:5173`

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Click "Request an Invitation" | Navigates to `/register` |
| 2 | Fill Name: `Test User`, Email: `test@example.com`, Password: `abc123` | Form renders correctly |
| 3 | Click "Create Account" | Registration succeeds, auto-login, redirects to `/products` |

**Also verify:**
- ❌ Leave any field blank → cannot submit (HTML5 required)
- ❌ Password < 6 characters → shows error `"Password must be at least 6 characters."`
- ❌ Email already exists → shows error `"Registration failed. This email may already be taken."`

---

### TC-AUTH-02: Customer login

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Go to `/login` | Login form is displayed |
| 2 | Enter customer email/password | — |
| 3 | Click "Enter the Atelier" | Redirects to `/products` |
| 4 | User name visible in top-right of topbar | Matches the registered name |

**Also verify:**
- ❌ Wrong password → shows error `"Invalid credentials. Try again."`
- ❌ Email does not exist → shows same error

---

### TC-AUTH-03: Admin login

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Login with admin account | Redirects to `/admin/dashboard` (not `/products`) |
| 2 | Sidebar shows: Dashboard, Orders, Inventory | ✅ |

---

### TC-AUTH-04: Logout

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | While logged in → click logout icon | Redirects to `/login` |
| 2 | Try accessing `/orders` directly | Redirected back to `/login` |
| 3 | Open DevTools → Application → LocalStorage | No `access_token` or `refresh_token` present |

---

### TC-AUTH-05: Route protection

| URL | State | Expected Result |
|-----|-------|----------------|
| `/orders` | Not logged in | Redirect to `/login` |
| `/checkout` | Not logged in | Redirect to `/login` |
| `/admin/dashboard` | Logged in as customer | Redirect to `/products` |
| `/admin/orders` | Logged in as customer | Redirect to `/products` |
| `/products` | Not logged in | Renders normally (public route) |

---

## 2. Products

### TC-PROD-01: Display product list

**URL:** `/products` (no login required)

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Go to `/products` | Exactly 10 Halloween products are displayed |
| 2 | Resize browser window | Grid adjusts: 2 cols (mobile) → 3 (md) → 4 (lg) → 5 (xl) |
| 3 | Out-of-stock product (stock = 0) | "Out of Stock" overlay shown, cannot add to cart |
| 4 | Low-stock product (stock ≤ 5) | "Only X left" badge is displayed |

---

### TC-PROD-02: Add to cart (not logged in)

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Not logged in, click "Add to Coven" | Redirects to `/login` (or shows login prompt) |

---

### TC-PROD-03: Add to cart (logged in)

**Precondition:** Logged in as customer

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Click "Add to Coven" on any product | Button changes to `−  1  +` controls, cart badge increments |
| 2 | Click `+` again | Quantity increases to 2 |
| 3 | Click `−` | Quantity decreases to 1 |
| 4 | Click `−` when qty = 1 | Product is removed from cart, button reverts to "Add to Coven" |
| 5 | Add several different products | Cart badge shows total item count (displays "9+" at maximum) |
| 6 | Refresh the page | Cart is still intact (persisted in localStorage) |

---

## 3. Cart

### TC-CART-01: Open and inspect CartDrawer

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Click cart icon (topbar) | Drawer slides in from the right |
| 2 | Cart has products | List shows emoji/image, name, price, qty controls per item |
| 3 | Check footer section | Subtotal, Shipping $10.00, Total (= subtotal + 10) |
| 4 | Cart is empty | Shows "Your cart is empty" |

---

### TC-CART-02: Interact with CartDrawer

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Click `+` / `−` inside drawer | Qty updates, total recalculates immediately |
| 2 | Click trash icon on an item | That item is removed from the cart |
| 3 | Click "Clear cart" | All items removed, shows "Your cart is empty" |
| 4 | Click "Checkout" (inside drawer) | Drawer closes, navigates to `/checkout` |

---

## 4. Checkout & Payment

### TC-CHECK-01: Successful payment flow

**Precondition:** Logged in as customer, cart has at least 1 item

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Go to `/checkout` | Form pre-filled with Name/Email from account |
| 2 | Fill "Delivery Address": `123 Haunted Lane` | — |
| 3 | Check Order Summary (right panel) | Shows item list + Shipping $10 + correct Total |
| 4 | Enter test card: `4242 4242 4242 4242`, `12/34`, `123` | Stripe form accepts input |
| 5 | Click "Complete the Manifestation ✦" | Loading spinner appears |
| 6 | Payment succeeds | Navigates to `/orders/{orderId}` — new order detail page |
| 7 | Check cart | Cart is empty after checkout |

---

### TC-CHECK-02: Failed payment

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Use declined test card: `4000 0000 0000 0002` | — |
| 2 | Click submit | Stripe error message shown (e.g., "Your card was declined.") |
| 3 | Form remains on the page | User can retry with a different card |

---

### TC-CHECK-03: Checkout with empty cart

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Go to `/checkout` with an empty cart | Shows empty cart state, payment form is not rendered |

---

## 5. Orders (Customer)

### TC-ORD-01: View order list

**URL:** `/orders`

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Go to `/orders` | Orders table shows columns: Order ID, Date, Total, Status |
| 2 | Status badges | Processing = orange (pulsing), Shipped = blue, Delivered = green |
| 3 | New account with no orders | Shows "No orders yet" |

---

### TC-ORD-02: Search orders

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Type in search box (Order ID or product name) | Table filters in realtime, no Enter needed |
| 2 | Search → clear the text | Table resets to full list, page resets to 1 |
| 3 | Search with no results | Shows "No orders found" |

---

### TC-ORD-03: Pagination

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Many orders present → click "Next" | Navigates to next page, table updates |
| 2 | On first page | "Prev" button is disabled |
| 3 | On last page | "Next" button is disabled |
| 4 | Click a specific page number | Navigates to that page |

---

### TC-ORD-04: Order detail

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Click any order row | Navigates to `/orders/{id}` |
| 2 | Items table | Product name, qty, unit price, line total are correct |
| 3 | "Delivered To" card | Name, email, address from checkout |
| 4 | "Payment" card | Masked card number `•••• 4242`, payment status |
| 5 | Click "Back" | Returns to `/orders` |

---

## 6. Admin — Dashboard

### TC-DASH-01: Verify stats

**Precondition:** Logged in as admin, URL `/admin/dashboard`

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | View 3 stat cards | Today / Last Week / Last Month with Revenue + Orders count |
| 2 | "Today" card | Shows "+14.2% from yesterday" indicator in green |
| 3 | Data is valid | Revenue ≥ $0, Orders ≥ 0, no NaN or undefined values |

---

### TC-DASH-02: Revenue chart

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Default view | "7 Days" chart shows 7 bars |
| 2 | Click "12 Months" | Chart switches to 12 bars (monthly) |
| 3 | Click "7 Days" | Returns to 7 bars |
| 4 | Hover over any bar | Tooltip shows revenue for that period |
| 5 | Last bar (most recent) | Visually darker/highlighted vs other bars |

---

### TC-DASH-03: Bestsellers table

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Top 5 Bestsellers table | Exactly 5 products displayed |
| 2 | Order | First product has the highest units sold |
| 3 | Revenue column | Formatted as $Xk or $X.XM |

---

## 7. Admin — Orders

### TC-AORD-01: Manage order list

**URL:** `/admin/orders`

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | View table | All orders from all customers, includes Customer column (avatar + name) |
| 2 | Search via topbar (form submit) | Filters by Order ID, customer name, or product name |
| 3 | Search on orders page | Filters in realtime |
| 4 | Pagination | Same behavior as customer orders |

---

### TC-AORD-02: Update order status

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Click any order | Opens `/admin/orders/{id}` |
| 2 | View Status dropdown | Shows current status |
| 3 | Change "processing" → "shipped" → Save | "Saved" feedback appears in green for 2 seconds |
| 4 | Change to "delivered" → Save | Same — "Saved" feedback shown |
| 5 | Re-open the same order | Status is persisted correctly |

---

## 8. Admin — Inventory

### TC-INV-01: Create a new product

**URL:** `/admin/products`

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Click "New Batch" | "Create Product" modal opens |
| 2 | Fill: Name=`Test Candy`, Price=`5.99`, Stock=`100` | — |
| 3 | Click "Save" | Modal closes, new product appears in the table |
| 4 | Check `/products` | New product is visible in the storefront |

**Also verify:**
- ❌ Leave Name blank → cannot submit
- ❌ Negative price (enter -1) → cannot submit (min=0)
- ❌ Negative stock → cannot submit (min=0)

---

### TC-INV-02: Edit a product

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Hover over a product row → click Edit icon | "Edit Product" modal opens with pre-filled data |
| 2 | Change Price to `9.99` → Save | Modal closes, table reflects the new price |
| 3 | Check stock indicator color | >10 = green, 1–10 = orange, 0 = red |

---

### TC-INV-03: Delete a product

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Hover over a row → click Delete icon | Confirmation modal appears with product name |
| 2 | Click "Cancel" | Modal closes, product is still in the table |
| 3 | Click Delete again → click "Delete" (red) | Product is removed from the table |

---

## 9. Navigation & UX

### TC-NAV-01: Storefront navigation (Customer)

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Click "The Haunted Atelier" logo | Goes to `/products` |
| 2 | Click "Collections" | Goes to `/products` |
| 3 | Click "My Orders" (only shown when logged in) | Goes to `/orders` |
| 4 | Not logged in | "Sign in" link is shown instead of user name |

---

### TC-NAV-02: Admin sidebar

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Click "Dashboard" | Goes to `/admin/dashboard` |
| 2 | Click "Orders" | Goes to `/admin/orders` |
| 3 | Click "Inventory" | Goes to `/admin/products` |
| 4 | Click "New Batch" (sidebar) | Goes to `/admin/products` |

---

### TC-NAV-03: Default redirects

| # | URL | State | Expected Result |
|---|-----|-------|----------------|
| 1 | `/` | Not logged in | Redirect to `/login` |
| 2 | `/` | Customer | Redirect to `/products` |
| 3 | `/` | Admin | Redirect to `/admin/dashboard` |
| 4 | `/unknown-page` | Any | Redirect per above logic |

---

## 10. End-to-End Flows

### E2E-01: Customer completes a purchase

```
[Register] → [Products] → [Add items] → [Open cart] → [Checkout]
→ [Fill form + payment] → [Order success] → [View order detail]
```

1. Register a new account
2. Go to `/products`, add 2–3 products to cart
3. Open CartDrawer, verify total is correct
4. Click Checkout
5. Fill in delivery address, enter test card
6. Submit → wait for processing
7. Redirected to order detail page — verify all info is correct
8. Go to `/orders` — new order appears with status "processing"

---

### E2E-02: Admin processes an order

```
[Admin login] → [Dashboard] → [Orders] → [Update status] → [Verify]
```

1. Login as admin
2. Verify dashboard stats have increased since E2E-01
3. Go to `/admin/orders` — new order from E2E-01 is visible
4. Open the order → change status to "shipped" → Save
5. Login as customer → go to `/orders` → status has updated

---

## Bug Report Template

When a bug is found, log it using this format:

```
[TC-ID] Bug title
- Steps to reproduce: ...
- Actual result: ...
- Expected result: ...
- Browser + OS: Chrome 123 / macOS 14
- Screenshot: (attach)
```
