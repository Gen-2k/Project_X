# ProcureDesk -- How Our Business Actually Works

> **Who is speaking:** I am the owner of Aarav Solutions Pvt Ltd. You are the developer I hired. This is me sitting across from you, explaining how we work, where we struggle, and what I need you to solve. This is not a tech spec -- it is how we work before software, and how I expect to work after.
>
> **What to remember:** We are 120 people, Pune (100) + Delhi (20). Six departments: Engineering (45), Design (15), Sales & Marketing (25), Ops & Admin (20), Finance (12), HR (3). We do about 80 purchases a month, average Rs 18,000 each, range Rs 2,000 to Rs 1.2 lakh. About 85 active vendors, 20 percent of them get 80 percent of our spend. We buy SaaS, equipment, services, office supplies. No factory buying, no direct materials. Our tools today: Gmail, Google Sheets (3 sheets), Drive, Slack, QuickBooks for accounting.

---

## 1. How Our Company Works Today

Let me introduce ourselves properly.

We are Aarav Solutions. We build software for clients. We are not a large enterprise, but we are no longer a 20-person startup where I can approve everything on Slack. We have grown.

**How purchasing works today is informal:**

- There is no procurement team. Our Office Manager, who we call Admin, and our Finance Controller, Meena, double as procurement. They check things when asked.
- Finance is small. Meena and two others handle budgets, QuickBooks, GST, and month-end.
- Vendors are managed as a list. The Admin keeps a sheet called "Vendor List" with name, email, GSTIN, contact. Finance has the same vendors in QuickBooks but spelled differently. Drive has some vendor GST certificates. Three places, same vendor, three spellings.
- Budgets are monthly, per department. Example: "Engineering Q3" is Rs 5 lakh for July-September. Finance tracks spent in a sheet called "Budget Tracker" -- often a day or two behind.
- How much activity? About 80 requests a month. Not huge, but enough that sheets break. Peak at quarter-end when everyone orders at once.

**Who is responsible for procurement today? Technically the Admin. In reality, everyone and no one.** Any employee asks their manager, manager says okay, Admin checks with Finance on Slack, Finance looks at a sheet, then someone creates a PO in Word and emails the vendor. There is no single place where a request lives from start to finish. Email is our workflow engine. Sheets are our database.

I hired you because this does not scale to 180 people, which is where we are heading next year, and because this will not pass our quarterly internal audit without weeks of work.

---

## 2. Where We Struggle Today -- Let Me Show You a Normal Day

I will tell you what happens when Arun from Engineering needs a laptop. Arun is 27, joined 6 months ago.

**Arun needs a laptop -- the current story:**

Arun realizes he needs a MacBook for a new hire. He writes an email to his manager Priya: "Hi Priya, need MacBook Pro for new hire, around Rs 95,000, can I get quote from vendor?"

Priya reads it a day later. She replies "approved, check with finance."

Arun forwards to Admin, Admin asks Finance on Slack: "Do we have budget for Engineering?" Finance opens the Budget Tracker sheet, which was last updated yesterday. It says Rs 2.1 lakh remaining of Rs 5 lakh for Engineering Q3. Finance says "looks okay, go ahead."

Arun gets a quote PDF from a vendor, saves it to Drive, emails the vendor a PO made in Word. The vendor delivers. Someone notes "received" in a different sheet called "Request Log" -- sometimes.

A week later the vendor emails an invoice PDF to finance@aarav. Finance forwards to Meena, Meena retypes the amount into QuickBooks and into the Budget Tracker sheet. At month-end, finance opens three sheets, reconciles, and finds surprises.

**Where it goes wrong -- all of these have happened:**

- **Email gets missed:** Priya was on leave, the request sat 3 days. Arun pinged on Slack, Priya said "I never saw it."
- **Approval takes too long:** We had a production issue, needed a Rs 12,000 tool urgently, but the approval email chain added 2 days. The team did a rush order outside the process to unblock, which is maverick spend.
- **Nobody knows status:** Arun asks "Did Priya approve?" Admin says "I think so, maybe finance saw it?" No one knows without searching email.
- **Budget is unclear:** At approval time, no one sees remaining budget. We discover at month-end that Engineering spent Rs 5.4 lakh against Rs 5 lakh. Once we ordered the same 3 laptops twice because two employees asked separately and neither saw the other's request.
- **Wrong vendor:** Someone picked a vendor not in our preferred list because the preferred list is in a sheet no one checks. We have preferred vendors but no one is guided to them.
- **Duplicate purchase:** As above -- duplicate laptops.
- **Invoice arrives without approval:** A vendor sent an invoice for a purchase that was never formally approved, because someone verbally approved on a call.
- **Finance cannot prove who approved:** GST audit asks "who approved PO-2026-042 and when, and was it within budget?" Finance spends 3 days searching email threads. In a federal study, even 24 large agencies failed data-quality when it was not system-generated. We are smaller, we fail worse.
- **Audit is difficult:** Every quarter, internal audit asks for a trail: who requested, who approved, what changed, why rejected. We have no system-generated log, only scattered emails. Reconstructing after the fact takes far longer than logging at the time.

**Operational consequences:** Projects wait for equipment, overspend happens, duplicate spend happens, vendor friction when POs are late, audit risk, and finance as a bottleneck instead of controller. This is why 56 percent of teams cite process inefficiencies as their #1 pain, and 57 percent cite siloed ops (industry surveys). We are in that majority.

