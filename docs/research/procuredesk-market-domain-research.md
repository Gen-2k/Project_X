# ProcureDesk -- Market, Domain & Workflow Research

> **Evidence base for Phase 0.** Created 2026-08-22. This is the source of truth before any architecture decisions. All claims cite primary/official or reputable sources (2025-2026). Generic AI knowledge is marked as inference.

---

## 1. Executive Summary

**What we learned:** The procurement market splits cleanly by size. SMB/mid-market (our target 20-300-person orgs) uses lightweight **procure-to-pay (P2P)** tools (Precoro, Procurify, Fraxion) that go live in 1-6 weeks and publish pricing from $499/mo. Enterprise uses **source-to-pay (S2P)** suites (Coupa, SAP Ariba, Oracle) that cost 6-figures annually and take 4-18 months to deploy. The gap is precisely where sheets/email still dominate: 60% of large orgs and only 30% of small orgs have _any_ P2P system (McKinsey Oct 2025). Manual approval via email + spreadsheet tracking is the #1 pain (56% of teams, CAPP/Deloitte).

**Core pattern across _all_ products:** `Requisition (internal request) -> Approval (threshold/policy routed) -> Purchase Order (external, legally binding) -> Receipt -> Invoice -> 3-way match -> Payment -> Audit`. Precoro, Procurify, Kissflow, Ivalua all document this exact sequence. The difference is _governance depth_, not workflow shape.

**Opportunity for ProcureDesk:** A **modular P2P control center** for SMBs that enforces the budget _before_ spend (not retrospective), provides single-step + threshold routing, vendor master, quote/file evidence, and immutable audit -- without the Coupa/SAP enterprise complexity. This is the smallest slice that is still _useful_ and _teaches_ transactions, locking, RBAC, and audit.

**AI where it is real (not gimmick):** Invoice OCR + 3-way-match exception flagging (Levelpath, Coupa) and intake form pre-fill with duplicate/policy check (Ramp). Pure chatbot wrappers are not used by leaders.

---

## 2. Market Overview

### Market size & structure

- Global procurement software: **$6.6B in 2024 -> $8.6B by 2029 (5.3% CAGR)** (Apps Run The World, cited by Teem 2026-03-12).
- **Gartner 2026 Magic Quadrant for Source-to-Pay Suites:** Coupa and SAP Ariba both Leaders (Teem, ProcurementAI Agents 2026-01-21).
- Implementation timelines: **P2P-focused 4-6 months minimum, full S2P 12-18 months** (SCClarity 2026-02-20). Precoro/Procurify mid-market: **1-3 weeks (Precoro) and 2-6 weeks (Procurify)** (Kurums 2026-06-25) vs enterprise months. This gap matters for solo dev scope.

### Two-track market (Kurums, Youngju.dev, Sacra 2026)

1. **Mid-market P2P (Precoro, Procurify, Fraxion, Tradogram, ControlHub):** Requisitions, budgets, POs, invoice matching, approvals, spend analytics. Transparent or mid-tier pricing.
2. **Enterprise S2P (Coupa, SAP Ariba, Oracle, Ivalua, Jaggaer, GEP SMART):** All of P2P + strategic sourcing (RFx, reverse auctions), contract lifecycle, supplier risk, large supplier networks.

**Pricing evidence:**

- **Precoro:** Publicly listed **$499/mo Core, $499/mo AP, $999/mo Automation** (PricingSaaS 2026; Precoro.com/pricing). _Only major vendor publishing prices_ (Kurums).
- **Procurify:** Custom quote, mid-market $7K-60K/year implied (Kurums, Capterra). No public tier.
- **Kissflow Procurement:** From **$1,500/mo for 50 users (Basic)** then custom (ProcurementAI Agents 2026-04-17: $18K/year entry) vs earlier report $2,500/mo (Ramp blog 2026-08-10) -- confirms custom enterprise model.
- **Coupa/SAP Ariba/Oracle:** Custom enterprise, 6-figures + implementation (Kurums, TrustRadius). Coupa not an ERP, integrates to SAP/Oracle/NetSuite (Startupik 2026-05-30).

### Who buys what (Kurums, TrustRadius)

- **<500 employees, fast setup, transparent pricing -> Precoro**
- **100-2,000 employees, real-time budget control -> Procurify** (real-time spend vs budget is its standout)
- **Large enterprise, CFO-driven transformation -> Coupa** (deep spend analytics, Community.ai)
- **SAP ecosystem -> SAP Ariba** (Business Network 6M+ suppliers)
- **Manufacturing/public sector, strategic sourcing -> Jaggaer**

**Implication for ProcureDesk:** Our 20-300-person target aligns to the Precoro/Procurify mid-market P2P track -- not the Coupa/Ariba S2P track. We should copy Precoro/Procurify UX simplicity, not S2P depth.

---

## 3. Competitor Analysis

### Precoro (NYC, 2014, 51-100 emp)

- **Positioning:** SMB simple P2P with transparent pricing, fastest implementation 1-3 weeks. (Kurums, PricingSaaS)
- **Core workflows:** Purchase requests + budgets + purchase orders + reimbursements + vendor management + accounting integrations. Visualizes budget control, notifications for approvals, department distribution. (TrustRadius reviews 2022-2025)
- **Features:** Requisition->PO tracking, budget tracking & analytics, customizable approval workflow, custom fields, catalog/stock, 3-way match not emphasized (more operational analytics).
- **Strengths:** Only vendor publishing prices; simplicity/value; 14-day trial; clean UX.
- **Weaknesses:** Less suited to complex enterprise, spend analytics operational not predictive, workflow limits for very complex logic. (Fraxion 2026-07-05)
- **Pricing:** $499/$999/mo public (above).

### Procurify (Vancouver)

- **Positioning:** Mid-market spend management, real-time visibility.
- **Workflows:** **Intake-to-Approve -> Purchase-to-Receive -> Invoice-to-Pay** (Procurify.com/platform). 8-step PO flow: requisition -> PO creation -> PO approval (multi-level, automated routing) -> send to supplier -> fulfillment -> receiving/inspection -> 3-way matching (PO/receipt/invoice) -> payment. (Procurify blog 2025-10-02)
- **Standout:** Real-time tracking of spend against budgets, PunchOut catalogs, automated approvals, mobile approvals.
- **Evidence of use:** Capterra 4.6/5 (203 reviews 2026-06-03), users cite ease + speed but notes on comment navigation.
- **Pricing:** Custom, mid-market.

