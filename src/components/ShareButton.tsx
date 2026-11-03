import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CheckIcon, ShareIcon } from './icons';

type Props = {
  /** What is being shared, e.g. "Medan". Accessible name is "Share {title}". */
  title: string;
  /** Canonical URL including the current filters. */
  url: string;
  /** Optional share sheet text. */
  text?: string;
  /** Button classes; defaults to the outlined `btn`. */
  className?: string;
};

const TOAST_MS = 2500;
const COPIED = 'Link copied';
const COPY_FAILED = 'Couldn’t copy. The link is in your address bar.';

const isAbort = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

/**
 * Web Share API when present, else copy the link and confirm in a polite
 * live region. Icon-only on phones, labelled from 640px.
 */
export const ShareButton = ({
  title,
  url,
  text,
  className = 'btn',
}: Props): ReactNode => {
  const [message, setMessage] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => (): void => clearTimeout(timer.current), []);

  const announce = (next: string): void => {
    setMessage(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(''), TOAST_MS);
  };

  const copyLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(url);
      announce(COPIED);
    } catch {
      announce(COPY_FAILED);
    }
  };

  const handleShare = async (): Promise<void> => {
    if (typeof navigator.share !== 'function') {
      await copyLink();
      return;
    }
    try {
      await navigator.share({ title, text, url });
    } catch (error) {
      if (!isAbort(error)) await copyLink();
    }
  };

  return (
    <>
      <button
        type="button"
        className={className}
        aria-label={`Share ${title}`}
        onClick={handleShare}
      >
        <ShareIcon />
        <span className="hidden sm:inline" aria-hidden="true">
          Share
        </span>
      </button>
      {/* One live region, always mounted so the announcement is read. */}
      <div role="status" className="contents">
        {message !== '' && (
          <p className="fixed bottom-[max(16px,env(safe-area-inset-bottom))] left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-control bg-ink px-4 py-3 text-sm font-medium text-board transition-[opacity,translate] duration-[180ms] ease-settle starting:translate-y-3 starting:opacity-0 sm:left-4 sm:translate-x-0">
            {message === COPIED && <CheckIcon />}
            {message}
          </p>
        )}
      </div>
    </>
  );
};