---

## 3. The People Who Will Use This

Let me introduce them as people, not just roles. You will meet them in testing.

**Arun -- Requester (Employee, any department)**

- **Responsibility:** Do good work and get what he needs to do it. He does not own budgets.
- **Cares about:** Getting his request approved quickly without chasing.
- **Needs to see:** His own requests and their status, vendor list to pick from, budget remaining for his department so he knows if his request will fly, and the history of his requests.
- **Can approve:** Nothing. Not even his own.
- **Cannot do:** Edit after he hits submit. See other departments private budgets.
- **Frustrates him:** "I submitted Monday, heard nothing until Thursday, had to ping three people."
- **Expects from ProcureDesk:** "I should be able to submit a request in a few minutes with a vendor, amount, and quote, and then just watch its status. Tell me when it is approved or if I need to fix something."

**Priya -- Manager / Approver (Engineering Head, 45 people)**

- **Responsibility:** Owns Engineering budget and approves Engineering requests up to Rs 50,000. Above that, she knows it needs Finance.
- **Cares about:** Approving with context, not blindly. Not being a bottleneck for small requests.
- **Needs to see:** Her inbox: only the requests assigned to her, with budget impact (how much remains, what this request will cost), the quote file, and history.
- **Can approve/reject:** Only requests assigned to her, not her own, and only when it is her turn in the chain.
- **Cannot do:** Approve beyond her limit without escalation. Approve out of order.
- **Frustrates her:** "I approve without knowing remaining budget. And I get asked for Rs 3,000 office supply approvals that Finance could handle."
- **Expects:** "Show me budget impact before I click. Notify me immediately when something needs me, and tell me why it was routed to me."

**Kumar -- Procurement Officer (at our size, this is often the Admin wearing another hat)**

- **Responsibility:** Validate that a request is complete and policy-correct before it reaches an approver. He is the first gate.
- **Cares about:** No incomplete requests reaching approvers.
- **Needs to see:** All pending requests, policy checks, vendor data.
- **Can do:** Verify completeness, send back incomplete requests for correction, determine approval route, create the PO after final approval.
- **Cannot do:** Bypass budget check. Approve financially beyond his authority.
- **Expects:** "No request should reach an approver missing a quote when amount is over Rs 10,000. I should be able to see that at a glance."

**Meena -- Finance / Budget Owner (Finance Controller, 12 people)**

- **Responsibility:** Owns budgets, prevents overspend, proves compliance, closes books.
- **Cares about:** Real-time control, not retrospective reporting. She does not want to discover overspend at month-end.
- **Needs to see:** All budgets (amount, spent, remaining, threshold), all requests, audit trails, spend by vendor/category/month, invoice vs PO vs receipt.
- **Can approve:** Over-threshold steps (above Rs 50k), order (generate PO), receive, close, and she can override with a documented reason when a budget would be exceeded.
- **Cannot do:** Approve her own request. Delete audit logs. Approve without reason when overriding.
- **Frustrates her:** "I find overspend after it happens. And I spend 3 days before GST proving who approved what."
- **Expects:** "I should see overspend attempt _before_ approval, not after. And I should answer any audit question in under 2 minutes with a query, not an email search."

**Ravi -- Department Head / Budget Owner (variant of Priya but for his department)**

- **Responsibility:** Owns his department budget.
- **Same needs as Priya, but also cares about his department spend vs budget.**

**Vendor -- External**

- **Responsibility:** Fulfill the PO and send the invoice.
- **At our size, vendor is not a system user.** We email them the PO. They are a master record we keep (name, email, GSTIN, contact). We do not need a vendor portal at first. I know larger companies have vendor self-service, but for 85 vendors, one email field per vendor is enough.

**Admin -- Operations/Admin (20 people, the ops team)**

- **Responsibility:** Master data, members, day-to-day ops.
- **Can do:** Create vendors, create budgets, invite members, change roles (except Owner), manage approval thresholds.
- **Cannot do:** Delete organization, change Owner without Owner, delete audit.
- **Expects:** "I should set who approves what in 5 minutes."

**Owner -- Me (Founder)**

- **Can do:** Everything, including delete org (guarded), change any role, override with audit.
- **Still cannot:** Approve own request without audit. Cannot delete audit.
- **Expects:** Ultimate visibility and control, but still audited where money is concerned.

---

## 4. Let Me Walk You Through 10 Real Scenarios

I will simulate each from beginning to end, telling you what happens _today_ and what I expect _with ProcureDesk_. These are not edge cases -- they happen monthly.

### Scenario 1 -- Small Purchase (Arun needs a Rs 28,000 software subscription)

**Today:** Arun emails Priya "need SaaS tool, Rs 28k/year, vendor X." Priya replies "approved." Arun asks Admin to create PO, Admin does, vendor activates license. No quote needed because it is small, no budget check because Rs 28k feels small. At month-end, Finance sees Engineering spent Rs 28k more than planned, but it is not a surprise.