### Ramp Procurement (SF, 2019)

- **Positioning:** Finance-first **card + expense + procurement fusion**. Over $10B/year AP volume, $1B annualized revenue Aug 2025 via attach across cards/bill pay/procurement/travel. (Sacra 2025-08-28)
- **Workflows:** Intake forms (dynamic) + PO sync to ERPs + Seat Intelligence + vendor risk. Employees submit in plain language, system pre-fills, flags duplicate/out-of-policy _before_ approver. (Ramp blog 2026-04-03)
- **Differentiator:** Starts with money movement (cards), expands upstream to requests; AI pre-fill + duplicate detection is real AI, not gimmick.
- **For small business:** Ramp, Precoro, Procurify all top-8 for SMB per Ramp blog 2026-08-10.

### Airbase (SF, 2017, acquired Paylocity 2024)

- **Positioning:** Spend management + AP + corporate cards + procurement. Pre-approval system + cards to manage AP spend in one place. (TrustRadius, Sacra)
- **Target:** Mid-market combined spend.

### Zip (SF, 2020, $2.2B Series D 2024)

- **Positioning:** **Intake-to-procure** (ITP) -- the upstream step where employee asks, managers/legal/security/finance all review, then PR/PO created. "Procurement orchestration" across finance, legal, IT, security, procurement in _one_ workflow. (Sacra, FinanceCopilotHQ 2026-06-14)
- **Workflows:** Employee initiates purchase/vendor request -> routed across cross-functional approvers -> integrates to ERP to create PR/draft PO.
- **Strengths:** Exceptional UX, 4-8 weeks live, cross-functional routing, high innovation/AI priority.
- **Weaknesses:** Not full BSM; sourcing/supplier/invoicing less mature vs Coupa; needs payment rails (launched Vendor Card to compete with Ramp/Brex).
- **Price:** Custom, enterprise but mid-market accessible.

### Kissflow Procurement Cloud (Atlanta/Chennai, 2012)

- **Positioning:** **Low-code/no-code customizable workflow** -- "bends to you". Works as standalone S2P layer complementary to ERP (NetSuite/SAP/Oracle/Dynamics/QuickBooks/Xero + REST/webhooks). ~8 weeks implementation. (ERP Research, Kissflow.com)
- **Workflows:** Requisition -> approval (visual designer with conditional routing, budget checks, supplier gates) -> PO -> sourcing -> supplier portal -> contracts -> invoice -> spend analytics -> PunchOut.
- **Strengths:** Visual drag-drop designer, ERP-agnostic, business-user configurability.
- **Weaknesses:** Flexibility vs complexity -- you design every edge case (cancel mid-approval, 72h timeout etc); maintenance burden at 50 workflows. PO module competent not extensive; AI only basic OCR 2025-2026 (no routing/insights). (ProcurementAI Agents 2026-06-10)
- **Pricing:** $1,500/mo for 50 users basic, then custom (not published on kissflow.com).

### Coupa (San Mateo) -- BSM Leader

- **Positioning:** **Total Spend Management** (procure-to-pay + contingent workforce + contract management). AI-native with SpendGuard (25+ alerts, duplicate/split detection). Nearly two decades data, $8T transactions. (Coupa.com 2026-07-07, Prec oro 2026-08-07)
- **Workflows:** Intake & Orchestration -> Procurement (single platform visibility) -> Inventory -> Services Procurement -> AP Automation (compliance-as-a-service) + Compass AI (NL queries, sourcing drafts).
- **Strengths:** Consumer-grade Guided Buying, spend analytics/Community.ai benchmarking, contract AI clause recommendations, supplier collaboration + risk.
- **Weaknesses:** Significant implementation cost/time, overkill for early mid-market; complexity + pricing beyond SMB.

### SAP Ariba (Enterprise)

- **Positioning:** SAP ecosystem S2P with **Business Network (6M+ suppliers)**. Strongest at strategic sourcing (RFx, reverse auctions) and contract depth. (SCClarity 2026-02-20, ProcurementAI 2026-02-15)
- **Workflows:** Deepest workflow customization with granular multi-tier routing; integrates to SAP ECC/S/4HANA natively, Oracle/Workday/Dynamics via Integration Framework (more middleware).
- **Weaknesses:** Longer impl (deeply configured), UX heavier than Coupa, pricing undisclosed enterprise.
- **Oracle Procurement Cloud:** Fusion-native, flexibility for Oracle ERP shops. Similar S2P depth.

### Common patterns across _all_ (evidence)

- Every product documents the same spine: **requisition -> approval -> PO -> receipt -> invoice -> 3-way match -> payment -> audit**. (Ivalua 2026-04-07, Procurify 2025-10-02, Kissflow ERP Research)
- **Approval routing** is always threshold + category + cost-center + role driven (see Business Rules).
- **PunchOut/catalogs** appear in Procurify, Coupa, Kissflow, Tradogram -- guiding users to preferred suppliers reduces maverick spend (56% of best-in-class provide pre-approved catalogs vs 26% peers, Kodiak 2026-01-29).
- **ERP as system of record:** All mid-market tools integrate to NetSuite/QuickBooks/Sage/Dynamics; they do _not_ replace ERP (Kissflow ERP Research).

### Gaps / underserved (for ProcureDesk)

- **SMB transparency gap:** Only Precoro publishes prices; others require custom quote -- confirms SMB underserved on _price clarity_ (our portfolio can show scope clarity).
- **Mid-market speed gap:** Coupa/Ariba 4-18 months vs Precoro/Procurify 1-6 weeks -- SMB needs weeks, not months.
- **UX vs governance gap:** Kissflow is flexible but maintenance-heavy; SMBs that "are still figuring out their process" are overwhelmed (ProcurementAI 2026-06-10). Opinionated, not configurable, wins for 20-300.

---

## 4. Procurement Domain Fundamentals

