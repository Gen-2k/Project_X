import { AlertCircle, ArrowRight, Lock, Mail } from 'lucide-react';
import type { FormEvent, JSX } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../lib/api-client';

export function LoginPage(): JSX.Element {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      void navigate('/');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to sign in. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <h2>Welcome back</h2>
        <p>Sign in to your Project X account</p>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          <AlertCircle size={18} className="alert-icon" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={(e) => void handleSubmit(e)} className="auth-form" noValidate>
        <div className="form-group">
          <label htmlFor="login-email">Email Address</label>
          <div className="input-wrapper">
            <Mail size={18} className="input-icon" />
            <input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="label-with-aside">
            <label htmlFor="login-password">Password</label>
          </div>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="btn-loading">
              <span className="spinner-sm"></span> Signing in...
            </span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="auth-card-footer">
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="link-highlight">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
