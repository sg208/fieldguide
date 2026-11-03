import type { ReactNode } from 'react';

type Props = {
  /** Output of `sanitizeHtml()` (src/lib/sanitize.ts). Never pass raw API strings. */
  sanitizedHtml: string;
  className?: string;
};

/** The only place in the app allowed to inject HTML. */
export const SafeHtml = ({ sanitizedHtml, className }: Props): ReactNode => (
  <div
    className={className}
    dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
  />
);
