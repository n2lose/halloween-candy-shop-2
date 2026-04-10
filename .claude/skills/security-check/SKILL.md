---
name: security-check
description: Review auth and security-sensitive code for vulnerabilities. Auto-invoked when working on files in backend/src/auth/.
paths:
  - "backend/src/auth/**"
  - "backend/src/middleware/**"
---

Automatically run this security review when touching auth or middleware files:

**CRITICAL — Block deployment**:
- JWT_SECRET hardcoded in code (must be `process.env.JWT_SECRET`)
- Password compared with `==` instead of constant-time comparison
- Refresh token accepted on access-token-only routes
- Error response leaking stack trace or internal details in production

**HIGH — Fix before commit**:
- JWT created without `expiresIn` option
- Missing `algorithm` option in jwt.verify() (should specify 'HS256')
- Access token used to call /refresh endpoint (should only accept refresh tokens)
- No check for token `type` field in payload

**MEDIUM — Fix this sprint**:
- Login endpoint missing rate limiting
- No input validation on username/password fields (min/max length)
- Refresh token not invalidated on logout

**Things that are OK for this assignment**:
- Credentials hardcoded in users.ts (in-memory, no DB — acceptable)
- No HTTPS (localhost only — acceptable)
- Tokens in localStorage (assignment scope — acceptable)

Report: [CRITICAL|HIGH|MEDIUM] `file:line` — finding → fix suggestion
If no issues: "✓ Security check passed"