**With ProcureDesk I expect:** Arun creates a DRAFT: title "SaaS tool for design", vendor X (ACTIVE, from master), amount Rs 28,000, picks budget "Engineering Q3" -- he sees "Rs 2.1 lakh remaining of Rs 5 lakh." He attaches no quote (allowed because under Rs 10k? Actually Rs 28k is over Rs 10k, so I expect you to require a quote file -- even for small, if over Rs 10k, attach something. If you make it optional for Rs 28k, Arun will skip and finance will have no evidence. So require quote if over Rs 10k). He hits Submit. System creates one ApprovalStep: Priya (order 1) because 28k is under Rs 50k threshold. Priya gets notified immediately (in-app + email), sees remaining, approves with no comment. System moves request to APPROVED, increments budget spent to Rs 2.38 lakh, logs audit "Priya approved, remaining Rs 1.9 lakh", notifies Arun. Finance then clicks Order, PO PDF is generated in background (PO number like PO-2026-042), status ORDERED. Vendor activates, Arun uploads no receipt because it is a service -- Finance clicks Receive with a note "license activated", then Close. All steps are timestamped.

**Why small still needs audit:** Even Rs 28k, I need to prove who approved if audit asks.

### Scenario 2 -- Large Purchase (Priya needs 3 MacBooks, Rs 2.85 lakh)

**Today:** Priya emails Finance "need 3 MacBooks, Rs 2.85 lakh, vendor Y, quote attached to Drive." Finance checks Budget Tracker: Engineering has Rs 1.2 lakh remaining. Finance says "over budget, need owner approval." Priya emails me, I reply "approved." This takes 4 days, 3 email threads.

**With ProcureDesk:** Priya (as requester this time -- she is buying for her team, but she cannot approve her own) creates DRAFT: 3x MacBook, vendor Y, amount Rs 285,000, budget Engineering Q3, attaches quote PDF. She submits. System sees amount > Rs 50k threshold, so it creates _two_ steps: Order 1 = Priya''s manager? Actually threshold adds Finance. For us, default single approver is Dept Head, but when over threshold, add Finance. Since Priya _is_ Dept Head, her own request cannot be approved by her. So steps are: Order 1 = Finance (Meena) -- or we need a rule: if requester is Dept Head, route directly to Finance. This is why threshold + no self-approval matters. So steps: Meena (Finance) as order 1, then me (Owner) as order 2 because Rs 2.85 lakh is large. Meena sees "remaining Rs 1.2 lakh, request Rs 2.85 lakh would exceed by Rs 1.65 lakh -- would exceed budget." She cannot approve without exception. She escalates with comment "over budget, need owner + budget increase." I get notified, I increase budget amount from Rs 5 lakh to Rs 7 lakh (audited), then Meena approves with exception reason "owner increased budget, approved with new remaining Rs 1.15 lakh." Then I approve as Owner. Request APPROVED, budget spent now Rs 4.05 lakh, audit shows both approvals + budget change + exception reason. Then Order -> PO PDF, vendor delivers 3 laptops, Finance uploads receipt (delivery note), Receive, Close.

**What you must handle:** Amount -> threshold routing, no self-approval, budget remaining shown at approval time, override with reason and audit, budget edit mid-flight applies to new requests, not retroactively to this one already submitted? Actually we increased budget to allow this one, so it is retroactive in a good way -- but audit shows why. This is why budget edits and approvals must be transactional.

### Scenario 3 -- Rejected Request (Arun asks for gaming chair, Rs 22k)

Arun creates DRAFT for a gaming chair, submits. Priya reviews and thinks "we just bought chairs last month, not needed, and no quote attached though over Rs 10k." She clicks Reject, must enter comment: "Not needed this quarter, and missing quote. Please re-evaluate." System moves request to REJECTED (terminal), notifies Arun with reason, budget untouched, audit logs rejection. To fix, Arun cannot resubmit the same request -- he must clone to a new DRAFT if he still wants it, with a new quote and justification. This preserves the rejection history.

### Scenario 4 -- Changes Requested (Arun asks for monitor, Rs 18k, but quote is unclear)

Arun submits monitor request with a blurry quote. Priya does not want to reject outright -- she wants a better quote. She clicks "Request Changes" (or at MVP, she will Reject with comment "please add detailed quote" and Arun clones, but I prefer a distinct _Changes Requested_ that returns the request to DRAFT _without_ cloning, preserving thread). With Changes Requested, request goes back to DRAFT, Arun sees comment "need detailed vendor quote with GST breakup", he edits the DRAFT (adds new file, fixes description), and resubmits. This keeps the conversation in one request, not two.

At MVP, if you only build Reject, it still works but is clunky. I would _prefer_ Changes Requested returning to DRAFT. If you cannot build it at MVP, tell me now and we will use Reject+clone, but know that approvers expect "request changes" as a softer path.

### Scenario 5 -- Budget Exceeded (Rahul from Sales needs Rs 65,000 display, but Sales Q3 has Rs 1.45 lakh remaining)

Rahul submits Rs 65k. System creates steps: Sales Head (order 1) + Finance (order 2) because >50k. Sales Head approves. Finance sees "remaining Rs 1.45 lakh, this Rs 65k would leave Rs 80k, so it _would_ fit, actually 1.45 - 0.65 = 0.8, so it fits, so she approves." Now consider a different case: same but budget had Rs 40k remaining. Sales Head approves, Finance sees "remaining Rs 40k, request Rs 65k exceeds by Rs 25k." Approve is blocked with "Budget exceeded." Finance has two choices: reject with "over budget, reduce amount or wait for next period" or override with exception reason "urgent client demo, approved over budget, will adjust next period", which is audited as APPROVE_WITH_EXCEPTION and still increments spent (now budget shows negative remaining or over 100 percent). This exception requires Finance or Owner only, and must have a reason text.

