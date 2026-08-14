import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as useAuthModule from '../hooks/useAuth';
import { DashboardPage } from './DashboardPage';

describe('DashboardPage', () => {
  const mockRefreshUser = vi.fn();
  const mockUser = {
    id: '01912345-6789-7abc-def0-123456789abc',
    email: 'alex@example.com',
    name: 'Alex Johnson',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: mockRefreshUser,
    });
  });

  it('renders welcome banner with user name and email', () => {
    render(<DashboardPage />);

    expect(screen.getByText(/welcome back, alex johnson!/i)).toBeInTheDocument();
    expect(screen.getByText('alex@example.com')).toBeInTheDocument();
    expect(screen.getByText(mockUser.id)).toBeInTheDocument();
  });

  it('renders key architectural metric cards and roadmap', () => {
    render(<DashboardPage />);

    expect(screen.getByText('Authentication Protocol')).toBeInTheDocument();
    expect(screen.getByText('Database Engine')).toBeInTheDocument();
    expect(screen.getByText('API Gateway')).toBeInTheDocument();
    expect(screen.getByText('SaaS Platform Roadmap')).toBeInTheDocument();
  });

  it('triggers session verification when clicking Verify Session', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    const verifyBtn = screen.getByRole('button', { name: /verify session/i });
    await user.click(verifyBtn);

    expect(mockRefreshUser).toHaveBeenCalled();
  });
});
