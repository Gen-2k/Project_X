# Architecture -- ProcureDesk

> **Status:** Phase 0 complete, stack present but not yet formally decided via ADRs (except ADR-002 Nest and ADR-003 state). This file will grow step-by-step as we decide.
> Last updated: 2026-08-22

## Current (from AGENTS.md, verified)

- Monorepo `pnpm@11.21.0 + Turborepo 2.4 + TypeScript project references` (tsconfig.json solution)
- Frontend `apps/client`: React 19 + Vite 8 + TanStack Query 5 + React Router 7, entry `src/main.tsx -> src/App.tsx`, QueryClient stale 5m
- Backend `apps/server`: NestJS 11 + Express 5, entry `src/main.ts -> AppModule`, global prefix `api/v1`, Swagger `api/v1/docs`, `nestjs-pino` (bufferLogs), `Throttler`, `helmet`, `PrismaService` via `@prisma/adapter-pg` + `pg` Pool
- Database `packages/database`: Prisma 7, schema currently only `User` (uuid(7)), `prisma.config.ts`, exports `dist/index.js`
- Shared `packages/shared`: DTOs
- Docker: only `postgres:15-alpine` live (Phase 1 will add redis/minio/mailpit per AGENTS.md)

## Decisions Made

- ADR-001: MVP Option B (opinionated P2P)
- ADR-002: Keep Nest (modular monolith)
- ADR-003: Context + TanStack Query
- ADR-004: Keep ProcureDesk name with disclaimer

## Open Decisions (Station 7 checklist)

- Database + ORM (Postgres+Prisma present, needs formal ADR with why)
- API style, validation, storage, jobs, email, caching, testing, deploy, observability, AI -- to be decided one by one with Teach->Compare->Recommend->you decide->ADR.

## Next

Increment 1.1: Database fundamentals + Organization/Membership schema (with ADR for DB+ORM).
