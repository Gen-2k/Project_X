# MVP Scope -- ProcureDesk (Extract from PRD Section 18)

> **Status: LOCKED 2026-08-22 per user decision Go with Option B as is (Area 2).** This is the agreed MVP for solo 10-12 weeks. No changes without re-discussion.

What the business expects you to deliver as a coherent, valuable MVP vs what is deliberately later vs never. Reasoning per research.

## MVP (must for viable product -- ~10-12 weeks solo, realistic)

- **Must:** Orgs + Membership + invite (multi-tenancy is the isolation boundary)
- Vendors CRUD (unique name per org, categoryId hook) + Budgets (monthly, threshold, period edits not retroactive for PENDING) + Requests (DRAFT->PENDING->APPROVED/REJECTED/CHANGES_REQUESTED->ORDERED->RECEIVED->CLOSED via single-step + threshold to Finance, no self-approval, in-order, 48h step escalation (request stays PENDING), version lock)
- Files: quotes/receipts/PO PDFs (pdf/jpg/png, 10MB/file, 5/request, 100MB/org, MIME magic, signed URL 15m, scan stub, S3 API via MinIO local + R2 free)
- Search/filter/sort/paginate for vendors/requests/audit (ILIKE + composite index, offset MVP)
- Notifications in-app (bell + unread) + email (Mailpit local, Resend 100/day free, queued not blocking)
- Audit append-only (who/what/when/before/after/reason, 7-year for all financial entities with history, hard delete only if zero history, filterable) + Comments per request + transactional (Budget+steps+audit in one DB transaction)
- Jobs: PO PDF (pdfmake) + email + escalation (BullMQ+Redis, 3x retry, dead-letter, graceful shutdown)
- Caching: Redis TTL + explicit invalidation on mutation (pattern delete via SCAN)
- Rate limiting: global 100/60s, auth 5/60s, requests 20/60s
- Security: org isolation (where:{orgId} everywhere + cross-org 403 tests), RBAC (OWNER>ADMIN>FINANCE>APPROVER>REQUESTER + PolicyGuard), file guards, audit immutability
- Health (Terminus DB + Redis), Docker prod (multi-stage, non-root), CI (lint/typecheck/test/build + Postgres E2E + Docker verify), free deploy (Render/Neon/Upstash/R2)

**Why this is the MVP:** Every item maps to a business expectation in PRD Sections 7-9 + one engineering layer you must learn (auth, DB, transactions, files, search, jobs, cache, observability, deploy). Remove one and you lose a full-stack path that the research says is load-bearing (not bolted on). Precoro/Procurify 1-6 week P2P is exactly this scope; Coupa/Ariba S2P is not.

## Phase 2 (right after MVP, meaningfully extends without enterprise complexity)

- Org dashboard (spent by vendor/month/category) -- needs real data first
- Cursor pagination (`?cursor=` when offset slow at 10k)
- Vendor spend history polish + file quota enforcement + retention + saved views ("My pending")
- CSV bulk import for vendors
- Comments polish + export audit CSV

## Future (advanced enterprise, after product is used and data exists)

- Parallel approvals, delegation/backup, category-specific routing (Tacto IT), department as hard entity, Cost Center GL
- Recurring cron, advanced spend analytics (burn rate, 3-way tolerance engine), contract lifecycle, vendor onboarding portal + banking docs
- Full sourcing/RFx, quote comparison, vendor performance
- SSO, QuickBooks/NetSuite sync, Slack approvals, webhooks, mobile PWA
- AI: invoice extraction + duplicate detection (Phase 10, with eval set)

## Explicitly Out-of-Scope (never in this repo)

- Payments/card rails (PCI, Ramp/Brex card-first is payments, not procurement control)
- Full supplier onboarding/risk + contract management (enterprise S2P)
- K8s/Kafka/microservices (no justification for solo P2P; monolith gives ACID for budget+request+audit)
- Real-time WebSockets (polling + invalidation is enough for approval; 48h escalation is not realtime)

**Reasoning (research-backed):** Products that try to be "configurable for any workflow" (Kissflow 50 workflows) become maintenance-heavy and overwhelm teams still figuring out process (ProcurementAI). Opinionated P2P (Precoro) wins on speed for <500 (Kurums). Enterprise S2P takes 12-18 months (SCClarity) -- not solo. Our scope is opinionated P2P, not configurable S2P.
