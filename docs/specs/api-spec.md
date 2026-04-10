# API Specification — Freddy's Halloween Candy Shop

**Version**: 3.0.0 (APPROVED — 2026-04-10 by Lam Nguyen)
**Base URL**: `http://localhost:3001`
**Auth**: Bearer JWT (access token in Authorization header)

---

## Merge Decision Log

| Endpoint | Source | Lý do giữ / bỏ |
|----------|--------|----------------|
| `POST /login` | v1.0 | Core requirement của assignment |
| `POST /refresh` | v1.0 | Core requirement của assignment |
| `GET /dashboard` | v1.0 | **Main feature** — có trong cả 3 designs |
| `GET /orders?page&q` | v1.0 | Core requirement, có search + pagination |
| `POST /register` | v2.0 | Thêm vào — hoàn thiện auth flow |
| `GET /auth/me` | v2.0 | Thêm vào — cần cho frontend hiển thị username |
| `GET /products` | v2.0 | Thêm vào — hợp lý cho candy shop |
| `GET /products/:id` | v2.0 | Thêm vào — cặp với GET /products |
| Stripe flow | v2.0 | ❌ Bỏ — quá phức tạp, không có trong designs |
| `POST /orders` | v2.0 | ❌ Bỏ — phụ thuộc Stripe |
| `GET /orders/:id` | v2.0 | ❌ Bỏ — không có trong requirements gốc |

**Tổng: 8 endpoints** — 2 public auth, 2 public products, 4 protected

---

## Authentication — `/auth`

### POST `/auth/register`

**Description**: Tạo tài khoản mới. Trả về token pair ngay sau khi đăng ký.

**Request**:
```json
{
  "username": "jane",
  "password": "SecretPass123"
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
{ "error": "Username already taken" }
```

---

### POST `/auth/login`

**Description**: Đăng nhập, trả về token pair.

**Request**:
```json
{
  "username": "freddy",
  "password": "ElmStreet2019"
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
- `access_token`: expires **15 minutes**, payload `{ sub, username, iat, exp }`
- `refresh_token`: expires **30 days**, payload `{ sub, type: "refresh", iat, exp }`

---

### POST `/auth/refresh`

**Description**: Đổi refresh token lấy access token mới.

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

**Description**: Trả về thông tin user đang đăng nhập. Frontend dùng để hiển thị username trên sidebar.

**Response 200**:
```json
{
  "id": 1,
  "username": "freddy"
}
```

---

## Products — `/products`

### GET `/products`

**Auth required**: No

**Description**: Danh sách 10 Halloween candy products.

**Response 200**:
```json
[
  {
    "id": 1,
    "name": "Pumpkin Spice Lollipop",
    "price": 2.99
  }
]
```

---

### GET `/products/:id`

**Auth required**: No

**Response 200**:
```json
{
  "id": 1,
  "name": "Pumpkin Spice Lollipop",
  "price": 2.99
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

**Description**: Tổng hợp analytics data cho Freddy. Tính toán từ mock orders data.

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
      { "label": "month 3",    "revenue": 76000 },
      { "label": "month 4",    "revenue": 91000 },
      { "label": "month 5",    "revenue": 83000 },
      { "label": "month 6",    "revenue": 67000 },
      { "label": "month 7",    "revenue": 54000 },
      { "label": "month 8",    "revenue": 48000 },
      { "label": "month 9",    "revenue": 61000 },
      { "label": "month 10",   "revenue": 72000 },
      { "label": "month 11",   "revenue": 89000 },
      { "label": "month 12",   "revenue": 105000 }
    ]
  },
  "bestsellers": [
    { "name": "Pumpkin Spice Lollipop",  "price": 2.99, "units_sold": 342, "revenue": 1022.58 },
    { "name": "Witch Finger Gummy",      "price": 3.49, "units_sold": 289, "revenue": 1008.61 },
    { "name": "Skull Chocolate Bar",     "price": 4.99, "units_sold": 201, "revenue": 1002.99 },
    { "name": "Spider Web Cotton Candy", "price": 1.99, "units_sold": 487, "revenue":  969.13 },
    { "name": "Ghost Marshmallow",       "price": 2.49, "units_sold": 376, "revenue":  936.24 }
  ]
}
```

---

## Orders — `/orders`

### GET `/orders`

**Auth required**: Yes (access token)

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
      "id": 1,
      "product": "Pumpkin Spice Lollipop",
      "customer": "John Doe",
      "date": "2025-10-28",
      "price": 2.99,
      "status": "delivered"
    }
  ],
  "total": 30,
  "page": 1,
  "per_page": 10,
  "total_pages": 3
}
```

**Status values**: `processing` | `shipped` | `delivered`

---

## Error Responses

| Status | When |
|--------|------|
| 400 | Missing or invalid fields |
| 401 | Missing, invalid, or expired token |
| 404 | Resource not found |
| 500 | Internal server error |

**Error format**:
```json
{ "error": "Human-readable message" }
```
