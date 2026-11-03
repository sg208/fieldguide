// @vitest-environment happy-dom
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FilterBar } from '../../src/components/FilterBar';
import { renderWithProviders } from '../helpers/render';

// Protects: HANDOFF RadiusScale + MonthToggle (radio group, switch, patch
// emitted on change, current radius/month reflected).
// Turns red if: a control stops reporting its change or loses its name.
// Existing tests miss it: no other spec renders the filter form.
const renderBar = (
  props: Partial<Parameters<typeof FilterBar>[0]> = {}
): { onChange: ReturnType<typeof vi.fn> } => {
  const onChange = vi.fn();
  void renderWithProviders(
    <FilterBar
      group="all"
      radius={25}
      month={undefined}
      currentMonth={11}
      onChange={onChange}
      {...props}
    />
  );
  return { onChange };
};

describe('FilterBar', () => {
  it('is a labelled form with the radius preselected', async () => {
    renderBar();
    expect(
      await screen.findByRole('form', { name: 'Filter species' })
    ).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '25 km' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '10 km' })).not.toBeChecked();
  });

  it('reports a radius change', async () => {
    const user = userEvent.setup();
    const { onChange } = renderBar();
    await user.click(await screen.findByRole('radio', { name: '50 km' }));
    expect(onChange).toHaveBeenCalledWith({ radius: 50 });
  });

  it('names the month switch after the current month and reports it on', async () => {
    const user = userEvent.setup();
    const { onChange } = renderBar();
    const toggle = await screen.findByRole('switch', {
      name: 'November only',
    });
    expect(toggle).not.toBeChecked();
    await user.click(toggle);
    expect(onChange).toHaveBeenCalledWith({ month: 11 });
  });

  it('shows the chosen month and clears it when switched off', async () => {
    const user = userEvent.setup();
    const { onChange } = renderBar({ month: 3 });
    const toggle = await screen.findByRole('switch', { name: 'March only' });
    expect(toggle).toBeChecked();
    await user.click(toggle);
    expect(onChange).toHaveBeenCalledWith({ month: undefined });
  });

  it('reports a group change from the chips', async () => {
    const user = userEvent.setup();
    const { onChange } = renderBar();
    await user.click(await screen.findByRole('radio', { name: 'Birds' }));
    expect(onChange).toHaveBeenCalledWith({ group: 'birds' });
  });
});
