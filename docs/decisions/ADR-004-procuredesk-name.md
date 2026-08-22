# ADR-004: Keep ProcureDesk Name with Disclaimer (Not Affiliated with procuredesk.com)

**Date:** 2026-08-22
**Status:** Accepted (user: "leave it")
**Context:** Research revealed real US product "ProcureDesk" (Cincinnati, 30 emp, $3M, since 2010, procuredesk.com, G2 4.4/5, Capterra 4.8/5, $498/mo P2P) shares our name. We never had their codebase, only same domain (ProcureDesk/Precoro/Procurify all do same P2P spine per research).

**Problem:** Portfolio clarity: recruiter googling "ProcureDesk" finds procuredesk.com (US company), may think we claim we built their product. Demo at procuredesk.vercel.app looks like trademark issue.

**Options:**

1. Keep name with disclaimer "Learning Project (Not affiliated with procuredesk.com)" -- fastest, no doc/code changes, clear it is domain inspiration not fork.
2. Rename to SpendDesk/BuyFlow/RequestDesk -- cleaner search, but renames docs.

**Decision:** Keep name with disclaimer (Option A).

**Why:** Learning goal unaffected, name does not matter for mastery. Disclaimer keeps portfolio honest: "Inspired by P2P domain (like Precoro/Procurify/ProcureDesk), not a fork."

**Consequences:** README/portfolio must show disclaimer.

**Alternatives rejected:** Rename now (cleaner but unnecessary at Phase 0).
