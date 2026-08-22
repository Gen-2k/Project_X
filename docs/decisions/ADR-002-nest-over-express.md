# ADR-002: Keep NestJS (on Express) for Modular Monolith

**Date:** 2026-08-22
**Status:** Accepted (user: "why choose nest over express?" -> keep Nest)
**Context:** apps/server already NestJS 11 + Express 5 (main.ts NestFactory.create, AppModule with Zod env, Pino, Throttler, Prisma via pg Pool). MVP needs 25+ endpoints across 9 modules, all org-scoped /orgs/:orgId/..., 5-layer guards (Jwt->OrgMembership->Roles->Policy->where:{orgId}), state machine, transactions, audit.

**Problem:** Choose minimal (plain Express) vs structured (Nest on Express) for solo beginner who wants mastery, not just speed.

**Options:**

1. Plain Express (express + Prisma + jwt + bcrypt + multer) -- bare road, you wire app.get + middlewares manually.
2. **NestJS on Express (chosen)** -- Express underneath (`@nestjs/platform-express`) + structure: Controller(Service), Module grouping, Guard classes, Pipe validation, DI, Test helpers.
3. Fastify -- faster but smaller community, not needed for 80 req/mo.

**Tradeoffs:** Express = you see every req/res line, good for learning HTTP deeply, but you invent guard order and DI, risk IDOR by forgetting where:{orgId} on one of 25 routes. Nest = more boilerplate (decorators @Controller/@Injectable), steeper climb, but guards declared as @UseGuards and testable via Test.createTestingModule, order is explicit and safe for 25 guarded routes.

**Decision:** Keep Nest (Option B). Already paid learn cost, avoids 2-week rewrite, and 25+ guarded routes + 9 modules are the smallest house that fits Nest -- 2 endpoints would have been Express.

**Why:** Already have 6 cross-cutting concerns wired (Zod, Pino, Throttler, Prisma, Swagger, health). Nest makes guard chain visible and testable for portfolio (enterprise codebase look). In Tanglish: 2 endpoint ku Express pothum, 25 endpoint + 5 gate ku Nest tha sariyana size.

**Consequences:** Must learn decorators + DI, but gain structure that prevents IDOR and makes testing easy.

**Alternatives rejected:** Plain Express (would be inventing Nest manually for 25 routes).