I expect you to show remaining _before_ the approver clicks, and block without reason, not just warn.

### Scenario 6 -- New Vendor (We want to buy from a vendor not in our list)

Today: Someone types a new vendor name free-text in email, creating duplicates ("Acme Corp" vs "Acme Corporation Pvt Ltd" -- same vendor, two spellings). Finance later spends hours deduping.

**With ProcureDesk:** Requester cannot type a new vendor free-text. He must pick from the vendor master (ACTIVE, unique name per org). If vendor does not exist, he asks Admin/Finance to create vendor first (name, email, GSTIN, contact). At our size, Admin creates it immediately and it is ACTIVE right away. Future we may add a verification step where Finance approves new vendor after checking GSTIN, but for 85 vendors and 15 new per year, immediate ACTIVE is fine. The rule "name unique per org" prevents duplicates at the gate. If vendor is inactive, it cannot be selected for new requests but history remains.

### Scenario 7 -- Invoice Mismatch (Vendor invoices Rs 67,000 for a Rs 65,000 request)

Vendor delivers display, sends invoice PDF for Rs 67,000 (maybe shipping extra). Finance uploads invoice file type INVOICE at Receive step. I expect you to _warn_ at Receive: "Invoice Rs 67k differs from request Rs 65k by Rs 2k (3 percent)." Do not block -- allow Receive, but log the warning in audit and show it. At our size, manual visual check is enough; full automated 3-way matching with tolerances (PO vs Receipt vs Invoice) is enterprise and can wait. But the warning must be visible so finance can ask the vendor.

If invoice was Rs 95k for a Rs 65k request, that is not a warning, that is an exception -- finance should handle via comment and audit, not a new state.

### Scenario 8 -- Approver Unavailable (Priya is on leave for a week)

Priya is the only Engineering approver. Arun submits a Rs 18k request assigned to Priya. No one approves for 48 hours.

I expect: After 48 hours, the system marks Priya''s step as ESCALATED (the request stays PENDING, not a new request state), creates a new PENDING step for Finance (Meena) or Owner, and notifies them. Not auto-approved -- never auto-approve money. Manual escalation should also be possible: Admin can escalate immediately if they know Priya is on leave, without waiting 48 hours.

Future we may add delegated approval (Priya sets "Meena is my backup Dec 10-17"), but at MVP, escalation covers it.

What if the approver was removed from the organization mid-approval (left the company)? Same: that step auto-escalates to Finance/Owner, request stays PENDING, audit logs removal + escalation.

What if Priya''s role was demoted from APPROVER to REQUESTER while her step is still PENDING? I expect permission to be checked at _decision time_ against her current role, not snapshot at submission. If demoted before she clicks, she should get 403 at approve time.

### Scenario 9 -- Request Cancellation (Arun submits, then realizes he ordered wrong model)

Arun submits a Rs 28k SaaS request, it is PENDING (no decision yet). He realizes he picked the wrong plan. He clicks Cancel. I expect: If no step has been decided yet (all steps still PENDING), owner can cancel -> CANCELLED (terminal), notify approver, budget untouched, audit logged.

If Priya had already approved (one step approved, next step pending), Arun cannot cancel -- it is already partially approved. To stop it, Arun must ask Finance to reject the next step, or Finance can handle via exception. After APPROVED (all steps approved, budget already incremented), no cancel -- must go through Order/Receive/Close or handle as exception with audit.

This prevents moving targets during approval.

### Scenario 10 -- Duplicate Request (Arun and Rahul both submit for the same 3 laptops, unaware)

We had this: two requests for same 3 MacBooks within a day, because neither saw the other. Finance approved both, we ordered 6 laptops.

**Today:** No detection.

**With ProcureDesk I expect at MVP:** No AI needed. But I do expect that when Arun creates a DRAFT, if there is already a PENDING or APPROVED request for the same vendor and similar amount/title in the last 7 days, you _warn_ him: "Similar request: ''3x MacBook'' by Rahul, Rs 285k, PENDING. Is this duplicate?" Do not block, just warn and show.

Future with AI, you can do embeddings and better duplicate detection, but a simple title/vendor/amount match in the last 7 days as a warning is enough for MVP and prevents the duplicate laptops.

---

## 5. Why Our Rules Exist (Not Just What They Are)

I want you to understand _why_ I insist, so you can defend the rules.

**Why requests above Rs 50,000 need Finance (threshold)?** Because 50k is where a mistake becomes material for us. A 5k office supply mistake is absorbable; a 65k mistaken SaaS annual commit is not. Thresholds are not universal -- a startup might use 20k, a public company 5k -- so I need the threshold _configurable_ per budget or org, not hard-coded. And it must be audited when changed, and only affect _new_ requests, not those already in flight.

**Why departments/budgets?** Engineering, Sales, Design each have their own budget. Priya should not approve a Sales request that charges Engineering budget. At our size, we do not need a hard Department table yet -- budget name like "Engineering Q3" encodes it, and the request picks a budget. Future we will make Department a real entity and Cost Center for GL posting to QuickBooks.

**Why categories?** Office Supplies vs SaaS vs Equipment have different risks. Example from industry: a production manager can order spare parts up to Rs 5 lakh, but IT equipment from Rs 2 lakh also needs IT manager. We do not need category routing at MVP, but we need the _hook_ so we can add it later without breaking history. That is why the request has a nullable categoryId even though we do not use it at MVP.

