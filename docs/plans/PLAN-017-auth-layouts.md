# PLAN-017: Auth + Layouts + UI Primitives

**Status**: DONE  
**Branch**: `feat/PLAN-017-auth-layouts`  
**Completed**: 2026-04-20

---

## Context

First frontend plan. Built on scaffold from PLAN-007 (Vite + React + Tailwind + stores + API layer).  
Fixed type/API mismatches from Sprint 2 backend refactor, built design-system primitives, created layouts, wired all routes with role-based guards.

**Design reference**: `docs/designs/stitch/` + `docs/designs/FRONTEND_DESIGN.md`

---

## Tasks

- [x] Task 1: `types/index.ts` — add `role` to UserProfile, add `AuthResponse`, `AdminOrderSummary`, `PaginatedOrders<T>`
- [x] Task 2: `api/auth.ts` — update register/login return type to `AuthResponse` (matches PLAN-013 backend)
- [x] Task 3: `store/authStore.tsx` — re-hydrate user via `GET /auth/me` on page load (Promise chain, no sync setState in effect)
- [x] Task 4: `index.css` — add noise texture overlay (`.noise-overlay`) + atmospheric glow (`.atelier-glow`)
- [x] Task 5: UI Primitives — `Button`, `Input`, `Badge`, `Card`, `StatCard`, `Spinner`, `EmptyState`, `Pagination`, `SearchBar`
- [x] Task 6: `pages/auth/LoginPage.tsx` — faithful to Stitch design (glassmorphism card, gradient button, tertiary focus ring)
- [x] Task 7: `pages/auth/RegisterPage.tsx` — same aesthetic, redirects to `/products`
- [x] Task 8: `components/shared/ProtectedRoute.tsx` — handles loading hydration, role-based redirect
- [x] Task 9: `layouts/Sidebar.tsx` — `rounded-r-full` active state, brand header, user info, logout
- [x] Task 10: `layouts/AdminLayout.tsx` — glassmorphism topbar (`backdrop-blur-xl`), content canvas `ml-64 pt-16`
- [x] Task 11: `layouts/StorefrontLayout.tsx` — sticky topbar, cart icon with badge, drawer stub, user actions
- [x] Task 12: `routes/AppRoutes.tsx` — all routes: public / admin (role="admin") / storefront (auth required)
- [x] Task 13: `App.tsx` — noise overlay + AppRoutes

## Key design decisions

- `setLoading(true)` in event handlers (not in useEffect) to satisfy `react-hooks/set-state-in-effect` ESLint rule
- Auth hydration uses Promise chain (not synchronous setState in effect)
- Sidebar active state: `border-l-4 border-primary rounded-r-full bg-surface-container-high` — exact Stitch pattern
- Login uses native `<input>` markup (not `<Input>` component) to match Stitch's `group-focus-within` label pattern

## Verification

```bash
cd frontend && npm run lint   # 0 errors
cd frontend && npx tsc --noEmit  # 0 errors
# http://localhost:5173/ → redirect /login → login as admin → /admin/dashboard
# Refresh → user still logged in (hydration works)
# Visit /admin/dashboard as customer → redirect /products
```
