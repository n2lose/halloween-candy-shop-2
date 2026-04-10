# Architecture Overview — Freddy's Halloween Candy Shop

## System Diagram

```
┌─────────────────────────────────────────────────────┐
│                   Browser                           │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │           React Frontend (port 5173)         │   │
│  │                                              │   │
│  │  ┌──────────┐  ┌───────────┐  ┌──────────┐  │   │
│  │  │  Login   │  │ Dashboard │  │  Orders  │  │   │
│  │  │  Page    │  │   Page    │  │   Page   │  │   │
│  │  └──────────┘  └───────────┘  └──────────┘  │   │
│  │                                              │   │
│  │  ┌──────────────────────────────────────┐    │   │
│  │  │    API Client (axios + interceptors) │    │   │
│  │  │    - Attach access_token to headers  │    │   │
│  │  │    - Auto-refresh on 401             │    │   │
│  │  └──────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────┘   │
│                        │ HTTP                        │
└────────────────────────┼────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│            Express Backend (port 3001)              │
│                                                     │
│  ┌─────────────┐  ┌────────────┐  ┌─────────────┐  │
│  │    /login   │  │ /dashboard │  │   /orders   │  │
│  │    /refresh │  │            │  │             │  │
│  └─────────────┘  └────────────┘  └─────────────┘  │
│         │                │                │         │
│  ┌──────▼────────────────▼────────────────▼──────┐  │
│  │           JWT Middleware (auth guard)         │  │
│  └───────────────────────────────────────────────┘  │
│                        │                            │
│  ┌─────────────────────▼──────────────────────────┐ │
│  │          In-Memory Data Store (JSON)           │ │
│  │   orders.ts  |  products.ts  |  users.ts      │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## Frontend Architecture

```
frontend/src/
├── pages/
│   ├── LoginPage.tsx        ← form, calls /login, stores tokens
│   ├── DashboardPage.tsx    ← stats cards + chart + bestsellers table
│   └── OrdersPage.tsx       ← search input + orders table + pagination
├── components/
│   ├── Layout/
│   │   ├── Sidebar.tsx      ← logo, nav links, logout button
│   │   └── ProtectedRoute.tsx ← redirect to /login if no token
│   ├── Dashboard/
│   │   ├── StatsCard.tsx    ← Today/LastWeek/LastMonth widget
│   │   ├── RevenueChart.tsx ← bar chart with weekly/yearly toggle
│   │   └── BestsellersTable.tsx
│   └── Orders/
│       ├── OrdersTable.tsx  ← table with status colour coding
│       ├── SearchBar.tsx
│       └── Pagination.tsx
├── api/
│   ├── client.ts            ← axios instance + request/response interceptors
│   ├── auth.ts              ← login(), refresh()
│   ├── dashboard.ts         ← getDashboard()
│   └── orders.ts            ← getOrders(page, query)
├── store/
│   └── authStore.ts         ← tokens in localStorage + zustand/context
└── types/
    └── index.ts             ← shared TypeScript interfaces
```

## Backend Architecture

```
backend/src/
├── auth/
│   ├── auth.router.ts       ← POST /login, POST /refresh
│   ├── auth.service.ts      ← validateCredentials(), generateTokens()
│   └── auth.middleware.ts   ← verifyAccessToken() guard
├── dashboard/
│   ├── dashboard.router.ts  ← GET /dashboard
│   └── dashboard.service.ts ← computeStats(), getSalesOverview(), getBestsellers()
├── orders/
│   ├── orders.router.ts     ← GET /orders
│   └── orders.service.ts    ← listOrders(page, query)
├── data/
│   ├── orders.ts            ← mock orders array (~30 items)
│   ├── products.ts          ← Halloween candy products
│   └── users.ts             ← { freddy: "ElmStreet2019" }
├── types/
│   └── index.ts             ← Order, Product, DashboardResponse types
└── app.ts                   ← Express setup, CORS, routes mount
```

## Key Technical Decisions

See `adr/` folder for detailed reasoning. Summary:

| Decision | Choice | Reason |
|----------|--------|--------|
| Data store | In-memory JSON | Assignment scope, no DB setup needed |
| Auth | JWT (jsonwebtoken) | Required by spec |
| Frontend state | React Context + localStorage | Simple, no extra dependency |
| Chart library | Recharts | TypeScript-first, easy to use with React |
| HTTP client | Axios | Interceptor support for auto token refresh |
| Styling | CSS Modules | No extra dependency, scoped styles |

## Token Flow

```
Login ──────────────────────────────────────────────────────────┐
  │                                                             │
  │  POST /login ──► { access_token (15min), refresh_token }   │
  │  Store both in localStorage                                 │
  │                                                             │
  ▼                                                             │
API Request ────────────────────────────────────────────────────┤
  │                                                             │
  │  Axios interceptor adds: Authorization: Bearer <access>     │
  │                                                             │
  │  If 401 ──► try POST /refresh with refresh_token           │
  │             │                                              │
  │             ├── success ──► retry original request         │
  │             └── fail    ──► logout, redirect /login        │
  │                                                             │
  ▼                                                             │
Response ───────────────────────────────────────────────────────┘
```
