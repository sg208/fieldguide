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
    await renderWithProviders(
      <RouteError {...errorProps(new Error('boom'))} />
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Something went wrong' })
    ).toBeInTheDocument();
    expect(screen.queryByText(/boom/)).not.toBeInTheDocument();
  });

  it('explains a rate limit after server-fn serialization (message only)', async () => {
    await renderWithProviders(
      <RouteError {...errorProps(new Error('Upstream rate limit reached'))} />
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'iNaturalist is busy' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeVisible();
  });
});