**Why vendors must be in a master and unique per org?** To prevent duplicates and to guide to preferred. Best-in-class firms provide pre-approved catalogs (56 percent vs 26 percent). At MVP, unique name per org plus ACTIVE status is enough.

**Why policy exceptions need a reason and audit?** Because every exception is a risk. If Finance approves over budget, I need to see _why_ later: "urgent client demo, will adjust next period." Without a reason, exceptions become maverick.

**Why quotes required above Rs 10k?** Because below 10k, the cost of getting a quote (time) outweighs the risk. Above 10k, I need evidence for audit and for the approver to check price. This is configurable.

**Why quotes, POs, receipts as files with signed URLs?** Because they are evidence for 7-year retention. They contain PII and amounts, so they must not be guessable. Signed URL 15-minute expiry means I can download but no one can guess `s3Key`.

**Why only DRAFT editable, only by owner?** Because once submitted, it is a commitment. Allowing edits during approval would be moving the goalposts. If changes are needed, cancel (if still all PENDING) and clone, or use Changes Requested to return to DRAFT.

**Why no self-approval ever, even for Owner?** Segregation of duties is fundamental internal control (audit Gold). Even I cannot approve my own request without audit; someone else must.

**Why audit history for everything?** Because without it, GST and internal audit are email searches. With it, I can answer "who approved PO-2026-042 and why" in 2 minutes. Audit must be append-only, never deletable, even by me, and include before/after and reason.

---

## 6. The Life of One Request -- What I Expect You to Record

Let me follow one request from birth to end, telling you what I expect at each state, who owns it, what can happen, and what gets recorded.

**DRAFT** -- Arun just created it. He sees a form: title, vendor picker (ACTIVE only), amount, budget picker (shows remaining), files dropzone, category (future). He can save, edit only his own DRAFT, attach files, and see `version` for concurrency. Who owns: Arun. Can submit (only Arun), can cancel. Cannot be approved. No notification yet. Audit: "Arun created request draft-123, amount Rs 28k."

**PENDING_APPROVAL** -- Arun hit Submit. System creates ApprovalSteps: e.g., Priya order 1. If amount > threshold, add Finance order 2. Who owns: the assigned approver(s), not Arun. What can happen: assigned approver approves (in order, not own, version check), rejects (with comment), or requests changes (with comment). What cannot: Arun cannot edit. No one can approve out of order. No self-approval. Notification: approver(s) notified immediately (in-app + email). Audit: "Submitted by Arun, steps created."

**APPROVED** -- Last step approved. Budget spent incremented atomically (`spent + amount`, row lock), audit written _transactionally_ with the state change. Who owns: Finance/Admin for next step. What can: Order (Finance/Admin). What cannot: cancel. Notification: requester notified approved. Audit: "Priya approved step 1, Meena approved step 2 (threshold), budget Engineering Q3 spent 2.38 lakh."

**ORDERED** -- Finance clicked Order, PO PDF generated in background (PO number like PO-2026-042), File created, status ORDERED. Who owns: Finance for fulfillment. What can: Receive. What cannot: edit amount. Notification: requester + finance "PO created." Audit: "Meena ordered, PO-2026-042 generated."

**RECEIVED** -- Finance uploaded receipt, confirmed. Status RECEIVED. Who owns: Finance for close. What can: Close. What cannot: reorder. Notification: requester "received." Audit: "Meena received, receipt file id 789."

**CLOSED** -- Finance clicked Close. Terminal, financially complete. Who owns: no one, it is done. What can: nothing except view and query audit. Audit: "Meena closed."

**REJECTED** -- Any step rejected with comment. Terminal. To fix, clone to new DRAFT. Budget untouched. Audit: "Priya rejected, reason: missing quote."

**CHANGES_REQUESTED** -- Approver asked for changes with comment. Returns to DRAFT (non-terminal). Arun sees comment, edits, resubmits. Audit: "Priya requested changes: need detailed GST breakup."

**CANCELLED** -- Owner cancelled DRAFT any time, or PENDING only if all steps still PENDING. Terminal. Audit: "Arun cancelled."

**ESCALATED is not a request state** -- it is a step status. Request stays PENDING while a step is ESCALATED and a new step for Finance/Owner is created after 48 hours. Never auto-approve.

**What gets recorded every time:** Who, what, when (server time), before/after or field diff, related request, reason where needed, and the request''s version bump.

At every transition, two things must happen: the state change and the audit log, in one database transaction. If audit fails, the state must not commit.

---

## 7. What I Expect ProcureDesk to Feel Like (After You Build It)

Now I will tell you how I want it to _feel_ for each person, not what API you will build.

**For Arun (Employee):** "I should be able to submit a request in a few minutes without asking anyone who to send it to. I pick a vendor from a list, not typing, so I do not create duplicates. I see my budget remaining before I submit. I attach a quote if it is over Rs 10k. I hit Submit and then I just wait. I see status: Pending, Approved, Ordered, Received, Closed. If it is rejected or needs changes, I see the reason right away. I get notified, not by email thread, but in the app and by email."

**For Priya (Manager):** "I want to open my approval inbox and immediately see only the requests waiting for me, with budget impact, vendor, and files. I want to approve or reject with a comment in one click, and know that my decision is audited. I do not want to be asked for Rs 3,000 office supplies that Finance could handle."

**For Kumar (Procurement/Admin):** "I need visibility into all pending purchases across departments, and I need to see which ones are incomplete before they reach an approver. I should be able to see policy checks at a glance."

