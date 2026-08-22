# Business Rules -- ProcureDesk (Extract from PRD Section 8)

> Explicit rules as the business owner expects them enforced. `[Client assumption, configurable]` means you must make it configurable per org, not hard-coded.

## Approval Thresholds [Configurable]

- Default single threshold: e.g., Rs 50,000 per request (configurable per Budget/Org). Rs <= threshold: single approval (Dept Head). Rs > threshold: sequential Dept Head -> Finance.
- Threshold is per Budget (`Budget.threshold`) or per Organization (`Organization.defaultThreshold`) if request has no budget.
- Editable by Finance/Admin/Owner, audited on change, applies only to _new_ requests after change (not retroactive to PENDING in-flight).

## Budget Limits [Research-backed, must]

- `spent + amount <= amount` enforced at _approve time_ atomically with `SELECT ... FOR UPDATE`. Submit allowed even if would exceed, approve blocked 422 unless Finance overrides with documented exception (audit `APPROVE_WITH_EXCEPTION`).

## Department / Category Restrictions [Future]

- Category-based routing (IT gear > Rs 2k needs IT manager, Tacto example) deferred. At MVP, budget name encodes department/category, but requests already carry `categoryId` nullable hook for Phase 2 Category without breaking history.

## Vendor Restrictions

- Only ACTIVE vendors selectable for new requests.
- Preferred flag is future (56% best-in-class have pre-approved lists); at MVP no flag, but name unique per org prevents duplicates.

## Required Quotes [Client assumption]

- Amount > Rs 10k requires at least 1 quote file (type QUOTE) before Submit.

## Mandatory Fields [Client assumption]

- To create DRAFT: title, vendor, amount. To submit: budget (if available) + quote if > Rs 10k + description. Amount Rs 0.01 to Rs 10L per request.

## Approval Delegation [Future]

- At MVP, if approver unavailable, Admin can escalate manually or 48h timeout escalates. No delegate-to-backup table. Future: delegation with date range (AuraVMS backup provisions).

## Policy Exceptions

- Any exception (budget exceeded override, missing quote override) must have mandatory `reason` and is audit logged as `APPROVE_WITH_EXCEPTION`. Only Finance/Owner can exception-approve.

## Cancellation [Client assumption]

- DRAFT: owner can cancel any time -> CANCELLED.
- PENDING: owner can cancel only if _all_ steps still PENDING.
- APPROVED/ORDERED/RECEIVED/CLOSED: cannot cancel (terminal).

## Editing After Submission [Client assumption]

- Only DRAFT editable, only by owner. PENDING+ : no edits. If changes needed, cancel (if allowed) and clone to new DRAFT.

## Who Can Modify Approved Requests

- No one. Approved is immutable except via Order/Receive/Close. Wrong amount = new request; old handled via exception if needed.

## Who Can Override

- Finance or Owner can override via exception (budget, missing quote) with reason + audit. No one can override "no self-approval" or "must approve in order."

## Inactive User / Approver Removed Mid-Flight

- If approver is removed from org while PENDING, that step auto-escalates to Finance/Owner (request stays PENDING), audit logs removal + escalation. Permission is checked at decision time against current Membership/Role, not snapshot at Submit (if demoted, 403 at approve).

## Stale DRAFT Retention

- DRAFT abandoned 90 days -> auto-archive (not hard delete if has files). Phase 2 retention job.

## What Requires Audit

- Everything in PRD Section 7H. If audit is not written _transactionally_ with state change (Budget spent + steps + audit in one DB transaction), feature not done. Append-only, never deletable, 7-year retention for all financial entities with history (requests/vendors/budgets, hard delete only if zero history).
