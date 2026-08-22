# Personas -- ProcureDesk (Client: Aarav Solutions Pvt Ltd, 120 employees, Pune + Delhi)

> Agreed 2026-08-22. Based on PRD Section 2-3 and research. Building for these, even if you test all roles yourself initially.

## 1. Rahul -- Requester (Employee, any department)

- **Context:** Any of 120 employees. Needs 3 laptops for new hires or a 28k SaaS tool. Previously emailed manager.
- **Goals:** Get what I need without chasing; know where my request stands.
- **Pain:** Email lost, duplicate orders last quarter, no visibility.
- **Needs:** Create DRAFT (title/vendor/amount/budget/quote), attach file, submit own, see status + history + comments, get notified.
- **Restrictions:** Cannot approve own, cannot edit after Submit, cannot see other dept budgets.
- **Success:** Submitted Monday with quote, approved Tuesday, PO Thursday -- no email.

## 2. Priya -- Approver (Department Manager)

- **Context:** Engineering Head, 45 in dept, owns Engineering budget. Approves up to Rs 50k; above needs Finance.
- **Goals:** Approve quickly with budget context, not be bottleneck.
- **Pain:** Approves without remaining, via email thread.
- **Needs:** Inbox of PENDING assigned to me, budget impact (remaining) at approval, files, history, approve/reject with comment.
- **Restrictions:** Not own, in order, not beyond limit without escalation.
- **Success:** I see remaining before I click.

## 3. Ankit -- Finance (Finance Controller, 12 in Finance)

- **Context:** Owns 3 budgets (Engineering Q3, Marketing Q3, Ops Q3), 18L monthly spend. Prevents overspend.
- **Goals:** Real-time control, not retrospective; audit ready.
- **Pain:** Discovers overspend month-end, 3 days to reconcile.
- **Needs:** Create budgets, set thresholds, approve over-threshold, order (PO PDF), receive (receipt), close, view audit, spend by vendor/month, override with reason.
- **Restrictions:** Cannot approve own; cannot delete audit.
- **Success:** I see overspend before approval; audit is a query.

## 4. Surya -- Owner / Admin (Founder / Ops Head)

- **Context:** Created org, accountable. At our size, Owner + Admin often same.
- **Goals:** Control, visibility, compliance.
- **Pain:** No one knows who can approve what.
- **Needs:** Create org (OWNER), invite/change roles, manage vendors/budgets, delete org, override with audit.
- **Restrictions:** Cannot approve own without audit; cannot delete audit.
- **Success:** Set who approves what in 5 minutes, and prove it.

## 5. Auditor (Read-only, future)

- **Context:** Internal quarterly, GST. Samples transactions.
- **Needs:** Filter audit by org+entity+time, export, see who/what/when/before/after/reason.
- **Restrictions:** No mutations.

## Role Hierarchy (agreed)

OWNER > ADMIN > FINANCE > APPROVER > REQUESTER -- higher can do lower, but self-approval never allowed (request.requesterId != approverId), enforced server-side.

## Why This Matters for Solo Dev

Even though you test all roles yourself initially, building for 4 distinct roles forces org isolation + RBAC + object-level policy -- the portfolio signal beyond CRUD.
