import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default fetch mock returning 401 unauthenticated for session check
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      headers: {
        get: () => 'application/json',
      },
      json: () => Promise.resolve({ message: 'Unauthorized' }),
    });
  });

  it('renders application and redirects unauthenticated user to login', async () => {
    render(<App />);

    // Unauthenticated user is redirected to login page
    expect(await screen.findByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
