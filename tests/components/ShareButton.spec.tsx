// @vitest-environment happy-dom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ShareButton } from '../../src/components/ShareButton';

// Protects: HANDOFF 6 ShareButton (native share first, else copy + "Link copied").
// Turns red if: the fallback stops announcing, or native share still copies.
// Existing tests miss it: no other spec touches navigator.share/clipboard.
const URL_TO_SHARE = 'https://fieldguide.engg.app/place/1214520?radius=25';

afterEach(() => {
  // happy-dom has no navigator.share; remove what a test defined.
  Reflect.deleteProperty(navigator, 'share');
});

describe('ShareButton', () => {
  it('copies the link and announces it when Web Share is missing', async () => {
    const user = userEvent.setup();
    // userEvent installs a clipboard stub on navigator; read back from it.
    render(<ShareButton title="Medan" url={URL_TO_SHARE} />);
    await user.click(screen.getByRole('button', { name: 'Share Medan' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Link copied');
    expect(await navigator.clipboard.readText()).toBe(URL_TO_SHARE);
  });

  it('uses the native share sheet when available, without a copy toast', async () => {
    const user = userEvent.setup();
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      value: share,
      configurable: true,
    });
    render(<ShareButton title="Medan" url={URL_TO_SHARE} />);
    await user.click(screen.getByRole('button', { name: 'Share Medan' }));
    expect(share).toHaveBeenCalledWith({
      title: 'Medan',
      text: undefined,
      url: URL_TO_SHARE,
    });
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });
});
