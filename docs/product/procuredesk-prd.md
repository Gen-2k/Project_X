# ProcureDesk -- Product Requirements Document (PRD)

> **Author:** Client / Business Owner -- Aarav Solutions Pvt Ltd (fictional but realistic, based on research)
> **Audience:** Engineering team hired to build and operate ProcureDesk
> **Date:** 2026-08-22
> **Research base:** `docs/research/procuredesk-market-domain-research.md:1` (15 sections, 39 sources, 2025-2026)
> **Status:** What the business _wants and why_ -- not how to implement. Engineering will decide stack after this.
> **Traceability tags:** [Research-backed] = market/domain evidence, [Client assumption] = our org-specific, [Recommended] = product decision from research, [Open] = needs validation

---

## 1. Product Context

### Product name

**ProcureDesk**

### Product vision

ProcureDesk is our spend-request control center. When anyone needs to buy something -- from office laptops to a `45,000 SaaS tool -- the need is captured in one place, checked against the right budget, approved by the right person, turned into an order to the vendor, tracked to receipt, and left with a queryable audit trail. No more email threads as the system of record.

### Business context

We are a services company that buys constantly: equipment, software, contractor services, office supplies, marketing. Today every purchase starts as an email or spreadsheet row. As we grew past 100 people, that stopped working. We are not large enough for Coupa/SAP Ariba (6-figure enterprise suites, 4-18 month deployments), but we _have_ outgrown sheets. The market gap is exactly this mid-market P2P layer: Precoro and Procurify serve `500 and 100-2,000 employee orgs in 1-6 weeks, while enterprise needs months. We need the 1-6 week P2P, not full source-to-pay.

### Business problem

- **No single truth:** "Who requested what, who approved, was it in budget, where is the quote?" lives in 3 sheets + 5 email threads.
- **No enforcement before spend:** Budgets are checked after overspend at month-end, not before.
- **No audit:** Reconstructing who approved what for GST/internal audit takes weeks; even federal agencies fail data-quality reporting when it is not system-generated (GAO Sep 2025).
- **No SLA:** Approvals sit 2-3 days in inboxes; no reminder, no escalation, no history of "why rejected."
- **Result:** 10-20% of targeted savings lost to maverick spend (Hackett), 56% of teams cite process inefficiencies as #1 pain, 57% siloed ops as #1 barrier (CAPP/Deloitte 2024-2025), and 68% lack real-time visibility.

### Current/manual process being replaced

Employee emails manager -> manager replies "approved" -> procurement (often the same manager or office admin) checks by asking finance on Slack -> finance opens a spreadsheet to check budget -> vendor is emailed a PO (Word/PDF) -> goods/services arrive -> receipt noted in another sheet -> invoice arrives by email PDF -> finance retypes into accounting sheet -> month-end reconciliation. Every handoff is a manual retype and a place where data is lost. Email is the workflow engine; spreadsheets are the database.

### Target organizations

For our own use and as a product: **20-300-person organizations** (services firms, clinics, schools, startups, agencies) with 2-8 departments, 50-200 vendors, `80% indirect spend (not direct materials). Geographic: single city or 2-3 locations. Purchasing volume: 40-120 requests/month, average `12k-45k per request.

### Target users

Requesters (any employee), Department Approvers, Finance Controllers, Admins/Owners. Detailed in Section 3.

### Primary stakeholders

Owner (budget owner), Finance, Department Heads, Procurement/Admin, Auditor/Compliance, Employees. See Section 3.

### Business objectives

1. Prevent overspend _before_ it happens (budget check at approval time, not retrospective).
2. Route every request through the correct approver(s) based on amount/policy without manual triage.
3. Give real-time budget visibility at approval (approver sees remaining before deciding).
4. Create an immutable, queryable audit trail for every state change.
5. Make compliant buying easier than maverick buying (or people will bypass).

### Expected business outcomes (6 months after adoption)

- 80% of requests submitted via ProcureDesk (not email), maverick spend visibly reduced in reports.
- Average approval cycle from 3 days to <1 day for standard requests.
- Zero budget surprises at month-end (budget exceeded is blocked, not discovered).
- Any audit question ("who approved `PO-2026-042` and why?") answered in <2 minutes via query, not email search.

### Success definition

We will say ProcureDesk works when an employee can create a request with a vendor quote, see budget impact, get it approved (with threshold routing adding Finance when needed), have a PO generated, upload a receipt, and we can query the full history -- all without an email thread as the system of record. If we still need email to know what happened, it failed.

### Environment

Daily use on desktop (primary) and occasional mobile approval. Single primary location (Pune) with a small Delhi office. GST applies; department budgets are monthly.

---

## 2. Client Persona -- Who Is Asking For This

**Company:** Aarav Solutions Pvt Ltd -- fictional, realistic mid-market services firm commissioning ProcureDesk for our own ops and as a product we could offer to similar firms.

- **Size:** 120 employees (growing to 180 next year)
- **Departments:** Engineering (45), Design (15), Sales & Marketing (25), Operations & Admin (20), Finance (12), HR (3)
- **Geography:** HQ Pune (100), branch Delhi (20); single legal entity
- **Purchasing volume:** ~80 requests/month, average `18k (range `2k-1.2L). Peaks at quarter-end. ~`18L monthly spend through this system (direct materials not included -- this is indirect: SaaS, equipment, services, office).
- **Vendors:** ~85 active vendors (20% create 80% of spend), ~15 new vendors/year. Mix of domestic and 5 overseas SaaS vendors.
- **Procurement maturity:** Low-mid. No dedicated procurement team. Office Manager (Admin) + Finance Controller double as procurement. No formal sourcing/RFx; we pick vendors via referral or past use. No contract lifecycle -- contracts are PDFs in Drive.
- **Current tools:** Gmail + Google Sheets (3 masters: Vendor List, Budget Tracker, Request Log) + Drive for quotes/invoices + Slack for "can you approve?" No P2P system (only 30% of small orgs have any, McKinsey). Accounting: QuickBooks (not yet integrated). No ERP.
- **Current approval process:** Informal. Manager approves if they feel it is okay; above `10k informal ask to Finance on Slack; above `50k owner involved. No written DOA matrix until now -- this PRD will create one.
- **Current problems (lived, not invented):** Requests lost in email (found 2 duplicate laptop orders last quarter), budget checked after PO, vendor info in 3 places (Sheets + Drive + QuickBooks), approvals bottleneck when manager on leave (no backup), audit before GST filing takes 3 days of email search.
- **Compliance/audit expectations:** Need to show GST-compliant quote/PO/invoice linkage and who approved what, when, against which budget. No SOX, but internal audit every quarter. Data retention: 7 years for financial records (audit log must not be deletable).

**Why this profile for solo dev:** Complex enough to need org isolation, roles, budgets, threshold routing, audit -- but not complex enough to need multi-entity, multi-currency, or global S2P (which would require 12-18 month enterprise effort). One org, one currency (INR), monthly budgets, single-step + threshold approval is the smallest realistic slice that is still useful and forces the hard engineering.

---

## 3. Stakeholders

As the business owner, here is what each stakeholder expects from ProcureDesk. You must enforce the restrictions, not just suggest them.

### Employee / Requester

- **Responsibilities:** Raise genuine needs with evidence.
- **Goals:** Get what I need without chasing finance; know where my request stands.
- **Needs to see:** My requests (all states), vendor list (read), budget remaining for my department (read), status history, comments on my requests.
- **Can do:** Create DRAFT, attach quotes/files, edit _own_ DRAFT only, submit own, cancel own DRAFT, comment on own requests, view own audit entries.
- **Restrictions:** Cannot approve own request (ever), cannot edit after Submit, cannot see other departments budgets, cannot delete submitted requests.
- **Approval authority:** None.
- **Success:** "I submitted Monday with a quote, got approved Tuesday, saw PO Thursday -- no email."

### Manager / Department Head (Approver)

- **Responsibilities:** Approve/reject with budget context.
- **Goals:** Approve quickly with correct info; not be bottleneck.
- **Needs to see:** Inbox of PENDING assigned to me, budget impact at approval time (amount vs remaining), request files, history.
- **Can do:** Approve/reject assigned requests (with comment), request changes, view team spend.
- **Restrictions:** Cannot approve own requests, must approve in order if multi-step, cannot approve out-of-policy amount beyond limit (escalates).
- **Authority:** Up to department limit (e.g., Engineering Head up to `50k) -- above that needs Finance. [Client assumption, configurable]
- **Success:** "I see budget impact before I click approve, and I am not asked for routine `3k orders that finance already approved."

### Procurement Officer (where we have one -- at our size, often Admin doubles)

- **Responsibilities:** Validate completeness/policy, route correctly, create PO.
- **Goals:** Ensure every request is complete and policy-aligned before it reaches an approver.
- **Needs to see:** All requests in org, policy checks, vendor data, budget data.
- **Can do:** Verify completeness, reject incomplete for correction, determine approval route, create PO after final approval.
- **Restrictions:** Cannot approve financially beyond authority; cannot bypass budget check.
- **Success:** "No request reaches an approver missing a quote or with a wrong vendor."

### Finance / Budget Owner

