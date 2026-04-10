# Project Roadmap — Freddy's Halloween Candy Shop

## Sprint Overview

```
Sprint 1 (Backend)          Sprint 2 (Frontend)         Done
────────────────────         ────────────────────        ─────
PLAN-001 Backend setup   →   PLAN-005 Frontend setup  →  Full-stack working
PLAN-002 Auth API        →   PLAN-006 Login page      →  Manual tested
PLAN-003 Dashboard API   →   PLAN-007 Dashboard page  →  README written
PLAN-004 Orders API      →   PLAN-008 Orders page     →  Deliverable ready
```

## Sprint 1 — Backend

**Goal**: API hoàn chỉnh, test được bằng curl/Postman

| Task | Plan | Status | Notes |
|------|------|--------|-------|
| Express project setup + TypeScript config | PLAN-001 | TODO | |
| Mock data (orders, products, users) | PLAN-001 | TODO | ~30 Halloween candy orders |
| POST /login | PLAN-002 | TODO | JWT 15min + 30d |
| POST /refresh | PLAN-002 | TODO | |
| JWT middleware | PLAN-002 | TODO | Guard cho /dashboard, /orders |
| GET /dashboard | PLAN-003 | TODO | Stats + chart + bestsellers |
| GET /orders | PLAN-004 | TODO | Pagination + search |

**Done criteria**: All endpoints respond correctly, tested với curl

---

## Sprint 2 — Frontend

**Goal**: React app kết nối backend, match designs

| Task | Plan | Status | Notes |
|------|------|--------|-------|
| Vite + React + TypeScript setup | PLAN-005 | TODO | |
| Axios client + token interceptors | PLAN-005 | TODO | Auto-refresh on 401 |
| React Router setup | PLAN-005 | TODO | /login, /dashboard, /orders |
| Login page | PLAN-006 | TODO | Match Freddys_Login.png |
| Token storage + ProtectedRoute | PLAN-006 | TODO | |
| Dashboard page — stats cards | PLAN-007 | TODO | |
| Dashboard page — bar chart + toggle | PLAN-007 | TODO | Recharts |
| Dashboard page — bestsellers table | PLAN-007 | TODO | |
| Orders page — table + status colours | PLAN-008 | TODO | |
| Orders page — search | PLAN-008 | TODO | |
| Orders page — pagination | PLAN-008 | TODO | |

**Done criteria**: All screens match designs, tokens auto-refresh works

---

## Bonus (nếu có thời gian)

| Item | Priority |
|------|----------|
| Unit tests cho backend services | HIGH |
| Loading & error states trên frontend | MEDIUM |
| Docker setup (docker-compose.yml) | LOW |
| React Query thay cho bare axios | LOW |

---

## Milestones

| Milestone | Condition |
|-----------|-----------|
| **M1: API Ready** | Tất cả Sprint 1 tasks DONE, test được bằng curl |
| **M2: App Working** | Login → Dashboard → Orders flow hoạt động end-to-end |
| **M3: Deliverable** | README viết xong, `public/` folder có production build |
