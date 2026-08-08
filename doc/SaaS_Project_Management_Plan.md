# Comprehensive Product Requirements & Development Plan
## SaaS Project Management Platform (Linear/Jira Clone)

This document serves as the single source of truth for the project, detailing the architecture, database schema, API endpoints, frontend views, and a granular phase-by-phase feature breakdown.

---

## 1. System Architecture & Tech Stack Details
- **Frontend Workspace (`/client`)**
  - **Core:** React (Vite), TypeScript
  - **Routing:** React Router v6
  - **UI Components:** Shadcn UI (Tailwind + Radix primitives)
  - **Forms:** `react-hook-form` + `zod`
  - **State Management:** 
    - Server State: `@tanstack/react-query` (Caching, Optimistic UI updates)
    - Client State: `zustand` (User session, Theme preferences, Active workspace)
  - **Drag and Drop:** `@dnd-kit/core`
  - **Rich Text Editor:** TipTap or React-Quill

- **Backend Workspace (`/server`)**
  - **Core:** Node.js, NestJS, TypeScript
  - **Database:** PostgreSQL (Running via local system installation)
  - **ORM:** Prisma
  - **Authentication:** Passport.js (JWT Strategy), bcrypt. JWTs stored securely in HTTP-only cookies.
  - **Validation:** `class-validator` and `class-transformer`

---

## 2. Detailed Database Schema (Prisma Approach)

The core data model is highly relational. Below is the proposed schema structure:

```prisma
model User {
  id             String      @id @default(uuid())
  email          String      @unique
  passwordHash   String
  name           String
  avatarUrl      String?
  createdAt      DateTime    @default(now())
  
  // Relations
  ownedWorkspaces Workspace[] @relation("WorkspaceOwner")
  memberships     WorkspaceMember[]
  assignedTasks   Task[]      @relation("TaskAssignee")
  comments        Comment[]
}

model Workspace {
  id          String      @id @default(uuid())
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
  id          String    @id @default(uuid())
  workspaceId String
  userId      String
  role        Role      @default(MEMBER) // Enum: OWNER, ADMIN, MEMBER

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
}

model Project {
  id          String    @id @default(uuid())
  name        String
  key         String    @unique // e.g., "ENG", "MKT" (used for task prefixes like ENG-12)
  workspaceId String
  
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  tasks       Task[]
}

model Task {
  id          String    @id @default(uuid())
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
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  taskId    String
  authorId  String
  createdAt DateTime @default(now())

  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```

---

## 3. Core API Architecture (REST & GraphQL)

### REST Endpoints (Auth & File Uploads)
- `POST /auth/register` - Create new user
- `POST /auth/login` - Authenticate and return JWT
- `GET /auth/me` - Get current user profile (JWT required)
- `POST /upload` - Handle file attachments

### GraphQL API (NestJS Code-First)
The core data layer uses GraphQL for flexible, deeply-nested data fetching and mutations.

#### Queries (Fetching Data)
- `workspaces` - List workspaces user belongs to
- `workspace(id)` - Get workspace details, nested projects, and members
- `projects(workspaceId)` - List all projects in a workspace
- `project(id)` - Get project details
- `tasks(projectId, filters)` - List tasks with specific filters (status, assignee)
- `task(id)` - Get detailed task info, comments, and history

#### Mutations (Modifying Data)
- `createWorkspace(...)`
- `inviteMember(workspaceId, email, role)`
- `createProject(...)`
- `createTask(...)`
- `updateTask(id, input)` - Used for drag-and-drop, reassignment
- `deleteTask(id)`
- `addComment(taskId, content)`

#### Subscriptions (Real-time)
- `taskUpdated(projectId)` - Pushes delta updates when a task changes status/assignee to keep the Kanban board in sync live.

---

## 4. Frontend Architecture & Views

### Public Routes
- **`/login`**: JWT Authentication form.
- **`/register`**: Account creation form.

### Protected Routes (Requires Auth)
- **`/` (Dashboard)**: Lists recent Workspaces and assigned tasks across all projects.
- **`/:workspaceId`**: 
  - Sidebar: Shows all Projects in the Workspace, Members list.
  - Main Area: Activity feed or Workspace settings.
- **`/:workspaceId/projects/:projectId` (The Core View)**:
  - **Header**: Project name, Filter bar (Filter by Assignee, Status, Priority).
  - **Board View**: 4-5 columns representing `Status`. Tasks are rendered as draggable cards.
  - **List View**: A data-table alternative to the Kanban board.
- **Task Modal (`?taskId=123`)**: Opens over the board. Shows full description, activity history, and comments.

---

## 5. Granular Phase-by-Phase Execution Plan

### Phase 1: Foundation & Security
*Focus: Getting the servers talking, database connected, and users secured.*
- [ ] Initialize PostgreSQL database and apply Prisma schema.
- [ ] Setup NestJS Validation Pipes globally.
- [ ] Implement REST AuthController and AuthService.
- [ ] Create JWT Strategy for route protection.
- [ ] Setup GraphQL Module in NestJS (Apollo Server).
- [ ] Frontend: Setup Apollo Client (or React Query with graphql-request).
- [ ] Frontend: Setup Axios interceptors for REST auth endpoints.
- [ ] Frontend: Build Login/Register screens and store JWT securely.

### Phase 2: Multi-Tenancy (Workspaces & Projects)
*Focus: Organizing data so users only see what belongs to them.*
- [ ] Build Workspace GraphQL Resolvers (Queries & Mutations).
- [ ] Implement GraphQL RBAC Guard: Protect queries/mutations based on `WorkspaceMember` roles.
- [ ] Build Project GraphQL Resolvers.
- [ ] Frontend: Build the primary App Shell (Sidebar, Top Nav).
- [ ] Frontend: Build Workspace creation modal and Dashboard lists.

### Phase 3: The Engine (Task Management & Kanban)
*Focus: The heavy lifting of the UI and complex state management.*
- [ ] Build Task GraphQL Resolvers.
- [ ] Frontend: Implement GraphQL queries for fetching tasks efficiently (avoiding N+1).
- [ ] Frontend: Build the Kanban Board UI using `@dnd-kit/core`.
- [ ] Frontend: Implement Drag-and-Drop logic.
  - *Crucial detail:* Implement **Optimistic Updates** in the client cache (Apollo or React Query). When a user drops a card, update the UI state instantly, send the `updateTask` mutation to the server, and rollback if it fails.

### Phase 4: Collaboration & Depth
*Focus: Making it a real product.*
- [ ] Task Modal: Build the detailed view for a single task.
- [ ] Comments: Build the backend API and frontend UI for commenting on tasks.
- [ ] Task Filtering: Build client-side filtering (e.g., clicking "My Issues" filters the board).
- [ ] Member Management: Allow Workspace Owners to add new users via email to their workspace.

### Phase 5: Future AI & Pro Features
- [ ] **AI Task Breakdown:** Send a task description to OpenAI to generate an array of sub-tasks, then bulk-create those sub-tasks.
- [ ] **Real-time Engine:** Implement GraphQL Subscriptions (`taskUpdated`) via WebSockets so team members see cards moving live on the Kanban board without manual refresh.