- **Responsibilities:** Owns budgets, ensures spend stays within, reconciles, proves compliance.
- **Goals:** Real-time control, not retrospective reporting.
- **Needs to see:** All budgets (amount/spent/remaining by period), all requests, audit trails, spend by vendor/category/month, invoice vs PO vs receipt.
- **Can do:** Create/budgets, set thresholds, approve over-threshold steps, order/receive/close, post to accounting (future), override with documented exception (audit logged).
- **Restrictions:** Even Finance cannot approve own request; cannot delete audit logs.
- **Authority:** Up to org threshold; above needs Owner. Can approve any threshold step.
- **Success:** "I see overspend attempt _before_ approval, not at month-end. Audit is a query, not a week."

### Admin

- **Responsibilities:** Master data, members, day-to-day ops.
- **Can do:** CRUD vendors, CRUD budgets, invite members, change roles (except demote Owner), manage approval policies.
- **Restrictions:** Cannot delete org, cannot change Owner without Owner, cannot delete audit.

### Super Admin / Owner

- **Responsibilities:** Org exists, ultimate accountability.
- **Can do:** Everything Admin can + create/delete org, change any role, override any policy (with audit), view all.
- **Restrictions:** Still cannot approve own request without audit; cannot delete audit.

### Vendor (external)

- **Responsibilities:** Fulfill PO, send invoice.
- **Expectation:** For MVP, vendor is _not_ a system user (we email PO). Self-service portal is future. Vendor data lives as master with contacts/documents read-only for them. [Research: Kissflow has self-service portal; we defer it -- out of MVP to keep solo scope.]

### Auditor / Compliance (read-only)

- **Responsibilities:** Verify controls, sample transactions.
- **Needs to see:** Full audit trail (who, what, when, before/after, reason), budget vs spend, policy, approvals.
- **Can do:** Read all, export audit for period, filter by entity.
- **Restrictions:** No mutations.
- **Success:** "I can trace any rupee from request to PO to receipt to audit without asking finance for email threads."

### Executive / Management

- **Needs to see:** Spend dashboards (by dept/vendor/month), approval analytics (avg cycle, bottleneck), budget analytics.
- **Can do:** View reports, not approve routine (unless escalated).
- **Note:** Executive dashboard is _Phase 2_ -- for MVP we provide the data via audit/search, not a polished BI layer.

---

## 4. Current-State Problems (Before ProcureDesk)

This is how we operate _today_ -- you must replace this, not replicate it.

**Step-by-step today:**

1. Employee realizes need (e.g., "need 3 laptops for new hires") -> writes email to manager with description, maybe a quote PDF in Drive link.
2. Manager reads email (maybe 1 day later), replies "approved" or "check with finance."
3. Employee forwards to Operations/Admin who checks a _Budget Tracker_ sheet (often outdated) and replies on Slack "looks okay, go ahead" or "over budget, need finance."
4. Admin creates a PO in Word, emails vendor.
5. Vendor delivers, someone notes "received" in a _Request Log_ sheet (sometimes).
6. Vendor emails invoice PDF -> forwarded to finance -> finance retypes into QuickBooks and into the sheet.
7. Month-end: finance opens 3 sheets, reconciles, finds surprises (e.g., two duplicate orders of the same laptops because two employees asked separately and neither saw the other request).

**Where it breaks (all lived):**

- **Email as workflow engine:** Lost requests, duplicate purchases (we ordered same laptops twice last quarter), no status visibility. Ramp: email chains add days/weeks and rush orders bypass process.
- **Spreadsheets as database:** Three masters (Vendor List, Budget Tracker, Request Log) drift, no constraints (duplicate vendor names), `68% lack real-time visibility` (McKinsey) -- we are in that 68%.
- **Manual approvals:** No routing rules; manager on leave = stall; no escalation. Hospitality Net: approvals in email/Excel/WhatsApp create silos.
- **Budget surprise:** Checked after PO, not before; 10-20% targeted savings lost to maverick (Hackett).
- **Vendor info scattered:** Same vendor in Sheets + Drive + QuickBooks, different spellings, no link to spend history.
- **Approval bottleneck:** One manager approving everything because DOA is not written; senior execs become bottleneck for routine `9k purchases (AuraVMS: without DOA, requests escalate unnecessarily).
- **Audit difficulty:** Every GST quarter, finance spends 3 days searching email threads to prove who approved what. GAO found none of 24 federal agencies fully met data-quality when it was not system-generated.
- **Manual reconciliation:** AP team manually compares invoice to PO to receipt; Stampli case: AP at capacity, falling behind on matching.

**Operational consequences:** Delays (projects wait for equipment), overspend, duplicate spend, vendor friction (late POs), audit risk, and finance as a bottleneck instead of controller. Jaggaer: manual = any workflow where a _person_ moves data between requisition/approval/payment -- that is exactly us.

---

## 5. Future-State Vision (After ProcureDesk)

| Area                  | Before (today)                      | After (with ProcureDesk)                                                                                                                  | Business gain                                           |
| --------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Request intake**    | Email + Drive link, no form         | Single form: title, vendor (from master), amount, budget, category, files (quote) -- mandatory fields, validated                          | Complete requests first time; no re-ask                 |
| **Approval routing**  | Manual forward, ask "who approves?" | System routes: single-step by default; if amount > threshold (e.g., `50k) auto-adds Finance; if category=IT also adds IT manager (future) | Correct approver first time, no escalation by confusion |
| **Budget check**      | Spreadsheet after PO                | Real-time at approval: approver sees `Budget: `2.1L remaining of `5L, this request `65k would leave `1.45L                                | Prevent overspend, not discover it                      |
| **Status visibility** | "Did manager see my email?"         | Status DRAFT/PENDING/APPROVED/ORDERED... with history, in-app + email notify                                                              | No chasing                                              |
| **Ordering**          | Word PO, emailed manually           | Approved -> Order -> PO PDF auto-generated (background job) with number, sent to vendor (email), status ORDERED                           | Faster, audited, numbered                               |
| **Receipt**           | Note in sheet (sometimes)           | Receive -> upload receipt, quantity check, status RECEIVED                                                                                | Link to 3-way match future                              |
| **Audit**             | 3 days email search                 | Every action: who, what, when, before/after, reason -- queryable, exportable, append-only                                                 | GST/internal audit in minutes                           |
| **Vendor master**     | 3 sheets, different spellings       | Single master per org, unique vendor name, contacts, docs, spend history                                                                  | One truth                                               |
| **Reporting**         | Month-end sheet                     | Spend by vendor/category/dept/month (Phase 2 dashboard, MVP via search/audit)                                                             | Proactive, not retrospective (Fraxion pattern)          |

**Key behavioral shift:** Compliant buying must be _easier_ than maverick. Ramp: reducing maverick starts with making compliance the path of least resistance. So intake must be frictionless (plain language, pre-fill, duplicate flag before approver -- Ramp pattern).

---

## 6. Domain Model

This is the business vocabulary you must model. I am not prescribing tables, but you must capture these concepts correctly. [Research-backed] vs [Client assumption] marked.

### Organization [Research-backed, must]

- **Purpose:** Isolation boundary. One org = one company. All data (vendors, budgets, requests, audit) belongs to one org. No cross-org leak.
- **Why we need it:** Even for our 120-person use, portfolio requires multi-tenancy (real SaaS), and our Delhi branch must not see another client org.
- **Attributes:** Name, slug (unique, URL), owner, created, departments (logical, not separate entity at MVP).
- **Relationships:** Has many Users via Membership, has many Vendors/Budgets/Requests/Audit.
- **Lifecycle:** Created by Owner, active until Owner deletes (with confirmation). Deletion cascades? Must be explicit and guarded.
- **Rule:** Every query must scope to org. No org = no access.

### User [Research-backed, must]

- **Purpose:** Person who can log in and act within orgs.
- **Attributes:** Email (unique), name, password, avatar.
- **Relationships:** Member of 1..N orgs via Membership; creates requests; approves steps; uploads files.
- **Rule:** User exists independently of orgs; membership carries role.

### Role [Research-backed, must - our 5]

- **Purpose:** Who can do what within an org.
- **Values:** OWNER, ADMIN, FINANCE, APPROVER, REQUESTER (hierarchy but with object-level exceptions like no self-approval). See Section 8.
- **Why:** Real DOA matrices (AuraVMS) are role + amount + category driven. For MVP, role + threshold is enough.

### Department / Team [Client assumption, logical for MVP]

- **Purpose:** Grouping for budgets (e.g., Engineering owns a budget). Not a separate hard entity at MVP; we track via budget name + org, not a full Department table. Future we may add Department entity if budgets need cost-center hierarchy.
- **Why defer hard entity:** Adds complexity without MVP value; budget allocation by department can be via naming + ownership.

### Vendor [Research-backed, must]

- **Purpose:** Master of who we buy from. One vendor has many requests/invoices. Reduces maverick by guiding to preferred vendors (56% best-in-class provide pre-approved lists).
- **Attributes:** Name (unique per org), email, GSTIN, contact, status ACTIVE/INACTIVE, docs (future).
- **Relationships:** Org has many vendors; vendor has many requests.
- **Lifecycle:** Created by Admin/Finance/Owner, active, can be deactivated (not deleted if it has history).
- **Rule:** Name unique per org prevents duplicates; deactivated vendor cannot be selected for new requests but history remains.

### Vendor Contact / Vendor Document [Future, not MVP]

- **Purpose:** Contacts (multiple emails/phones) and docs (compliance, banking). Kissflow has self-service portal + banking/compliance docs.
- **Why defer:** For our 85 vendors, single email + GSTIN per vendor is enough at MVP. Multi-contact + doc portal is enterprise portal scope.

### Spend Request [Research-backed, must -- core]

- **Purpose:** The _requisition_ -- internal, not legally binding, before any vendor commitment. This is the product.
- **Attributes:** Title, description, vendor, amount (Decimal, INR), category (future), budget, currency INR, required quote file(s), status, version (for concurrency), idempotency key.
- **Lifecycle (states):** DRAFT -> PENDING_APPROVAL -> APPROVED -> ORDERED -> RECEIVED -> CLOSED; also REJECTED (terminal), ESCALATED, CANCELLED. See Section 7.
- **Rule:** Only DRAFT editable by owner; only PENDING approvable; only APPROVED orderable; etc.

### Request Item (line items) [Recommended, for MVP as single-item MVP, multi-item future]

- **Purpose:** What exactly is being bought (e.g., 3x MacBook @ `95k). Real POs have line items with quantity x price = total.
- **Why defer multi-item to Phase 2:** For our average single-item requests (SaaS tool, 3 laptops as one line), single amount field is enough. But model should allow future items (so amount is sum of items). For MVP, keep request as single amount + description; add RequestItem table in Phase 2 without breaking requests.

