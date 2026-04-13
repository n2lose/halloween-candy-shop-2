# Changelog

All notable changes to project specs and plans are documented here.

---

## [2.1.0] — 2026-04-13

### Added
- **Clarifications & Edge Cases** section in `specs/api-spec.md` (21 items)
  - Auth: User.id format (`number` internal, `"usr_{id}"` in API), email lowercase, password min 6 / max 100
  - Products: stock is read-only (no decrement on purchase)
  - Stripe/Orders: duplicate PaymentIntent guard, items validation, `Math.round(price * 100) * quantity`
  - Pagination: clamp page < 1, empty results shape, `includes()` search (not regex)
  - Dashboard: server-local timezone, bestsellers all-time scope
- **Frontend edge cases** in `specs/requirements.md`
  - Concurrent token refresh (queue + single refresh call)
  - Cart per-user (clear on logout), price freshness (store id+qty only)
  - Post-checkout `navigate({ replace: true })`

### Changed
- OrderId format standardized to sequential `ORD-0001` (was `ORD-8F3K2`)
- Plan numbering synced to 11 plans (roadmap mapping): PLAN-006 = integration tests, PLAN-007-011 = frontend
- `docs/` restructured: `Designs/` → `designs/`, `requirements.md` → `specs/requirements.md`, `roadmap/` → `roadmap.md`, `implementation-workflow/` merged into CLAUDE.md

---

## [2.0.0] — 2026-04-10

### Added
- Initial API spec with 11 endpoints (auth, products, dashboard, stripe, orders)
- Architecture overview and ADR-001 tech stack decisions
- Project requirements, roadmap, implementation workflow
- UI designs (Dashboard, Login, Orders, Logo)
