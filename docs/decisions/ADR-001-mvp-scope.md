# ADR-001: MVP Scope -- Option B (Opinionated P2P, Not S2P)

**Date:** 2026-08-22
**Status:** Accepted (user: "Go with Option B as is")
**Context:** Solo dev, INR 0, 10-12 weeks, learning-first. Need smallest that is still valuable + teaches every full-stack layer. Research showed mid-market P2P (Precoro 1-3 weeks, $499/mo) vs enterprise S2P (Coupa/Ariba 12-18 months) are different tracks.

**Problem:** Too small MVP (only vendor + request CRUD) would be generic CRUD with no transactions/audit/jobs. Too large (parallel approvals, category routing, contracts, mobile) would be enterprise S2P with 18-month effort, solo would burn out.

**Options considered:**

1. Minimal: Orgs + vendors + requests, no budgets/approvals/audit/files -- 3 weeks, but portfolio = "todo with orgs".
2. **Option B (chosen):** Orgs/vendors/budgets/requests(DRAFT->PENDING->APPROVED/REJECTED/CHANGES_REQUESTED->ORDERED->RECEIVED->CLOSED via single+threshold sequential, no self, in-order, 48h escalation), files(10MB/MIME/S3 signed URL), search(ILike+index, offset->cursor), audit(7-year append-only), notifications(queued), jobs(PO PDF, escalation), plus org isolation/RBAC/idempotency/version lock.
3. Maximal: Above + parallel/category/recurring/dashboard/SSO/vendor portal -- 6 months solo.

**Tradeoffs:** Option B is at upper edge of solo 10-12 weeks, but phasing (1 orgs, 2 DRAFT, 4 state machine, 5 jobs) makes it manageable. Cutting caching and making PO sync at MVP are fallback cuts if heavy, never cut audit/budget.

**Decision:** Option B as locked MVP. Phase 2=dashboard/cursor/quota, Future=parallel/category/recurring/contracts/vendor portal, Never=payments/K8s/Kafka.

**Why chosen:** Every item maps 1:1 to a mastery goal (auth, DB, lock, audit, files, search, jobs, deploy). Remove one and you lose a layer. Research evidence: opinionated P2P wins for <500 (Precoro) vs configurable S2P (Kissflow 50 workflows overwhelm SMBs). Verified in reviews/procuredesk-requirements-review.md verdict READY FOR PHASE 0.

**Consequences:** 10-12 week commitment, must demo invisible work (concurrent approve -> 409, audit <2m, budget before approval) to avoid looking like CRUD.

**Alternatives rejected:** Minimal (too weak for mastery) and Maximal (18-month enterprise, not solo).
