import { BookOpen, Layers, LogOut, User } from 'lucide-react';
import type { JSX } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export function Navbar(): JSX.Element {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-group">
          <Link to="/" className="brand-link">
            <div className="brand-icon">
              <Layers size={22} className="text-primary" />
            </div>
            <span className="brand-name">Project X</span>
          </Link>
          <span className="badge badge-accent">Enterprise SDLC</span>
        </div>

        <div className="nav-actions">
          <a
            href="http://localhost:3000/api/v1/docs"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
            title="Open Swagger OpenAPI Documentation"
          >
            <BookOpen size={16} />
            <span>API Docs</span>
          </a>

          {user && (
            <div className="user-profile-menu">
              <div className="user-badge" title={user.email}>
                <div className="avatar-circle">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.name ?? 'User'}</span>
                  <span className="user-email">{user.email}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void logout()}
                className="btn btn-ghost btn-sm"
                title="Log out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
