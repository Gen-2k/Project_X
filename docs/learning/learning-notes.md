# Learning Notes -- ProcureDesk

> **What you _understand_, not just what code works.** Updated after every FR and after every experiment. Read before next session.
> Last updated: 2026-08-22 (after Phase 0, before Phase 1).

## How to Use This File

For each concept: What I understand | What I still struggle with | Where in ProcureDesk | Exercise done? | Common mistakes | Related concepts

Do NOT mark as mastered just because code works. Goal: independent reasoning.

## Concepts

### 1. DRAFT vs PENDING (FR-1)

- **What I understand:** DRAFT = Arun still editing (only owner can edit), PENDING = frozen, system creates ApprovalSteps threshold-aware, idempotent POST prevents double-click duplicate.
- **Still struggle:** Why submit allowed even if budget would exceed (Finance gate at approve, not submit)?
- **Where:** Create Request -> Submit, `PurchaseRequisition` status, `ApprovalStep` creation
- **Exercise:** Idempotency-Key double POST -> same 201 (pending, to be done)
- **Mistakes:** Allowing edit after Submit (moving goalposts), hard-coding threshold 50k instead of configurable per Budget/Org
- **Related:** Threshold, Vendor ACTIVE, Quote >10k

### 2. Approval: No Self, In-Order, Version Lock, FOR UPDATE (FR-2)

- **What I understand:** No self (requester != approver), in-order (order 1 before 2), version optimistic lock (one 409 on concurrent), budget FOR UPDATE row lock prevents double-spend, last step -> APPROVED + budget spent atomically.
- **Still struggle:** Difference between version (request) vs FOR UPDATE (budget) -- each protects different thing.
- **Where:** Approve/Reject/Changes, ApprovalStep, Budget
- **Exercise:** Two windows Approve same version -> one 409, budget not double (pending)
- **Mistakes:** Approving out of order, self-approval, app check instead of row lock

### 3. Order/Receive/Close (FR-3)

- **What I understand:** APPROVED->ORDERED (PO PDF via BullMQ+Redis, not blocking, 3 retries), ORDERED->RECEIVED (receipt file), RECEIVED->CLOSED (Finance). Never auto-approve.
- **Still struggle:** Why PO is a File at MVP not a separate table?
- **Where:** Request detail Order/Receive/Close buttons (Finance only)
- **Exercise:** Kill worker mid-job -> retry (pending)

### 4. Files/Vendors/Budgets (FR-4)

- **What I understand:** Files 10MB/5/req/100MB/org, MIME magic not extension, s3Key orgId/requestId/uuid, signed URL 15m, scan stub, S3 API (MinIO local + R2 free). Vendor unique per org, deactivate not delete if history. Budget Decimal(12,2), threshold configurable per Budget/Org, warning <20%.
- **Still struggle:** S3 signed URL vs permanent link -- why temporary?
- **Where:** Vendor master, Budget, File upload
- **Exercise:** Rename virus.exe to quote.pdf -> MIME block (pending)

### 5. Search/Filter/Sort/Paginate (FR-5)

- **What I understand:** q ILIKE, filters scoped to orgId, sort allowlist, offset MVP (20) -> cursor later. Composite @@index([orgId,status]) + EXPLAIN ANALYZE Index Scan vs Seq Scan.
- **Still struggle:** Why where:{orgId} on every query? What if forget?
- **Where:** Vendors/Requests/Budgets/Audit lists
- **Exercise:** EXPLAIN before/after index with 10k rows (pending)

### 6. Audit + Notifications (FR-6)

- **What I understand:** Audit append-only 7-year, transactionally with state (budget+steps+audit in one tx), never deletable even by Owner. Notifications queued (BullMQ+Redis, 3 retries, dead-letter, poll 30s), in-app + email, never block approval.
- **Still struggle:** Why audit must be in same transaction as state change?
- **Where:** Request timeline, Audit page, bell + Mailpit :8025
- **Exercise:** Kill worker, see dead-letter (pending)

### 7. Permissions & Security (FR-7)

- **What I understand:** 5-layer guards: Jwt -> OrgMembership -> Roles -> Policy (no self, in-order) -> where:{orgId} everywhere. UI hide != security (curl bypass). Even Owner cannot self-approve or delete audit.
- **Still struggle:** Testing cross-org 403 (IDOR) -- how to write?
- **Where:** Every /orgs/:orgId/... endpoint
- **Exercise:** curl GET /orgs/org-b/vendors as Org A -> 403 (pending)

### 8. Onboarding (FR-9)

- **What I understand:** Register -> Create Org (atomic Org+OWNER) -> Invite email+role (single-use 7-day token, queued email, prefilled email locked) -> Join -> Role change audited at decision time.
- **Still struggle:** Why permission checked at decision time not snapshot?
- **Where:** /login, /create-org, /:orgSlug/settings/members

### 9. Domain Relationships (Station 4)

- **What I understand:** Org has many Vendors/Budgets/Requests; User 1..N orgs via Membership (carries Role); Vendor/Budget 1..* Requests; Request has many Steps/Files/Comments/Audit. Category as nullable hook, Department via budget name at MVP.
- **Still struggle:** Visualizing joins for "find all PENDING for Priya"

### 10. Workflows (Station 5)

- **What I understand:** Spine Need->DRAFT->PENDING->APPROVED->ORDERED->RECEIVED->CLOSED + REJECTED/CHANGES_REQUESTED/CANCELLED + 48h escalation (step only). Small vs large threshold, budget exceeded exception.
- **Exercise:** Walk through 10 scenarios (business-simulation.md) without PRD

### 11. Tech Checklist (Station 7)

- **What I understand:** 15 decisions to make (DB, ORM, API, auth, state, jobs...), most already in repo (Nest, Prisma+PG, TanStack). Need evidence before deciding, not opinion.

### 12. Stack Still Deep to Learn (Station 8)

- **TODO:** Database fundamentals (table/PK/FK), Prisma syntax (@id, @@unique, onDelete), Transactions, Nest guards+DI, S3, BullMQ, Testing pyramid, Docker+CI -- all pending via tiny experiments.

## Learning Promises

- Do not mark mastered just because code works.
- For every new syntax: explain const, name, =, value, execution, why in ProcureDesk.
- Mini-challenges: predict output, write pseudocode, dry run, spot bug.
