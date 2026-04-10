# ADR-001: Tech Stack Decisions

**Date**: 2026-04-10
**Status**: ACCEPTED
**Decided by**: Lam Nguyen

---

## Context

Freddy's Halloween Candy Shop là một full-stack assignment với yêu cầu:
- Frontend: TypeScript + React
- Backend: Node.js + Express + JWT
- Data: In-memory hoặc JSON file

Cần quyết định các thư viện cụ thể trước khi bắt đầu code.

---

## Decisions

### 1. Chart Library: Recharts

**Alternatives considered**: Chart.js, Victory, Nivo

**Chosen**: Recharts

**Reason**:
- TypeScript-native, không cần @types/... riêng
- React component-based API — dễ integrate
- `<BarChart>` và `<ResponsiveContainer>` đủ cho yêu cầu

---

### 2. Frontend State Management: React Context + localStorage

**Alternatives considered**: Zustand, Redux Toolkit, React Query

**Chosen**: React Context + localStorage

**Reason**:
- Assignment scope nhỏ — Zustand/Redux là overkill
- Context đủ để share auth state (tokens, user)
- localStorage cho token persistence đơn giản
- Bonus: có thể nâng cấp lên Zustand sau (xem Bonus Points trong requirements)

---

### 3. HTTP Client: Axios

**Alternatives considered**: fetch API, ky

**Chosen**: Axios

**Reason**:
- Interceptor support là key requirement — cần auto-refresh token khi 401
- Fetch API không có interceptors built-in (phải wrap thủ công)
- Axios interceptors cho phép retry original request sau refresh

---

### 4. Styling: CSS Modules

**Alternatives considered**: Tailwind CSS, Styled Components, plain CSS

**Chosen**: CSS Modules

**Reason**:
- Không cần cài thêm dependency
- Scoped styles — không conflict giữa components
- Đủ nhanh cho assignment này

---

### 5. Backend Data: In-memory TypeScript arrays

**Alternatives considered**: SQLite (better-sqlite3), lowdb (JSON file)

**Chosen**: In-memory TypeScript arrays

**Reason**:
- Assignment cho phép in-memory
- Không cần setup DB
- TypeScript arrays dễ seed mock data Halloween candy
- Trade-off chấp nhận được: data reset khi restart server

---

### 6. Backend Project Structure: Feature-based modules

**Chosen**: Mỗi feature (auth, dashboard, orders, products, stripe) có folder riêng với router + service

**Reason**:
- Tách concerns rõ ràng
- Dễ test từng service independently
- Scale tốt nếu cần thêm feature sau

---

### 7. Payment: Stripe (test mode)

**Alternatives considered**: Mock payment (fake form), no payment

**Chosen**: Stripe SDK — `stripe` (backend), `@stripe/react-stripe-js` + `@stripe/stripe-js` (frontend)

**Reason**:
- Spec v2.0 yêu cầu real payment flow
- Stripe tokenises card data client-side → card details không đi qua backend (PCI compliance)
- Test mode với `sk_test_` / `pk_test_` keys — không charge tiền thật
- PaymentIntent API pattern: frontend confirm → backend verify → persist order

---

### 8. Password Hashing: bcryptjs

**Alternatives considered**: bcrypt (native C++ binding), argon2

**Chosen**: bcryptjs (pure JavaScript)

**Reason**:
- Không cần native build tools (node-gyp) — setup đơn giản hơn
- Performance đủ cho assignment scope (ít users)
- API giống hệt bcrypt — dễ swap nếu cần

---

### 9. Routing: React Router v6

**Alternatives considered**: TanStack Router, wouter

**Chosen**: React Router v6

**Reason**:
- Standard routing library cho React SPA
- `<Outlet>` pattern phù hợp cho nested layout (Sidebar + ProtectedRoute)
- `<NavLink>` có active state styling built-in

---

### 10. Testing: Jest + Supertest

**Alternatives considered**: Vitest, Mocha

**Chosen**: Jest + Supertest (backend)

**Reason**:
- Jest là standard testing framework cho Node.js + TypeScript (via ts-jest)
- Supertest cho phép test Express routes mà không cần start server
- Phù hợp với app.ts / server.ts split pattern

---

## Consequences

- Frontend: `npm install recharts axios react-router-dom @stripe/react-stripe-js @stripe/stripe-js`
- Backend: `npm install jsonwebtoken cors bcryptjs dotenv stripe`
- DevDeps: `typescript ts-node-dev jest ts-jest supertest` + tất cả @types
- Không cần database setup
- Token refresh logic nằm ở axios interceptor trong `api/client.ts`
- Card data xử lý hoàn toàn bởi Stripe — backend chỉ lưu last4
- Env vars cần thiết: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`
