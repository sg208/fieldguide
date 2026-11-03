// @vitest-environment happy-dom
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GroupTabs } from '../../src/components/GroupTabs';
import { renderWithProviders } from '../helpers/render';

// Protects: HANDOFF GroupChips (single-select radio group in a fieldset with a
// hidden legend, all 11 groups, arrow keys select).
// Turns red if: the group list loses an entry or chips stop being radios.
// Existing tests miss it: validation.spec checks parsing, not the control.
describe('GroupTabs', () => {
  it('renders every group as a radio inside the "Species group" fieldset', async () => {
    await renderWithProviders(<GroupTabs value="birds" onChange={vi.fn()} />);
    expect(
      await screen.findByRole('group', { name: 'Species group' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(11);
    expect(screen.getByRole('radio', { name: 'Birds' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'All' })).not.toBeChecked();
  });

  it('selects the next group with the arrow key', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    await renderWithProviders(<GroupTabs value="all" onChange={onChange} />);
    (await screen.findByRole('radio', { name: 'All' })).focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('birds');
  });
});
