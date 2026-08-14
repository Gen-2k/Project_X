# @project/server — NestJS Backend Application

Production-grade REST API service for Project X, built with **NestJS 11**, **Express 5**, **Prisma 7**, and **PostgreSQL**.

---

## 🏛 Architecture Overview

```
apps/server/src/
├── common/
│   └── filters/
│       └── all-exceptions.filter.ts   # Global sanitized error filter
├── database/
│   ├── prisma.module.ts               # Global Prisma provider
│   └── prisma.service.ts              # pg.Pool + @prisma/adapter-pg
├── health/
│   ├── health.controller.ts           # Terminus DB health check
│   └── health.module.ts
├── modules/
│   ├── auth/                          # AuthController, AuthService, PasswordService, JwtStrategy
│   └── users/                         # UsersService, UsersModule
├── app.controller.ts
├── app.module.ts                      # AppModule with Zod Config, Pino, Throttler
└── main.ts                            # Bootstrap, Helmet, CORS, Swagger, CookieParser, ValidationPipe
```

---

## 🛡 Security & Defensive Controls

1. **Timing-Attack Defense**: `PasswordService.mitigateTimingAttack()` executes a dummy bcrypt comparison when an email is not found, ensuring uniform response times to prevent user enumeration.
2. **Password Length Limit**: Custom `MaxBcryptBytes` validator prevents bcrypt silent truncation at 72 UTF-8 bytes.
3. **Route-Specific Throttling**: `@Throttle({ default: { limit: 5, ttl: 60000 } })` applied to sensitive authentication routes (`/auth/login`, `/auth/register`).
4. **HTTP-Only Cookie Transport**: JWTs are transmitted exclusively in `httpOnly`, `sameSite: 'strict'` cookies with configurable `COOKIE_SECURE` flags.
5. **Sanitized Exception Handling**: `AllExceptionsFilter` masks internal database errors in production while preserving detailed structured Pino logs.

---

## 🔌 API Endpoints & Interactive Documentation

Interactive Swagger OpenAPI documentation is available at:

- **Local Dev**: [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)

### Core Endpoints

| Method | Path                    | Description                     | Access                    |
| :----- | :---------------------- | :------------------------------ | :------------------------ |
| `POST` | `/api/v1/auth/register` | Register a new user account     | Public (Throttled: 5/min) |
| `POST` | `/api/v1/auth/login`    | Authenticate & set JWT cookie   | Public (Throttled: 5/min) |
| `POST` | `/api/v1/auth/logout`   | Clear authentication cookie     | Public                    |
| `GET`  | `/api/v1/auth/me`       | Fetch authenticated profile     | Protected (JWT Cookie)    |
| `GET`  | `/api/v1/health`        | Terminus database health status | Public                    |
| `GET`  | `/api/v1/docs`          | Swagger OpenAPI UI              | Public                    |

---

## ⚙️ Environment Variables

Create `.env` in `apps/server/.env` or at the repository root:

```ini
# Application Configuration
NODE_ENV="development"
PORT="3000"
CORS_ORIGIN="http://localhost:3000,http://localhost:5173"

# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/project_x?schema=public"

# Authentication Configuration (Min 32 characters)
JWT_SECRET="super-secret-jwt-key-min-32-characters-long!"
JWT_EXPIRES_IN="1d"

# Cookie Configuration
COOKIE_SECURE="false"
```

---

## 🧪 Testing Strategy & Execution

- **Unit & Integration Tests** (95%+ Code Coverage):
  ```bash
  pnpm --filter @project/server run test
  ```
- **Coverage Report**:
  ```bash
  pnpm --filter @project/server run test:cov
  ```
- **End-to-End Test Suite** (Against PostgreSQL):
  ```bash
  pnpm --filter @project/server run test:e2e
  ```
