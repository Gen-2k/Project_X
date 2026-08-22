# Domain Model -- ProcureDesk (Extract from PRD Section 6)

> Companion to `procuredesk-prd.md:6`. Business vocabulary the software must capture correctly. No tech stack decisions here.

## Core Entities

### Organization

- **Why:** Isolation boundary; one org = one company; no cross-org leak.
- **Attributes:** Name, slug (unique, URL), owner (User), created.
- **Relationships:** Has many Memberships, Vendors, Budgets, Requests, Audits.
- **Lifecycle:** Created by Owner, active until Owner archives. Deletion is _blocked_ if org has any requests/vendors/budgets with history (to preserve 7-year audit). Archive instead of cascade delete.
- **Rules:** Every query scopes to orgId; no org = no access. Hard delete only if zero history.

### User

- **Why:** Person who logs in and acts.
- **Attributes:** Email (unique), name, passwordHash, avatar.
- **Relationships:** Member of N orgs via Membership; creates requests; approves steps; uploads files.
- **Rules:** Independent of orgs; membership carries role.

### Membership + Role

- **Why:** Who can do what within an org.
- **Attributes:** orgId, userId, role OWNER/ADMIN/FINANCE/APPROVER/REQUESTER (hierarchy, but with object rules like no self-approval).
- **Relationships:** Links User <-> Organization.
- **Rules:** @@unique([orgId,userId]); every membership is per org; change role audited.

### Vendor

- **Why:** Master of who we buy from; reduces maverick via preferred guidance.
- **Attributes:** Name (unique per org), email, GSTIN, contact, status ACTIVE/INACTIVE.
- **Relationships:** Org has many vendors; vendor has many requests.
- **Lifecycle:** Created by Admin/Finance/Owner, active until deactivated (not deleted if history exists).
- **Rules:** Name unique per org; inactive cannot be selected for new requests but remains in history.

### Purchase Requisition (canonical; UI synonym "Spend Request", API path `/requests` as shorthand)

- **Why:** The product -- internal, not binding, before vendor commitment. We use _Purchase Requisition_ as the domain term (per Ivalua: requisition is internal, PO is external). `Spend Request` is the user-facing synonym used in the UI; `PurchaseRequest` remains the Prisma model name for brevity.
- **Attributes:** Title, description, vendor (ACTIVE), amount (Decimal INR), budget (optional), categoryId (nullable, hook for future Category entity), currency INR, required quote files, status DRAFT/PENDING_APPROVAL/APPROVED/REJECTED/CHANGES_REQUESTED/ORDERED/RECEIVED/CLOSED/CANCELLED, version (concurrency), idempotencyKey. `ESCALATED` is _only_ a step status, not a request status.
- **Relationships:** Belongs to Org, Requester (User), Vendor, Budget; has many Steps, Files, Audits, Comments.
- **Lifecycle:** See workflows.md.
- **Rules:** Only DRAFT editable by owner; only PENDING approvable; amount 0.01-10L; quote required if >10k. Retained 7 years if has history (hard delete only if zero history).

### Request Item (future)

- **Why:** Line items (quantity x price). At MVP, request is single amount+description; model should allow future items without breaking.

### Budget

- **Why:** Money allocated for a period, checked _before_ approval.
- **Attributes:** Name, periodStart/end (monthly/quarterly), amount, spent (derived), threshold (optional), remaining (amount-spent).
- **Relationships:** Org has many budgets; request optionally links to one.
- **Lifecycle:** Created by Finance/Admin/Owner; spent increments atomically on APPROVED.
- **Rules:** @@unique([orgId,name,periodStart]); cannot approve if spent+amount > amount (unless exception with reason); remaining shown at approval.

### Approval Policy + Approval Step

- **Policy why:** Rules for who approves what (DOA matrix: role + amount + category). At MVP, policy is simple: default single approver + threshold adds Finance, hardcoded in service.
- **Step why:** One approver in a sequential chain.
- **Attributes:** order 1..N, approver (User), status PENDING/APPROVED/REJECTED/ESCALATED, comment, decidedAt.
- **Relationships:** Belongs to Request; approver is User.
- **Rules:** @@unique([requestId,order]); approve only assigned, not own, in order, version checked.

### Purchase Order (PO)

- **Why:** External, legally binding doc sent to vendor after approval. At MVP, PO number + PDF generated as File on request after APPROVED->Order; not a separate PO table yet.
- **Attributes:** PO number (auto, e.g., PO-2026-042), date, supplier, items, total, terms.

### Quote / Receipt / Invoice (as Files at MVP)

- **Why:** Evidence attached to request. At MVP, modeled as File with type QUOTE/RECEIPT/INVOICE, not separate tables. Future Invoice may become structured entity for 3-way match.
- **Attributes:** Original name, S3 key, MIME, size, scan status.
- **Rules:** 10MB/file, 5/request, 100MB/org; MIME magic; signed URL 15m; scan stub.

### Comment, Notification, Audit Event

- **Comment:** Author, body, timestamp, request -- append-only thread.
- **Notification:** User, type, title, payload (requestId), read flag -- created on every transition, in-app + email queued.
- **Audit Event:** Org, entityType/id, actor, action, diff JSON (before/after), timestamp -- append-only, 7-year, never deletable, indexed by org+entity+time.

## Relationships Summary

```
Organization 1--* Membership *--1 User
Organization 1--* Vendor 1--* PurchaseRequest
Organization 1--* Budget 1--* PurchaseRequest
User 1--* PurchaseRequest (requester)
Vendor 1--* PurchaseRequest
Budget 1--* PurchaseRequest
PurchaseRequest 1--* ApprovalStep *--1 User (approver)
PurchaseRequest 1--* File
PurchaseRequest 1--* Comment
PurchaseRequest 1--* AuditEvent
```

## What Is NOT a Hard Entity at MVP (logical or deferred)

- Department/Team, Cost Center, VendorContact/Document, Contract, Payment -- see PRD Section 6 for why deferred.
- **Category:** No hard Category table at MVP, but requests already carry `categoryId` nullable (hook) so Phase 2 can add Category without breaking history (see review D3). At MVP, budget name encodes category.
- PO/Invoice/Receipt as separate tables -- at MVP they are File + status on request.