> Beginner primer. Each concept is how _real_ teams use it (cross-checked across Ivalua, Procurify, Kissflow, AuravMS, Fraxion).

**Vendor / Supplier:** External party you buy from. _Supplier_ often covers broader relationship (onboarding, risk, performance); _vendor_ is the transactional selling entity. In SMBs they are used interchangeably; ProcureDesk uses _Vendor_ for the master record (name, email, GSTIN, contact). One vendor has many requests.

**Procurement vs Purchasing:** _Procurement_ = full strategy/policy/process (needs, sourcing, contracts, supplier management). _Purchasing_ = the act of buying (PO, receipt). ProcureDesk is **procurement control** (policy + approval + audit), not just purchasing.

**Spend:** All money that leaves via procurement. _Maverick spend_ = off-contract / off-policy buying (see Pain Points). Controlling maverick spend is a core value proposition.

**Purchase Request / Requisition:** **Internal** document where an employee requests to buy something (item, quantity, estimated cost, justification, preferred vendor). _Not_ legally binding, never sent to vendor. Routes through approval to check budget/policy. (Ivalua 2026-04-07: "strictly internal... not legally binding" vs PO). In ProcureDesk we call it `PurchaseRequest` (status DRAFT).

**Purchase Order (PO):** **External**, legally binding document sent to vendor after requisition approval. Has PO number, date, supplier, items, quantities, prices, terms. Vendor uses it to fulfill. (Ivalua table: PR internal request vs PO external contract). In full P2P, approved requisition `becomes` a PO.

**Quote:** Vendor estimate sent before PO; used to justify amount. In SMBs, attached as PDF to request (our file evidence).

**Approval & Approval Policy:** Decision gate. _Approval policy_ defines who can approve what, based on thresholds, category, cost center. Without it, procurement is chaos (AuraVMS).

**Budget vs Cost Center vs Department vs Category:**

- _Budget:_ Money allocated for a period (monthly/quarterly) for an org/department/project. Has `amount` vs `spent` + remaining. In Fraxion/Procurify: real-time budget visibility at approval is a top feature.
- _Cost Center:_ Accounting bucket (GL code) spend posts to.
- _Department:_ Organizational unit (Marketing, IT) -- owns budgets.
- _Category:_ What is being bought (Office Supplies, SaaS, Equipment) -- drives policy (e.g., IT must approve SaaS > ₹5k).

**Invoice:** Vendor bill _after_ delivery: what was delivered + amount due. Sent via email PDF/EDI/portal. Must be matched before payment.

**Receipt / Goods Received Note (GRN):** Internal confirmation that goods/services arrived (quantity, inspection). For services, a completion entry.

**Accounts Payable (AP):** Team that validates invoices and pays vendors. Handles invoice -> 3-way match -> payment.

**Contract:** Agreement with supplier covering pricing, terms, renewal. Mid-market may track contracts loosely; enterprise has contract lifecycle management.

**Audit Trail:** System-generated, append-only record of who approved what, when, against which policy. Federal agencies: _none_ of 24 met data-quality reporting fully (GAO Sep 2025 via Jaggaer 2026-07-23) -- even large orgs struggle without automatic logs. In procurement, reconstructing from email threads takes far longer than querying a log.

**3-Way Match:** Reconciles **PO (what you ordered) = Receipt (what arrived) = Invoice (what billed)** on vendor, quantities, prices, totals before payment. Flag mismatches (wrong unit of measure, price variance). 2-way match is PO=Invoice only (no receipt). Best practice: categorize spend to decide where 3-way is worth the extra receiving step (Optis 2026-04-17). Modern P2P platforms automate matching and reduce exceptions up to 60% (Symphona via IOFM).

**Procure-to-Pay (P2P):** The workflow from requisition through payment (request -> approve -> PO -> receipt -> invoice -> payment). Precoro/Procurify are P2P tools.

**Source-to-Pay (S2P):** P2P + _strategic sourcing_ upstream (find vendors, RFx, bidding, contracts, supplier management). Coupa/SAP Ariba/Oracle are S2P. ProcureDesk will be **P2P**, not S2P (see Technical Implications).

**How they relate:**

```
Need -> Requisition (internal) -> Approval (policy + budget) -> PO (external, to vendor) -> Vendor fulfills -> Receipt (internal) -> Invoice (vendor) -> 3-way match (PO=Receipt=Invoice) -> AP pays -> Spend posts to Cost Center / Budget -> Audit logs all steps
```

Budgets, policies, and audit wrap the whole flow. Vendor sits outside (receives PO, sends invoice). Departments/categories drive routing.

---

## 5. Real-World Workflows

### Spine (same in every product)

1. **Need identified** -- employee fills requisition (item, quantity, estimate, justification, preferred vendor, quote attached)
2. **Budget/policy validation** -- system checks budget availability + policy (spending limit, category, vendor)
3. **Approval** -- routed to manager/finance based on amount + category + cost center
4. **Vendor selection/quote** -- if new vendor, may need onboarding; if existing, use catalog/PunchOut
5. **Purchase Order** -- approved requisition converted to PO, sent to vendor (email/EDI/portal)
6. **Fulfillment & Receipt** -- vendor delivers, receiving logs GRN (quantity/inspection)
7. **Invoice** -- vendor invoices, captured via email/OCR/portal
8. **3-way match & AP approval** -- PO=Receipt=Invoice within tolerance
9. **Payment** -- AP pays per terms
10. **Audit** -- every step logged

_Sources:_ Ivalua 5-step requisition (Identify need -> Create req -> Approve -> PO -> Fulfillment), Procurify 8-step PO flow (requisition -> PO creation -> PO approval -> send -> fulfillment -> receiving -> 3-way match -> payment), Kissflow: requisition -> approval -> PO -> sourcing -> supplier -> contracts -> invoice -> analytics.

### Variations

