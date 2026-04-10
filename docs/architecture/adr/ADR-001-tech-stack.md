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

**Chosen**: Mỗi feature (auth, dashboard, orders) có folder riêng với router + service

**Reason**:
- Tách concerns rõ ràng
- Dễ test từng service independently
- Scale tốt nếu cần thêm feature sau

---

## Consequences

- Frontend: `npm install recharts axios`
- Backend: `npm install jsonwebtoken cors`  
- Không cần database setup
- Token refresh logic nằm ở axios interceptor trong `api/client.ts`
