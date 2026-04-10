# Project Roadmap — Freddy's Halloween Candy Shop

## Sprint Overview

```
Sprint 1 — Backend API          Sprint 2 — Frontend             Deliverable
─────────────────────           ────────────────────            ──────────
PLAN-001 Backend setup     →    PLAN-006 Frontend setup    →    Full-stack working
PLAN-002 Auth API          →    PLAN-007 Login page        →    Manual tested
PLAN-003 Products API      →    PLAN-008 Dashboard page    →    README written
PLAN-004 Dashboard API     →    PLAN-009 Orders page       →    public/ built
PLAN-005 Orders API
```

## Sprint 1 — Backend API

**Goal**: Tất cả 8 endpoints hoạt động, test được bằng curl

| Task | Plan | Status |
|------|------|--------|
| Express + TypeScript project setup | PLAN-001 | TODO |
| Mock data: users, products, orders | PLAN-001 | TODO |
| `POST /auth/register` | PLAN-002 | TODO |
| `POST /auth/login` | PLAN-002 | TODO |
| `POST /auth/refresh` | PLAN-002 | TODO |
| `GET /auth/me` + JWT middleware | PLAN-002 | TODO |
| `GET /products` | PLAN-003 | TODO |
| `GET /products/:id` | PLAN-003 | TODO |
| `GET /dashboard` | PLAN-004 | TODO |
| `GET /orders?page&q` | PLAN-005 | TODO |

**Done criteria**: All endpoints tested với curl, error cases handled

---

## Sprint 2 — Frontend

**Goal**: React app kết nối backend, match designs

| Task | Plan | Status |
|------|------|--------|
| Vite + React + TypeScript + Router setup | PLAN-006 | TODO |
| Axios client + token interceptors (auto-refresh) | PLAN-006 | TODO |
| Login page — match `Freddys_Login.png` | PLAN-007 | TODO |
| ProtectedRoute (redirect to /login if no token) | PLAN-007 | TODO |
| Dashboard — stats cards (Today/Week/Month) | PLAN-008 | TODO |
| Dashboard — bar chart with weekly/yearly toggle | PLAN-008 | TODO |
| Dashboard — bestsellers table | PLAN-008 | TODO |
| Sidebar (logo + nav: Dashboard, Orders, Logout) | PLAN-008 | TODO |
| Orders — table with status colour coding | PLAN-009 | TODO |
| Orders — search input | PLAN-009 | TODO |
| Orders — pagination | PLAN-009 | TODO |

**Done criteria**: All screens match designs, token auto-refresh works

---

## Bonus (nếu có thời gian)

| Item | Priority |
|------|----------|
| Unit tests cho backend services (PLAN-002 → 005) | HIGH |
| Loading & error states trên frontend | MEDIUM |
| Docker setup (docker-compose.yml) | LOW |

---

## Milestones

| Milestone | Condition |
|-----------|-----------|
| **M1: API Ready** | Sprint 1 done, all endpoints tested với curl |
| **M2: App Working** | Login → Dashboard → Orders flow end-to-end |
| **M3: Deliverable** | README xong, `public/` folder có production build |
