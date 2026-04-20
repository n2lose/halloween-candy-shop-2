# Frontend Design — The Haunted Atelier

**Version**: 1.0 | **Status**: DRAFT | **Date**: 2026-04-20  
**Scope**: Layout, Pages, Components for Sprint 3 Frontend

---

## 1. Design System

### 1.1 Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `surface` | `#131313` | Base page background |
| `surface-raised` | `#1a1a1a` | Cards, sidebar |
| `surface-overlay` | `#222222` | Hover states, table rows alt |
| `on-surface` | `#e5e2e1` | Primary text |
| `on-surface-muted` | `#9e9a98` | Secondary text, labels |
| `primary` | `#db7619` | CTA buttons, accents, active nav |
| `primary-dim` | `#b85f10` | Button hover |
| `primary-subtle` | `#2a1a08` | Orange tint backgrounds |
| `tertiary` | `#8adb4d` | Delivered status, success |
| `tertiary-dim` | `#6fb838` | Success hover |
| `info` | `#6b9dc2` | Shipped status |
| `error` | `#e05c5c` | Error states |
| `border` | `#262626` | Subtle separators (never 1px sharp) |

> **Rule**: No raw 1px borders with stark contrast. Depth via background color shifts only.

### 1.2 Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Display / Hero | Newsreader | 400–600 | 2.25–3rem |
| Heading H1 | Newsreader | 600 | 1.75rem |
| Heading H2 | Newsreader | 500 | 1.25rem |
| Body | Manrope | 400 | 0.875rem |
| Label / UI | Manrope | 500 | 0.75–0.875rem |
| Code / ID | Manrope Mono | 400 | 0.75rem |

### 1.3 Spacing Scale
`4px` base unit. Use Tailwind's scale: `p-2`(8px), `p-4`(16px), `p-6`(24px), `p-8`(32px).

### 1.4 Status Badges

| Status | Color | Style |
|--------|-------|-------|
| `processing` | `#db7619` | Orange pill + pulsing dot |
| `shipped` | `#6b9dc2` | Blue pill |
| `delivered` | `#8adb4d` | Eerie green pill |

---

## 2. Route Architecture

```
/ → redirect based on role (admin → /admin/dashboard, customer → /products)

PUBLIC (no token required)
├── /login          → LoginPage
├── /register       → RegisterPage
└── /products       → ProductsPage   (browse without account)

ADMIN (role = "admin")
├── /admin/dashboard          → AdminDashboardPage
├── /admin/orders             → AdminOrdersPage
├── /admin/orders/:id         → AdminOrderDetailPage
└── /admin/products           → AdminProductsPage

CUSTOMER (role = "customer", requires auth)
├── /products                 → ProductsPage (same page, with cart enabled)
├── /cart                     → CartPage
├── /checkout                 → CheckoutPage
├── /orders                   → CustomerOrdersPage
└── /orders/:id               → CustomerOrderDetailPage
```

---

## 3. Layout Components

### 3.1 `AuthLayout`

Full-screen centered layout for Login/Register.

```
┌─────────────────────────────────────────────┐
│                                             │
│   [Background: #131313 + subtle pattern]    │
│                                             │
│         ┌──────────────────────┐            │
│         │  🎃 The Haunted      │            │
│         │     Atelier          │            │
│         │  ─────────────────   │            │
│         │  [Form content here] │            │
│         └──────────────────────┘            │
│                                             │
└─────────────────────────────────────────────┘
```

- Background: `#131313` with optional spider-web SVG texture (opacity 5%)
- Card: `bg-surface-raised` (`#1a1a1a`), rounded-xl, shadow-2xl, `p-10`
- Width: `w-full max-w-md`
- Logo: pumpkin emoji + serif "The Haunted Atelier"

### 3.2 `AdminLayout`

Two-column: fixed Sidebar + scrollable Main.

```
┌────────────┬────────────────────────────────┐
│  SIDEBAR   │  TOPBAR                        │
│  240px     ├────────────────────────────────┤
│  fixed     │                                │
│            │  PAGE CONTENT                  │
│  🎃 Logo   │  (scrollable)                  │
│            │                                │
│  Dashboard │                                │
│  Orders    │                                │
│  Products  │                                │
│            │                                │
│  ─────     │                                │
│  Logout    │                                │
└────────────┴────────────────────────────────┘
```

**Sidebar** (`bg-[#0d0d0d]`, `w-60`, `h-screen`, `fixed`):
- Logo section: pumpkin emoji + "The Haunted Atelier" (Newsreader) + "Admin Portal" (muted)
- Nav items: icon + label, `hover:bg-surface-overlay`, active = left orange border (`border-l-2 border-primary`) + `text-primary`
- Footer: User avatar initials + name + email
- Bottom action: Logout button

