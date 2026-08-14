import { AlertCircle, ArrowRight, Check, Lock, Mail, User } from 'lucide-react';
import type { FormEvent, JSX } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../lib/api-client';

export function RegisterPage(): JSX.Element {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email.trim(), password, name.trim());
      void navigate('/');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <h2>Create an account</h2>
        <p>Get started with Project X SaaS platform</p>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          <AlertCircle size={18} className="alert-icon" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={(e) => void handleSubmit(e)} className="auth-form" noValidate>
        <div className="form-group">
          <label htmlFor="register-name">Full Name</label>
          <div className="input-wrapper">
            <User size={18} className="input-icon" />
            <input
              id="register-name"
              type="text"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="register-email">Email Address</label>
          <div className="input-wrapper">
            <Mail size={18} className="input-icon" />
            <input
              id="register-email"
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
          <label htmlFor="register-password">Password</label>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input
              id="register-password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="input-hint">
            <Check size={14} className={password.length >= 6 ? 'text-success' : 'text-muted'} />
            <span className={password.length >= 6 ? 'text-success' : 'text-muted'}>
              Minimum 6 characters
            </span>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="btn-loading">
              <span className="spinner-sm"></span> Creating account...
            </span>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="auth-card-footer">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="link-highlight">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
