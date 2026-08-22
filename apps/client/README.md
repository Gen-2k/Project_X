# @project/client -- React Frontend (ProcureDesk Track)

SPA for **ProcureDesk** (Vendor & Spend Request Control Center) + base Project X monorepo. Built with **React 19**, **Vite 8**, **TypeScript 5.7**, **React Router 7**, **TanStack Query 5**.

> **Current code (Phase 0):** Auth pages + Dashboard only (`apps/client/src/pages/{Login,Register,Dashboard}`, `App.tsx:16` QueryClient+Router, `context/AuthContext`). **Planned (Phases 1-7):** Org switcher, Vendors, Requests, Budgets, Audit, FileUpload, DataTable — see `docs/product/procuredesk-prd.md:7`, `procuredesk-api.md`.

---

## Architecture Overview

```
apps/client/src/
├── components/
│   ├── ProtectedRoute.tsx     # Guard (auth)
│   └── PublicRoute.tsx        # Redirect if authed
├── context/
│   └── AuthContext.tsx        # Session (httpOnly cookie, GET /auth/me)
├── hooks/
│   └── useAuth.ts
├── layouts/
│   ├── AuthLayout.tsx         # Centered auth
│   └── DashboardLayout.tsx    # Shell
│   ├── (planned) OrgLayout.tsx # Org switcher
├── lib/
│   └── api-client.ts          # fetch with credentials:include
├── pages/
│   ├── DashboardPage.tsx      # Current landing + roadmap
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── (planned) VendorsPage.tsx, RequestsPage.tsx, RequestDetailPage.tsx, BudgetsPage.tsx, AuditLogPage.tsx
├── components/ (planned)
│   ├── DataTable.tsx          # Search/sort/paginate (offset MVP, cursor later per ADR 0004)
│   ├── StatusBadge.tsx
│   ├── FileUpload.tsx         # Drag-drop, signed URL
│   └── BudgetBar.tsx
├── App.tsx                    # QueryClient (App.tsx:16 stale 5m) + BrowserRouter + Protected/Public routes
├── index.css
└── main.tsx
```

Planned: see `docs/product/procuredesk-prd.md:7` + `workflows.md` + `docs/product/mvp-scope.md`.

---

## Routing Matrix

| Route                                | Component           | Access                    | Description                  |
| :----------------------------------- | :------------------ | :------------------------ | :--------------------------- |
| `/login`                             | `LoginPage`         | Public Only               | Sign in                      |
| `/register`                          | `RegisterPage`      | Public Only               | Create account               |
| `/`                                  | `DashboardPage`     | Protected                 | Session dashboard (Phase 0)  |
| `*`                                  | `Navigate to="/"`   | Fallback                  | Catch-all                    |
| _(planned)_ `/:orgSlug/vendors`      | `VendorsPage`       | Protected + OrgMembership | Vendor CRUD, search/paginate |
| _(planned)_ `/:orgSlug/requests`     | `RequestsPage`      | Protected                 | Request list + filters       |
| _(planned)_ `/:orgSlug/requests/:id` | `RequestDetailPage` | Protected                 | Timeline, approvals, files   |
| _(planned)_ `/:orgSlug/budgets`      | `BudgetsPage`       | Protected                 | Budget CRUD + spent          |
| _(planned)_ `/:orgSlug/audit`        | `AuditLogPage`      | Protected (FINANCE/ADMIN) | Audit trail                  |

---

## State Management & Authentication

- **Server State**: TanStack Query (`App.tsx:16` 5m stale, retry 1), optimistic updates for approve/reject (planned).
- **Client Session**: `AuthContext` + `apiClient` with `credentials: ''include''`, `GET /auth/me` restores session without localStorage (httpOnly cookie).
- **RBAC in UI**: Hide buttons by `membership.role` (planned Phase 1), but API enforces via guards.

---

## Testing Strategy

- **Vitest 3** + **React Testing Library** + **jsdom**:
  ```bash
  pnpm --filter @project/client run test
  ```
- **Watch Mode**:
  ```bash
  pnpm --filter @project/client run test:watch
  ```
- **Planned**: a11y (vitest-axe), loading/error/empty states, optimistic update tests — see `docs/reviews/procuredesk-requirements-review.md:11`.

---

## Local Development & Production Build

```bash
# Start dev on 5173
pnpm --filter @project/client run dev

# Build (tsc -b + vite)
pnpm --filter @project/client run build

# Preview
pnpm --filter @project/client run preview
```

---

## Containerization

Production: `nginxinc/nginx-unprivileged:alpine` on 8080 with SPA fallback + `/api` proxy to `server:3000` (`apps/client/nginx.conf:14`, `docker-compose.yml:1`).
