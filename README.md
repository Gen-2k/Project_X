# Project X -- ProcureDesk: Vendor & Spend Request Control Center

[![CI Pipeline](https://github.com/Gen-2k/Project_X/actions/workflows/pr.yml/badge.svg)](https://github.com/Gen-2k/Project_X/actions/workflows/pr.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)
![pnpm](https://img.shields.io/badge/pnpm-11.x-blue.svg)
![Turborepo](https://img.shields.io/badge/Turborepo-2.x-red.svg)
![React](https://img.shields.io/badge/React-19.x-cyan.svg)
![NestJS](https://img.shields.io/badge/NestJS-11.x-red.svg)
![Prisma](https://img.shields.io/badge/Prisma-7.x-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)

> **ProcureDesk is the active product track** -- a vendor & purchase-request control center for 20-300-person orgs. Budgets -> Requests -> Threshold-routed Approvals -> PO PDF -> Receive -> Audit. Modular monolith (NestJS + React + PostgreSQL), INR 0-first (Docker + free tiers: Neon/Upstash/R2/Resend/Render).
> **Start here:** `docs/product/procuredesk-prd.md` (22-section client PRD, the source of truth), `docs/research/procuredesk-market-domain-research.md` (evidence, 39 sources), `docs/product/domain-model.md` + `workflows.md` + `business-rules.md` + `mvp-scope.md` + `personas.md`, `docs/reviews/procuredesk-requirements-review.md` — technical specs (ERD/API) and ADRs will be recreated step-by-step as we learn (Phase 0 Area 7).

> Modern full-stack monorepo demonstrating production-grade architecture, strict quality gates, isolated package boundaries, and automated CI/CD.

---

## System Architecture

```
Project_X/
├── apps/
│   ├── client/           # React 19 + Vite 8 + Vitest UI App
│   └── server/           # NestJS 11 + Prisma 7 + Jest REST API
└── packages/
    ├── config-eslint/    # Modular ESLint Flat Configurations
    ├── config-typescript/# Shared TypeScript compiler definitions
    ├── database/         # Prisma ORM schema & client exports
    └── shared/           # Cross-application DTOs & Validation
```

---

## Quickstart Guide

### Prerequisites

- **Node.js**: `>= 22.13.0`
- **pnpm**: `>= 11.0.0`
- **Docker Desktop** (for PostgreSQL, Redis, MinIO, Mailpit)

### 1. Installation & Setup

```bash
# Clone
git clone https://github.com/Gen-2k/Project_X.git
cd Project_X

# Install
pnpm install

# Generate Prisma Client
pnpm db:generate
```

### 2. Local Development

```bash
# Start infra -- Phase 0: postgres only (current docker-compose.yml:1)
# Phase 1 adds redis + minio + mailpit per docs/product/procuredesk-prd.md:7 + docs/research/procuredesk-market-domain-research.md:11 (P2P scope)
docker compose up postgres -d

# After Phase 1:
# docker compose up postgres redis minio mailpit -d

# Or full stack (after Phase 1)
# docker compose up --build

# Start apps in dev (hot reload)
pnpm dev
```

Accessible at:

- **Client**: http://localhost:5173
- **Server API**: http://localhost:3000/api/v1
- **Swagger**: http://localhost:3000/api/v1/docs
- **Mailpit**: http://localhost:8025
- **MinIO**: http://localhost:9001

---

## Available Workspace Scripts

| Command            | Description                                     |
| ------------------ | ----------------------------------------------- |
| `pnpm dev`         | Starts all apps in dev (persistent)             |
| `pnpm build`       | Compiles all packages in topological order      |
| `pnpm db:generate` | Generates Prisma client                         |
| `pnpm lint`        | ESLint flat config                              |
| `pnpm typecheck`   | `tsc --noEmit` via solution refs                |
| `pnpm test`        | Unit & integration (Vitest client, Jest server) |
| `pnpm format`      | Prettier check                                  |
| `pnpm format:fix`  | Prettier write                                  |

---

## Testing Strategy

- **Client**: Vitest + RTL + jsdom
- **Server**: Jest + Supertest
- Run: `pnpm test`

---

## Code Quality & Git Hooks

- **Commits**: Husky + Commitlint (Conventional Commits)
- **Pre-commit**: lint-staged (ESLint + Prettier)
- **CI**: GitHub Actions (format, audit, Knip, turbo lint/typecheck/test/build, Postgres E2E, Docker verify, semantic PR, Changesets, GHCR)

---

## Author

- **Surya** ([@Gen-2k](https://github.com/Gen-2k)) — Owner & Architect

---

## Documentation

- [ProcureDesk PRD (Client, 22 sections)](./docs/product/procuredesk-prd.md) — What the business wants and why (the source of truth)
- [Market & Domain Research (39 sources)](./docs/research/procuredesk-market-domain-research.md) — Evidence base (P2P vs S2P, 5-8-step workflows, DOA, pain points)
- [Domain Model](./docs/product/domain-model.md) — Business entities, relationships, lifecycle
- [Workflows](./docs/product/workflows.md) — 8 workflows, state machine, transitions
- [Business Rules](./docs/product/business-rules.md) — Explicit rules, configurable marks
- [MVP Scope](./docs/product/mvp-scope.md) — MVP vs Phase 2 vs Future vs Never
- [Personas](./docs/product/personas.md) — 5 personas (Aarav Solutions — 120 people)
- [Requirements Review (18 sections)](./docs/reviews/procuredesk-requirements-review.md) — Deep review, verdict READY FOR PHASE 0

> Technical specs (ERD, API, setup) and ADRs were removed for now per your request — they will be recreated step-by-step as we learn domain knowledge, requirements, full flow and business logic (Phase 0 Areas 3-7).

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [SECURITY.md](./SECURITY.md)
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- [LICENSE](./LICENSE) — MIT