### Category [Future, not MVP hard entity]

- **Purpose:** Office Supplies, SaaS, Equipment, Services -- drives approval policy (IT must approve SaaS). Tacto example: IT equipment from `2k needs IT manager.
- **Why defer hard entity:** At MVP, budget name can encode category (e.g., "Engineering SaaS Q3"). Adding a Category table + routing rules is a Phase 2 product decision (see mvp-scope.md).

### Budget [Research-backed, must]

- **Purpose:** Money allocated for a period for an org/department, to be checked _before_ approval.
- **Attributes:** Name, period (start/end, monthly/quarterly), amount, spent (derived, not editable), threshold (e.g., `50k over needs Finance), remaining (amount-spent).
- **Relationships:** Org has many budgets; request optionally links to one budget.
- **Lifecycle:** Created by Finance/Admin/Owner, active for period, spent increments atomically on APPROVED, not on DRAFT.
- **Rules:** Cannot approve if spent+amount > amount (unless exception with audit). Remaining shown at approval time. Period overlap rules: name+periodStart unique per org.

### Cost Center [Future, accounting concept, not MVP entity]

- **Purpose:** GL code where spend posts (for ERP). P2P feeds ERP, not replaces it (Kissflow: P2P compliments ERP as system of record). Defer until QuickBooks integration.

### Approval Policy [Research-backed, must as logic, not necessarily separate table at MVP]

- **Purpose:** Rules for who approves what: amount threshold, department, category, vendor. DOA matrix is the policy.
- **Why we need it:** Without policy, requests route randomly (AuraVMS: people escalate unnecessarily).
- **MVP form:** Simple: default single approver + "if amount > budget.threshold auto-add Finance" as the _policy_. Hard-code the evaluation in service, not a full policy builder (Kissflow visual designer is enterprise flexibility we deliberately avoid at MVP to stay opinionated).

### Approval Step / Approver [Research-backed, must]

- **Purpose:** One approver in a sequential chain. Request has steps `order 1..N`, each with approver + status PENDING/APPROVED/REJECTED/ESCALATED.
- **Lifecycle:** Created on Submit, decided in order, no skipping, no self.
- **Rule:** Approve only assigned, not own, in order, with version check.

### Purchase Order (PO) [Research-backed, must but generated]

- **Purpose:** External, legally binding doc sent to vendor after approval, with PO number. Requisition _becomes_ PO only after approval (Ivalua: internal request vs external contract).
- **Attributes:** PO number (auto, e.g., PO-2026-042), date, supplier, items, totals, terms.
- **MVP:** PO PDF generated as background job after APPROVED -> Order. Not a separate hard entity at MVP? We can store PO number on request + generated PDF as a File, not a full PO table. Future we may add PO entity if we need vendor acknowledgment.

### Quote [Research-backed, must as file, not separate entity at MVP]

- **Purpose:** Vendor estimate attached to request to justify amount. In SMBs, a PDF we attach.
- **MVP:** Modeled as a File attached to request with type QUOTE (vs RECEIPT/INVOICE). No separate Quote table needed.

### Invoice [Future, not MVP hard entity]

- **Purpose:** Vendor bill after delivery. Matched via 3-way. At MVP, invoice can be a File of type INVOICE attached to request for evidence, not a full invoice workflow (AP payment is future). Research shows invoice matching is where AP lives; our P2P scope stops at receipt for MVP.

### Receipt / Goods Received Note [Research-backed, must as evidence]

- **Purpose:** Confirmation that goods/services arrived (quantity, inspection). Enables future 3-way match. For services, a completion entry.
- **MVP:** Modeled as a File of type RECEIPT + status RECEIVED on request. No separate Receipt table at MVP; receipt is the file + status. Future we add Receipt entity with line-item receipts for 3-way.

### Contract [Future, not MVP]

- **Purpose:** Agreement with pricing/terms/renewal (enterprise). Our 85 vendors have PDFs in Drive, not lifecycle. Defer contract table until needed.

### Payment [Future, not MVP]

- **Purpose:** Money actually sent. Our P2P stops at receipt/close; QuickBooks integration will post payment later. No Payment entity at MVP.

### Comment [Must for MVP, lightweight]

- **Purpose:** Discussion on request (approver asks "why this vendor?").
- **Attributes:** Author, body, timestamp, request.
- **Rule:** Comments are append-only, visible to org members with request visibility.

### Attachment [Must, modeled as File]

- **Purpose:** Any evidence: quote, receipt, invoice. See File above.
- **Attributes:** Original name, S3 key, MIME, size, scan status, uploader.
- **Rule:** 10MB/file, 5/request, 100MB/org at MVP; MIME magic check.

### Notification [Must]

- **Purpose:** Tell the right person at the right time (submitted, approval needed, approved, rejected, escalation).
- **Attributes:** User, type, title, body, payload (requestId), read flag.
- **Lifecycle:** Created on every transition, in-app + email queued, read/dismissed.

### Audit Event [Research-backed, must, append-only]

- **Purpose:** Prove who did what, when, before/after, reason. Federal GAO failure shows even large orgs need system-generated audit.
- **Attributes:** Org, entity type/id, actor, action (CREATE/SUBMIT/APPROVE/REJECT/ORDER/RECEIVE/UPDATE), diff JSON (before/after or field->from/to), timestamp.
- **Rules:** Immutable (no update/delete), indexed by org+entity+time, actor always recorded, exception reason required.

---

## 7. Complete Business Workflows

As the client, here is how I expect the system to behave for _every_ flow. If it does not behave like this, it does not meet acceptance.

### A. User Onboarding

**Goal:** From zero to a working org in <10 minutes.

**Flow:**

1. **Organization creation:** Visitor registers (name, email, password) -> chooses "Create organization" -> enters org name (e.g., "Aarav Solutions") -> system creates org with slug `aarav-solutions`, creator becomes OWNER (also ADMIN+FINANCE implicitly). This is atomic: org + OWNER membership must both succeed or both fail.
2. **Admin setup:** OWNER sees "Invite members" -> enters email + role (REQUESTER/APPROVER/FINANCE/ADMIN) -> system sends invite email with link (token). Link can be used once; expires in 7 days.
3. **Inviting users:** Admin/Owner can invite at any time (Settings -> Members -> Invite). Bulk invite is future.
4. **Accepting invite:** Invitee clicks link -> if new user, register then join as invited role; if existing, join directly. Membership created `orgId+userId` unique.
5. **Assigning roles:** Owner/Admin can change role for any member except cannot demote Owner without transferring ownership. Change is audit logged with reason.
6. **Department assignment:** At MVP, department is via budget assignment, not separate entity. Future we may add Department. For now, admin creates budgets like "Engineering Q3" and approvers are tagged by department in their role.
7. **Permission setup:** Immediately after invite, role takes effect. User sees only what role allows (RBAC). Org isolation: new member sees only that org, not other orgs they belong to.

**Edge:** Invite to already-member -> error "already member." Invite link reused -> error "already used." Inviter leaves org before invite accepted -> invite still valid (but inviter audit remains).

### B. Vendor Lifecycle

**Goal:** One vendor master, no duplicates, clear lifecycle.

**Flow:**

