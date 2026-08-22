# Contributing Guidelines

Thank you for contributing to **Project X**! To maintain code quality and architectural consistency, please follow these guidelines.

---

## ðŸŒ¿ Git Workflow & Branch Strategy

We follow **Trunk-Based Development** with short-lived topic branches.

1. Branch Naming Standards:
   - `feat/description` â€” New features
   - `fix/description` â€” Bug fixes
   - `chore/description` â€” Maintenance / tooling
   - `docs/description` â€” Documentation updates
2. Submit Pull Requests targeting `main`.
3. Pull Requests require all CI quality checks (Lint, Typecheck, Test, Build) to pass before merging.

---

## ðŸ“ Commit Message Convention

Commits must follow the **Conventional Commits** format:

```
<type>(<scope>): <short description>
```

### Supported Types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style/formatting changes
- `refactor`: Code refactoring without behavioral changes
- `test`: Adding or updating tests
- `chore`: Maintenance tasks or build updates

### Examples:

- `feat(server): add jwt authentication strategy`
- `fix(client): resolve counter button focus state`
- `chore(deps): update prisma to version 7.9.1`

---

## ðŸ§ª Quality Gates Before Opening PR

Before submitting a Pull Request, run the validation suite locally:

```bash
# 1. Typecheck TypeScript across all packages
pnpm typecheck

# 2. Run ESLint checks
pnpm lint

# 3. Execute test suite
pnpm test

# 4. Check formatting
pnpm format

# 5. Check for unused code and dead dependencies
pnpm analyze
```

---

## ðŸ“¦ Changesets & Versioning

For user-facing changes or package modifications, add a changeset before opening your PR:

```bash
pnpm changeset
```

---

## ProcureDesk Product Track (Phase 0+)

Active product is **ProcureDesk** (Vendor & Spend Requests). Before any feature:

1. Read `docs/product/procuredesk-prd.md` (22-section client PRD, the source of truth) + `docs/research/procuredesk-market-domain-research.md` (evidence).
2. Check `docs/product/domain-model.md`, `workflows.md`, `business-rules.md`, `mvp-scope.md`, `personas.md` and `docs/reviews/procuredesk-requirements-review.md` for current phase scope. Technical specs (ERD/API) and ADRs will be recreated step-by-step as we learn (Phase 0 Areas 3-7).
3. For any architectural choice (RBAC, pagination, storage, caching, jobs, auth), add a new ADR in `docs/adr/` when we make the decision together — do not decide silently.
4. Keep `docs/product/procuredesk-prd.md` and phase docs (`domain-model`, `workflows`, etc.) in sync with code; update them in the same PR as code.

See `README.md:118` Documentation links.
