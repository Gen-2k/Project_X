# @project/server -- NestJS Backend (ProcureDesk Track)

Production-grade REST API for **ProcureDesk** (Vendor & Spend Request Control Center) + base Project X monorepo. Built with **NestJS 11**, **Express 5**, **Prisma 7**, **PostgreSQL**.

> **Current code (Phase 0):** Auth + Users + Health only (`apps/server/src/modules/auth`, `users`, `health`). **Planned (Phases 1-8):** Organizations, Memberships, Vendors, Budgets, Requests, Approvals, Files, Audit, Notifications, Jobs — see `docs/product/procuredesk-prd.md:7`, `procuredesk-prd.md:6` + future ERD/API and future `docs/adr/` (will be recreated step-by-step).

---

## Architecture Overview

```
apps/server/src/
├── common/
│   └── filters/
│       └── all-exceptions.filter.ts   # Global sanitized error filter
├── database/
│   ├── prisma.module.ts               # Global Prisma provider
│   └── prisma.service.ts              # pg.Pool + @prisma/adapter-pg (packages/database/prisma/schema.prisma:9 currently User only; ProcureDesk adds 8 tables per erd.md)
├── health/
│   ├── health.controller.ts           # Terminus DB health check (health.controller.ts:26) — Phase 5 extends to Redis
│   └── health.module.ts
├── modules/
│   ├── auth/                          # AuthController, AuthService, PasswordService, JwtStrategy (jwt in httpOnly cookie auth.controller.ts:35)
│   ├── users/                         # UsersService
│   └── (planned) organizations/ memberships/ vendors/ budgets/ requests/ approvals/ files/ audit/ notifications/ jobs/
├── app.controller.ts
├── app.module.ts                      # AppModule with Zod Config (app.module.ts:15), Pino (31), Throttler (54)
└── main.ts                            # Bootstrap, Helmet (21), CORS (22), Swagger (55), CookieParser (31), ValidationPipe (34), AllExceptionsFilter (46)
```

Planned modules: see `docs/product/procuredesk-prd.md:7` + `domain-model.md` and `docs/product/procuredesk-prd.md (future API spec will be recreated)` for endpoints.

---

## Security & Defensive Controls

1. **Timing-Attack Defense**: `PasswordService.mitigateTimingAttack()` dummy bcrypt when email not found.
2. **Password Length Limit**: `MaxBcryptBytes` prevents bcrypt 72-byte truncation.
3. **Route Throttling**: `@Throttle({ limit: 5, ttl: 60000 })` on auth (`auth.controller.ts:76`), global 100/60s (`app.module.ts:54`), future 20/60s for requests.
4. **HTTP-Only Cookie Transport**: JWT in `httpOnly`, `sameSite: ''strict''` (`auth.controller.ts:44`), `COOKIE_SECURE` override.
5. **Sanitized Exception Handling**: `AllExceptionsFilter` masks DB errors in prod, Pino logs.
6. **Planned (Phases 1-5)**: Org isolation (`where:{orgId}`), RBAC guards (OrgMembership/Roles/Policy), `SELECT ... FOR UPDATE` for budgets, file MIME + scan, rate limiting, audit append-only — see `docs/product/business-rules.md` and ADRs 0003/0005/0006.

---

## API Endpoints & Interactive Documentation

Interactive Swagger at:

- **Local Dev**: [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)

### Core Endpoints (Phase 0 — current)

| Method | Path                    | Description                   | Access                    |
| :----- | :---------------------- | :---------------------------- | :------------------------ |
| `POST` | `/api/v1/auth/register` | Register                      | Public (Throttled: 5/min) |
| `POST` | `/api/v1/auth/login`    | Authenticate & set JWT cookie | Public (Throttled: 5/min) |
| `POST` | `/api/v1/auth/logout`   | Clear cookie                  | Public                    |
| `GET`  | `/api/v1/auth/me`       | Fetch profile                 | Protected (JWT Cookie)    |
| `GET`  | `/api/v1/health`        | Terminus DB health            | Public                    |
| `GET`  | `/api/v1/docs`          | Swagger UI                    | Public                    |

### Planned (Phases 1-10) — see `docs/product/procuredesk-prd.md (future API spec will be recreated)`

`POST/GET /api/v1/orgs`, `/orgs/:orgId/members`, `/orgs/:orgId/vendors`, `/budgets`, `/requests`, `/requests/:id/submit|approve|reject|order|receive|close`, `/files`, `/audit-logs`, `/notifications`, `/ai/*` — full list in `procuredesk-api.md:10`.

---

## Environment Variables

Create `.env` in `apps/server/.env` or root:

```ini
# Application (app.module.ts:15 Zod schema)
NODE_ENV="development"
PORT="3000"
CORS_ORIGIN="http://localhost:3000,http://localhost:5173"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/project_x?schema=public"

# Auth (Min 32 chars)
JWT_SECRET="super-secret-jwt-key-min-32-characters-long!"
JWT_EXPIRES_IN="1d"

# Cookie
COOKIE_SECURE="false"

# Planned Phase 1+ (see procuredesk-setup-zero-cost.md and docs/product/procuredesk-prd.md:22)
# REDIS_URL="redis://localhost:6379"
# S3_ENDPOINT="http://localhost:9000"
# S3_BUCKET="procuredesk"
# S3_ACCESS_KEY="minioadmin"
# S3_SECRET_KEY="minioadmin"
# MAIL_HOST="localhost"
# MAIL_PORT="1025"
# RESEND_API_KEY=""
# AI_PROVIDER="ollama"
```

Current `app.module.ts:15` validates only the first block; REDIS/S3 vars will be added in Phase 1.

---

## Testing Strategy & Execution

- **Unit & Integration** (95%+ target):
  ```bash
  pnpm --filter @project/server run test
  ```
- **Coverage**:
  ```bash
  pnpm --filter @project/server run test:cov
  ```
- **E2E** (against PostgreSQL service `pr.yml:54`):
  ```bash
  pnpm --filter @project/server run test:e2e
  ```
- **Planned**: cross-org RBAC matrix, transaction/locking tests, file/audit tests — see `docs/reviews/procuredesk-requirements-review.md:11`.