- **Small purchases (< threshold):** May be 1-step approval or auto-approve; Fraxion: "Below what amount is approval overhead not worth control?" Depends on risk tolerance (AuraVMS).
- **Large purchases (>50k):** Multi-stage (manager -> finance -> executive/board), may require committee (AuraVMS).
- **Recurring purchases:** Subscription/renewal -- same vendor, may be auto-generated monthly; not in core P2P, handled via contracts.
- **New vendor onboarding:** Extra steps: supplier onboarding, qualification, risk check, banking details, compliance docs -- Kissflow has self-service portal; SMBs often skip formal onboarding for low risk.
- **Existing vendor + catalog:** Fastest: user picks from PunchOut/pre-approved catalog, prices pre-negotiated, minimal approval (Procurify PunchOut).
- **Multi-level approvals:** Based on Delegation of Authority (DOA) matrix: e.g., supervisor up to $500, manager up to $10k, VP up to $50k, board above (AuraVMS example: warehouse $500, manager $10k, VP $50k). Routing logic: amount + category + cost center + role (see Business Rules).
- **Budget rejection:** If budget exceeded, request either rejected or escalated to finance for exception (AuraVMS exception workflow).
- **Request modification:** If requester edits after submit, approvals restart; if approver requests changes, back to requester.
- **Emergency purchases:** "No PO, No Pay" policy normally enforced, but emergency may bypass with post-approval + documented exception (Optis).
- **Policy exceptions:** Flagged for special review without bypassing controls (AuraVMS); recurring exceptions trigger matrix update.

### Where workflows differ between companies (evidence)

- **Industrials OEM:** Elevated procurement center of excellence saved $370M year one by standardizing (McKinsey Oct 2025 via Jaggaer).
- **Pharma:** AI reconciliation found $10M value leakage in 4 weeks by automating _one_ matching process (same McKinsey) -- shows variation in how deep matching is.
- **SMB vs enterprise:** 60% large vs 30% small have any P2P system (McKinsey); small often _has no PO at all_, just card/expense.

**What this means for ProcureDesk:** We will model the _spine_ (requisition -> approval -> PO -> receipt -> audit) and allow _one_ threshold-driven variation (over-budget -> Finance). We will _not_ model full S2P sourcing/RFx or complex multi-level delegation in MVP (see Scope).

---

## 6. Roles & Permissions

### Realistic org roles (cross-product synthesis)

| Role (real title)              | Typical system role             | Sees                                    | Can do                                                                 |
| ------------------------------ | ------------------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| **Employee / Requester**       | Requester                       | Own requests + org catalog/vendors      | Create DRAFT, attach quote, submit own, view status                    |
| **Team Manager / Dept Head**   | Approver                        | Team requests assigned                  | Approve/reject assigned, not own, in order                             |
| **Procurement (if dedicated)** | Often ADMIN or Procurement role | All requests in org/dept                | Validate completeness/policy, route, create PO                         |
| **Finance / Controller**       | Finance                         | Budgets, spend, audit                   | Budget check, approve over-threshold, order/receive/close, post to ERP |
| **Accounts Payable**           | AP                              | Invoices, matches                       | 3-way match, pay (not in our MVP -- we stop at receipt)                |
| **Admin / Ops**                | Admin                           | Members, vendors, budgets, all requests | Manage master data, members, budgets                                   |
| **Owner / Executive**          | Owner                           | Everything + org settings               | Create/delete org, change any role, override                           |
| **Vendor (external)**          | Not a user in system            | (Portal if built)                       | Update info via self-service (Kissflow) -- **out of scope** for MVP    |

**Evidence:** Kissflow: requester -> procurement specialist -> finance reviewer -> authorized approver -> procurement manager escalation (MangoApps SOP 8-step). Ivalua: employee/dept lead -> procurement -> approvers. AuravMS DOA: role + amount determines approver.

### RBAC + Approval Policy patterns (industry)

- **Delegation of Authority (DOA) matrix:** Formal table "role can approve up to X". Example: supervisor $500, manager $10k, VP $50k, board above (AuraVMS). Must also define escalation path + backup approver when primary on vacation.
- **Segregation of duties:** _Requester != approver_ is fundamental internal control (AuraVMS). Enforced by routing rules, not just policy.
- **Category/cost-center routing:** Production spare parts up to 5k approved by production manager, IT equipment from 2k also needs IT manager (Tacto practical example). IT SaaS may route differently than office supplies.
- **Signing limit per transaction type:** Separate limits for requisition vs PO (Dynamics community: signing limit policy per transaction type).
- **Approval chain:** Can be hierarchical (reports-to position) or matrix (category-driven). Kissflow allows any combo of amount + category + cost center + requester role via visual designer.

**Common approval-policy patterns to copy for ProcureDesk MVP:**

- **Single-step + threshold:** 1 approver by default; if amount > threshold (or budget exceeded) add Finance as second step. Simple, covers most SMBs.
- **Sequential, not parallel:** Approvals in order (`order` 1..N), next only after prior. Parallel is enterprise complexity (defer).
- **Backup/delegation:** If approver unavailable, route to designated backup (AuraVMS) -- defer for MVP but note.

---

## 7. Business Rules

| Rule                                                  | Common?                 | Details & Evidence                                                                                                                                                                        |
| ----------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Spending / Approval limits (authorization limits)** | **Universal**           | Max an individual/role can approve (e.g., manager $10k). Any request above must escalate. Defined per role + transaction type (Hyperbots 2026-08-14).                                     |
| **Department / cost-center caps**                     | Very common             | Budget per department/project; approval checks budget before PO. Budget vs DOA are complementary (AuraVMS: DOA does not replace budget control).                                          |
| **Category restrictions**                             | Common                  | IT equipment needs IT manager even if low value (Tacto 5k spare parts vs 2k IT).                                                                                                          |
| **Vendor restrictions / Preferred catalogs**          | Common in mid-market+   | 56% best-in-class provide pre-approved supplier lists (Kodiak). PunchOut catalogs guide users to contracted pricing.                                                                      |
| **Multi-level approval**                              | Common above thresholds | Hierarchical escalation: manager -> finance -> executive. Kissflow example: $50k strategic goes through management+controlling multi-stage.                                               |
| **Delegated / backup approval**                       | Expected even in SMB    | "Approvers take vacations" -- DOA must have backup provisions (AuraVMS).                                                                                                                  |
| **Escalation on timeout**                             | Common                  | If approver does not respond in 72h, escalate or terminate approvals automatically (Kissflow gap: you must design this). MangoApps SOP: procurement manager escalates threshold overruns. |
| **Policy exceptions**                                 | Needed                  | Threshold exceed, non-standard vendor, urgent need -- flagged for special review, documented, recurring exceptions trigger matrix update (AuraVMS).                                       |
| **No PO, No Pay**                                     | Best practice           | Prevents maverick spend; PO required before purchase (Optis). Can be bypassed for emergency with post-approval.                                                                           |
| **Tolerances for matching**                           | Enterprise              | Allow 5% price diff under $5k for certain vendors (Stampli BTB example); high-value always flagged.                                                                                       |
| **Splitting to bypass limits**                        | Anti-pattern to prevent | Employees split orders to stay under limit; need automated monitoring/audit (Tacto: circumvention risks).                                                                                 |

