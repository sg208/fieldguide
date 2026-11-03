// @vitest-environment happy-dom
import { screen } from '@testing-library/react';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { describe, expect, it, vi } from 'vitest';
import { RouteError } from '../../src/components/RouteStates';
import { renderWithProviders } from '../helpers/render';

const errorProps = (error: Error): ErrorComponentProps => ({
  error,
  reset: vi.fn(),
});

describe('RouteError', () => {
  it('shows the generic error for an unknown failure', async () => {
    const props = errorProps(new Error('boom'));
    await renderWithProviders(<RouteError {...props} />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Something went wrong' })
    ).toBeInTheDocument();
    expect(screen.queryByText(/boom/)).not.toBeInTheDocument();
    expect(props.reset).not.toHaveBeenCalled();
  });

  it('explains a rate limit and retries once by itself (browser fallback)', async () => {
    const first = errorProps(new Error('Upstream rate limit reached'));
    const { unmount } = await renderWithProviders(<RouteError {...first} />);
    expect(first.reset).toHaveBeenCalledTimes(1);
    unmount();

    // A second busy page right after must not loop.
    const second = errorProps(new Error('Upstream rate limit reached'));
    await renderWithProviders(<RouteError {...second} />);
    expect(second.reset).not.toHaveBeenCalled();
    expect(
      screen.getByRole('heading', { level: 1, name: 'iNaturalist is busy' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeVisible();
  });
});