**Topbar** (`bg-surface-raised`, `h-14`, `sticky top-0`):
- Breadcrumb: "Dashboard" / "Orders" / "Products"
- Right: date display

**Page content**: `ml-60 p-8 min-h-screen bg-surface`

### 3.3 `StorefrontLayout`

Full-width layout for customer-facing pages.

```
┌─────────────────────────────────────────────┐
│  TOPBAR: Logo | nav links | 🛒 Cart(n)      │
├─────────────────────────────────────────────┤
│                                             │
│  PAGE CONTENT                               │
│                                             │
└─────────────────────────────────────────────┘
```

**Topbar**: `bg-surface-raised`, `sticky top-0`, `z-40`
- Left: Logo
- Center: Products | My Orders
- Right: Cart icon + item count badge

### 3.4 `ProtectedRoute`

Wrapper that checks `isAuthenticated` and `user.role`.  
Redirects to `/login` or `/products` based on failed check.

---

## 4. Shared Components

### 4.1 `Button`
```tsx
variant: "primary" | "secondary" | "ghost" | "danger"
size: "sm" | "md" | "lg"
```

| Variant | Style |
|---------|-------|
| primary | `bg-primary text-white hover:bg-primary-dim` |
| secondary | `bg-surface-overlay text-on-surface hover:bg-[#2a2a2a]` |
| ghost | `bg-transparent text-primary hover:bg-primary-subtle` |
| danger | `bg-error/10 text-error hover:bg-error/20` |

Rounded: `rounded-lg`. No border. Manrope 500. Transition 150ms.

### 4.2 `Input`
```tsx
label?: string
error?: string
icon?: ReactNode
```

- Background: `bg-surface-overlay` (not pure black — slightly lifted)
- Border: none, use shadow-inner or inset background for depth
- Focus ring: `ring-2 ring-primary/50`
- Label: Manrope 500, `text-on-surface-muted`, `text-xs uppercase tracking-wide`
- Error: red helper text below

### 4.3 `Badge` (Status)
```tsx
status: "processing" | "shipped" | "delivered"
```

```
processing: [🟠 ●] Processing   ← pulsing orange dot
shipped:    [🔵] Shipped
delivered:  [🟢] Delivered
```

Pill shape, `rounded-full px-3 py-1`, `text-xs font-medium`.

### 4.4 `Card`
```tsx
padding?: "sm" | "md" | "lg"   // p-4 / p-6 / p-8
```

`bg-surface-raised rounded-xl` — no border, depth from background color vs surface.

### 4.5 `StatCard`
```tsx
label: string      // "Today" | "Last Week" | "Last Month"
revenue: number    // display as $X or $XK
orders: number
```

Layout:
```
┌──────────────────────┐
│ TODAY                │
│ $1,456               │
│ 9 orders             │
└──────────────────────┘
```

Newsreader for the revenue number (italic, large).

### 4.6 `Table`
Generic dark table: `bg-surface-raised`, header `bg-surface-overlay`, `text-on-surface-muted text-xs uppercase tracking-wider`.  
Row hover: `hover:bg-surface-overlay`. No dividers — alternating subtle background shifts.

### 4.7 `Pagination`
```
← Prev   Page 1 of 3   Next →
```
Buttons: ghost variant, active page highlighted.

### 4.8 `SearchBar`
Icon + input, full border-radius, `bg-surface-overlay`, no visible border.  
`placeholder="Search orders, products…"` in muted color.

### 4.9 `Spinner` / `Skeleton`
- Spinner: orange rotating ring
- Skeleton: `bg-surface-overlay animate-pulse rounded`

### 4.10 `EmptyState`
Center-aligned: large muted emoji + heading + subtext.  
e.g. "🕸️ No orders found"

---

## 5. Pages

### 5.1 LoginPage (`/login`)

**Layout**: `AuthLayout`

```
┌──────────────────────────────┐
│  🎃  The Haunted Atelier     │  ← Newsreader display
│      Artisanal Confections   │  ← muted caption
│  ─────────────────────────   │
│  Email                       │
│  [___________________________]│
│                               │
│  Password                    │
│  [___________________________]│
│                               │
│  [     Enter the Atelier    ] │  ← primary button full-width
│                               │
│  Don't have an account?      │
│  → Create one                │  ← ghost link
└──────────────────────────────┘
```

**Behavior**:
- On submit → `POST /auth/login` → store tokens → redirect by role
- Error: inline error message below button
- Loading: button shows spinner + "Entering…"