**Which are company-specific:** Threshold values ($500 vs $5k vs $50k), category rules, backup assignments, tolerances -- all vary by size/risk tolerance. AuraVMS: "A startup might accept more risk for speed. A public company might require more controls." So ProcureDesk should make thresholds _configurable_ (budget.threshold) not hard-coded.

**For MVP:** Implement spending limits via `Budget.threshold` + DOA-style `role can approve up to X` as one threshold test: `if (amount > budget.threshold) add Finance step`. Leave category/vendor-specific routing for post-MVP.

---

## 8. User Pain Points (evidence-based, not invented)

| Pain                                                                          | Evidence                                                                                                                                                                                                                                                                                            | Impact                                                                                                |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Process inefficiencies (56% of teams)** -- slow approvals, manual workflows | CAPPO 2024 State of Procurement Survey: #1 challenge 56% (2024-12-18)                                                                                                                                                                                                                               | Delays, errors, missed opportunities                                                                  |
| **Siloed operations (57% CPOs)** -- isolated point solutions, data silos      | Deloitte 2025 CPO Survey: #1 barrier 57% (via Jaggaer 2026-07-23)                                                                                                                                                                                                                                   | No single truth, 68% lack real-time visibility (McKinsey)                                             |
| **Manual approvals (email chains, spreadsheets, paper)**                      | Ramp blog: "Paper-based approvals slow cycles by days/weeks, rush orders bypass process"; Hospitality Net 2024-11-05: approval workflows in email/Excel/WhatsApp create silos                                                                                                                       | Days added to PO cycle; 3-5x higher invoice processing cost manual vs automated (Apagen via Aberdeen) |
| **Maverick / rogue spend** -- buying off-contract, fragmented supplier base   | Ramp: fragments base, reduces leverage, creates shadow IT; Hospitality: individual sites buying separately, duplicate products at different prices; The Hackett Group: 10-20% of targeted savings lost to maverick (via Pantavanij 2026-05-20); Deloitte 7-12% of revenue lost to maverick (Apagen) | 10-20% savings leakage; shadow IT risk; no spend analysis                                             |
| **Lack of visibility / poor spend visibility**                                | McKinsey: only 60% large / 30% small have any P2P system; CAPP: analytics to pinpoint inefficiencies missing; hospitality: "siloed and fragmented procurement software complicates P2P"                                                                                                             | Cannot answer "who bought what from whom at what price"; audit scramble                               |
| **Budget control after the fact**                                             | Fraxion 2026-07-05: "Spend data only analyzed after invoices processed"; Deloitte: retrospective reporting vs real-time budget at point of approval                                                                                                                                                 | Overspend discovered month-end, not prevented                                                         |
| **Duplicate / double purchases**                                              | Hospitality fragmented purchasing -> duplicate products; Stampli: without matching, duplicate invoices not flagged                                                                                                                                                                                  | Waste, disputes                                                                                       |
| **Invoice mismatches & 3-way failure**                                        | Apagen: invoice mismatches trigger disputes, late payments; Hospitality: limited/no 3-way match, discrepancies flagged late                                                                                                                                                                         | Late payments, vendor friction, $370M saved when one industrials OEM centralized (McKinsey)           |
| **Audit trail gaps / compliance exposure**                                    | Jaggaer: GAO Sep 2025 found _none_ of 24 major federal agencies fully met procurement data-quality reporting; manual system has no system-generated record of who approved when/against which policy                                                                                                | Audit reconstruction from email threads vs queryable log; weeks of work                               |
| **Slow approvals / bottlenecks**                                              | Procurify: multiple stakeholders hard to find comments; CAPP: process inefficiencies top pain                                                                                                                                                                                                       | Production/projects stall                                                                             |
| **Poor vendor visibility / supplier risk blind spot**                         | CAPPO: supplier reliability #2 challenge 40%; Jaggaer: manual tracking cannot deliver on-demand visibility during disruption; 64% CPOs rank supply chain visibility top-3 risk mitigation                                                                                                           | Risk not seen until disruption                                                                        |
| **Manual data entry & re-entry**                                              | Stampli BTB case: AP team manually comparing invoices to POs/receipts at capacity; Jaggaer: person moves data between requisition/approval/payment, each handoff retypes                                                                                                                            | Errors, delays, transcription mistakes; ERP integration adds days if not automated                    |

**Quantified costs (not invented):**

- $700B+ lost annually to procurement inefficiencies globally (Hackett Group via Apagen)
- $370M saved year one by industrials OEM after elevating procurement center (McKinsey)
- $10M value leakage found in 4 weeks by pharma via AI reconciliation of _one_ process (McKinsey)

**Root cause (Jaggaer):** Manual procurement = any workflow where a _person_ moves data between requisition/approval/payment. Even with an ERP, manual steps creep back to seams between systems.

---

## 9. Product Patterns (what every good P2P does)

