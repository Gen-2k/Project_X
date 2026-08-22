# Workflows -- ProcureDesk (Extract from PRD Section 7)

> Companion to `procuredesk-prd.md:7`. What the business expects the system to do, step by step.

## A. User Onboarding

1. Visitor registers -> Create organization (org + OWNER membership atomic, slug unique) -> Owner.
2. Owner/Admin invites by email+role -> email link (once, 7-day expiry) -> invitee registers or joins -> Membership.
3. Role change/remove audited; cannot demote Owner without transfer.

## B. Vendor Lifecycle

Created by Admin/Finance/Owner (name unique per org) -> ACTIVE immediately (MVP) -> active/inactive toggle (deactivate preserves history, not delete if requests exist) -> cannot select inactive for new requests. At MVP single contact/email per vendor; multi-contact/docs future.

## C. Purchase Requisition Lifecycle (core, enforced server-side -- Spend Request is UI synonym)

**States:** DRAFT -> PENDING_APPROVAL -> APPROVED -> ORDERED -> RECEIVED -> CLOSED; also REJECTED, CHANGES_REQUESTED (returns to DRAFT), CANCELLED. `ESCALATED` is _only_ an ApprovalStep status, not a request state; request stays PENDING while a step escalates.

- **DRAFT:** Editable, only by owner. Created with title, vendor (ACTIVE), amount 0.01-10L, budget (org), categoryId nullable hook, quote file(s) (required if >10k), idempotencyKey.
- **Submit:** Owner of DRAFT clicks Submit -> creates ApprovalStep(s) (single default + threshold adds Finance if amount>threshold) -> PENDING, notifies approver(s).
- **Pending checks:** Budget `spent+amount <= amount` atomically with row lock at approve time (submit allowed even if would exceed, approve is the gate).
- **Approve/Reject/Changes Requested:** Approver assigned, not own, in order, version checked. Approve advances steps; last approve -> APPROVED + budget spent increment _transactionally_ with audit (all in one DB transaction, not separate) + notify. Reject (with comment) -> REJECTED terminal, budget untouched, notify. Changes Requested (with comment) -> returns to DRAFT (non-terminal, preserves thread, e.g., "please add detailed quote") -> requester edits and resubmits. To fix REJECTED, clone to new DRAFT.
- **Order:** Finance/Admin after APPROVED clicks Order -> enqueues PO PDF job -> PO number, File, status ORDERED.
- **Receive:** Finance/Admin after ORDERED uploads receipt -> status RECEIVED.
- **Close:** Finance/Admin after RECEIVED -> CLOSED.
- **Cancel:** Owner can cancel DRAFT any time, PENDING only if _all_ steps still PENDING (no APPROVED/REJECTED yet); after APPROVED no cancel (exception via Finance with reason + audit). Terminal CANCELLED. Permission is checked at decision time against _current_ role, not snapshot at Submit.
- **Escalation:** PENDING >48h -> job marks _step_ ESCALATED (request stays PENDING), creates new PENDING step for Finance/Owner, notifies. Not auto-approved. Manual escalation by Admin if approver unavailable. If approver is removed mid-approval, that step auto-escalates similarly.

## D. Approval Workflow (MVP)

- Single by default; threshold adds Finance sequential (e.g., Rs 50k configurable per Budget/Org).
- Must approve in order (`order` 1..N), not own, version checked, budget checked atomically with `FOR UPDATE`.
- Rejection requires comment (REJECTED terminal); Changes Requested requires comment and returns to DRAFT (non-terminal).
- Approval shows budget remaining at decision time; `spent+amount <= amount` enforced transactionally.
- Timeout 48h escalates step (not request), manual escalation by Admin if approver unavailable, auto-escalate if approver removed mid-flight.
- Deferred: parallel, category-specific, budget-owner, delegated backup (future, but nullable categoryId hook already exists).

## E. Purchase Workflow

Vendor from master (ACTIVE) -> quote PDF attached (required if >10k) -> after APPROVED, Order generates PO PDF (background, PO number auto) -> status ORDERED -> vendor fulfills (outside system at MVP) -> receipt uploaded on Receive.

## F. Invoice / Payment (MVP lightweight)

Vendor invoice PDF uploaded as File type INVOICE at Receive step for evidence; no structured Invoice table or automated 3-way match at MVP (manual visual check). Warn if invoice amount differs >5% or `5k from request. Future: structured Invoice + tolerance engine + QuickBooks sync.

## G. Budget Workflow

Finance/Admin/Owner creates budget (name, period, amount, threshold, unique name+periodStart per org) -> spend tracked as `spent` increments on APPROVED, `remaining` shown at create and at approval. Warning amber if remaining <20% or <`50k. Exceeded: approve blocked 422 unless Finance overrides with reason (audit `APPROVE_WITH_EXCEPTION`). Period ended = no new requests can select it.

## H. Audit Workflow

Every important action -> AuditEvent append-only (who, what, when, before/after, reason) for org, membership, vendor, budget, request, steps, files. No update/delete ever, 7-year retention for all financial entities with history (requests/vendors/budgets, not just audit; hard delete only if zero history), indexed by org+entity+time, filterable and exportable (Phase 2). If audit is not written _transactionally_ with state change (Budget spent + steps + audit in one DB transaction), feature is not done. Stale DRAFT retention: 90 days then archive (Phase 2).
