# Freddy's Halloween Candy Shop

## Mô Tả Dự Án
Full-stack analytics dashboard cho cửa hàng kẹo Halloween. Freddy cần quản lý
orders và xem analytics (doanh thu, bestsellers). Đây là assignment — không có
production database, dùng in-memory mock data.

**Screens**: Login → Dashboard (stats + chart + bestsellers) → Orders (search + pagination)

---

## Tech Stack

### Backend (`/backend`)
- Runtime: Node.js 20
- Language: TypeScript (strict mode)
- Framework: Express 4.x
- Auth: JWT — `jsonwebtoken` (access token 15min, refresh token 30 days)
- Data: In-memory TypeScript arrays (không có database)
- Testing: Jest + Supertest
- Port: **3001**

### Frontend (`/frontend`)
- Language: TypeScript (strict mode)
- Framework: React 18 + Vite
- Routing: React Router v6
- HTTP Client: Axios (với interceptors cho auto token refresh)
- Charts: Recharts
- State: React Context + localStorage (tokens)
- Styling: CSS Modules
- Port: **5173**

---

## Cách Chạy Dự Án

```bash
# Backend
cd backend
npm install
npm run dev        # dev server port 3001
npm test           # run tests
npm run lint       # ESLint check
npm run build      # compile TypeScript

# Frontend
cd frontend
npm install
npm run dev        # dev server port 5173
npm run build      # production build → public/
npm run lint       # ESLint check
```

---

## Cấu Trúc Dự Án

```
Halloween-candy-shop/
├── backend/src/
│   ├── auth/           ← POST /login, POST /refresh, JWT middleware
│   ├── dashboard/      ← GET /dashboard (stats, chart, bestsellers)
│   ├── orders/         ← GET /orders (search, pagination)
│   ├── data/           ← mock data: orders.ts, products.ts, users.ts
│   ├── types/          ← shared TypeScript interfaces
│   └── app.ts          ← Express setup, CORS, routes
├── frontend/src/
│   ├── pages/          ← LoginPage, DashboardPage, OrdersPage
│   ├── components/     ← Layout/, Dashboard/, Orders/
│   ├── api/            ← client.ts (axios), auth.ts, dashboard.ts, orders.ts
│   ├── store/          ← authStore.ts (tokens)
│   └── types/          ← shared interfaces
└── docs/               ← specs, architecture, plans, workflow, roadmap
```

---

## Coding Conventions (BẮT BUỘC)

- TypeScript strict mode — không dùng `any`, dùng `unknown` nếu cần
- Functions tối đa 30 dòng — split nếu dài hơn
- Không hardcode credentials — dùng `.env` cho secrets
- Error responses luôn trả về format: `{ "error": "message" }`
- Commits theo conventional format: `feat(auth): add login endpoint`
- Tên file: camelCase cho TS files (`authService.ts`), PascalCase cho React components (`LoginPage.tsx`)

---

## API Endpoints

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/login` | No | username + password → tokens |
| POST | `/refresh` | Refresh token | → new access token |
| GET | `/dashboard` | Access token | stats + chart + bestsellers |
| GET | `/orders?page=1&q=` | Access token | paginated orders list |

Chi tiết đầy đủ: `docs/specs/api-spec.md`

---

## Mock Data

**Users**: `{ username: "freddy", password: "ElmStreet2019" }`

**Halloween candy products** (dùng tên này cho consistent):
Pumpkin Spice Lollipop, Witch Finger Gummy, Skull Chocolate Bar,
Spider Web Cotton Candy, Ghost Marshmallow, Cauldron Caramel Apple,
Vampire Fang Candy Corn, Black Cat Licorice, Frankenstein Fudge,
Zombie Brain Gummy

**Orders**: ~30 mock orders, spread across last 7 days và 12 months

---

## Tài Liệu Tham Khảo

- Requirements gốc: `docs/requirements.md`
- API spec chi tiết: `docs/specs/api-spec.md`
- Architecture diagram: `docs/architecture/overview.md`
- Tech stack decisions: `docs/architecture/adr/ADR-001-tech-stack.md`
- Implementation plans: `docs/plans/README.md`
- Workflow làm việc: `docs/implementation-workflow/README.md`
- Project roadmap: `docs/roadmap/README.md`
- Designs: `docs/Designs/`

---

## Known Decisions & Constraints

- In-memory data → reset khi restart server (acceptable for assignment)
- Token storage: localStorage (acceptable for assignment, không dùng cho production)
- Không có user registration — chỉ có user freddy hardcoded
- Chart toggle trên Dashboard: cùng 1 Recharts BarChart, đổi data source giữa weekly/yearly
