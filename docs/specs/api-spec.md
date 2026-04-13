# API Specification — Freddy's Halloween Candy Shop

**Version**: 2.1.0 (APPROVED — 2026-04-13 by Lam Nguyen)
**Base URL**: `http://localhost:3001`
**Auth**: Bearer JWT (access token in Authorization header)

---

## Authentication — `/auth`

### POST `/auth/register`

**Description**: Create a new account, return token pair.

**Request**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secretPassword123"
}
```

**Response 201**:
```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>"
}
```

**Response 400**:
```json
{ "error": "Email already registered" }
```

---

### POST `/auth/login`

**Description**: Login with email and password, return token pair.

**Request**:
```json
{
  "email": "jane@example.com",
  "password": "secretPassword123"
}
```

**Response 200**:
```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>"
}
```

**Response 401**:
```json
{ "error": "Invalid credentials" }
```

**Token specs**:
- `access_token`: expires **15 minutes**, payload `{ sub, email, name, iat, exp }`
- `refresh_token`: expires **30 days**, payload `{ sub, type: "refresh", iat, exp }`

---

### POST `/auth/refresh`

**Description**: Exchange refresh token for a new access token.

**Headers**:
```
Authorization: Bearer <refresh_token>
```

**Response 200**:
```json
{ "access_token": "<new_jwt>" }
```

**Response 401**:
```json
{ "error": "Invalid or expired refresh token" }
```

---

### GET `/auth/me`

**Auth required**: Yes (access token)

**Response 200**:
```json
{
  "id": "usr_abc123",
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

---

## Products — `/products`

### GET `/products`

**Auth required**: No

**Response 200**:
```json
[
  {
    "id": "prod_1",
    "name": "Pumpkin Spice Lollipop",
    "emoji": "🎃",
    "price": 2.99,
    "stock": 100
  }
]
```

---

### GET `/products/:id`

**Auth required**: No

**Response 200**:
```json
{
  "id": "prod_1",
  "name": "Pumpkin Spice Lollipop",
  "emoji": "🎃",
  "price": 2.99,
  "stock": 100
}
```

**Response 404**:
```json
{ "error": "Product not found" }
```

---

## Dashboard — `/dashboard`

### GET `/dashboard`

**Auth required**: Yes (access token)

**Description**: Aggregated analytics data. Computed from mock orders data.

**Response 200**:
```json
{
  "stats": {
    "today":      { "revenue": 1456, "orders": 9 },
    "last_week":  { "revenue": 34000, "orders": 120 },
    "last_month": { "revenue": 95000, "orders": 876 }
  },
  "sales_overview": {
    "weekly": [
      { "label": "today",     "revenue": 1456 },
      { "label": "yesterday", "revenue": 3200 },
      { "label": "day 3",     "revenue": 2800 },
      { "label": "day 4",     "revenue": 4100 },
      { "label": "day 5",     "revenue": 3750 },
      { "label": "day 6",     "revenue": 5200 },
      { "label": "day 7",     "revenue": 4600 }
    ],
    "yearly": [
      { "label": "this month", "revenue": 95000 },
      { "label": "last month", "revenue": 88000 },
      ...12 items total
    ]
  },
  "bestsellers": [
    { "name": "Pumpkin Spice Lollipop", "price": 2.99, "units_sold": 342, "revenue": 1022.58 },
    { "name": "Witch Finger Gummy",     "price": 3.49, "units_sold": 289, "revenue": 1008.61 },
    { "name": "Skull Chocolate Bar",    "price": 4.99, "units_sold": 201, "revenue": 1002.99 },
    { "name": "Spider Web Cotton Candy","price": 1.99, "units_sold": 487, "revenue": 969.13 },
    { "name": "Ghost Marshmallow",      "price": 2.49, "units_sold": 376, "revenue": 936.24 }
  ]
}
```

---

## Stripe — `/stripe`

### POST `/stripe/create-payment-intent`

**Auth required**: Yes (access token)

**Description**: Create a Stripe PaymentIntent based on cart items. Frontend uses `clientSecret` to confirm payment via Stripe.js.

**Request**:
```json
{
  "items": [
    { "productId": "prod_1", "quantity": 2 }
  ]
}
```

**Response 200**:
```json
{
  "clientSecret": "pi_xxx_secret_yyy",
  "amount": 599
}
```

**Response 400**:
```json
{ "error": "Invalid items" }
```

---

## Orders — `/orders`

### POST `/orders`

**Auth required**: Yes (access token)

**Description**: Create an order after Stripe payment succeeded. Backend verifies PaymentIntent before persisting.

**Request**:
```json
{
  "paymentIntentId": "pi_xxx",
  "customer": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "address": "123 Elm St, Springfield"
  },
  "items": [
    { "productId": "prod_1", "quantity": 2 }
  ]
}
```

**Response 201**:
```json
{
  "orderId": "ORD-0001",
  "items": [
    {
      "productId": "prod_1",
      "name": "Pumpkin Spice Lollipop",
      "quantity": 2,
      "unitPrice": 2.99,
      "subtotal": 5.98
    }
  ],
  "shipping": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "address": "123 Elm St, Springfield"
  },
  "payment": {
    "last4": "4242",
    "status": "succeeded"
  },
  "total": 5.98,
  "createdAt": "2026-04-10T08:00:00.000Z"
}
```

**Response 400**:
```json
{ "error": "Payment not confirmed" }
```

---

### GET `/orders`

**Auth required**: Yes (access token)

**Description**: Current user's order history. Returns only orders belonging to that user.

**Query params**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number (1-based) |
| `q` | string | `""` | Search — matches product name OR customer name (case-insensitive) |

**Response 200**:
```json
{
  "orders": [
    {
      "orderId": "ORD-0001",
      "total": 5.98,
      "status": "processing",
      "createdAt": "2026-04-10T08:00:00.000Z"
    }
  ],
  "total": 12,
  "page": 1,
  "per_page": 10,
  "total_pages": 2
}
```

**Status values**: `processing` | `shipped` | `delivered`

---

### GET `/orders/:id`

**Auth required**: Yes (access token)

**Description**: Single order detail. Returns 403 if the order does not belong to the current user.

**Response 200**:
```json
{
  "orderId": "ORD-0001",
  "items": [
    {
      "productId": "prod_1",
      "name": "Pumpkin Spice Lollipop",
      "quantity": 2,
      "unitPrice": 2.99,
      "subtotal": 5.98
    }
  ],
  "shipping": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "address": "123 Elm St, Springfield"
  },
  "payment": {
    "last4": "4242",
    "status": "succeeded"
  },
  "total": 5.98,
  "createdAt": "2026-04-10T08:00:00.000Z"
}
```

**Response 403**:
```json
{ "error": "Forbidden" }
```

**Response 404**:
```json
{ "error": "Order not found" }
```

---

## Error Responses

| Status | When |
|--------|------|
| 400 | Missing/invalid fields |
| 401 | Missing, invalid, or expired token |
| 403 | Resource does not belong to current user |
| 404 | Resource not found |
| 500 | Internal server error |

**Error format**:
```json
{ "error": "Human-readable message" }
```

---

## Payment Flow (Stripe Test Mode)

```
1. Frontend  →  POST /stripe/create-payment-intent { items }
2. Backend   →  Stripe API: createPaymentIntent(amount)
3. Backend   →  return { clientSecret }
4. Frontend  →  stripe.confirmCardPayment(clientSecret, { card })
5. Stripe    →  return { paymentIntent.status: "succeeded" }
6. Frontend  →  POST /orders { paymentIntentId, customer, items }
7. Backend   →  Stripe API: verify paymentIntent.status === "succeeded"
8. Backend   →  persist order, return order detail
```

**Test card**: `4242 4242 4242 4242` | Any future expiry | Any CVV

---

## Clarifications & Edge Cases

### Authentication

- **User ID format**: Internal storage uses auto-increment `number`. API responses format as `"usr_{id}"` (e.g., `"usr_1"`). JWT payload `sub` remains `number`.
- **Email case sensitivity**: All emails are normalized to lowercase before storage and comparison. `Freddy@Halloween.Shop` matches `freddy@halloween.shop`.
- **Password validation**: Minimum 6 characters, maximum 100 characters. No complexity rules. `confirmPassword` is frontend-only validation — not sent to API.

### Products & Stock

- **Stock is read-only**: Stock values are for display only. No decrement on purchase (acceptable for assignment scope — in-memory data resets on restart).

### Stripe & Orders

- **Duplicate PaymentIntent guard**: Backend must track used `paymentIntentId` values. If a `paymentIntentId` has already been used to create an order, return `400 { "error": "Payment already used" }`.
- **Items validation**: `POST /stripe/create-payment-intent` and `POST /orders` must validate:
  - `items` array is non-empty
  - Each `productId` exists in the products list
  - Each `quantity` is a positive integer
  - Return `400 { "error": "Invalid items" }` on failure
- **Amount calculation**: Backend calculates total in cents using `Math.round(price * 100) * quantity` per item to avoid floating-point precision issues. Client-provided prices are never trusted.

### Orders Search & Pagination

- **Pagination boundaries**: `page` defaults to `1`. Values `< 1` are clamped to `1`. Values exceeding `total_pages` return `{ orders: [], total, page, per_page: 10, total_pages }`.
- **Empty results**: New users with 0 orders receive `{ orders: [], total: 0, page: 1, per_page: 10, total_pages: 0 }`.
- **Search safety**: The `q` parameter uses string `includes()` matching (case-insensitive), not regex, to avoid injection of special characters.

### Dashboard

- **Timezone**: All date calculations use the server's local timezone (acceptable for assignment). No timezone conversion.
- **Bestsellers scope**: Computed from **all orders** (all-time), not filtered by time period.
- **Consistency**: `stats.today.revenue` and `sales_overview.weekly[0].revenue` are computed in the same request from the same data source, so they are always consistent.