**For Meena (Finance):** "I need to know how much has been committed and spent, per budget, in real time, not at month-end. When I am asked to approve, I should see remaining before I click. I should be able to generate a PO PDF without waiting, and I should be able to upload a receipt and close. I should be able to override a budget exceed with a reason, and it must be audited."

**For Admin:** "I need to invite by email and role, change roles, create vendors and budgets, set thresholds, and know that every change is audited. I should do this in minutes."

---

## 8. What I Expect to See (Dashboard & Information)

I am not asking for a fancy BI dashboard at first. I am asking for _answers_.

- **Pending approvals (for Priya/Meena):** How many are waiting for me, how long have they waited, which are overdue 48 hours. Why: so nothing sits.
- **Total requested spend (for Finance):** How much is currently PENDING vs APPROVED vs ORDERED. Why: to see commitment, not just spend.
- **Approved spend vs budget remaining (for Finance):** Per budget, amount, spent, remaining, threshold, warning if remaining <20 percent. Why: to prevent overspend before approval.
- **Upcoming purchases (for Ops):** What is ORDERED but not yet RECEIVED. Why: to follow up with vendors.
- **Vendor activity (for Finance):** How much per vendor this quarter. Why: to see concentration and negotiate.
- **Overdue approvals (for Admin):** Which requests have been PENDING >48 hours and who is the approver. Why: to escalate.
- **Requests requiring attention (for each role):** My pending, my rejected, my changes-requested.

At MVP, these can be simple lists with filters and counts, not charts. Phase 2 we will add charts (spent by vendor/month). What matters at MVP is that the data is _queryable_, not that it is beautiful.

---

## 9. When I Expect People to Know (Notifications)

I will tell you as the client: when this happens, this person must know, through this channel, or the process stalls.

- **Request submitted:** Approver(s) notified immediately (in-app + email). Why: so they act.
- **Approval required / assigned:** Approver notified.
- **Request approved:** Requester notified.
- **Request rejected / changes requested:** Requester notified with reason.
- **Budget exceeded attempt:** Finance notified with warning.
- **PO created:** Requester + Finance notified.
- **Approval overdue / escalated (48 hours):** Next-level approver + original approver + Finance notified. Why: so nothing sits.
- **Vendor deactivated, budget period ended, invite sent:** Relevant admin/finance notified.

**Through which channel:** At MVP, in-app bell (unread count) + email. Email must be queued, not blocking the request (if email fails, request still moves). Retry 3 times, then log dead-letter but keep in-app. Preferences (mute) are future.

**What if notification fails:** Retry, but do not roll back the business action. The request state is more important than the email.

---

## 10. How I Expect You to Prove It (Auditability)

Pretend the auditor asks me, and I turn to you:

- "Who requested this purchase?" -- You must show: Arun, on 2026-08-20, DRAFT created, amount Rs 28k, vendor X.
- "Who approved it?" -- Priya, on 2026-08-21 10:15, step order 1, comment "looks good, budget okay."
- "When was it approved?" -- Server timestamp, not client.
- "Was the amount changed?" -- Show diff: before Rs 28k, after Rs 32k, by Arun on DRAFT, before submit, with audit.
- "Who changed it?" -- Arun (owner) on DRAFT.
- "Why was the request rejected?" -- Priya''s comment: "missing quote, not needed this quarter."
- "What happened afterward?" -- Arun cloned to new DRAFT draft-124, resubmitted, approved.

I expect you to be able to prove _every_ important action: who, what, when, before/after or field diff, related request, reason. Append-only, 7-year retention, never deletable even by me, filterable by org + entity + actor + time, exportable in Phase 2. If it is not logged, it did not happen. Every audit record must include actor + before/after + reason where applicable, and be written _transactionally_ with the state change.

---

## 11. When Things Break (What I Expect You to Handle)

As the client, I will be demanding when normal workflows break. Here is what I expect for each difficult situation. Do not tell me "that will not happen."

- **Someone loses access (removed from org):** Their active session for that org must end on next check (they see 403). Their history remains. If they were an approver on a PENDING request, that step must auto-escalate to Finance/Owner, not stall forever. Audit logs removal + escalation.

- **Approver changes role (Priya demoted from APPROVER to REQUESTER mid-approval):** Her pending step must be re-evaluated at _decision time_ against her _current_ role, not snapshot at submission. If demoted before she clicks, she gets 403 at approve time.

- **Employee leaves company (account deactivated):** Same as loses access, but also their DRAFT requests should remain for audit, not deleted. If they had PENDING requests, those escalate.

- **Vendor is deactivated (we stop using them):** Existing PENDING requests with that vendor remain (they were valid when created), but no new requests can select it. Vendor history (spend) remains. Deactivation, not deletion, if history exists.

- **Budget changes mid-flight (Finance edits amount/threshold while requests are PENDING):** Change is audited, applies only to _new_ requests after change. PENDING requests keep the budget snapshot from when they were submitted, not retroactive. Otherwise you create confusion mid-flight.

- **Approval is overdue (48 hours):** Do not auto-approve. Escalate: mark step ESCALATED, create new step for Finance/Owner, notify. Also allow Admin to escalate manually immediately if they know the approver is on leave.

- **Request is edited after approval:** Not allowed. Only DRAFT editable, only by owner. If a Rs 28k request was approved and someone changes it to Rs 32k, that is a different purchase. Must create a new request; old remains as audit.