- **Guided buying / preferred catalogs:** Precoro, Coupa Guided Buying, Procurify PunchOut -- guide users to compliant suppliers _before_ they ask.
- **Dynamic intake forms:** Ramp: plain-language request, system pre-fills, flags duplicate/out-of-policy before approver.
- **Real-time budget visibility at approval:** Fraxion #1: approver sees budget impact _before_ approving; Procurify real-time spend vs budget is its standout.
- **Configurable approval workflows:** Kissflow visual designer (any combo amount/category/cost-center/role) vs Precoro customizable workflow vs Procurify automated routing. Pattern: routing is _rule-driven_, not hard-coded.
- **Mobile approvals:** Procurify, Coupa, Fraxion all emphasize mobile to prevent inbox stall.
- **Audit-ready history:** Every product logs who approved when + policy; JAGGAER: "logs every approval automatically".
- **PO auto-generation:** Approved requisition -> PO with auto-number (Kissflow), sent via email/EDI/portal (Procurify).
- **3-way match with tolerances:** Not just equality, but tolerance rules (Stampli BTB 5% under $5k).
- **ERP as system of record:** P2P never replaces ERP; it _feeds_ ERP via connectors/APIs (Kissflow, Procurify NetSuite/QuickBooks, Coupa). Keep ERP as source of financial postings.
- **Spend analytics:** Fraxion/Precoro/Coupa all have spend dashboards by department/project/supplier/category -- operational (Fraxion/Precoro) vs predictive (Coupa).

---

## 10. Market Gaps / Opportunities

| Gap                                  | Evidence                                                                                                                               | ProcureDesk angle                                                                                                           |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **SMB transparency & speed**         | Only Precoro publishes prices; Coupa/Ariba 4-18 months impl vs 1-6 weeks for Precoro/Procurify; 30% small orgs have any P2P (McKinsey) | Build the 1-6 week P2P for 20-300 orgs, with clear scope (not custom quote). Portfolio shows scope clarity.                 |
| **UX vs governance**                 | Kissflow flexible but overwhelming for teams still figuring out process; maintenance burden at 50 workflows (ProcurementAI).           | Be _opinionated_, not configurable: single-step + threshold is enough for SMB, avoids designer maintenance.                 |
| **Intake-to-PO as control layer**    | Sacra: winners own the initial request then hand off to card/AP/ERP. Zip/Ramp both converge on intake.                                 | Own the request: make compliant buying easier than maverick (frictionless form + quote attach + immediate budget feedback). |
| **Real-time budget before approval** | Fraxion: retrospective reporting is the problem; Procurify standout is real-time budget.                                               | Show approver _budget impact_ at approval time (spent/remaining), not after.                                                |
| **Audit without enterprise**         | GAO: even federal agencies fail audit data quality; SMBs have email threads only.                                                      | Immutable, queryable audit log from day 1 -- small feature, huge portfolio signal.                                          |

---

## 11. ProcureDesk Opportunity (synthesis)

**Positioning (validated):** _Vendor & spend-request control center for 20-300-person orgs that have outgrown sheets but cannot justify Coupa/Ariba._ Not a generic task manager; not a full S2P suite.

**Target customer:** The office manager / ops head + finance controller at a services firm, clinic, school, startup, agency in India/global that currently runs on sheets/email/Slack and needs budget enforcement before spend, not after.

**Primary problem (evidence-backed):** 56% process inefficiencies + 57% siloed ops + maverick spend (10-20% savings leakage) + manual approvals adding days/weeks. These are not invented -- they rank #1 in 2024-2025 surveys.

**Core workflow (real spine):** `Requisition (with quote/file) -> Budget/policy check (real-time) -> Approval (single-step + threshold to Finance) -> PO (PDF, background job) -> Receipt -> Audit` -- this is the _common_ flow across Ivalua/Procurify/Kissflow, stripped to SMB essentials. We deliberately _exclude_ full S2P sourcing/RFx, 3-way invoice payment, and complex multi-level delegation for MVP.

**Why this is interesting as portfolio:** It forces you to solve _money + policy + audit_ (transactions, row locking, idempotency, RBAC, append-only logs) -- the exact hard parts that generic CRUD (todo/blog) never touches, and that interviewers probe.

**Where we provide meaningful value quickly:** If a team can replace "email a request, wait, ask finance, check sheet, email PO" with "create request with quote, see budget impact, get approved in hours, PO auto-generated, audit queryable" -- that is a week-1 win worth paying for, even without enterprise analytics.

---

## 12. Recommended Product Scope (evidence-based)

### Product Positioning

- P2P (not S2P) control layer for 20-300-person orgs, opinionated, fast (weeks) vs enterprise months.

### Core Workflow (MVP spine)

`DRAFT (with files) -> Submit -> PENDING (single approver, threshold adds Finance) -> APPROVED/REJECTED -> Order (PO PDF) -> ORDERED -> Receive (receipt) -> RECEIVED -> Close -> CLOSED + Audit (every transition)`

### MVP (Phase 1-7, ~10-12 weeks solo, realistic)

