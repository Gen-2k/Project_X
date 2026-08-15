# Project X — Enterprise Monorepo Architecture

[![CI Pipeline](https://github.com/Gen-2k/Project_X/actions/workflows/pr.yml/badge.svg)](https://github.com/Gen-2k/Project_X/actions/workflows/pr.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)
![pnpm](https://img.shields.io/badge/pnpm-11.x-blue.svg)
![Turborepo](https://img.shields.io/badge/Turborepo-2.x-red.svg)
![React](https://img.shields.io/badge/React-19.x-cyan.svg)
![NestJS](https://img.shields.io/badge/NestJS-11.x-red.svg)
![Prisma](https://img.shields.io/badge/Prisma-7.x-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)

> Modern full-stack monorepo demonstrating production-grade software architecture, strict quality gates, isolated package boundaries, and automated CI/CD pipelines.

---

## 🏛 System Architecture

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

## 🚀 Quickstart Guide

### Prerequisites

- **Node.js**: `>= 22.13.0`
- **pnpm**: `>= 11.0.0`
- **Docker Desktop** (for PostgreSQL database)

### 1. Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Gen-2k/Project_X.git
cd Project_X

# Install workspace dependencies cleanly
pnpm install

# Generate Prisma Client & internal database exports
pnpm db:generate
```

### 2. Local Development

```bash
# Start PostgreSQL via Docker Compose
docker compose up postgres -d

# Start client & server applications in development mode (hot-reloading)
pnpm dev
```

The applications will be accessible at:

- **Client App**: [http://localhost:5173](http://localhost:5173)
- **Server API**: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
- **Swagger API Docs**: [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)

---

## 🛠 Available Workspace Scripts

| Command            | Description                                                               |
| ------------------ | ------------------------------------------------------------------------- |
| `pnpm dev`         | Starts all applications in persistent development mode.                   |
| `pnpm build`       | Compiles all packages and applications in topological dependency order.   |
| `pnpm db:generate` | Generates Prisma client types across workspace packages.                  |
| `pnpm lint`        | Runs ESLint flat config checks across all apps and packages.              |
| `pnpm typecheck`   | Executes `tsc --noEmit` using TypeScript solution references.             |
| `pnpm test`        | Runs Unit & Integration test suites (Vitest for Client, Jest for Server). |
| `pnpm format`      | Verifies code formatting compliance via Prettier.                         |
| `pnpm format:fix`  | Automatically formats codebase via Prettier.                              |

---

## 🧪 Testing Strategy

- **Client (`apps/client`)**: **Vitest** + **React Testing Library** + **jsdom** for component rendering and user interaction testing.
- **Server (`apps/server`)**: **Jest** + **Supertest** for NestJS unit and E2E controller integration testing.

Run tests monorepo-wide:

```bash
pnpm test
```

---

## 🛡 Code Quality & Git Hooks

- **Commit Messages**: Enforced via **Husky** and **Commitlint** adhering to [Conventional Commits](https://www.conventionalcommits.org/).
- **Pre-commit Formatting**: Automatically triggers **lint-staged** to format staged files via Prettier and ESLint.
- **Continuous Integration**: 7 automated quality gates on GitHub Actions (Lint, Format, Audit, Typecheck, Test, E2E Postgres, Build).

---

## Contributors

- Surya

---

## 📄 Documentation

- [CONTRIBUTING.md](./CONTRIBUTING.md) — Git workflow, branch strategy, and contribution guidelines.
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Technical design, package boundaries, and data flows.
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) — Community pledge and standards.
- [SECURITY.md](./SECURITY.md) — Security policy and vulnerability disclosure.
- [LICENSE](./LICENSE) — MIT License.
