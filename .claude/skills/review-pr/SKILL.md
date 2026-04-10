---
name: review-pr
description: Review all changes on current branch vs main before creating a PR. Checks code quality, security, tests, and alignment with project conventions.
---

Run these commands to gather context:
1. `git diff main...HEAD` — all code changes
2. `git log main..HEAD --oneline` — commit history
3. `git diff main...HEAD --stat` — files changed

Review against these criteria:

**SECURITY** — Block PR if found:
- JWT secret hardcoded (must be in .env)
- Password logged or exposed in error response
- Missing auth middleware on protected routes (/dashboard, /orders)
- SQL/NoSQL injection (not applicable here, but check eval/exec usage)

**CORRECTNESS**:
- Token expiry logic correct (15min access, 30d refresh)
- Pagination offset calculation: `(page - 1) * per_page`
- Search is case-insensitive and matches both product AND customer fields
- Stats (today/week/month) calculated from orders data, not hardcoded

**TESTS**:
- New service functions have unit tests
- API endpoints have integration tests via Supertest
- Error cases tested (invalid token, wrong credentials, empty search)

**CONVENTIONS** (per CLAUDE.md):
- No `any` TypeScript types
- Functions under 30 lines
- Error responses use `{ "error": "message" }` format
- File names: camelCase for TS, PascalCase for React components

**FRONTEND SPECIFIC**:
- Token interceptor handles 401 and retries after refresh
- ProtectedRoute redirects unauthenticated users to /login
- Chart toggle switches data without re-fetching from API

Output format:
## PR Review
**Status**: READY / NEEDS WORK / BLOCKED

### Issues
**[CRITICAL|HIGH|MEDIUM|LOW]** `file:line`
Problem: ...
Fix: ...

### Summary
[2-3 sentences]
