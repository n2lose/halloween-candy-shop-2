---
name: commit
description: Create a conventional commit message by analyzing staged git changes. Use after finishing a task and staging files with git add.
---

Run these commands to understand what's being committed:
1. `git diff --staged` — see exact changes
2. `git status` — see which files are staged

Then create a commit message following this format:
```
type(scope): short description (max 72 chars)

Optional body: what changed and WHY (not how)
```

**Types**: feat, fix, docs, refactor, test, chore, style, perf
**Scopes for this project**: auth, dashboard, orders, frontend, backend, docs, config

**Examples for this project**:
- `feat(auth): add JWT login endpoint with 15min access token`
- `feat(orders): add search and pagination to GET /orders`
- `fix(dashboard): correct weekly revenue calculation`
- `test(auth): add unit tests for token refresh service`
- `docs(plans): approve PLAN-002 auth implementation`
- `chore(backend): setup Express project with TypeScript config`

Ask me to confirm the message before running `git commit`.