**Components**: `AuthLayout`, `Input` ×2, `Button` (primary), link to `/register`

---

### 5.2 RegisterPage (`/register`)

**Layout**: `AuthLayout` (same card, same feel)

Fields: Name, Email, Password  
CTA: "Create Account" → `POST /auth/register` → store tokens → redirect to `/products`  
Link: "Already have an account? → Sign in"

---

### 5.3 AdminDashboardPage (`/admin/dashboard`)

**Layout**: `AdminLayout`

```
Dashboard                              [Last updated: Today, 09:41]

┌──────────┐  ┌──────────┐  ┌──────────┐
│ TODAY    │  │LAST WEEK │  │LAST MONTH│
│ $1,456   │  │ $34K     │  │  $95K    │
│ 9 orders │  │120 orders│  │876 orders│
└──────────┘  └──────────┘  └──────────┘

Revenue                        [Weekly ○──● Yearly]
┌──────────────────────────────────────────────────┐
│                    BarChart                       │
│   ████                                            │
│   ████  ██                                        │
│   ████  ██  ████       ██   ██                   │
│   ████  ██  ████  ██   ██   ██   ██              │
└──────────────────────────────────────────────────┘

Bestsellers
┌──────────────────────────────────────────────────────┐
│  Product Name         Price   Units Sold   Revenue   │
│  ─────────────────────────────────────────────────   │
│  Witch Finger Gummy   $4.99      342       $1,706    │
│  Skull Chocolate Bar  $6.99      287       $2,006    │
│  ...                                                 │
└──────────────────────────────────────────────────────┘
```

**Components**:
- `StatsRow` → 3× `StatCard`
- `RevenueChart` (Recharts BarChart)
  - Custom bar fill: `#db7619`
  - Custom tooltip: dark `bg-surface-raised` card
  - X-axis: muted labels, no grid lines (or very subtle)
  - Toggle: `WeeklyYearlyToggle` pill component
- `BestsellersTable` (top 5, all-time)

**Data**: `GET /admin/dashboard`

---

### 5.4 AdminOrdersPage (`/admin/orders`)

**Layout**: `AdminLayout`

```
Order Manifest                  [Search: __________________ 🔍]

┌────────────────────────────────────────────────────────────────┐
│  Order ID      Customer    Date         Total    Status        │
│  ─────────────────────────────────────────────────────────     │
│  ORD-0001      John Doe    Apr 15       $24.97   [Processing●] │
│  ORD-0002      Jane Smith  Apr 14       $12.49   [Shipped]     │
│  ORD-0003      Freddy      Apr 13       $8.99    [Delivered]   │
│  ...                                                           │
└────────────────────────────────────────────────────────────────┘

← Prev   Page 1 of 3   Next →
```

**Click row** → navigate to `/admin/orders/:id`

**Components**:
- `OrdersTable` (Table + rows with Badge)
- `SearchBar`
- `Pagination`

**Data**: `GET /admin/orders?page=N&q=query` (per PLAN-014 admin API)

---

### 5.5 AdminOrderDetailPage (`/admin/orders/:id`)

**Layout**: `AdminLayout`

```
← Back to Orders        Order ORD-0042      [Processing●] ▼ Change status

┌─────────────────────────────┐  ┌──────────────────────┐
│ Items                       │  │ Shipping             │
│                             │  │ John Doe             │
│ Witch Finger Gummy ×2 $9.98 │  │ john@example.com     │
│ Skull Chocolate    ×1 $6.99 │  │ 123 Main St          │
│ ─────────────────────────── │  └──────────────────────┘
│ Total: $16.97               │
└─────────────────────────────┘  ┌──────────────────────┐
                                 │ Payment              │
                                 │ •••• 4242            │
                                 │ succeeded            │
                                 └──────────────────────┘
```

**Status change**: `<select>` dropdown → `PATCH /admin/orders/:id/status`

**Components**:
- `OrderDetailHeader` (ID, status badge, back button)
- `OrderItemsCard` (Card with Table)
- `ShippingCard` (Card with address info)
- `PaymentCard` (Card with last4, status)
- `StatusDropdown` (admin-only action)

**Data**: `GET /admin/orders/:id`

---

### 5.6 AdminProductsPage (`/admin/products`)

**Layout**: `AdminLayout`

```
Products                                        [+ Add Product]

┌──────────────────────────────────────────────────────────────┐
│  #   Name                    Emoji  Price   Stock   Actions  │
│  ──────────────────────────────────────────────────────────  │
│  1   Pumpkin Spice Lollipop  🍭    $3.99    50    [✏] [🗑] │
│  2   Witch Finger Gummy      🫚    $4.99    34    [✏] [🗑] │
│  ...                                                         │
└──────────────────────────────────────────────────────────────┘
```

