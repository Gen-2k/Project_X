import {
  Activity,
  CheckCircle2,
  Database,
  FolderGit2,
  Kanban,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import type { JSX } from 'react';
import { useState } from 'react';

import { useAuth } from '../hooks/useAuth';

export function DashboardPage(): JSX.Element {
  const { user, refreshUser } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async (): Promise<void> => {
    setIsRefreshing(true);
    try {
      await refreshUser();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="dashboard-content">
      {/* Welcome Banner */}
      <section className="welcome-banner">
        <div className="welcome-text">
          <div className="badge badge-success mb-2">
            <ShieldCheck size={14} />
            <span>Authenticated Session Active</span>
          </div>
          <h1>Welcome back, {user?.name ?? 'Engineer'}!</h1>
          <p className="subtitle">
            Connected as <strong className="text-primary">{user?.email}</strong> (User ID:{' '}
            <code>{user?.id}</code>)
          </p>
        </div>

        <div className="welcome-actions">
          <button
            type="button"
            onClick={() => void handleRefresh()}
            className="btn btn-secondary btn-sm"
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Verify Session'}</span>
          </button>
        </div>
      </section>

      {/* Metrics & Status Grid */}
      <section className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Authentication Protocol</span>
            <div className="metric-icon bg-primary-soft text-primary">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="metric-value text-success">Active (HTTP-Only)</div>
          <p className="metric-description">SameSite: Strict + Timing Attack Guard</p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Database Engine</span>
            <div className="metric-icon bg-info-soft text-info">
              <Database size={20} />
            </div>
          </div>
          <div className="metric-value">Prisma 7.9</div>
          <p className="metric-description">PostgreSQL Driver Adapter + UUIDv7 IDs</p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">API Gateway</span>
            <div className="metric-icon bg-warning-soft text-warning">
              <Activity size={20} />
            </div>
          </div>
          <div className="metric-value">NestJS 11</div>
          <p className="metric-description">OpenAPI Swagger + Throttler Protected</p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Frontend Framework</span>
            <div className="metric-icon bg-accent-soft text-accent">
              <Sparkles size={20} />
            </div>
          </div>
          <div className="metric-value">React 19 + Vite</div>
          <p className="metric-description">TanStack Query + React Router v7</p>
        </div>
      </section>

      {/* Project Roadmap & Execution Plan Preview */}
      <section className="roadmap-section">
        <div className="section-header">
          <div>
            <h2>SaaS Platform Roadmap</h2>
            <p>Phase-by-phase feature development matrix</p>
          </div>
          <span className="badge badge-outline">In Active Development</span>
        </div>

        <div className="roadmap-grid">
          {/* Phase 1 */}
          <div className="roadmap-card card-completed">
            <div className="card-status-badge status-done">
              <CheckCircle2 size={14} />
              <span>Phase 1: Completed</span>
            </div>
            <h3>Core Security & Auth Foundation</h3>
            <p>
              JWT Authentication via HTTP-only cookies, password timing attack defense, 85%+ backend
              test coverage, and OpenAPI documentation.
            </p>
            <ul className="feature-checklist">
              <li className="item-checked">REST Auth Controllers & Services</li>
              <li className="item-checked">Bcrypt 72-Byte Truncation Guard</li>
              <li className="item-checked">Global Exception Sanitization</li>
              <li className="item-checked">Swagger UI Interactive Docs</li>
            </ul>
          </div>

          {/* Phase 2 */}
          <div className="roadmap-card card-active">
            <div className="card-status-badge status-next">
              <Users size={14} />
              <span>Phase 2: Next</span>
            </div>
            <h3>Multi-Tenancy & Workspaces</h3>
            <p>
              Organization management, workspace memberships, RBAC permissions, and team member
              invitation flows.
            </p>
            <ul className="feature-checklist">
              <li>Workspace & WorkspaceMember Prisma Models</li>
              <li>Multi-Tenant Isolation Guards</li>
              <li>Role-Based Access Control (Owner, Admin, Member)</li>
              <li>Organization Switching & Dashboard</li>
            </ul>
          </div>

          {/* Phase 3 */}
          <div className="roadmap-card">
            <div className="card-status-badge status-upcoming">
              <Kanban size={14} />
              <span>Phase 3: Upcoming</span>
            </div>
            <h3>Task Engine & Kanban Boards</h3>
            <p>
              Interactive Linear/Jira-style board views with optimistic drag-and-drop updates using
              @dnd-kit.
            </p>
            <ul className="feature-checklist">
              <li>Project & Task Relational Schemas</li>
              <li>Interactive Kanban Columns & Filters</li>
              <li>Optimistic UI Mutations via React Query</li>
              <li>Task Modal with Comments & Activity Feed</li>
            </ul>
          </div>

          {/* Phase 4 */}
          <div className="roadmap-card">
            <div className="card-status-badge status-upcoming">
              <FolderGit2 size={14} />
              <span>Phase 4: Future</span>
            </div>
            <h3>Real-Time & AI Features</h3>
            <p>
              Live board synchronization via WebSockets and AI-powered task breakdowns using LLMs.
            </p>
            <ul className="feature-checklist">
              <li>WebSocket / SSE Delta Synchronization</li>
              <li>Automated Sub-Task Generation</li>
              <li>Audit Logs & Advanced Filtering</li>
              <li>Production Cloud Deployments</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
