---
name: debug
description: Systematic debugging assistant for this project. Use when stuck on a bug for more than 10 minutes.
---

Ask me to provide:
1. Exact error message and stack trace
2. Which endpoint or component has the issue
3. What was expected vs what actually happened
4. Steps to reproduce (curl command or UI steps)

Then systematically:

**Step 1 — Locate**
Read the relevant files based on the error location:
- Backend error → read the router + service file
- Auth error → read `backend/src/auth/`
- Frontend error → read the component + `api/client.ts`

**Step 2 — Trace execution**
Follow the request from entry to error:
- Backend: route → middleware → controller → service → data
- Frontend: user action → api call → interceptor → response handler

**Step 3 — Hypotheses**
Form exactly 3 hypotheses ranked by likelihood. Common issues in this project:
- JWT token expired or malformed → check token decode
- Missing `Authorization: Bearer` header → check axios interceptor
- Pagination offset wrong → check `(page-1) * per_page` calculation
- CORS blocking request → check backend CORS config
- Search not working → check case-insensitive filter logic

**Step 4 — Fix**
Minimal change that fixes root cause. Explain WHY it fixes it.
Suggest what test would catch this in the future.

Never suggest: ignoring the error, increasing timeout, or disabling the check.