- **Must:** Orgs + Membership (+ invite) -- multi-tenancy is the isolation boundary (all products are org-scoped)
- Vendors CRUD (master, unique per org)
- Budgets (monthly, amount/spent/threshold) with real-time remaining at approval (Fraxion #1 pattern)
- Purchase Requests: CRUD + submit + approve/reject with _no self-approval_ + _in-order_ + version check (sequential only)
- Files: quotes/receipts (pdf/jpg/png, 10MB, 5/request, 100MB/org) + MIME magic + signed URL 15m + scan stub (MinIO local / R2 free -- S3 API standard)
- Search/filter/sort/paginate for vendors/requests (ILIKE + composite index, offset MVP then cursor)
- Notifications: in-app bell + email (queued, not blocking -- Mailpit local / Resend 100/day free)
- Audit log: append-only, queryable by org/entity
- Background jobs: email, PO PDF, escalation (BullMQ + Redis) -- 3x retry, dead-letter
- Caching: Redis TTL + explicit invalidation on mutation (pattern from audit)
- Rate limiting: global 100/60s, auth 5/60s, requests 20/60s
- Security: httpOnly+Strict cookies, Helmet, org isolation, RBAC, file guards, audit immutability
- Health, Docker prod, CI (lint/typecheck/test/build + Postgres E2E + Docker verify), free deploy (Render/Neon/Upstash/R2)

### Phase 2 (right after MVP, before future)

- Org dashboard (spent by vendor/month -- needs real data first)
- Cursor pagination (when offset slow at 10k)
- Org file quota enforcement + retention
- CSV bulk import for vendors

### Future (documented, not built until MVP deployed)

- Parallel approvals, delegation/backup, category-specific routing (Tacto example: IT gear needs IT manager)
- Recurring cron, spend analytics (operational -> predictive), advanced sourcing/RFx
- SSO/OAuth, webhooks to ERP, mobile PWA

### Explicitly Out-of-Scope (never in this repo)

- Payments/card rails (PCI, competition with Ramp/Brex)
- Full supplier onboarding/risk + contract lifecycle (enterprise S2P)
- K8s/Kafka/microservices (no justification for solo P2P)
- Real-time WebSockets (polling + invalidation is enough for approval)

**Evidence for scope cut:** Every product that tries to be "configurable for any workflow" (Kissflow) becomes maintenance-heavy at 50 workflows; SMBs still figuring out their process are overwhelmed. Opinionated P2P (Precoro) wins on speed/value for <500 employees (Kurums). Our scope is opinionated P2P, not configurable S2P.

---

## 13. Technical Implications (problems architecture _must_ solve -- stack not chosen yet)

| Domain need                        | Engineering problem                                                                                                                                                                                                           |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Org isolation**                  | Every query must scope `where: {orgId}` -- IDOR risk. Need OrgMembershipGuard + cross-org 403 tests.                                                                                                                          |
| **Approval policy (threshold)**    | Rule engine: `if (amount > budget.threshold) add Finance step`. Must be configurable, not hard-coded. Versioned for audit.                                                                                                    |
| **State machine**                  | Request has states DRAFT..CLOSED + guards (DRAFT->PENDING, PENDING->APPROVED only if last step approved etc). Need version optimistic lock to prevent lost updates.                                                           |
| **Budget enforcement (real-time)** | `UPDATE Budget SET spent = spent + :amount WHERE spent + :amount <= amount` atomically, with `SELECT ... FOR UPDATE` to prevent double-spend race (two approvers concurrent). Need transaction + row lock + CHECK constraint. |
| **Idempotency**                    | `POST /requests` with `Idempotency-Key` must return same 201 on retry, not duplicate. Need unique key table + response replay. Same for jobs (two emails).                                                                    |
| **Audit**                          | Append-only, never UPDATE/DELETE, `diff` JSON (before/after). Need immutable service + tests that assert no update.                                                                                                           |
| **Sequential approvals**           | `ApprovalStep.order` unique per request, must approve in order, not own. Need PolicyGuard + order check + version.                                                                                                            |
| **Files**                          | No `../`, MIME magic (not just extension), size cap, S3 key `orgId/requestId/uuid-name`, signed URL expiry, scan stub. Need object storage abstraction (S3 API).                                                              |
| **Notifications + Jobs**           | Must not block request (enqueue, not await SMTP). Need Redis queue, 3x retry exp backoff, cron for escalation (PENDING >48h), dead-letter, graceful shutdown.                                                                 |
| **Search/filter/sort/paginate**    | Every list needs composite index `@@index([orgId, status])`, ILIKE search, sort allowlist, offset then cursor. Need EXPLAIN ANALYZE verification.                                                                             |
| **RBAC**                           | OWNER>ADMIN>FINANCE>APPROVER>REQUESTER, but Finance only for threshold steps. Need RolesGuard + object policy.                                                                                                                |
| **Caching**                        | `requests:list:{orgId}:{hash}` with TTL + pattern invalidation on mutation -- or stale cache bug.                                                                                                                             |
| **3-way match (deferred)**         | For MVP we stop at receipt; but data model should allow future PO=Receipt=Invoice matching with tolerances (Stampli BTB 5%).                                                                                                  |
| **Performance**                    | 10k requests + 50 concurrent approvers p95 <500ms. Need pooling, indexes, avoid N+1 (`include` not loop).                                                                                                                     |
| **Integrity**                      | Declarative constraints: `@@unique([orgId,name])` vendor, `FK` cascade, `Decimal(12,2)` for money (never float).                                                                                                              |

These are the _actual_ problems the stack must solve -- choosing the stack (Area 7) comes after validation.

---

## 14. Open Questions / Unknowns

- **Threshold value discovery:** What is a realistic INR threshold for a 20-300-person Indian org? Need to interview 2-3 ops/finance users or test with sample budgets (e.g., 5k/10k/50k) -- defer to Phase 0 Area 2 scope discussion.
- **Category-specific routing:** How many SMBs truly need IT vs Office Supplies different routing? Our MVP assumes one threshold; may need to validate via 2 user interviews before building category logic.
- **No PO, No Pay enforcement:** Should MVP enforce it strictly or allow emergency bypass with post-approval? Optis says best practice is enforce, but SMBs often bypass -- needs user validation.
- **Vendor onboarding depth:** Kissflow has self-service portal + banking/compliance docs; SMBs may just need name/email/GSTIN. Unknown how much to model.
- **File types:** Are GSTIN invoices always PDF, or also images? Our 10MB pdf/jpg/png cap is inferred from Precoro -- needs validation with 5 sample invoices.
- **Notification preference:** Do approvers want email + in-app or just one? All products do both, but SMB preference unknown.
- **AI invoice extraction accuracy:** Levelpath/Ramp/Coupa all do OCR, but SMB invoice variance in India (different formats) unknown -- needs eval set of 10 real invoices before committing to Phase 10.

---

## 15. Sources

**Market & Competitors:**

- Kurums 2026-06-25: Best Procurement Software in 2026 (comparison, pricing, implementation timelines) -- https://kurums.com/best-procurement-software-2026-comparison/
- Ramp Blog 2026-08-10: Best procurement software for small business 2026 (ControlHub $249/mo, Coupa custom, Kissflow $2,500/mo) -- https://ramp.com/blog/procurement-software-small-business
- PricingSaaS: Precoro Pricing Plans & History 2026 (Core $499, AP $499, Automation $999) -- https://pricingsaas.com/companies/precoro
- Precoro.com/pricing -- https://precoro.com/pricing
- TrustRadius Precoro/Procurify/Ramp reviews -- https://www.trustradius.com/products/precoro/pricing, https://www.trustradius.com/spend-management, https://www.trustradius.com/compare-products/ramp-finance-automation-platform-vs-zip-intake-to-procure
- Capterra Procurify 4.6/5 (203 reviews 2026-06-03) -- https://www.capterra.com/p/129758/Procurify/
- Sacra Zip series & Ramp/Zip convergence (2025-2026) -- https://sacra.com/c/zip, https://sacra.com/c/ziphq.com, https://ramp.com/versus/zip
- FinanceCopilotHQ Zip Review 2026-06-14 (FCIQ, weaknesses, pricing) -- https://financecopilothq.com/zip-review-2026-procurement-software-financecopilothq
- Startupik Coupa Explained 2026-05-30 -- https://startupik.com/coupa-explained-procurement-and-spend-management-platform
- Youngju.dev 2026-05-16: AI Procurement Deep Dive (10 tracks, ProcureDesk positioning) -- https://www.youngju.dev/blog/culture/2026-05-16-ai-procurement-saas-spend-management-2026-sap-ariba-coupa-vendr-tropic-sastrify-spendesk-ramp-pivot-levelpath-deep-dive.en
- ERP Research Kissflow Procurement Cloud (features, integrations, 8-week impl) -- https://www.erpresearch.com/erp-add-ons/procurement/kissflow-procurement
- Kissflow.com (products + workflow automation) -- https://kissflow.com/workflow/bpm/procurement-approval-workflow-automation/, https://kissflow.com/workflow/approval-workflow-software/, https://www.gravityer.com/commerce/kissflow
- ProcurementAI Agents (Kissflow 7.3/10, Coupa vs Ariba, Kissflow low-code review 2026-06-10) -- https://procurementaiagents.com/agents/kissflow-procurement, https://procurementaiagents.com/blog/kissflow-procurement-low-code-po-review
- SCClarity 2026-02-20: e-procurement comparison SAP/Coupa/Ariba (sourcing depth, impl 4-18 months) -- https://scclarity.com/eprocurement-systems-comparison-sap-coupa-ariba
- Coupa.com/products/procure-to-pay (intake, procurement, AP, SpendGuard) -- https://www.coupa.com/products/procure-to-pay/
- Teem Blog 2026-03-12: SAP Ariba vs Coupa (market $6.6B->8.6B, 5.3% CAGR) -- https://blog.teem.finance/product-comparison-report-sapariba-vs-coupa/
- Jaggaer Blog 2026-07-23: Hidden Cost of Manual Procurement (McKinsey Oct 2025 50% spend per employee growth, Deloitte 2025 57% siloed, Hackett up to 80% process cost reduction, $370M/$10M cases, GAO Sep 2025) -- https://www.jaggaer.com/blog/the-hidden-cost-of-manual-procurement-processes

**Domain & Workflows:**

- Ivalua Blog 2026-04-07: Purchase Requisition Definition & Process (internal vs external, 5 steps, manual issues) -- https://www.ivalua.com/blog/purchase-requisitions
- Procurify Blog 2025-10-02: Purchase Order Process Flow 8 steps (requisition -> creation -> approval -> send -> fulfillment -> receiving -> 3-way match -> payment) -- https://www.procurify.com/blog/purchase-order-process
- Optis Consulting 2026-04-17: Best Practices for 2-way and 3-way Match (No PO No Pay, tolerances, catalogs) -- https://optisconsulting.com/best-practices-for-2-way-and-3-way-match
- Stampli Blog: PO & invoice matching guide + BTB case (SAP S/4HANA, tolerances 5% under $5k, 4 steps) -- https://www.stampli.com/blog/all/po-matching-invoice
- Zip Blog: P2P process guide (8. Invoice approval = 3-way match) -- https://ziphq.com/blog/procure-to-pay-process
- Cleverence 2026-04-23: Invoice PO Software Buyers Guide (Top 10, 3-way, warehouse receiving) -- https://www.cleverence.com/articles/for-business/invoice-purchase-order-software-4827
- MangoApps: Procurement Spend Approval SOP Template (8-step approval workflow) -- https://www.mangoapps.com/templates/sop/procurement-spend-approval-sop

**Roles, Business Rules, Pain Points:**

- AuraVMS 2026-06-10: Delegation of Authority Matrix Complete Guide (DOA, thresholds $500/$10k/$50k, segregation, escalation, backup, exception) -- https://www.auravms.com/blogs/procurement-delegation-authority-matrix-approval-guide
- Tacto: Purchase approval limits Definition, methods, best practices (circumvention by splitting, delegation, system failure) + 5k/50k practical example -- https://www.tacto.ai/en/procurement-glossary/procurement-approval-thresholds
- Hyperbots 2026-08-14: Purchase Order Authorization Limit (definition, process, metrics) -- https://www.hyperbots.com/glossary/purchase-order-authorization-limit
- Fraxion Blog 2026-07-05: Best procurement software for spend control (real-time budget visibility, approval workflow control, purchasing vs payment controls) -- https://www.fraxion.biz/blog/best-procurement-spend-control-software
- CAPPO 2024 State of Procurement Survey (process inefficiencies 56% top challenge, supplier reliability 40%) -- https://www.cappo.org/news/689607/Navigating-Procurements-Biggest-Challenges-Insights-from-the-2024-State-of-Procurement-Survey.htm
- Ramp Blog 2026-08-12: What Is a Procurement Manager (maverick spend 10-20% leakage, manual approvals days/weeks, shadow IT) -- https://ramp.com/blog/procurement-manager + Pantavanij 2026-05-20 (maverick 10-20% targeted savings) + Zycus 2025-10-14
- Hospitality Net 2024-11-05 & HNR 2024-07-24: Top 7 Pain Points in Hospitality Procurement (fragmented purchasing, duplicate products, 3-way) -- https://www.hospitalitynet.org/opinion/4123012/the-top-7-pain-points-in-hospitality-procurement-and-how-to-overcome-them
- Apagen Slideshare: How Modern Procurement Systems Save $500K+ (5 failures, $700B global, 68% lack visibility, 3-5x manual invoice cost) -- https://www.slideshare.net/slideshow/how-modern-procurement-management-systems-save-500k-annually/287538287

_All sources accessed Aug 2026. Facts are cited; inferences are marked. Pricing/implementation are provider-reported and should be confirmed via demo where needed._