- **Purchase is cancelled after some approval:** Only allowed if all steps still PENDING. After any approval, no cancel -- must be rejected or handled via Finance exception with reason and audit. This prevents moving targets.

- **Invoice is incorrect (Rs 67k vs Rs 65k):** At MVP, warn at Receive: "Invoice Rs 67k differs from request Rs 65k." Allow Receive, log warning in audit, let finance handle with vendor. Do not block, just make it visible. Future with structured invoices, you will do tolerance checks.

- **Duplicate requests occur (two people ask for same laptops):** At MVP, warn on create if similar title/vendor/amount exists in last 7 days (simple match, not AI). Future with embeddings, better detection. Do not block, just warn: "Similar request by Rahul, Rs 285k, PENDING."

- **Notifications fail (email bounces):** Retry 3 times, keep in-app, log dead-letter, but do not roll back the business action. The request state is more important than the email.

- **Something goes wrong halfway (budget increment succeeds but audit fails, or PO PDF job fails):** All must be transactional: budget + steps + audit in one DB transaction. If audit fails, state must not commit. If PO PDF job fails, request stays APPROVED and Finance can retry Order idempotently without duplicate PO numbers.

For every difficult situation above, I expect an audit record and a clear next step, not a silent failure.

---

## 12. What Success Looks Like After Six Months

Imagine ProcureDesk has been running for six months. I would say it is successful if:

- **Faster approvals:** Average approval cycle from 3 days to under 1 day for standard requests. Not because we rushed, but because routing is correct and budget impact is visible. Assumption: we measure from Submit to APPROVED for non-threshold requests.

- **Better spend visibility:** I can answer "how much did Engineering spend on SaaS last quarter, per vendor" in minutes, not days. Assumption: we actually use budgets and vendor master consistently.

- **Fewer unauthorized purchases:** Maverick spend visibly reduced in audit -- 80 percent of requests are via ProcureDesk, not email. Assumption: compliant buying is made easier than bypass.

- **Better budget control:** Zero budget surprises at month-end. Every overspend attempt was either blocked or approved as a documented exception. Assumption: thresholds are set correctly (we will tune).

- **Easier audits:** Any audit question ("who approved PO-2026-042, when, was amount changed, who changed it, why rejected, what happened after?") answered in under 2 minutes via query, not email search. Assumption: audit is append-only and queryable.

- **Less manual work:** Finance no longer retypes invoice to QuickBooks and sheets. At MVP, still some retyping, but after QuickBooks integration (Phase 2), less. Assumption: we actually integrate.

- **Better vendor visibility:** One vendor master, no duplicates, spend per vendor visible, preferred vendors guided. Assumption: we keep the master clean.

I do not expect perfect metrics on day one. I expect the _trend_ to be clear and the _evidence_ to be queryable.

---

## 13. Challenge Me Back -- What You Should Ask Me

Do not make everything convenient for you. As a real client, I will ask you demanding questions. You should ask me these before you code:

- "What happens if the approver is unavailable for a week? Do you want timeout 48 hours, or should Admin escalate immediately?"
- "What if someone changes the amount after approval? Do you want to block all edits after submit, or allow Finance to edit with audit?"
- "Can finance see everything, even other departments budgets? Yes, finance must see all; department heads see only theirs plus what is routed to them."
- "What if the vendor is no longer approved but a request is already PENDING with that vendor? Should it stay or be blocked? It should stay, but no new requests can use it."
- "Can an employee approve their own request if they are also a manager? Never. No self-approval, even for Owner."
- "How do we prove who authorized this purchase for GST? Through the immutable audit: who, what, when, before/after, reason."
- "What happens if two people submit the same request within minutes? Warn on create if similar title/vendor/amount in last 7 days, do not block."

If you do not ask these, you will miss requirements I may not have stated.

---

## 14. A Day in the Life -- Before and After ProcureDesk

### Before ProcureDesk: Monday Morning, the Old Way

**6:00 AM, Pune:** Arun arrives, needs 3 laptops for new hires starting Friday. He emails Priya: "Hi Priya, need 3 MacBooks ~Rs 285k, vendor Y, quote in Drive."

**9:00 AM:** Priya is in meetings, misses email. Arun pings on Slack at 10:00: "Did you see?" Priya replies "approved, check with finance."

**11:00 AM:** Arun forwards to Admin, Admin asks Meena on Slack: "Engineering budget?" Meena opens Budget Tracker (yesterday''s data): "Rs 1.2 lakh remaining, this Rs 285k will exceed by Rs 1.65 lakh, need owner." Admin emails me: "Engineering over budget by 1.65 lakh for 3 laptops."

**2:00 PM:** I reply "approved, increase budget to 7 lakh." Meena updates sheet, but Arun''s request is still an email thread with no number. Meanwhile, Rahul from Sales also needed 2 laptops, emailed Priya separately at 10:30 AM, Priya also replied "approved" (she did not know about Arun''s). Two duplicate requests, neither visible to the other.

**3:00 PM:** Admin creates a PO in Word for Arun''s 3 laptops, emails vendor Y. For Rahul''s 2 laptops, another PO. Vendor delivers 5 laptops total.

