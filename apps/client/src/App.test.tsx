import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import App from './App';

describe('App Component', () => {
  it('renders heading and main layout', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Get started');
  });

  it('increments counter on button click', async () => {
    const user = userEvent.setup();
    render(<App />);

    const button = screen.getByRole('button', { name: /count is 0/i });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument();
  });
});
