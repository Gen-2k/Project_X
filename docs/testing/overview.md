# Testing Strategy -- ProcureDesk (Placeholder)

> Created 2026-08-22 for persistent storage requirement. Will be filled as we implement.
> Phase 0: Verified `pnpm test` (Vitest client, Jest server) and `test:e2e` needs `postgres:15-alpine` service per `.github/workflows/pr.yml`.

## Planned (from PRD + AGENTS.md)

- Unit (Jest/Vitest): services, guards, state machine
- Integration (with DB): Vendors/Budgets/Requests with real PG
- API (Supertest + test/jest-e2e.json): cross-org 403, 409 version, 422 budget, 5-layer guards
- DB: Prisma constraints (@@unique, FK)
- Frontend: Vitest + RTL + jsdom, a11y (vitest-axe)
- E2E: Register->Create Org->Vendor->Budget->Request->Approve->Order

See docs/reviews/procuredesk-requirements-review.md Section 9 and AGENTS.md Tests & CI.