Actions: Edit (opens modal) | Delete (confirm dialog)

**Components**:
- `ProductsTable`
- `ProductFormModal` (create/edit) — name, emoji, price, stock fields
- `ConfirmDialog` (delete confirmation)

**Data**: `GET /products`, `POST/PUT/DELETE /admin/products`

---

### 5.7 ProductsPage (`/products`)

**Layout**: `StorefrontLayout`

```
The Haunted Atelier                              🛒 Cart (3)

Artisanal Halloween Confections
─────────────────────────────────────────────

┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│    🍭    │  │    🫚    │  │    💀    │  │    🕸️    │
│ Pumpkin  │  │  Witch   │  │  Skull   │  │Spider Web│
│ Lollipop │  │  Finger  │  │ Choco Bar│  │  Cotton  │
│ $3.99    │  │ $4.99    │  │ $6.99    │  │  $2.99   │
│[Add Cart]│  │[Add Cart]│  │[Add Cart]│  │[Add Cart]│
└──────────┘  └──────────┘  └──────────┘  └──────────┘

┌──────────┐  ┌──────────┐  ... (10 products total, 3-4 col grid)
```

**Cart indicator**: floating badge on cart icon in topbar  
**Stock 0**: button disabled, shows "Out of Stock"  
**Add**: increments in cart drawer, button changes to "In Cart (qty)"

**Components**:
- `ProductCard` (emoji, name, price, stock, add-to-cart button)
- `CartIcon` with badge (count)
- `CartDrawer` (slide-in panel from right)

**Data**: `GET /products`

---

### 5.8 CartDrawer (overlay on any page)

```
                              ┌─────────────────────┐
                              │  Your Grimoire Cart  │  ← Newsreader
                              │  ─────────────────── │
                              │  🍭 Pumpkin Lollipop │
                              │  $3.99   [−] 2 [+]  │
                              │  Subtotal: $7.98     │
                              │                      │
                              │  🫚 Witch Finger      │
                              │  $4.99   [−] 1 [+]  │
                              │  Subtotal: $4.99     │
                              │  ─────────────────── │
                              │  Total: $12.97       │
                              │                      │
                              │  [  Proceed to Pay ] │
                              │  [   Clear Cart    ] │
                              └─────────────────────┘
```

- Slide-in from right, `w-80`, dark overlay backdrop
- Qty controls: `−` / `+` buttons, delete on qty = 0
- "Proceed to Pay" → requires auth: if not logged in → modal "Please login to checkout" → redirect `/login`
- Empty state: "🕸️ Your cart is empty"

**Components**: `CartDrawer` (drawer container), `CartLineItem` (per product row), `QtyControl`

---

### 5.9 CheckoutPage (`/checkout`)

**Layout**: `StorefrontLayout` (minimal topbar only)  
**Guard**: requires `isAuthenticated`

```
Checkout
─────────────────────────────────────────────────────────────

┌──────────────────────────────────┐  ┌────────────────────┐
│  Shipping Information            │  │  Order Summary     │
│                                  │  │                    │
│  Full Name: [________________]   │  │  🍭 Lollipop ×2   │
│  Email:     [________________]   │  │  $7.98             │
│  Address:   [________________]   │  │                    │
│                                  │  │  🫚 Witch ×1       │
│  ─────────────────────────────── │  │  $4.99             │
│  Payment                         │  │                    │
│                                  │  │  ─────────────     │
│  [Stripe Payment Element]        │  │  Total: $12.97     │
│                                  │  └────────────────────┘
│  [      Place Order  🎃        ] │
└──────────────────────────────────┘
```

**Flow**:
1. Fill shipping form (name, email, address)
2. Stripe mounts `PaymentElement`
3. Click "Place Order" → `POST /stripe/create-payment-intent` → `stripe.confirmPayment()` → on success → `POST /orders` → redirect `/orders/:id` (success page)
4. Error: inline error below payment element

**Components**:
- `ShippingForm` (controlled form)
- `StripeWrapper` (wraps `Elements` provider)
- `PaymentSection` (Stripe `PaymentElement`)
- `OrderSummaryPanel` (read-only cart items + total)
- `PlaceOrderButton` (handles loading state)

**Data**: `POST /stripe/create-payment-intent`, `POST /orders`

---

### 5.10 CustomerOrdersPage (`/orders`)

**Layout**: `StorefrontLayout`  
**Guard**: requires `isAuthenticated`

