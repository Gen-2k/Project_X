# @project/client — React Frontend Application

Modern Single Page Application (SPA) for Project X, built with **React 19**, **Vite**, **TypeScript**, **React Router v7**, and **TanStack Query**.

---

## 🏛 Architecture Overview

```
apps/client/src/
├── components/
│   ├── Navbar.tsx             # Application navigation & session status
│   ├── ProtectedRoute.tsx     # Guard ensuring user authentication
│   └── PublicRoute.tsx        # Redirects authenticated users from login
├── context/
│   └── AuthContext.tsx        # Session state provider (HTTP-only cookie transport)
├── hooks/
│   └── useAuth.ts             # Typed consumer hook for AuthContext
├── layouts/
│   ├── AuthLayout.tsx         # Centered branded layout for login/register
│   └── DashboardLayout.tsx    # App shell with navbar and main container
├── lib/
│   └── api-client.ts          # Centralized fetch wrapper with credentials
├── pages/
│   ├── DashboardPage.tsx      # Authenticated landing view & roadmap
│   ├── LoginPage.tsx          # Accessible sign-in form
│   └── RegisterPage.tsx       # Account registration form
├── App.tsx                    # QueryClient & Router definition
├── index.css                  # Core design tokens & typography
└── main.tsx                   # React 19 root mount
```

---

## 🧭 Routing Matrix

| Route       | Component          | Access Control | Description                     |
| :---------- | :----------------- | :------------- | :------------------------------ |
| `/login`    | `LoginPage`        | Public Only    | Sign in with email & password   |
| `/register` | `RegisterPage`     | Public Only    | Create a new user account       |
| `/`         | `DashboardPage`    | Protected      | Authenticated session dashboard |
| `*`         | `Navigate to="/" ` | Fallback       | Catch-all redirect              |

---

## 🔐 State Management & Authentication

- **Server State**: Managed by **TanStack Query** (`@tanstack/react-query`) with automatic background refetching and caching.
- **Client Session**: Handled via `AuthContext` and `apiClient`. Cookies are transferred transparently using `credentials: 'include'`.
- On initial mount, `AuthContext` calls `GET /api/v1/auth/me` to automatically restore active sessions without storing tokens in vulnerable `localStorage`.

---

## 🧪 Testing Strategy

- **Vitest 3** + **React Testing Library** + **jsdom**:
  ```bash
  pnpm --filter @project/client run test
  ```
- **Interactive Watch Mode**:
  ```bash
  pnpm --filter @project/client run test:watch
  ```

---

## 🚀 Local Development & Production Build

```bash
# Start development server on port 5173
pnpm --filter @project/client run dev

# Compile TypeScript & production bundle
pnpm --filter @project/client run build

# Preview production build locally
pnpm --filter @project/client run preview
```

---

## 🐳 Containerization

In production containers, the client is served via `nginxinc/nginx-unprivileged:alpine` on unprivileged port `8080` with SPA fallback routing configured in `nginx.conf`.
