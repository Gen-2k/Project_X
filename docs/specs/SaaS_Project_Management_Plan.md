# Comprehensive Product Requirements & Development Plan

## SaaS Project Management Platform (Linear/Jira Clone)

This document serves as the single source of truth for the project, detailing the architecture, database schema, API endpoints, frontend views, and a granular phase-by-phase feature breakdown.

---

## 1. System Architecture & Tech Stack Details

- **Frontend Workspace (`/client`)**
  - **Core:** React 19 (Vite), TypeScript
  - **Routing:** React Router v7
  - **UI Components:** Modern accessible CSS design system
  - **Forms:** React form handling + Client Validation + Shared DTOs
  - **State Management:**
    - Server State: `@tanstack/react-query` (Caching, Background Sync, Optimistic UI updates)
    - Client State: `AuthContext` (User session, HTTP-only Cookie transport)
  - **Icons:** `lucide-react`
  - **Drag and Drop (Phase 3):** `@dnd-kit/core`

- **Backend Workspace (`/server`)**
  - **Core:** Node.js 20+, NestJS 11, Express 5, TypeScript
  - **Database:** PostgreSQL (Docker Compose or local instance)
  - **ORM:** Prisma 7 with PostgreSQL Driver Adapter (`@prisma/adapter-pg`)
  - **Authentication:** Passport.js (JWT Strategy), bcrypt. JWTs stored securely in HTTP-only cookies.
  - **Security:** Timing-attack dummy hash mitigation, bcrypt 72-byte truncation validator, Throttler rate limiting, Helmet, sanitized exception filters.
  - **Documentation:** OpenAPI / Swagger UI at `/api/v1/docs`.
  - **Validation:** `class-validator` and `class-transformer`

---

## 2. Detailed Database Schema (Prisma Approach)

The core data model is highly relational. Below is the proposed schema structure:

```prisma
model User {
  id             String      @id @default(uuid(7))
  email          String      @unique
  passwordHash   String
  name           String?
  avatarUrl      String?
  createdAt      DateTime    @default(now())

  // Relations (Phases 2-4)
  ownedWorkspaces Workspace[] @relation("WorkspaceOwner")
  memberships     WorkspaceMember[]
  assignedTasks   Task[]      @relation("TaskAssignee")
  comments        Comment[]
}

model Workspace {
  id          String      @id @default(uuid(7))
  name        String
  description String?
  ownerId     String
  createdAt   DateTime    @default(now())

  // Relations
  owner       User              @relation("WorkspaceOwner", fields: [ownerId], references: [id])
  members     WorkspaceMember[]
  projects    Project[]
}

model WorkspaceMember {
  id          String    @id @default(uuid(7))
  workspaceId String
  userId      String
  role        Role      @default(MEMBER) // Enum: OWNER, ADMIN, MEMBER

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
  @@index([workspaceId, userId])
}

model Project {
  id          String    @id @default(uuid(7))
  name        String
  key         String    @unique // e.g., "ENG", "MKT" (used for task prefixes like ENG-12)
  workspaceId String

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  tasks       Task[]

  @@index([workspaceId])
}

model Task {
  id          String    @id @default(uuid(7))
  sequenceId  Int       @default(autoincrement()) // For generating readable IDs like "ENG-12"
  title       String
  description String?
  status      Status    @default(TODO) // Enum: BACKLOG, TODO, IN_PROGRESS, REVIEW, DONE
  priority    Priority  @default(MEDIUM) // Enum: LOW, MEDIUM, HIGH, URGENT

  projectId   String
  assigneeId  String?

  // Relations
  project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assignee    User?     @relation("TaskAssignee", fields: [assigneeId], references: [id])
  comments    Comment[]

  @@index([projectId, status])
  @@index([assigneeId])
}

model Comment {
  id        String   @id @default(uuid(7))
  content   String
  taskId    String
  authorId  String
  createdAt DateTime @default(now())

  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([taskId])
}
```

---

## 3. Core API Architecture (REST & Swagger)

### REST Endpoints (Auth & Platform)

- `POST /api/v1/auth/register` — Create new user account & set HTTP-only cookie
- `POST /api/v1/auth/login` — Authenticate and set HTTP-only JWT cookie
- `GET /api/v1/auth/me` — Get current user profile (JWT Cookie required)
- `POST /api/v1/auth/logout` — Clear session cookie
- `GET /api/v1/health` — Terminus API & Database health check
- `GET /api/v1/docs` — Interactive Swagger OpenAPI Documentation

---

## 4. Frontend Architecture & Views

### Public Routes

- **`/login`**: JWT Authentication form with email/password validation.
- **`/register`**: Account creation form with name, email, password strength check.

### Protected Routes (Requires Auth)

- **`/` (Dashboard)**: Authenticated landing hub showing user profile, active session status, architectural metrics, and development roadmap.
- **`/:workspaceId` (Phase 2)**: Workspace project directory and member management.
- **`/:workspaceId/projects/:projectId` (Phase 3)**: Core Kanban board and List views with drag-and-drop task manipulation.

---

## 5. Granular Phase-by-Phase Execution Plan

### Phase 1: Core Foundation & Security (Completed)

- [x] Monorepo workspace boundaries (pnpm + Turborepo 2).
- [x] PostgreSQL database connected via Prisma 7 Driver Adapter.
- [x] REST AuthController, AuthService, UsersService, PasswordService.
- [x] Timing-attack mitigation and Bcrypt 72-byte truncation protection.
- [x] OpenAPI / Swagger documentation (`/api/v1/docs`).
- [x] Frontend Auth client layer, Context, Router, Login, Register, Dashboard.
- [x] 85%+ Test coverage on backend and comprehensive frontend Vitest suite.

### Phase 2: Multi-Tenancy (Workspaces & Projects)

- [ ] Implement Workspace and WorkspaceMember Prisma migrations.
- [ ] Build Workspace CRUD controllers and RBAC guards.
- [ ] Build Project management endpoints.
- [ ] Frontend workspace switcher and organization management.

### Phase 3: Task Engine & Kanban Boards

- [ ] Implement Task and Comment schemas.
- [ ] Build Kanban board UI using `@dnd-kit/core`.
- [ ] Implement optimistic updates via `@tanstack/react-query`.
- [ ] Task detail modal and commenting.

### Phase 4: Collaboration, Real-Time & AI Features

- [ ] Real-time board synchronization via WebSockets.
- [ ] AI task breakdown using LLMs.
- [ ] Activity logs and production release pipelines.
