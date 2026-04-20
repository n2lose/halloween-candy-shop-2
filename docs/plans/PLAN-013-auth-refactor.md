# PLAN-013: Auth Refactor — Role-based JWT + Controller/Service/Repository

**Status**: DONE

## Context

Migrate auth layer from `src/auth/` (router+service flat structure) to the new
Controller/Service/Repository pattern. Wire auth service to `UserRepository`
(delete `data/users.ts`). Add `roleMiddleware`. Login/register now returns
`{ tokens, user }` so frontend doesn't need a separate `GET /auth/me` call.

**Dependencies**: PLAN-012 DONE (UserRepository exists, types updated).

---

## Tasks

- [x] Task 1: `src/middleware/auth.middleware.ts` — verify token, attach req.user
- [x] Task 2: `src/middleware/role.middleware.ts` — requireRole("admin"|"customer")
- [x] Task 3: `src/services/auth.service.ts` — uses UserRepository, returns {tokens, user}
- [x] Task 4: `src/controllers/auth.controller.ts` — HTTP layer
- [x] Task 5: `src/routes/auth.routes.ts` — route definitions
- [x] Task 6: `src/app.ts` — mount new auth routes
- [x] Task 7: Delete `src/auth/`, delete `src/data/users.ts`

## API changes

Login + Register now return:
```json
{
  "access_token": "...",
  "refresh_token": "...",
  "user": { "id": "usr_1", "name": "Admin", "email": "admin@halloween.shop", "role": "admin" }
}
```

GET /auth/me returns:
```json
{ "id": "usr_2", "name": "Freddy", "email": "freddy@halloween.shop", "role": "customer" }
```

## Verification

```bash
cd backend && npm run lint
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
# → { access_token, refresh_token, user: { id, name, email, role: "customer" } }

curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@halloween.shop","password":"Halloween2024!"}'
# → { access_token, refresh_token, user: { role: "admin" } }
```
