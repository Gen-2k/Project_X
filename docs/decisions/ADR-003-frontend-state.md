# ADR-003: Frontend State -- Context (Auth) + TanStack Query (Server) + useState (Local), No Zustand at MVP

**Date:** 2026-08-22
**Status:** Accepted (user: "okay i am okay with all done with all go with all recommended")
**Context:** apps/client already React 19 + Vite 8 + TanStack Query 5 + React Router 7 (App.tsx:16 QueryClient stale 5m, AuthContext). Need to decide Context API vs Zustand vs Redux for ProcureDesk state.

**Problem:** Separate server state (vendors/requests/budgets from PostgreSQL, stale, need fetch/cache/invalidate/optimistic) vs client state (user/org, sidebar, form before submit, page/sort). Using wrong tool = stale bugs.

**Options:**

1. Context API alone + TanStack Query + useState -- built-in, AuthContext (user/org) read often/written rarely (fine, re-renders ok), TanStack for server state (caching, background refetch, invalidate, optimistic rollback).
2. Zustand (tiny global store) -- better for frequently changing shared client state (e.g., multi-step wizard draft), but has no caching/invalidation for server state.
3. Redux Toolkit -- powerful for team of 5+, but cannon for solo, most boilerplate.
4. Hybrid -- both, but most to learn at once.

**Tradeoffs:** Zustand does NOT solve main ProcureDesk problem (10k rows, search/filter, where:{orgId}, optimistic approve -> 409). Putting requests in Zustand means manually rebuilding TanStack.

**Decision:** Keep Context (AuthContext) + TanStack Query (vendors/requests/budgets) + useState (local) at MVP, no Zustand. Add one Zustand store only later if multi-step wizard feels prop-drilling pain.

**Why:** Already have it, covers 100% of MVP (90% state is server state). No extra learning cost. Making invisible visible via optimistic + invalidation is the portfolio signal.

**Consequences:** Must use invalidateQueries after mutate, not forget. Later wizard may need Zustand, but not now.

**Alternatives rejected:** Zustand now (wrong for server state), Redux (overkill solo).
