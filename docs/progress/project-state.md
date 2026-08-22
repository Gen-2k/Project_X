# Project State -- ProcureDesk

> **Single source of truth for where we are.** Updated on every meaningful milestone. Read this first at the start of a new session.
> Last updated: 2026-08-22 (after Phase 0, before Phase 1). Owner: Surya.

## Current Phase

**Phase 0 -- Discovery & Validation: COMPLETE (8/8 stations validated)**
**Next: Phase 1 -- Foundations (Organization + Membership + multi-tenancy)**

Phase 0 stations:

| Station | Area                                                      | Status       | Evidence                                                                                 |
| ------- | --------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------- |
| 1       | Product understanding (what/why/who)                      | DONE         | personas.md, business-simulation.md:1-3, approved "go with recommended" 2026-08-22       |
| 2       | Product scope (MVP)                                       | DONE, LOCKED | mvp-scope.md LOCKED 2026-08-22 -- Option B (opinionated P2P, 10-12 weeks)                |
| 3       | Requirements (FR-1..9, NFR, rules, stories)               | DONE         | FR-1..9 validated one-by-one, PRD Section 9, workflows.md, business-rules.md             |
| 4       | Domain understanding                                      | DONE         | domain-model.md (Organization/User/Membership/Vendor/Budget/Requisition/Step/File/Audit) |
| 5       | Real-world workflow                                       | DONE         | business-simulation.md 10 scenarios + day-in-the-life before/after                       |
| 6       | Product validation                                        | DONE         | reviews/procuredesk-requirements-review.md verdict READY FOR PHASE 0 after fixing C1/C2  |
| 7       | Technical decision preparation (checklist, not decisions) | DONE         | 15-decision checklist in discussion (DB, ORM, API, auth, state, jobs, etc.)              |
| 8       | Learning map                                              | DONE         | 12-row learning map with tiny experiments                                                |

Phase 0 DoD from your prompt: all 10 bullets met (problem, users, workflows, MVP, requirements, domain, assumptions/risks, tech decisions identified, gaps identified, docs structure exists).

## Product Source of Truth (after cleanup)

```
docs/product/procuredesk-prd.md (22 sections, client voice, 754 lines) -- WHAT the business wants
docs/product/domain-model.md -- business entities & relationships
docs/product/workflows.md -- 8 workflows + state machine (DRAFT->PENDING->APPROVED/REJECTED/CHANGES_REQUESTED->ORDERED->RECEIVED->CLOSED)
docs/product/business-rules.md -- explicit rules (threshold 50k configurable, no self-approval)
docs/product/mvp-scope.md -- LOCKED Option B (MVP vs Phase 2 vs Future vs Never)
docs/product/personas.md -- 5 personas (Aarav Solutions, 120 people, Pune+Delhi, 80 req/mo, 85 vendors)
docs/product/business-simulation.md -- client teaching (people->business->process->rules->outcome)
docs/research/procuredesk-market-domain-research.md -- 39 sources, P2P vs S2P, 5-8-step workflows
docs/reviews/procuredesk-requirements-review.md -- 18-section deep review (C1 naming drift + C2 ESCALATED fixed)
```

