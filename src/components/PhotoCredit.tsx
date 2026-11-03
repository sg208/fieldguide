import type { ReactNode } from 'react';

export type ParsedAttribution =
  | { kind: 'licensed'; name: string; licence: string }
  | { kind: 'reserved'; name: string }
  | { kind: 'public-domain'; licence: string }
  | { kind: 'verbatim'; text: string };

/** iNaturalist appends ", uploaded by login" to credits; we never show it. */
const stripUploader = (attribution: string): string =>
  attribution.replace(/,\s*uploaded by\s.*$/i, '').trim();

/** HANDOFF 7.2: parse an iNaturalist attribution string; unknown shapes stay verbatim. */
export const parseAttribution = (attribution: string): ParsedAttribution => {
  const text = stripUploader(attribution);
  const licensed = /^\(c\)\s+(.+?),\s*some rights reserved\s*\((.+)\)$/i.exec(
    text
  );
  if (licensed?.[1] && licensed[2]) {
    return { kind: 'licensed', name: licensed[1], licence: licensed[2] };
  }
  const reserved = /^\(c\)\s+(.+?),\s*all rights reserved$/i.exec(text);
  if (reserved?.[1]) return { kind: 'reserved', name: reserved[1] };
  const publicDomain = /^no rights reserved(?:\s*\((.+)\))?$/i.exec(text);
  if (publicDomain) {
    return { kind: 'public-domain', licence: publicDomain[1] ?? 'CC0' };
  }
  return { kind: 'verbatim', text };
};

type Props = {
  /** Raw iNaturalist `attribution` string. */
  attribution: string;
  /** `card`: compact label field. `full`: the whole string (species gallery). */
  variant?: 'card' | 'full';
  className?: string;
};

const CaptionRow = ({ children }: { children: ReactNode }): ReactNode => (
  <span className="field block text-[0.6875rem]">{children}</span>
);

/**
 * Photo credit label field. Never truncated: it wraps between words, and
 * licence codes never break (`.lic`). Renders nothing for an empty string:
 * callers must not show a photo without a credit.
 */
export const PhotoCredit = ({
  attribution,
  variant = 'card',
  className,
}: Props): ReactNode => {
  if (attribution.trim() === '') return null;
  const parsed = parseAttribution(attribution);

  if (variant === 'full') {
    return (
      <p className={`text-xs text-ink ${className ?? ''}`}>
        {stripUploader(attribution)}
      </p>
    );
  }

  return (
    <div className={`grid gap-0.5 ${className ?? ''}`}>
      <CaptionRow>Photo</CaptionRow>
      {parsed.kind === 'licensed' && (
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span className="font-medium text-ink">© {parsed.name}</span>
          <span className="lic">{parsed.licence}</span>
        </span>
      )}
      {parsed.kind === 'reserved' && (
        <span className="text-xs">
          <span className="font-medium text-ink">© {parsed.name}</span>
          <span className="block text-ink-2">All rights reserved</span>
        </span>
      )}
      {parsed.kind === 'public-domain' && (
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span className="font-medium text-ink">No rights reserved</span>
          <span className="lic">{parsed.licence}</span>
        </span>
      )}
      {parsed.kind === 'verbatim' && (
        <span className="text-xs font-medium text-ink">{parsed.text}</span>
      )}
    </div>
  );
};
