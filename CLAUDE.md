# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack analytics dashboard for Freddy's Halloween candy shop. **Assignment project** — no production database, uses in-memory TypeScript arrays. The code has not been written yet; this repo contains planning docs and is ready for implementation.

**User flow**: Login → Dashboard (stats + chart + bestsellers) → Orders (search + pagination)

---

## Commands

```bash
# Backend (port 3001)
cd backend && npm run dev       # dev server
cd backend && npm test          # all tests
cd backend && npx jest auth     # run single test file/folder
cd backend && npm run lint
cd backend && npm run build

# Frontend (port 5173)
cd frontend && npm run dev
cd frontend && npm run build    # outputs to public/
cd frontend && npm run lint
```

---

## Architecture

Two independent packages: `backend/` and `frontend/` (neither exists yet — create both).

### Backend (`backend/src/`)

Each feature follows the pattern `*.router.ts` (Express routes) + `*.service.ts` (business logic):

```
auth/           auth.router.ts, auth.service.ts, auth.middleware.ts
dashboard/      dashboard.router.ts, dashboard.service.ts
orders/         orders.router.ts, orders.service.ts
data/           orders.ts, products.ts, users.ts  ← in-memory mock arrays
types/          index.ts  ← shared interfaces
app.ts          Express setup, CORS, route mounting
```

`auth.middleware.ts` exports `verifyAccessToken()` — applied to all routes except `/login` and `/refresh`.

### Frontend (`frontend/src/`)

```
pages/          LoginPage.tsx, DashboardPage.tsx, OrdersPage.tsx
components/     Layout/{Sidebar,ProtectedRoute}, Dashboard/{StatsCard,RevenueChart,BestsellersTable}, Orders/{OrdersTable,SearchBar,Pagination}
api/            client.ts (axios instance), auth.ts, dashboard.ts, orders.ts
store/          authStore.ts  ← tokens in localStorage
types/          index.ts
```

`api/client.ts` is the single axios instance with two interceptors:
1. **Request**: attach `Authorization: Bearer <access_token>`
2. **Response**: on 401 → call `POST /refresh` → retry original request → on refresh failure → logout + redirect `/login`

The Dashboard `RevenueChart` uses a single Recharts `BarChart` with a weekly/yearly toggle that swaps the data source.

---

## API Contracts

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/login` | No | Returns `{ access_token, refresh_token }` |
| POST | `/refresh` | Refresh token in Bearer header | Returns `{ access_token }` |
| GET | `/dashboard` | Access token | Returns `{ stats, sales_overview, bestsellers }` |
| GET | `/orders?page=1&q=` | Access token | Returns `{ orders, total, page }` |

Token specs: access token 15min, refresh token 30 days. Full shapes in `docs/specs/api-spec.md`.

---

## Coding Conventions

- TypeScript strict mode — no `any`, use `unknown` if needed
- Functions max 30 lines — split if longer
- Error responses always: `{ "error": "message" }`
- File naming: camelCase for TS files (`authService.ts`), PascalCase for React components (`LoginPage.tsx`)

---

## Implementation Workflow

Plans live in `docs/plans/` (PLAN-001 through PLAN-008, currently DRAFT). Work on a feature only after its plan is **APPROVED**:

```
DRAFT → (review) → APPROVED → implement → DONE
```

Branch per plan: `feat/PLAN-00X-short-description`

---

## Mock Data

- **Credentials**: `{ username: "freddy", password: "ElmStreet2019" }` (only user, no registration)
- **Products**: Pumpkin Spice Lollipop, Witch Finger Gummy, Skull Chocolate Bar, Spider Web Cotton Candy, Ghost Marshmallow, Cauldron Caramel Apple, Vampire Fang Candy Corn, Black Cat Licorice, Frankenstein Fudge, Zombie Brain Gummy
- **Orders**: ~30 mock orders spread across last 7 days and 12 months (for chart data)

---

## Key Constraints

- In-memory data resets on server restart (acceptable for assignment)
- Token storage in localStorage (acceptable for assignment)
- UI designs: `docs/Designs/Freddys_Dashboard.png`, `Freddys_Login.png`, `Freddys_Orders.png`