Deleted per your request: docs/adr/* and docs/specs/* (ERD/API/setup). They will be recreated step-by-step in Phase 1+ as we learn (no premature architecture).

Tech stack already in repo (not yet decided via ADR, but present):

- Monorepo `pnpm@11.21.0 + Turborepo 2.4 + TypeScript project references` (AGENTS.md)
- `apps/server` NestJS 11 + Express 5 (`src/main.ts -> AppModule`, `api/v1`, Swagger, `nestjs-pino`, `Throttler`, `helmet`, `PrismaService` via `pg` Pool)
- `apps/client` React 19 + Vite 8 + TanStack Query 5 + React Router 7 (AuthContext + QueryClient in App.tsx:16)
- `packages/database` Prisma 7 schema currently only `User` (uuid(7)), `packages/shared` DTOs
- Docker: only `postgres:15-alpine` live in `docker-compose.yml` (redis/minio/mailpit are Phase 1, not yet)

## Decisions Already Made (locked, with why)

| Date       | Decision                   | Choice                                                                                                                                                                                | Why (so you can explain)                                                                                                                                                                  | Where recorded                          |
| ---------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| 2026-08-22 | Product domain             | ProcureDesk: Vendor & Purchase Requisition control center for 20-300, budgets->requests->threshold approvals->PO->receive->audit. Not Jira clone.                                     | Research: 30% small have any P2P, 56% inefficiencies, Precoro $499/mo gap. Differentiation = opinionated P2P, not configurable S2P.                                                       | PRD Section 1, business-simulation.md:1 |
| 2026-08-22 | MVP scope                  | Option B as is (locked). Orgs/vendors/budgets/requests/files/search/audit/notifications/jobs/cache deferred to Phase 5. Phase 2=dashboard/cursor, Future=parallel/category/recurring. | Smallest that is still valuable + teaches every layer, solo 10-12 weeks.                                                                                                                  | mvp-scope.md LOCKED                     |
| 2026-08-22 | Entity naming              | Canonical `Purchase Requisition` (domain), `Spend Request` = UI synonym, `PurchaseRequest` = Prisma model                                                                             | Fixes C1 drift (requisition=internal, PO=external per Ivalua)                                                                                                                             | domain-model.md, review C1              |
| 2026-08-22 | Request state machine      | States DRAFT,PENDING_APPROVAL,APPROVED,REJECTED,CHANGES_REQUESTED,ORDERED,RECEIVED,CLOSED,CANCELLED; `ESCALATED` only on ApprovalStep (request stays PENDING); 48h escalation         | Fixes C2 contradiction, adds missing CHANGES_REQUESTED loop                                                                                                                               | workflows.md, review C2                 |
| 2026-08-22 | Backend framework          | **Keep NestJS (on Express)** (modular monolith)                                                                                                                                       | You already have Nest 11 with 6 cross-cutting concerns wired; 25+ endpoints need 5-layer guards (Jwt->Org->Roles->Policy). Express would need you to invent that structure and risk IDOR. | ADR-002 (to be created), AGENTS.md      |
| 2026-08-22 | Frontend state             | **Context API (AuthContext) + TanStack Query (server) + useState (local), no Zustand at MVP**                                                                                         | AuthContext = user/org (rare writes), TanStack = vendors/requests/budgets (caching/stale/optimistic). Zustand wrong for server state, only needed later for multi-step wizard.            | ADR-003 (to be created)                 |
| 2026-08-22 | Real ProcureDesk collision | Keep name ProcureDesk with disclaimer "Learning Project (Not affiliated with procuredesk.com)"                                                                                        | Same domain, not same codebase. Name collision is branding, not clone.                                                                                                                    | README discussion 2026-08-22            |
| 2026-08-22 | Learning approach          | Teach What->Why->How->Where->Options->Recommend->you decide->document. No understanding = no implementation. Use Tanglish for hard concepts.                                          | Your core rule.                                                                                                                                                                           | This file + learning-notes.md           |

## Open Decisions (require Teach->Compare->Recommend->you decide->ADR)

These are the 15 from Station 7, not yet decided. We will do one at a time, starting with Database+ORM.

- [ ] 1. Database (PostgreSQL already in schema, but needs formal ADR with why vs others)
- [ ] 2. ORM (Prisma 7 already in repo, but needs ADR: why Prisma _with_ SQL underneath vs raw pg)
- [ ] 3. API style (REST api/v1 already in main.ts, but needs ADR for pagination/idempotency)
- [ ] 4. Validation library (class-validator vs Zod) -- shared DTOs in packages/shared
- [ ] 5. Storage (S3 API: MinIO local + R2 free vs local disk -- decision pending Phase 2)
- [ ] 6. Background jobs (BullMQ+Redis vs pg-boss vs sync -- pending Phase 4)
- [ ] 7. Email (Mailpit local + Resend free -- pending)
- [ ] 8. Caching (Redis TTL+invalidation -- deferred to Phase 5)
- [ ] 9. Testing strategy (already Jest/Vitest/Supertest, but needs ADR for cross-org matrix)
- [ ] 10-15. Deployment, observability, AI (Phase 7,10) -- later

## Current Tasks

**Active:**

- None (waiting for your "start Increment 1.1").

**Next (Phase 1, Increment 1.1):** Database fundamentals + `Organization` + `Membership` + `Role` in `packages/database/prisma/schema.prisma:9` (currently only User). Taught as: Understand -> Break down -> Mental model -> Pseudocode -> Dry run -> Small implementation (15 lines) -> Explain line-by-line -> Test/Debug.

**Queued (Phase 1, 1 week):**

- Increment 1.2: OrganizationsModule + MembershipsModule (atomic org+OWNER, invite single-use 7-day)
- Increment 1.3: Guards (Jwt->OrgMembership->Roles->Policy) + `where:{orgId}` everywhere
- Increment 1.4: Infra `docker-compose.yml` add redis/mailpit/minio + frontend org switcher `/:orgSlug`

## Blocked Tasks

- None. Note: `pnpm db:generate` must run before `build/lint` (turbo.json deps). `docker compose up postgres -d` requires `DB_PASSWORD` and `JWT_SECRET`.

## Known Problems

- Previous C1/C2 fixed (naming drift + ESCALATED). No open critical.
- Risk: MVP at upper edge of solo 10-12 weeks -- mitigated by phasing, deferring caching to Phase 5.
- ProcureDesk name collision with real procuredesk.com (30 emp, Cincinnati) -- mitigated with disclaimer, not a code clone.

## Learning Topics Completed

- FR-1 Create & Submit (DRAFT vs PENDING, idempotency, vendor ACTIVE, quote >10k)
- FR-2 Approve/Reject/Changes (no self, in-order, version lock, FOR UPDATE budget lock, single+threshold)
- FR-3 Order/Receive/Close (PO PDF background job, receipt file)
- FR-4 Files/Vendors/Budgets (MIME magic, S3 signed URL 15m, unique per org, Decimal, configurable threshold)
- FR-5 Search/Filter/Sort/Paginate (ILIKE, composite @@index, offset MVP -> cursor)
- FR-6 Audit (7-year append-only, transactional with state) + Notifications (queued, 3 retries, poll 30s)
- FR-7 Permissions (5-layer guards, org isolation, UI hide != security)
- FR-8 Invoicing as File (warn not block) + Comments
- FR-9 Onboarding (atomic org+OWNER, single-use invite)
- Domain: Organization/User/Membership/Role/Vendor/Budget/Requisition/Step/File/Audit relationships
- Business simulation 10 scenarios + day-in-the-life before/after

## Learning Topics Remaining (deep dive needed)

- Database fundamentals (table/row/column/PK/FK/relationship/query/index/transaction) -- next, Increment 1.1
- Prisma syntax (model, @id, @default(uuid(7)), @unique([orgId,userId]), onDelete: Cascade) -- next
- Transactions + FOR UPDATE (deep, with dry run)
- Nest guards + DI (Jwt, OrgMembership, Roles, Policy)
- S3 pre-signed URLs + MIME magic
- BullMQ + cron + graceful shutdown
- Redis caching + invalidation
- Testing pyramid (cross-org, concurrent)
- Docker multi-stage + CI (pr.yml) + free deploy (Neon/Upstash/R2/Render)

## Important Experiments (from learning map)

- DataTable with URL ?page= in 20 rows (Frontend)
- TanStack invalidation after Approve (Server state)
- curl double POST with Idempotency-Key -> same 201
- DevTools Application -> Cookies jwt HttpOnly (Auth)
- EXPLAIN ANALYZE before/after @@index (DB)
- Two windows Approve same version -> one 409 (Locking)
- Rename virus.exe to quote.pdf -> MIME block (Files)
- Enqueue job that fails 50% -> retry 3x (Jobs)
- curl GET /orgs/org-b/vendors as Org A -> 403 (IDOR)
- E2E register->create org->vendor->request->approve (Testing)

## Next Recommended Step

**Start Increment 1.1: Database fundamentals + Organization/Membership schema.**
Reply `start Increment 1.1` and I will teach: database->table->row->column->PK->FK->relationship->query->index->transaction with a tiny Tanglish veedu example, then pseudocode->dry run for "Surya creates Aarav Solutions", then 15 lines of Prisma with line-by-line syntax (const, model, String, @id, @@unique...), then challenge + test.

---

_Teams: PRD is docs/product/procuredesk-prd.md (source of truth). Do not start coding product until you say "start Phase 1". This file is the memory across sessions._
