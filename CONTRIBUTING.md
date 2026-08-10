# Contributing Guidelines

Thank you for contributing to **Project X**! To maintain code quality and architectural consistency, please follow these guidelines.

---

## 🌿 Git Workflow & Branch Strategy

We follow **Trunk-Based Development** with short-lived topic branches.

1. Branch Naming Standards:
   - `feat/description` — New features
   - `fix/description` — Bug fixes
   - `chore/description` — Maintenance / tooling
   - `docs/description` — Documentation updates
2. Submit Pull Requests targeting `main`.
3. Pull Requests require all CI quality checks (Lint, Typecheck, Test, Build) to pass before merging.

---

## 📝 Commit Message Convention

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

## 🧪 Quality Gates Before Opening PR

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
```