**Next week:** Vendor invoices Rs 4.75 lakh for 5 laptops. Finance retypes into QuickBooks and sheets. At month-end, finance finds duplicate: we ordered 5 when we needed 3+2 but could have negotiated bulk? Audit asks "who approved the second laptop request, was it within budget?" Finance searches 3 email threads for 3 days. Budget shows Rs 5 lakh spent against Rs 7 lakh, but no one knows which approval was threshold vs not.

**Total: 4 days, 3 threads, 2 duplicate requests, budget checked after PO, audit = email search.**

### After ProcureDesk: Same Monday, the New Way

**8:00 AM:** Arun opens ProcureDesk, clicks "Create Request": title "3x MacBook Pro for new hires", vendor Y (ACTIVE, from master -- he cannot type free-text, so no duplicate spelling), amount Rs 285,000, budget "Engineering Q3" (he sees remaining Rs 1.2 lakh of Rs 5 lakh), attaches quote PDF. System warns: "Similar request by Rahul 30 minutes ago: ''2x MacBook'' Rs 190k, PENDING. Is this duplicate?" Arun sees it, comments "Rahul, are these for same hires or different? @Rahul", Rahul replies in comments: "Different team -- keep both." Arun hits Submit. System creates two ApprovalSteps: Order 1 = Finance (Meena) because >50k threshold and because Priya cannot approve her own team''s large request? Actually Arun is requester, not Priya, so Order 1 = Priya (Dept Head), Order 2 = Finance (Meena), and because amount >50k and also Priya is Dept Head but requester is Arun (not Priya), it is fine. Request PENDING, Priya and Meena notified.

**8:05 AM:** Priya opens her Approval Inbox, sees Arun''s request with budget impact "remaining Rs 1.2 lakh, this Rs 285k exceeds by Rs 1.65 lakh." She approves with comment "over budget but needed for new hires, need Finance + budget increase." Request still PENDING (needs Finance). Meena sees it, sees remaining, sees Priya''s comment, knows she must increase budget or exception. She clicks "Increase Budget" to Rs 7 lakh (audited), then approves with exception reason "owner approved increase, remaining now Rs 1.15 lakh after this." Request APPROVED, budget spent updated transactionally to Rs 4.05 lakh, audit logs both approvals + budget change + exception.

**8:30 AM:** Finance clicks Order, PO PDF job runs, PO number PO-2026-042 generated, status ORDERED, Arun notified "PO created." At same time, Rahul''s separate 2-laptop request is also PENDING but visible as separate, not duplicate confusion, and its budget impact is now correctly calculated against the _new_ remaining Rs 1.15 lakh.

**11:00 AM:** Vendor delivers 3 laptops, Meena uploads delivery note as receipt, clicks Receive, status RECEIVED. Vendor invoices Rs 285k, Meena uploads invoice PDF at Receive, system warns no mismatch, she clicks Close, status CLOSED. Audit shows: Arun created 08:00, Priya approved 08:05, Meena approved 08:20 with exception, Meena ordered 08:30, Meena received 11:00, Meena closed 11:05 -- all with actor, before/after, reason.

**When audit asks:** Meena queries audit by request id, answers "Arun requested, Priya approved, Meena approved with budget increase, who changed amount? No one, amount never changed after submit, and we can prove it because only DRAFT editable." Duplicates were warned, budget was checked _before_ approval, and the PO number is queryable.

**Total: 30 minutes to APPROVED (with correct routing and budget check before, not after), no email thread as system of record, audit in 2 minutes, no duplicate surprise.**

---

## 15. What I Need You to Take Away

After this, you should be able to explain ProcureDesk to another engineer in your own words without the PRD.

You should now understand:

- **What we do:** 120-person services firm, 80 purchases a month, 85 vendors, Sheets+Slack today, QuickBooks for accounting.
- **Why procurement is difficult:** It is not buying that is hard, it is _control_ -- who approved what, against which budget, with what evidence, and can you prove it 7 years later.
- **Who participates:** Arun (needs), Priya (approves up to 50k), Meena (owns budgets, real-time control), Admin (master data), me (Owner), plus future auditor -- and what each needs, can approve, and cannot do.
- **How the real workflow works:** The 8 workflows (onboarding, vendor, request, approval with threshold + no self + in-order + 48h escalation, purchase, invoice as file at MVP, budget with remaining before, audit append-only) and the 10 scenarios (small, large, rejected, changes requested, budget exceeded, new vendor, invoice mismatch, approver unavailable, cancellation, duplicate) and day-in-the-life.
- **Why every major rule exists:** Threshold because materiality, no self-approval because segregation, no edits after submit because moving target, quotes above 10k because evidence, audit because GST.
- **What can go wrong:** Two approvers click at once, approver removed, budget changed mid-flight, vendor deactivated, invoice mismatch, notification fail, duplicate -- and what I expect (version+lock, escalation, not retroactive, warn not block, retry, etc.).
- **What ProcureDesk should feel like:** For Arun, few minutes to submit and watch status; for Priya, inbox with budget impact; for Meena, real-time spent vs remaining and audit in 2 minutes; for Admin, policies in minutes.
- **What success looks like in 6 months:** Faster approvals, better visibility, fewer unauthorized, better budget control, easier audits, less manual work -- all measurable and queryable.

Do not add new features casually. If something is not in the PRD business-rules, label it as proposed assumption or open question. Now you know the business. The next step is to translate this into software, one area at a time, with me approving each decision.

---

_Client: Owner, Aarav Solutions Pvt Ltd -- 2026-08-22. This simulation is the business truth before software. Engineering to propose technical decisions next, with my approval._
