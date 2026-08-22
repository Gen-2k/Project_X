# AGENTS.md -- Project X (ProcureDesk)

> Monorepo `pnpm@11.21.0 + Turborepo 2.4 + TypeScript project references`. ProcureDesk P2P specs live in `docs/product/` (PRD + research) -- read them before touching business logic.

## Quick Commands

```bash
pnpm install --frozen-lockfile          # always frozen
pnpm db:generate                        # prisma generate (must run before build/lint)
pnpm dev                                # turbo dev (persistent, all apps)
pnpm build                              # turbo build (topo: ^build + db:generate)
pnpm lint && pnpm typecheck && pnpm test # local verify order (CI: lint/typecheck/test/build)
pnpm format                             # check only (CI); use pnpm format:fix to write
pnpm analyze                            # knip dead code (CI)
```

Single package:

```bash
pnpm --filter @project/server run test          # jest --coverage
pnpm --filter @project/server run test:e2e      # needs Postgres (see below)
pnpm --filter @project/server run test:watch
pnpm --filter @project/client run test          # vitest run
pnpm --filter @project/client run test:watch    # vitest
pnpm --filter @project/database run db:generate # prisma generate
```

## Workspace Boundaries

- `pnpm-workspace.yaml`: `apps/*`, `packages/*` (use `workspace:*`)
- `apps/server` -- NestJS 11 + Express 5 entry `src/main.ts` -> `AppModule` (`src/app.module.ts`). Global prefix `api/v1`, Swagger `api/v1/docs`. Tests: Jest + supertest (`jest.config.js`, `test/jest-e2e.json`).
- `apps/client` -- React 19 + Vite 8 + TanStack Query entry `src/main.tsx` -> `src/App.tsx`. Tests: Vitest + RTL + jsdom.
- `packages/database` -- Prisma 7 schema `prisma/schema.prisma` (currently only `User`), config `prisma.config.ts`, exports `dist/index.js`. Generates via `@prisma/adapter-pg` + `pg` Pool (see `apps/server/src/database/prisma.service.ts`).
- `packages/shared` -- DTOs/validation shared by client/server.
- `packages/config-eslint`, `packages/config-typescript` -- shared configs; root `eslint.config.mjs` delegates to `@project/eslint-config/node`.
- `tsconfig.json` -- TypeScript solution references (no files at root).

## Env & Services

- Root requires `pnpm@>=11` via `corepack enable` (`engines: node>=22.13.0`). `allowBuilds` and `overrides: js-yaml >=5.2.2` in `pnpm-workspace.yaml` are intentional.
- Env validated by Zod `envSchema` in `apps/server/src/app.module.ts:15` -- `DATABASE_URL`, `JWT_SECRET` (min 32 chars), `CORS_ORIGIN` required; `PORT`, `JWT_EXPIRES_IN`, `COOKIE_SECURE` optional. `turbo.json:3` lists `globalEnv` that bust cache if changed.
- `docker-compose.yml` (Phase 0: only `postgres:15-alpine` is live; `redis/minio/mailpit` are Phase 1 per `docs/product/` and not in compose yet):
  ```bash
  docker compose up postgres -d   # not `postgres redis...` until Phase 1
  pnpm db:generate                # after compose up
  ```
  Requires `DB_PASSWORD`, `JWT_SECRET` (compose checks `?DB_PASSWORD is required`). Server healthcheck: `wget .../api/v1/health | grep '"status":"ok"'` (Terminus, not just HTTP 200) at `apps/server/src/health/`.

## Build / Lint / Typecheck Quirks

- `turbo.json` deps: `build` needs `^build` + `db:generate`; `lint` needs `^build` + `db:generate`; `test` needs `build`; `typecheck` needs `^build`; `db:generate` uncached; `dev` persistent. So never `pnpm build` without `pnpm db:generate` first.
- `eslint.config.mjs` ignores `**/dist/**`, `**/node_modules/**`, `.turbo/**`, `docs/**`, `**/prisma.config.*`, etc. Lint only touches `src/**` -- docs are not linted.
- `lint-staged` in `package.json:38` runs `eslint --fix --no-warn-ignored` + `prettier --write` on `*.{js,ts,jsx,tsx}` and `prettier --write` on `*.{json,md,yml,yaml}` -- triggered by `.husky/pre-commit` (`npx lint-staged --relative`).
- `pnpm format` is _check_ (`prettier --check .`); CI fails if not formatted. Use `pnpm format:fix` locally.

## Tests & CI

- `test` at root is `turbo run test` (Vitest for client, Jest for server). `test:e2e` for server is separate: `node --experimental-vm-modules node_modules/jest/bin/jest --config ./test/jest-e2e.json` and **needs Postgres service** (see `.github/workflows/pr.yml:test-e2e` -- runs `postgres:15-alpine` with `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/project_x_test` and `JWT_SECRET` dummy).
- CI `pr.yml` concurrency `group: workflow-ref`, cancel-in-progress except `main`. Three jobs: `verify` (format + `pnpm audit --audit-level=high` + `pnpm analyze` + `turbo run lint typecheck test build`), `test-e2e` (with service), `docker-build` (Buildx, no push, cache `type=gha`).
- Release: `release.yml` uses `changesets/action@v1` on push to `main`; `publish-images.yml` on `release:published` pushes to `ghcr.io/gen-2k/project_x-{client,server}`. Use `pnpm changeset` before PR if user-facing.

## Conventions & Gotchas

- **Conventional Commits** enforced by `commitlint.config.js` (`@commitlint/config-conventional`) + `semantic-pr.yml` (types: feat/fix/docs/style/refactor/perf/test/build/ci/chore/revert, `requireScope: false`). PR title must pass.
- `apps/server/src/main.ts:13` uses `bufferLogs: true` + `nestjs-pino`; prod logs JSON, dev uses `pino-pretty` (`app.module.ts:31`). Always `app.enableShutdownHooks()`.
- `packages/database` is imported as `@project/database` (`PrismaClient` + `Prisma`); never import `prisma` directly in server except via that package.
- Product decisions belong in `docs/product/` (PRD is `docs/product/procuredesk-prd.md:22` sections) and `docs/research/` -- specs/ADRs are currently pruned and will be recreated step-by-step per README. Don''t recreate `docs/specs/procuredesk-plan.md` without Phase 0 discussion.
