# API Specification — Freddy's Halloween Candy Shop

**Version**: 1.0.0
**Base URL**: `http://localhost:3001`
**Auth**: Bearer JWT (access token in Authorization header)

---

## Authentication

### POST `/login`

**Description**: Authenticate user, return JWT token pair.

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
- `access_token`: expires in **15 minutes**, payload `{ sub, username, iat, exp }`
- `refresh_token`: expires in **30 days**, payload `{ sub, type: "refresh", iat, exp }`

---

### POST `/refresh`

**Description**: Exchange a valid refresh token for a new access token.

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

## Dashboard

### GET `/dashboard`

**Auth required**: Yes (access token)

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

## Orders

### GET `/orders`

**Auth required**: Yes (access token)

**Query params**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number (1-based) |
| `q` | string | `""` | Search term — matches product name or customer name |

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

**Search behaviour**: case-insensitive, partial match on `product` OR `customer`.

---

## Error Responses

| Status | When |
|--------|------|
| 400 | Missing required fields |
| 401 | Missing/invalid/expired token |
| 404 | Resource not found |
| 500 | Internal server error |

**Error format**:
```json
{ "error": "Human-readable message" }
```