Same look as Admin Orders but:
- No "Customer" column (it's always you)
- No status change (read-only)
- Simpler search (by order ID or product name)

```
My Orders                        [Search: __________________]

┌──────────────────────────────────────────────────────────┐
│  Order ID    Date         Total    Status                │
│  ────────────────────────────────────────────────────    │
│  ORD-0015    Apr 15       $12.97   [Delivered]           │
│  ORD-0008    Apr 10       $24.97   [Shipped]             │
│  ORD-0003    Apr 5        $8.99    [Processing●]         │
└──────────────────────────────────────────────────────────┘

← Prev   Page 1 of 2   Next →
```

**Data**: `GET /orders?page=N&q=query`

---

### 5.11 CustomerOrderDetailPage (`/orders/:id`)

**Layout**: `StorefrontLayout`

Same as Admin Order Detail minus the status change action.

```
← Back to Orders       Order ORD-0015        [Delivered]

[Items card]     [Shipping card]     [Payment card]
```

---

## 6. Component File Structure

```
frontend/src/
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── admin/
│   │   ├── AdminDashboardPage.tsx
│   │   ├── AdminOrdersPage.tsx
│   │   ├── AdminOrderDetailPage.tsx
│   │   └── AdminProductsPage.tsx
│   └── customer/
│       ├── ProductsPage.tsx
│       ├── CartPage.tsx          ← standalone cart page (optional)
│       ├── CheckoutPage.tsx
│       ├── CustomerOrdersPage.tsx
│       └── CustomerOrderDetailPage.tsx
│
├── components/
│   ├── layout/
│   │   ├── AuthLayout.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── StorefrontLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── AdminTopbar.tsx
│   │   ├── StorefrontTopbar.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── ui/                       ← design system primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx             ← status badges
│   │   ├── Card.tsx
│   │   ├── StatCard.tsx
│   │   ├── Table.tsx
│   │   ├── Pagination.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Spinner.tsx
│   │   ├── Skeleton.tsx
│   │   └── EmptyState.tsx
│   │
│   ├── dashboard/
│   │   ├── StatsRow.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── WeeklyYearlyToggle.tsx
│   │   └── BestsellersTable.tsx
│   │
│   ├── orders/
│   │   ├── OrdersTable.tsx
│   │   ├── OrderDetailHeader.tsx
│   │   ├── OrderItemsCard.tsx
│   │   ├── ShippingCard.tsx
│   │   ├── PaymentCard.tsx
│   │   └── StatusDropdown.tsx    ← admin only
│   │
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFormModal.tsx  ← admin only
│   │   └── ConfirmDialog.tsx
│   │
│   └── cart/
│       ├── CartDrawer.tsx
│       ├── CartLineItem.tsx
│       ├── QtyControl.tsx
│       └── CartIcon.tsx
│
├── checkout/                     ← kept separate (Stripe boundary)
│   ├── ShippingForm.tsx
│   ├── StripeWrapper.tsx
│   ├── PaymentSection.tsx
│   ├── OrderSummaryPanel.tsx
│   └── PlaceOrderButton.tsx
│
├── api/           (already done)
├── store/         (already done)
└── types/         (already done)
```

---

## 7. Implementation Order (Sprint 3 Plans)

| Plan | Scope | Key deliverables |
|------|-------|-----------------|
| PLAN-017 | Auth + Layouts | AuthLayout, AdminLayout, StorefrontLayout, ProtectedRoute, LoginPage, RegisterPage, routing |
| PLAN-018 | Admin pages | Dashboard, AdminOrders, AdminOrderDetail, AdminProducts |
| PLAN-019 | Storefront | ProductsPage, CartDrawer, CheckoutPage (+ Stripe) |
| PLAN-020 | Customer orders | CustomerOrdersPage, CustomerOrderDetailPage |

**Build each plan in order**: UI primitives first (Button, Input, Card…) → layout → page-specific components → data wiring → tests.

---

## 8. Key Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Dark mode | Always on (`dark` class on `<html>`) | Brand requirement — no light mode |
| Depth cues | Background color shifts, not borders | CLAUDE.md constraint |
| Role split | `/admin/*` vs `/` routes | Clean separation, easier ProtectedRoute logic |
| Cart state | localStorage per userId | Already implemented in cartStore.tsx |
| Stripe | `@stripe/react-stripe-js` `PaymentElement` | Handles all card UI, PCI compliant |
| Sidebar | Fixed 240px, not collapsible | Desktop-only (assignment scope) |
| Font loading | Google Fonts in index.html | Already in place |
| Chart | Recharts BarChart only | Matches spec — weekly/yearly toggle |
| No Customers page | Excluded | Per CLAUDE.md scope decision |
