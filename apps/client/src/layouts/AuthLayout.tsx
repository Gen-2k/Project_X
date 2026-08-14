import { CheckCircle, Code2, Layers, ShieldCheck, Zap } from 'lucide-react';
import type { JSX } from 'react';
import { Outlet } from 'react-router-dom';

export function AuthLayout(): JSX.Element {
  return (
    <div className="auth-layout-container">
      <div className="auth-hero-pane">
        <div className="hero-content">
          <div className="hero-badge">
            <Layers size={18} />
            <span>Project X Monorepo</span>
          </div>

          <h1 className="hero-title">
            Enterprise Full-Stack <br />
            <span className="text-gradient">Production Architecture</span>
          </h1>

          <p className="hero-description">
            Modern SaaS Project Management platform built with strict boundary isolation, NestJS 11,
            React 19, Prisma 7, and automated SDLC workflows.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <ShieldCheck className="feature-icon text-success" size={20} />
              <div>
                <strong>Defensive Security</strong>
                <p>Timing attack mitigation, bcrypt length protection, and HTTP-only cookies.</p>
              </div>
            </div>
            <div className="feature-item">
              <Zap className="feature-icon text-warning" size={20} />
              <div>
                <strong>High Performance</strong>
                <p>Turborepo topological pipelines and UUIDv7 ordered database indices.</p>
              </div>
            </div>
            <div className="feature-item">
              <CheckCircle className="feature-icon text-info" size={20} />
              <div>
                <strong>Strict Quality Gates</strong>
                <p>ESLint 9 Flat Config, solution TSConfig, and 85%+ test coverage.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-footer">
          <Code2 size={16} />
          <span>Engineered for Reliability & Scale</span>
        </div>
      </div>

      <div className="auth-form-pane">
        <div className="auth-form-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