1. **Vendor creation:** Admin/Finance/Owner creates vendor: name (required, unique per org), email, GSTIN, contact, notes. [Research: Precoro 56% best-in-class provide pre-approved catalogs -- vendor master is how you guide to preferred.]
2. **Onboarding (MVP lightweight):** No separate onboarding portal (Kissflow has self-service, we defer). At MVP, vendor is ACTIVE immediately after creation. Future: verification step where Finance approves new vendor after checking GSTIN/docs.
3. **Vendor information:** List vendors with search by name/email, sort by name/created, paginate. View vendor detail: name, contact, GSTIN, spend history (total requests + total ` amount).
4. **Contact management (MVP single, future multi):** At MVP, one email/contact per vendor as fields. Future: separate VendorContact table (multiple contacts).
5. **Documents (future):** At MVP, no separate vendor docs; vendor GSTIN as field is enough. Future: VendorDocument (banking, compliance PDFs).
6. **Active/inactive status:** Vendor has ACTIVE/INACTIVE. Inactive vendor still appears in history but cannot be selected for _new_ requests. Deactivation requires reason and is audited.
7. **Vendor updates:** Admin/Finance/Owner can edit vendor (name, email, etc). Name change must keep org-unique constraint; old name remains in audit diff.
8. **Vendor deactivation:** Not deletion. Hard delete only allowed if vendor has zero requests ever; otherwise deactivate. This preserves audit/referential integrity.

**Edge:** Duplicate name in same org -> 409. Duplicate across orgs is allowed (isolation). Deactivating vendor with PENDING requests -> allowed but those requests remain; new requests blocked.

### C. Spend Request Lifecycle

**This is the core. Every state and transition must be enforced server-side, never just UI.**

**States (derived from research + SMB simplification):**

- `DRAFT` -- editable, not yet submitted. Initial.
- `PENDING_APPROVAL` -- awaiting approval steps. Not editable (except cancellation).
- `APPROVED` -- all steps approved, budget increment happened, ready to order.
- `REJECTED` -- any step rejected, terminal for that request. Can be cloned to new DRAFT.
- `CHANGES_REQUESTED` -- approver requested changes, returns to DRAFT with comment preserved (non-terminal, distinct from REJECTED).
- `ORDERED` -- PO PDF generated and (logically) sent to vendor.
- `RECEIVED` -- receipt file uploaded, fulfillment confirmed.
- `CLOSED` -- Finance/Admin closed, financially complete.
- `CANCELLED` -- requester cancelled before approval completed (DRAFT or PENDING only).
- **Step status** `ESCALATED` is _only_ on ApprovalStep, not on the request. Request stays PENDING while a step escalates (48h timeout creates new step, not a request state).

**Who creates it:** Any member (REQUESTER or above). Created as DRAFT with required info (see validation below).

**Required information (to create DRAFT):**

- Title (required, e.g., "3x MacBook Pro for new hires")
- Description (optional but recommended)
- Vendor (required, must be ACTIVE, from org vendor master)
- Amount (required, Decimal, INR, `0.01 min, `10L max per request at MVP [Client assumption -- prevents fat-finger `1Cr])
- Budget (optional but recommended; if selected, must belong to same org and period must include today)
- Quote file(s) (at least 1 required if amount > `10k [Client assumption, aligns with Hyperbots authorization limit concept]; otherwise optional but encouraged)
- Category (future -- at MVP, budget name encodes it)

**Validation:**

- All required present, amount >0, vendor active, budget belongs to org, files valid (see Attachments).
- Idempotency: `POST /requests` with `Idempotency-Key` header returns same request on retry, not duplicate.

**Budget checks:**

- At submit and at approve time we check: `budget.spent + request.amount <= budget.amount` else block with `422 Budget exceeded`. Check is atomic with row lock (not just app check).

**Approval routing (on Submit):**

- DRAFT -> PENDING_APPROVAL when submitter clicks Submit (only owner of DRAFT can submit; only DRAFT can be submitted).
- System creates ApprovalStep(s): single step with default approver (configurable per org, e.g., Department Head) + if amount > threshold (budget.threshold or org default `50k) adds Finance as second step. Steps have `order` 1..N.

**Rejection:**

- Any step can be REJECTED with mandatory comment (reason). Request becomes REJECTED terminally; no further approvals. Budget not deducted. Notify requester with reason.

**Request modification:**

- Only DRAFT can be edited, only by owner. Once PENDING, no edits (to prevent moving goalposts). If changes needed after submit, requester must Cancel (if allowed) and clone to new DRAFT.

**Resubmission:**

- REJECTED cannot be resubmitted; must clone to new DRAFT (so rejection history is preserved and audit is clear).

**Cancellation:**

- Owner can cancel DRAFT at any time (no audit beyond cancel).
- Owner can cancel PENDING before any step decided (moves to CANCELLED, audit logged).
- Cannot cancel after APPROVED (must go through receive/close or be handled as exception by Finance with audit).

**Expiration / Timeout:**

- PENDING >48h with no decision: escalation job marks oldest PENDING step as ESCALATED, creates new step for Finance/Owner, notifies. Not auto-approved (we never auto-approve money).

**Escalation:**

- Timeout 48h or manual escalation by Admin if approver unavailable. Creates new step.

**Final completion:**

- APPROVED -> Order -> ORDERED -> Receive -> RECEIVED -> Close -> CLOSED. Each step is a POST with guard (see D).

### D. Approval Workflow

**Requirement:** As the business owner, I need this to be correct and auditable. Do not allow shortcuts in code.

**Supported at MVP:**

- **Single approval:** Default. One ApprovalStep (order 1).
- **Sequential multi-level (threshold-based):** If amount > threshold (e.g., Rs 50k, configurable per Budget/Org), sequential: Approver (order 1) -> Finance (order 2). Must approve in order; second cannot approve until first done.
- **Amount-based:** The threshold rule above _is_ amount-based. Other amounts may have different default approvers (e.g., `0-10k -> Manager, `10k-50k -> Dept Head, >`50k -> Finance) -- at MVP we simplify to single threshold; full amount-bands are Phase 2.
- **Escalation:** Timeout 48h -> ESCALATED, notifies next level. Admin can manually escalate if approver on leave.
- **Rejection:** Any step rejects -> whole request REJECTED. Rejection requires comment.
- **Request for changes:** At MVP, rejection _is_ the request for changes (with comment "please add detailed quote"). Requester clones to new DRAFT. Future we may add explicit "Request Changes" status that returns to DRAFT.

**Deferred to Phase 2 / Future (do not build in MVP, but design should not prevent):**

- **Parallel approval:** Multiple approvers at same order, all must approve (e.g., Finance _and_ Legal). Needs `order` group, not just single.
- **Category-based:** IT equipment >`2k needs IT manager _in addition_ to threshold (Tacto example). Needs Category entity + policy table.
- **Department-based:** Engineering vs Marketing budgets route differently. Needs Department entity.
- **Budget-owner approval:** Request charged to a budget must be approved by that budget owner (variant of threshold).
- **Delegated approval:** Approver out -> delegate to backup (AuraVMS backup provisions). Needs delegation table + date range.

**Exactly what should happen in each scenario (MVP):**

1. **Single approval, `8k request, threshold `50k:** Submit -> creates Step order 1 = Dept Head (from org default) -> Head approves -> APPROVED -> budget spent += `8k atomically.
2. **`65k request, threshold `50k:** Submit -> Step 1 = Dept Head, Step 2 = Finance -> Head approves (still PENDING) -> Finance approves -> APPROVED.
3. **Dept Head tries to approve Finance step first:** Blocked, 409 "not your turn -- order 1 pending."
4. **Requester tries to approve own request:** Blocked, 403 "cannot approve own."
5. **Budget would exceed:** At approve time, `spent+amount > amount` -> 422 "Budget exceeded" even if approver is authorized. Finance must increase budget or reject.
6. **Approver on leave, 48h timeout:** Job marks Step 1 as ESCALATED, creates Step 2 as Finance, notifies. Not auto-approved.
7. **Rejection:** Dept Head rejects with "need detailed quote" -> request REJECTED, notify requester, budget untouched, steps frozen.

### E. Purchase Workflow

**Goal:** Approved request becomes a purchase the vendor fulfills.

**MVP flow (what I expect):**

1. **Vendor selection:** At request creation, requester picks ACTIVE vendor from master (no ad-hoc vendor typing -- that creates duplicates). If new vendor needed, Admin/Finance creates vendor first (B flow), then requester picks it.
2. **Quote handling:** Requester attaches vendor quote PDF (evidence) to request. Quote is a File of type QUOTE. Required if amount >`10k. Quote amount should roughly match request amount; if mismatch >20%, warn but not block (future: auto-match).
3. **Purchase Order (PO):** When request is APPROVED, Finance/Admin clicks "Order" -> system generates PO PDF (PO number like `PO-2026-042`, date, vendor, line total, terms) as a background job (so Order returns 200 quickly, PDF appears shortly). Status becomes ORDERED. PO number is stored on request; PDF is a File.
4. **PO approval (not separate at MVP):** The request approval _is_ the PO approval. No second PO approval chain at MVP (enterprise has it; we keep one flow).
5. **Vendor communication (MVP manual):** PO PDF is ready for download; we email vendor outside system or download and forward. No automated vendor email integration at MVP (future: email vendor via system). Vendor acknowledgment is not tracked at MVP.
6. **Fulfillment:** Vendor delivers goods/services. Operations notes delivery.
7. **Receipt confirmation:** Finance/Admin clicks "Receive" -> uploads receipt/invoice file (File type RECEIPT), confirms quantity/inspection notes, status RECEIVED. This enables future 3-way match.

**Edge:** PO generation failure (job fails) -> request stays APPROVED, PO not yet ORDERED, Finance can retry "Order" (idempotent). PO PDF should be regeneratable.

### F. Invoice / Payment Workflow

**At our size, AP is Finance. Keep it simple for MVP.**

**MVP (files as evidence, not full AP):**

- **Invoice submission:** Vendor invoice PDF is uploaded as a File of type INVOICE attached to the request (or to the RECEIVED request). No separate Invoice table at MVP.
- **Invoice matching (manual at MVP):** Finance visually checks: invoice amount vs PO amount vs receipt. No automated 3-way match at MVP (full 3-way is enterprise: PO=Receipt=Invoice within tolerance per Stampli BTB 5%). We will keep invoice amount as a file, not a structured amount field.
- **Approval:** If invoice matches, Finance approves by marking RECEIVED -> CLOSED (no separate invoice approval state at MVP).
- **Exceptions:** If invoice amount differs >5% or `5k from request amount, system should warn at Receive time: "Invoice `67k differs from request `65k." Not block, just warn and audit the note.
- **Finance review:** Finance reviews all RECEIVED before Close.
- **Payment status (future):** Payment (wire/check) is done in QuickBooks; ProcureDesk does not handle payment at MVP. Future integration will post to accounting and track PAID.

**Future (not MVP):** Structured Invoice entity (number, date, amount, line items), automated 3-way match with tolerances (Stampli BTB 5% under `5k), AP approval chain, payment tracking, QuickBooks sync.

