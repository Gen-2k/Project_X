# ADR 0001: Monorepo Architecture & Workspace Boundaries

- **Status**: Approved
- **Date**: 2026-08-11
- **Authors**: Technical Lead & Architecture Team

---

## Context & Problem Statement

As Project X grows, we require a repository architecture that supports strict dependency separation between frontend client, backend server, and internal shared libraries (`@project/database`, `@project/shared`).

Without explicit boundaries:

- Internal packages get coupled or exported directly from raw TypeScript source code without build targets.
- Tooling version drift causes hoisting errors across package managers.
- Caching behavior in CI causes slow feedback loops.

---

## Decision Drivers

- **Developer Experience**: Fast feedback, clear folder discovery, automatic code formatting and type safety.
- **Production Safety**: Compiled JS (`dist/`) output contracts for internal packages; non-root unprivileged container runtime users.
- **CI/CD Efficiency**: Topological caching using Turborepo and parallelized GitHub Actions workflows.

---

## Considered Options

1. **Polyrepo (Separate GitHub Repositories)**: High overhead for shared DTOs and database schemas.
2. **Standard Monorepo without Build Contracts**: Fast prototype setup, but breaks in production containers and causes version drift.
3. **Strict Monorepo Architecture (pnpm Workspace + Turborepo + Solution TSConfig)**: Selected.

---

## Decision Outcome

We adopt Option 3:

- **Package Management**: `pnpm 11` workspace with strict `workspace:*` linking protocol.
- **Task Orchestration**: `Turborepo 2.x` graph with explicit `inputs` and `outputs`.
- **Compiler**: Root TypeScript solution `tsconfig.json` using project references (`references: []`).
- **Code Quality**: `@project/eslint-config` Flat Config + Prettier + Husky + Commitlint.
- **Testing**: Vitest for frontend UI components and Jest for NestJS backend modules.