**Why defer full 3-way:** Research shows 3-way adds a receiving step that SMBs often skip for low-value goods. Our 85 vendors are mostly services/SaaS where receipt is a completion note, not a dock scan. Adding full 3-way now would add an extra verification layer that slows our 80 requests/month without proportionate value.

### G. Budget Workflow

**Goal:** Real-time control, not retrospective reporting (Fraxion #1 pattern: approver sees budget impact before approving; Procurify standout).

**MVP flow:**

1. **Budget creation:** Finance/Admin/Owner creates budget: name (e.g., "Engineering Q3"), period (start/end, monthly/quarterly), amount, threshold (optional, e.g., `50k). Periods cannot overlap for same name+org.
2. **Budget allocation:** At MVP, allocation is _by budget_ (choose one budget per request). Department budgets are separate budgets with names like "Marketing Q3". No separate allocation table.
3. **Department budgets:** Logical via naming; hard Department entity is future. For now, admin creates budgets per department as needed.
4. **Categories:** Budget name encodes category (e.g., "Engineering SaaS Q3"). No separate Category entity at MVP.
5. **Spend tracking:** Every approved request linked to a budget increments `spent` atomically. `remaining = amount - spent` shown everywhere.
6. **Available budget:** Displayed at: vendor/Budget list (spent/remaining bar), at approval time (approver sees remaining before decision), at request create time (requester sees remaining when picking budget).
7. **Budget warnings:** When remaining <20% or <`50k, show warning amber. Not blocking, just visible.
8. **Budget exceeded scenarios:** If remaining insufficient for request amount, Submit still allowed? [Client expectation]: Submit is allowed (so budget check at approval is the gate), but approver sees "This approval would exceed budget (`1.45L remaining, request `65k would need `1.1L over -- exceeds)." Approve then fails with 422 unless Finance overrides with documented exception (audit logged as "exception: budget exceeded, approved by Finance with reason X").
9. **Budget approval:** Creating a budget itself does not need approval at MVP (Admin/Finance can create). Future we may require Owner to approve budgets above `5L.

- **Budget period edits:** Changing periodStart/periodEnd does not retroactively affect PENDING requests already submitted with that budget; new requests use the new period. Validity is checked at Submit, not at approve.

**Edge:** Budget period ended -> no new requests can select it (only historical). Budget amount edited mid-period -> must recalculate spent vs new amount; if new amount < spent, warn and block until resolved.

### H. Audit Workflow

**As the client, this is non-negotiable. If it is not logged, it did not happen.**

**Requirement:** Every _important_ action is recorded as an AuditEvent, append-only, never deletable, queryable by org + entity + actor + time. Federal GAO: without system-generated audit, even 24 major agencies fail data-quality.

**What is logged (MVP):**

- Organization: create, update, delete (Owner)
- Membership: invite, join, change role, remove (who, before/after role)
- Vendor: create, update, deactivate, reactivate
- Budget: create, update (amount/threshold), period close
- Request: create, submit, approve, reject, order, receive, close, cancel, escalate, update (DRAFT only edits logged as diff)
- ApprovalStep: created, approved, rejected, escalated (with comment)
- File: uploaded, deleted (soft), scan status change
- Notification: sent (implicit via audit of the triggering action)

**For each audit event, record:**

- Who did it (actor userId + name snapshot)
- What changed (entity type + id, e.g., PurchaseRequest `req-123)
- When it changed (timestamp, server time)
- Previous value (for updates: before JSON)
- New value (after JSON, or field diff)
- Related request/entity (e.g., approval step links to request)
- Reason when applicable (rejection comment, exception reason, budget override reason)

**Examples:**

- "2026-08-22T10:15:00Z, Priya (approver) APPROVED step order 1 of request req-789, comment: `looks good, budget okay`"
- "2026-08-22T10:20:00Z, Ankit (finance) attempted APPROVE step order 2 but failed: Budget exceeded (remaining `1.45L, amount `65k)."

**Access:** Finance/Admin/Owner/Auditor can list audit by org, filter by entityType/entityId, sort by time, paginate, export (Phase 2). Requester can see audit for own requests.

**Retention:** 7 years, never deleted even if request is cancelled or vendor deactivated.

---

## 8. Detailed Business Rules

As the business owner, these are explicit. Where I say _[Client assumption, configurable]_, I expect you to make it configurable, not hard-coded.

### Approval thresholds [Client assumption, configurable]

- Default single threshold: `50,000 INR per request. Amount `<= threshold: single approval (Dept Head). Amount > threshold: sequential Dept Head -> Finance.
- Threshold is per budget or per org (if request has no budget, use org default). Stored as `Budget.threshold` or `Organization.defaultThreshold`.
- Must be editable by Finance/Admin/Owner; change is audited; applies only to _new_ requests after change, not retroactively to PENDING ones in flight (to avoid mid-flight policy change confusion).

### Budget limits [Research-backed, must]

- `spent + amount <= amount` must hold at _approve time_ (atomic). Submit is allowed even if over, but approve is blocked unless Finance overrides with exception reason (audit: "exception: budget exceeded, approver Finance reason X").
- Remaining <20% or <`50k shows warning, not block.

### Department restrictions [Future, not MVP]

- Category-based routing (IT gear needs IT manager) deferred. At MVP, budget name encodes department; threshold is the only department-like rule.

### Category restrictions [Future]

- Deferred. At MVP, no Category entity; policy does not branch on category.

### Vendor restrictions

- Only ACTIVE vendors selectable for new requests.
- Preferred vendors: we do not have a formal preferred flag at MVP; future we will add `vendor.isPreferred` to guide users (56% best-in-class have pre-approved lists).

### Required quotes above certain amounts [Client assumption]

- Amount > `10k requires at least 1 quote file of type QUOTE attached before Submit. Amount <=`10k: quote optional but encouraged.

### Mandatory fields [Client assumption]

- To create DRAFT: title, vendor, amount. To submit: budget (if available) + quote if >`10k + description. Amount `0.01 to `10L per request.

### Approval delegation [Future, not MVP but must not be prevented]

- At MVP, if approver unavailable, Admin can escalate manually (48h timeout also escalates). No formal delegate-to-backup table. Future we will add delegation with date range.

### Policy exceptions

- Any rule exception (budget exceeded override, vendor not preferred but used, missing quote override) must have mandatory `reason` text and is audit logged as `action: APPROVE_WITH_EXCEPTION`. Only Finance/Owner can exception-approve.

### Cancellation rules

- DRAFT: owner can cancel any time -> CANCELLED.
- PENDING: owner can cancel only if no step has been decided yet (all steps still PENDING). After any APPROVED, cannot cancel -- must be rejected or handled via Finance exception.
- APPROVED/ORDERED/RECEIVED/CLOSED: cannot cancel (terminal).

### Editing restrictions after submission [Client assumption]

- Only DRAFT editable, only by owner. PENDING and beyond: no edits. If changes needed, cancel (if allowed) and clone to new DRAFT with edits. This preserves audit clarity (no moving target during approval).

### Who can modify approved requests

- No one. Approved state is immutable except via order/receive/close flow. If amount is wrong, new request must be created; old can be cancelled if still cancellable, otherwise Finance handles via exception/credit.

### Who can override policies

- Finance or Owner can override via exception (budget exceeded, missing quote) with reason + audit. No one can override "no self-approval" or "must approve in order."

### What requires audit logging

- Everything in Section 7H. If audit is not written transactionally with the state change, the feature is not done.

---

## 9. Requirements

### Functional Requirements (business view)

**FR-ORG:** Create/join org, invite by email+role, change role, remove member, list members, org isolation (no cross-org read).

**FR-VENDOR:** CRUD vendors (unique name per org), search/sort/paginate, active/inactive, vendor detail with spend history.

**FR-BUDGET:** CRUD budgets (name, period, amount, threshold), view spent/remaining/warning, atomic enforcement at approve.

**FR-REQUEST:** Create DRAFT, edit own DRAFT, submit, view list/detail, cancel (per rules), approve/reject/order/receive/close per state machine, idempotent create, version check on approve, clone rejected to new DRAFT.

**FR-FILE:** Upload/list/delete files per request (quote/receipt/invoice as types), signed URL 15m, MIME magic + size, scan stub.

**FR-APPROVAL:** Single + threshold sequential, no self, in-order, 48h escalation, rejection with comment, audit every transition.

**FR-PO:** Generate PO PDF (PO number auto) on Order (background job), download.

**FR-AUDIT:** Append-only log per 7H, filter by org/entity, export (Phase 2).

**FR-NOTIFY:** In-app + email on: submitted, approval needed, approved, rejected, escalation, ordered (see 13).

**FR-SEARCH:** Search/filter/sort/paginate for vendors/requests/budgets/audit (see 12).

**FR-COMMENT:** Comment thread per request.

**FR-ADMIN:** Org settings, member/role management.

### Non-Functional Requirements (business expectations, sensible for our stage)

**Security (must guarantee):**

- Passwords never stored plain (hashed), httpOnly+Strict cookies for auth, org isolation (no IDOR), RBAC enforced server-side (UI hide is not security), audit immutability, file MIME + scan, rate limiting to prevent abuse, session timeout.

**Availability (realistic):**

- Target: 99% for MVP (free tier, not enterprise 99.9). Health check must be 200 for load balancer. Maintenance window allowed.

**Performance (sensible for 80 req/mo org, but tested at 10k for growth):**

- p95 list (vendors/requests) `300ms at 10k rows, approve `500ms, file upload 10MB `3s. Not enterprise SLA, but must feel instant.

**Reliability:**

- Jobs (email, PDF, escalation) retry 3x exp backoff, not lost on restart, idempotent, dead-letter after 3.

**Scalability:**

- Single org 10k requests, 50 concurrent approvers without lock errors or data corruption. Not millions.

**Accessibility:**

- Keyboard + screen reader for core flows (request form, approval inbox). Not full WCAG audit at MVP, but not inaccessible.

**Auditability:**

- Every state change queryable in <2 minutes, exportable, 7-year retention, never deletable.

**Maintainability:**

- Clear domain model, monorepo boundaries, shared validation, ADRs for decisions, CI must stay green. As the client, I expect you can explain every major choice.

**Data integrity:**

- Money is Decimal, never float; constraints (unique, FK, checks) in DB, not just app; transactions for budget+request+steps+audit.

---

## 10. User Stories

> As a [role], I want to [action], so that [business outcome]. Acceptance criteria where it matters.

### Requester

- **As a requester, I want to create a DRAFT with vendor + amount + budget + quote file, so that I can capture a complete need without follow-ups.**
  - AC: Title, vendor (ACTIVE), amount validation, budget belongs to my org, file 10MB/type, idempotent key prevents duplicate on double-click.
- **As a requester, I want to submit my DRAFT, so that it routes to the correct approver without me choosing.**
  - AC: Only own DRAFT submittable, creates ApprovalStep(s) threshold-aware, status becomes PENDING, notifies approver.
- **As a requester, I want to see status + history of my request, so that I do not chase finance.**
  - AC: Detail shows state, steps, files, audit, comments.

### Approver (Manager)

- **As an approver, I want an inbox of PENDING assigned to me with budget impact, so that I decide with context.**
  - AC: List filterable by me, shows remaining, cannot see unassigned beyond org, cannot approve own.
- **As an approver, I want to approve/reject in order with comment, so that decisions are audited.**
  - AC: Approve only assigned, in order, version checked; reject requires comment; budget check atomic.

### Finance

- **As finance, I want real-time budget remaining at approval, so that I prevent overspend before it happens.** [Research: Fraxion #1, Procurify standout]
  - AC: At approve time, `remaining` shown, `spent+amount <= amount` enforced with lock.
- **As finance, I want to generate a PO PDF on Order, so that vendor gets a numbered, auditable order.**
  - AC: After APPROVED, Order creates PO number, enqueues PDF job, status ORDERED, PDF appears as File.
- **As finance, I want to receive with receipt upload, so that fulfillment is evidenced.**
  - AC: ORDERED -> RECEIVED requires receipt file, status change audited.
- **As finance, I want to override budget exceeded with reason, so that genuine need can proceed with audit.**
  - AC: Approve with exception requires reason, audit `APPROVE_WITH_EXCEPTION`, still atomic.

### Admin / Owner

- **As an admin, I want to invite by email + role, so that team is onboarded in minutes.**
  - AC: Invite creates membership with role, email link, audit, expiry 7 days.
- **As an owner, I want to change roles and deactivate vendors, so that org stays controlled.**
  - AC: Role change audited, cannot demote Owner without transfer, vendor deactivation preserves history.

### Auditor

- **As an auditor, I want to filter audit by org + entity + time and export, so that I prove who approved what.**
  - AC: List filter/sort/paginate by entityType/entityId/actor/time, immutable.

---

## 11. Screens / Product Surface

What you will build me, behaviorally (not styling).

### Login / Authentication

- **Purpose:** Let users in securely.
- **Users:** All.
- **Info:** Email, password, invite flow if via link.
- **Actions:** Register, login, logout, accept invite.
- **States:** Loading, validation error, throttled (5/min), success.
- **Permissions:** Public (login/register), protected (all else).
- **Edge:** Session restore via cookie, not localStorage.

### Dashboard

- **Purpose:** After login, choose org and see at-a-glance status.
- **Users:** All (after auth).
- **Info:** My orgs, pending approvals count, my recent requests, budget warnings.
- **Actions:** Switch org, go to Requests/Vendors/Budgets.
- **Empty:** "No orgs -- create one."

### Requests (List)

- **Purpose:** Find and act on requests.
- **Users:** All (scoped to org).
- **Info:** Table: title, vendor, amount, status badge, budget, requester, updated.
- **Actions:** Search title, filter by status/vendor/budget, sort amount/created, paginate, create.
- **States:** Loading skeleton, empty "No requests -- create," error.

### Request Details

- **Purpose:** Single request truth.
- **Users:** Members with org access (but approve button only for assigned approver).
- **Info:** Header (title, status, amount, vendor, budget, requester), timeline steps, files (quote/receipt), audit history, comments.
- **Actions:** Edit (if DRAFT own), Submit, Approve/Reject (if assigned, with comment), Order/Receive/Close (if Finance), Cancel (per rules), Comment.
- **States:** Badge colors per status, disabled approve if not your turn/own.

### Create Request

- **Purpose:** Capture complete need.
- **Info:** Title, vendor dropdown (ACTIVE, search), amount, budget dropdown (remaining shown), category future, files dropzone.
- **Actions:** Save DRAFT, Submit, add file.
- **Validation:** Required, amount range, MIME/size, at least 1 quote if >`10k.

### Approval Inbox

- **Purpose:** Approver focus.
- **Info:** Only PENDING assigned to me, with budget impact.
- **Actions:** Approve/Reject with comment.

### Vendors

- **Purpose:** Master.
- **Info:** Table search/sort/paginate, vendor detail with spend history.
- **Actions:** Create/edit/deactivate (Admin/Finance/Owner).

### Vendor Details

- **Purpose:** Vendor + history.
- **Info:** Name, GSTIN, contact, status, total spend, requests list.

### Budgets

- **Purpose:** Control.
- **Info:** Table: name, period, amount, spent, remaining bar, threshold, warning.
- **Actions:** Create/edit (Admin/Finance/Owner).

### Purchase Orders (logical, not separate nav at MVP)

- **Info:** PO number, date, vendor, total, generated PDF link, status.

### Notifications

- **Purpose:** Awareness.
- **Info:** Bell with unread count, list: type, title, time, read flag.
- **Actions:** Mark read, read all, click to go to request.

### Audit History

- **Purpose:** Proof.
- **Info:** Table: who, what, when, before/after, reason, filterable.
- **Actions:** Filter by entity, export (Phase 2).

### Organization Settings + User Management + Roles/Approval Policies

- **Purpose:** Admin control.
- **Info:** Members list (name, role), invite form, role change, vendor/budget thresholds.
- **Actions:** Invite, change role, deactivate vendor, set threshold.

---

## 12. Search, Filtering & Reporting

**Search:** Title/description (ILIKE, later full-text). Vendor name/email. At MVP, simple substring, not vector.

**Filters (MVP, all lists):**

- Requests: status, vendor, budget, requester, date range, amount range, my requests vs all.
- Vendors: status active/inactive, q.
- Budgets: period, remaining warning.
- Audit: entityType, entityId, actor, date range.

**Sorting:** Requests by amount/created/updated, vendors by name/created, budgets by period. Allowlist, default createdAt desc.

**Pagination:** MVP offset `?page=&limit=` with total. Phase 2 cursor `?cursor=` when 10k. Must handle empty/last page gracefully.

**Saved views (future, not MVP):** "My pending approvals" as a bookmark, not a saved view table.

**Exporting:** Phase 2: Export audit/search results as CSV for finance/auditor. MVP: on-screen only.

**Reports (MVP vs later):**

- **MVP:** Data via search/audit is enough; no dedicated BI. Spend can be summed via audit history.
- **Phase 2:** Spend analytics by vendor/category/dept/month, approval analytics (avg cycle, bottleneck), budget analytics (burn rate). These need real data first -- building dashboards before data is premature.

---

## 13. Notifications

**Channels (MVP):**

- **In-app:** Bell icon with unread count, list, mark read, read all. Poll 30s or on mutation invalidation.
- **Email:** Queued (not blocking request), via Mailpit local (catch all, UI 8025) and Resend 100/day free prod. Templates: invite, submitted, approval needed, approved, rejected, escalation, ordered.

**Events that must trigger notifications (MVP):**

- Request submitted (notify approver(s))
- Approval required / assigned (approver)
- Request approved (requester)
- Request rejected (requester, with reason)
- Changes requested (via rejection comment)
- Budget exceeded attempt (finance, warning)
- Vendor approved (future -- at MVP vendor ACTIVE immediately, so not needed)
- PO created (requester + finance)
- Invoice exception (future)
- Approval overdue / escalation (approver + finance + owner)

**Preferences (future):** At MVP, all on. Future: user toggle per event, digest.

**Edge cases:**

- Notification fails (email bounces) -> retry 3x exp backoff, not lost, dead-letter after 3, in-app still shows.
- Approver on leave -> escalation creates new notification for backup/Finance.

---

## 14. Permissions & Security Requirements

What I, as the business owner, _require_ you to guarantee -- not implementation details.

- **Authentication:** Only registered users with correct password can log in. Sessions via httpOnly+Strict cookies (not localStorage). Passwords strong (bcrypt), no plain storage, 72-byte truncation check, timing-attack dummy hash.
- **Role-based access:** Per Section 3 matrix. Higher roles can do lower, but no self-approval ever. PolicyGuard must enforce, not just UI hide.
- **Organization isolation:** No user can see any org data they are not a member of. Every query must scope to org. Cross-org IDOR is a _data leak_ -- test matrix required.
- **Department-level access (future):** Not enforced at MVP beyond budget scoping; Phase 2 we may add department visibility.
- **Approval authority:** Thresholds per Budget/Org, configurable, audited on change, applies only to new requests. Spending limit per role is enforced.
- **Sensitive information:** GSTIN/banking (future) visible only to Finance/Admin/Owner. Not at MVP but design should allow.
- **Audit logs:** Immutable, never deletable, even by Owner. Every state change has actor + before/after + reason.
- **Session behavior:** Cookie Secure in prod, SameSite Strict, Max-Age synced to JWT (1d), logout clears, session restores via `GET /me` without LS.
- **Account lifecycle:** Register, login, logout, invite accept, role change, remove member (audit). No account deletion at MVP that would orphan history; deactivation instead.
- **Administrative actions:** Invite, role change, vendor/budget thresholds -- all audited, all require Admin/Owner.

---

## 15. Error & Edge Cases

As a demanding client, here is what I expect when things go wrong. If you do not handle these, you do not meet acceptance.

- **Two users modify simultaneously (e.g., both approvers click Approve):** One succeeds, other gets 409 Conflict "version stale, already decided" -- budget not double-incremented. Must use version + row lock, not last-write-wins.
- **Approver unavailable / timeout:** After 48h, escalate: mark step ESCALATED, create next step for Finance/Owner, notify. Not auto-approve. Manual escalation by Admin also.
- **Approval times out (no decision):** Same escalation. No request should sit PENDING forever with no notice.
- **Request rejected:** Becomes REJECTED terminal, notifies requester with comment, budget untouched. To fix, clone to new DRAFT.
- **Request edited after approval:** Not allowed. Only DRAFT editable. Edited after submit must be via cancel+clone (if still cancellable) or new request.
- **Budget changes during approval (Finance edits amount mid-flight):** Change is audited, applies only to new requests; PENDING requests keep original threshold/budget snapshot (or re-evaluated? [Open] -- we will decide in Phase 0 Area 8: for MVP, keep original, not retroactive).
- **Vendor becomes inactive (mid-approval):** Existing PENDING requests with that vendor remain; new requests cannot select it. Inactive vendor still in history.
- **PO cannot be fulfilled (vendor says out of stock):** Finance marks request as exception: add comment, audit, can reject after approval via exception (Finance override) with reason, or keep ORDERED and handle outside. Not a new state at MVP.
- **Invoice does not match (future, but at MVP warn):** At Receive, if invoice file amount differs (manually entered amount vs request), warn "Invoice `67k differs from request `65k" but allow. Full 3-way tolerance is future.
- **Notification fails (email):** Retry 3x, in-app still shows, dead-letter logged. Request state does not roll back.
- **Background operation fails (PO PDF job):** Retry 3x, request stays APPROVED, Finance can retry Order idempotently. No duplicate PO numbers.
- **User loses access (removed from org):** Active sessions for that org end on next guard check (OrgMembershipGuard fails), they see 403. No data deleted.
- **Approver removed mid-approval (is approver on a PENDING step):** That ApprovalStep auto-escalates to Finance/Owner (creates new PENDING step for Finance/Owner), request stays PENDING, audit logs removal + escalation. Not auto-approved.
- **Permission/role changed while request in progress (approver demoted before approve):** Permission is checked at _decision time_ against current Membership/Role, not snapshot at Submit. If demoted before approve, 403 at approve time.
- **Request cancelled:** Only per cancellation rules (Section 8). Cancelled is terminal, audit logged, budget not deducted.
- **Integration unavailable (future QuickBooks):** Defer. At MVP, no integration, so not applicable. Future we will queue and retry.

**Other realistic failures from research:**

- Splitting orders to bypass threshold (Tacto) -- we will monitor via audit (two `24k requests from same requester same day to same vendor flags for review in Phase 2 analytics).
- Email as workflow engine returns (user emails instead of using ProcureDesk) -- we accept at MVP but will not support email-to-request parsing until Phase 10.

---

## 16. Integrations

**Required for MVP (must for viable product):**

- **Email provider:** For invites and notifications. Local Mailpit (catch-all, UI 8025) for dev/learn; Resend 100/day free for prod demo. Queued, not blocking.
- **Storage:** For files (quotes/receipts/PO PDFs). Local MinIO (S3-compatible) for dev; Cloudflare R2 10GB free (S3 API) for prod. Both use same S3 SDK with signed URLs (15m expiry). MIME magic + size + scan stub.
- **No other integration required for MVP.** We do not force ERP/accounting, Slack, or identity provider at MVP to keep solo scope.

**Future integrations (after MVP, when data exists):**

- **Accounting/ERP:** QuickBooks, NetSuite -- post spend to accounting, sync vendors. P2P compliments ERP as system of record (Kissflow), not replaces.
- **Slack/Teams:** Notify approval needed in Slack, approve via Slack action (defer -- email + in-app is enough for 20-300).
- **Identity providers (SSO):** OAuth (Google) -- after MVP, not day 1.
- **Payment systems:** Not at MVP (PCI); P2P stops at receipt/close.
- **Vendor systems:** No vendor portal at MVP; vendor communication is email outside system.

**Why this cut:** Every product that integrates to ERP does it via connectors/APIs after core P2P is stable (Kissflow 8-week impl still does ERP sync as step 2). Forcing QuickBooks integration into MVP would add a second system of record before our own data is stable.

---

## 17. AI Opportunities

I will pay for AI only where it saves real time, not where it is a demo.

| Idea                            | Problem                                                             | AI capability                                           | Benefit                                                            | Risks                             | Data needs                              | MVP?                                          |
| ------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------- | --------------------------------------- | --------------------------------------------- |
| **Invoice/quote extraction**    | Manual retyping of vendor quote ` amount/item/quantity/GST from PDF | Vision OCR + structured JSON (e.g., Ollama/Groq vision) | Auto-fill request form, `80% faster creation                       | Hallucinated amount, wrong vendor | 10 real invoices/quote PDFs as eval set | **Later (Phase 10)** -- after core works      |
| **Duplicate request detection** | Two employees request same laptops separately (our lived duplicate) | Embeddings + vector search over past requests           | Flags "similar request last week: 3x MacBook `95k" before approver | False positives                   | Past requests to embed                  | **Later** (Phase 10)                          |
| **Spend categorization**        | Budget name encoding is manual                                      | LLM classify description -> category/budget suggestion  | Faster budget picking                                              | Wrong budget, needs human confirm | Past categorized requests               | **Later**                                     |
| **Policy explanation**          | "Why was my `65k request routed to Finance?"                        | LLM explains policy from threshold/budget snapshot      | Transparency, less "why rejected?"                                 | Needs accurate policy snapshot    | Policy snapshot per request             | **Later** (simple rule text is enough at MVP) |
| **Spend search (NL)**           | "How much did Engineering spend on SaaS last quarter?"              | NL -> SQL/RAG over audit/spend                          | Ad-hoc insights without dashboard                                  | Wrong SQL, cost                   | Spend audit data                        | **Later**                                     |
| **Approval recommendation**     | Hints                                                               | Not needed at MVP; rule-based is enough                 | --                                                                 | Bias, over-reliance               | --                                      | **Reject for MVP**                            |
| **Chatbot wrapper**             | Generic                                                             | --                                                      | No real problem                                                    | Gimmick                           | --                                      | **Reject**                                    |

**MVP AI stance:** No AI in MVP. Build the data (requests, budgets, files, audit) first; AI without data is a gimmick. In Phase 10, start with invoice extraction + duplicate detection using local Ollama (free) and pgvector (in Postgres), evaluated on 10 real invoices.

---

## 18. MVP vs Future Scope

### MVP (must for coherent, valuable product -- ~10-12 weeks solo, realistic)

- **Must:** Orgs + Membership + invite (multi-tenancy is the boundary)
- Vendors CRUD + Budgets (monthly, threshold) + Requests (DRAFT->CLOSED via single-step + threshold)
- Files (quotes/receipts/PO PDFs) as above
- Search/filter/sort/paginate for vendors/requests/audit
- Notifications in-app+email (queued)
- Audit immutable + Comments
- Jobs (PO PDF + email + escalation) + Caching (Redis TTL+invalidation) + Rate limiting
- Security (org isolation, RBAC, file guards), Health, Docker prod, CI (lint/typecheck/test/build + Postgres E2E + Docker verify), free deploy (Render/Neon/Upstash/R2)

**Why this is the MVP:** Every item maps to one business expectation in Sections 7-9 + one engineering layer you need to learn (auth, DB, transactions, files, search, jobs, cache, observability, deploy). Remove one and you lose a full-stack path.

### Phase 2 (right after MVP, meaningfully extends without enterprise complexity)

- Org dashboard (spent by vendor/month -- needs real data first)
- Cursor pagination (when offset slow at 10k)
- Vendor spend history polish + file quota 100MB/org + retention
- CSV bulk import for vendors
- Comments polish + saved views ("My pending")

### Future (advanced enterprise, after product is used)

- Parallel approvals, delegation/backup, category-specific routing (IT needs IT manager), department budgets as hard entity, Cost Center GL
- Recurring cron, advanced analytics (burn rate, category), contract lifecycle (Kissflow has it, we defer)
- Vendor self-service portal + banking docs, sourcing/RFx, quote comparison, 3-way tolerance engine
- SSO, QuickBooks/NetSuite sync, Slack approvals, webhooks, mobile PWA

### Out of Scope (explicitly never in this repo)

- Payments/card rails (PCI, competition with Ramp/Brex)
- Full supplier onboarding/risk + contract management (enterprise S2P)
- K8s/Kafka/microservices (no justification for solo P2P)
- Real-time WebSockets (polling + invalidation is enough for approval)

**Reasoning:** Products that try to be "configurable for any workflow" (Kissflow 50 workflows) become maintenance-heavy; opinionated P2P (Precoro) wins on speed for <500 (Kurums). Our scope is opinionated P2P, not configurable S2P. Enterprise S2P takes 12-18 months (SCClarity) -- not solo.

---

## 19. Client Acceptance Criteria

As the business owner reviewing the finished product, here is what makes me say **yes**:

### Product level

- I can register -> create org -> invite 3 members with different roles -> each sees only what role allows, no cross-org leak (I will test cross-org 403 myself).
- I can create 10 vendors, 3 budgets, 20 requests with files, and find them via search/filter/paginate in <300ms at 10k rows (I will seed and test).

### Workflow level

- Request lifecycle DRAFT->PENDING->APPROVED->ORDERED->RECEIVED->CLOSED works end-to-end with threshold routing adding Finance when >`50k, and every transition is in audit with before/after. I will test the `65k path and the `8k path.
- I can approve as Dept Head, then as Finance, in order; I cannot approve my own; out-of-order is blocked (I will try to break it).
- Budget enforcement: I set budget `5L, spend `4.5L via approvals, next `65k approval is blocked with 422 unless Finance overrides with reason (I will test).

### Role level

- Requester cannot approve own, cannot edit after submit, cannot see other depts budgets (if we add dept budgets). Approver cannot approve beyond limit without escalation. Finance can override with audit. Owner can change any role but not delete audit.

### Security level

- No IDOR: user A of org A cannot read org B data via IDOR (I will try). File of org A not accessible via signed URL guessed for org B. Audit never deletable (I will try DELETE on audit -> 403). Rate limiting on auth works (5/min).

### Reliability level

- I double-click Submit (retry with same Idempotency-Key) -> one request, not two. I click Approve twice quickly -> one succeeds, one 409. I kill worker mid-PDF job -> it retries 3x and appears, not lost. Email fails -> retries, not lost, request stays APPROVED.

**If these pass, I accept. If email is the system of record again, I reject.**

---

## 20. Portfolio / Engineering Depth

While I am demanding a _real_ product, the requirements naturally expose serious engineering -- I am not adding fake complexity to teach technology.

**What you will be forced to learn (business drives it):**

- **React + TypeScript:** Request forms, DataTable, optimistic approve, RBAC hide, signed URL download, loading/error/empty, a11y -- driven by requirement "make compliant buying easier than maverick."
- **HTTP + REST:** 25+ endpoints, pagination, idempotency, signed URLs -- driven by "find any request in <300ms at 10k."
- **PostgreSQL + SQL + ORM:** Relationships (org has many vendors/budgets/requests), constraints (unique per org), indexes (composite for list), transactions + `SELECT ... FOR UPDATE`, Decimal for money -- driven by "prevent double-spend, no duplicate vendor."
- **Auth + RBAC:** httpOnly+Strict cookies, DOA matrix, `requester != approver`, order enforcement -- driven by "no self-approval, no cross-org leak."
- **State machines:** Request lifecycle with guards, version optimistic lock -- driven by "only DRAFT editable, only PENDING approvable."
- **Transactions:** Budget spent + steps + audit in one transaction -- driven by "approve must be atomic."
- **Background jobs:** PO PDF, email, escalation (BullMQ+Redis, 3x retry, graceful shutdown) -- driven by "Order should not block, approval should not stall 48h."
- **Caching:** Redis TTL + invalidation on mutation -- driven by "list must be fast but not stale."
- **Search:** ILIKE + composite index, later cursor -- driven by "find any request."
- **Testing:** Unit (state machine), integration (transactions), API (cross-org 403), DB (constraints), frontend (RBAC hide), E2E (80-request flow) -- driven by "if two approvers click, budget not double."
- **Security:** XSS (React escape), SQLi (Prisma params), IDOR (org isolation), file MIME, rate limiting -- driven by "audit never deletable, file not guessable."
- **CI/CD + Deployment + Observability + Performance:** Docker multi-stage, GHCR, free deploy (Render/Neon/Upstash/R2), Pino JSON + requestId, health, `EXPLAIN` -- driven by "prove audit in <2 minutes, deploy in weeks not months."

No fake complexity: every tech maps to a business rule I just demanded. If you add microservices to "look impressive" without an org that needs it, you are solving a problem I do not have.

---

## 21. Explicit Non-Technical Constraint

Do not decide the technology stack, framework, cloud provider, database technology, or implementation architecture inside this PRD beyond what I genuinely require.

**What I require:** Multi-tenant (org isolation), browser-based (desktop primary, mobile approval), file handling (pdf/jpg/png, 10MB, signed URL), email notifications, audit 7-year retention, local + free deploy for our cost constraints.

**What you decide later (based on this PRD):** Frontend/backend framework, database, ORM, API style, auth mechanism (beyond httpOnly cookie requirement), state management, validation library, storage service (beyond S3 API), job queue (beyond Redis), email service, cache, testing framework, deployment platform, observability stack. These will be decided in Phase 0 Area 7 with evidence and ADRs, not here.

---

## 22. Research Traceability

Every important requirement traces to evidence or is an explicit assumption.

**Research-backed (cite sources from `docs/research/procuredesk-market-domain-research.md:15`):**

- P2P vs S2P split and 1-6 week vs 12-18 month impl (Kurums, SCClarity, Precoro, Procurify) -> our P2P scope, not S2P.
- Requisition (internal) vs PO (external, binding) + 5-8-step spine (Ivalua 2026-04-07, Procurify 2025-10-02) -> our lifecycle DRAFT->PENDING->APPROVED->ORDERED->RECEIVED->CLOSED.
- Approval thresholds + DOA matrix + segregation requester != approver (AuraVMS 2026-06-10, Tacto, Hyperbots) -> our threshold + no self-approval.
- Maverick 10-20% (Hackett), 56% inefficiencies (CAPPO), 57% siloed (Deloitte), 30% small have any P2P (McKinsey), GAO audit failure -> our budget-before-approval + audit.
- Real-time budget at approval (Fraxion #1, Procurify standout) -> our approver sees remaining before decision.
- Preferred catalogs 56% best-in-class (Kodiak) -> our Vendor master unique per org.
- 3-way match PO=Receipt=Invoice + No PO No Pay (Optis, Stampli BTB) -> our future 3-way, MVP warn not block.
- PunchOut/catalogs (Procurify, Coupa), ERP as system of record (Kissflow) -> our future QuickBooks sync, not MVP.

**Client-specific assumption (our org, explicitly configurable):**

- Threshold `50k for Finance, quote required >`10k, amount `0.01-`10L per request, budget name+periodStart unique, 48h escalation, active/inactive vendor instead of full onboarding portal. These will be configurable per org, not universal.

**Recommended product decision (from research + client need):**

- Opinionated single-step + threshold sequential (not full Kissflow visual designer) for SMB speed; PO PDF as background job; in-app + email queued; Redis TTL+invalidation; MinIO local + R2 free via S3 API; offset MVP then cursor.

**Open question (needs user testing before Phase 2):**

- Category-specific routing (does IT gear truly need IT manager for `2k at our size?) -- defer.
- No PO No Pay strictness vs emergency bypass -- defer.
- File types and GSTIN invoice variance for AI extraction -- needs 10 real invoices eval.
- Department as hard entity vs budget naming -- defer until budgets need cost-center.

---

## Appendix: What You Should Do Next

As the engineer, you now have: market evidence, domain model, workflows, business rules, and acceptance criteria.

**Next step per your Phase 0 plan:** Do not start coding the product. Next is **Phase 0 Area 2: Product scope** -- we will lock MVP vs Phase 2 vs Future vs Out-of-Scope together using this PRD as the business want, and record your scope decision in `docs/requirements/mvp.md` and `docs/decisions/`. Then Areas 3-8 (requirements, domain, validation, tech checklist, learning map) one at a time.

**Deliverables from this PRD (already created):**

- `docs/product/procuredesk-prd.md` (this file, 22 sections)
- Supporting docs to be expanded: `domain-model.md`, `workflows.md`, `business-rules.md`, `mvp-scope.md` (we will create those as clean extracts from Sections 6-8/18 of _this_ PRD, not as separate inventions).

---

_Client: Aarav Solutions Pvt Ltd -- 2026-08-22. Engineering: hired team. Status: PRD approved as business want; engineering to translate to software and propose technical decisions with evidence._
