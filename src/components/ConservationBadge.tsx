import type { ReactNode } from 'react';

const STATUSES: Record<string, { code: string; word: string }> = {
  'critically endangered': { code: 'CR', word: 'Critically endangered' },
  endangered: { code: 'EN', word: 'Endangered' },
  vulnerable: { code: 'VU', word: 'Vulnerable' },
  'near threatened': { code: 'NT', word: 'Near threatened' },
  'least concern': { code: 'LC', word: 'Least concern' },
  'data deficient': { code: 'DD', word: 'Data deficient' },
  'extinct in the wild': { code: 'EW', word: 'Extinct in the wild' },
  extinct: { code: 'EX', word: 'Extinct' },
};
const THREATENED = new Set(['CR', 'EN', 'VU']);

export const conservationFor = (
  statusName: string | null
): { code: string; word: string; isThreatened: boolean } | null => {
  // Accepts the IUCN code ("EN", what iNaturalist returns) or the lowercase name.
  const key = statusName?.trim().toLowerCase() ?? '';
  const status =
    STATUSES[key] ??
    Object.values(STATUSES).find((entry) => entry.code.toLowerCase() === key);
  return status
    ? { ...status, isThreatened: THREATENED.has(status.code) }
    : null;
};

/** Global IUCN status stamp (HANDOFF "StatusStamp"). Threatened = red double rule; others use ink. */
export const ConservationBadge = ({
  statusName,
}: {
  statusName: string | null;
}): ReactNode => {
  const status = conservationFor(statusName);
  if (!status) return null;
  const tone = status.isThreatened
    ? 'border-redlist text-redlist'
    : 'border-ink text-ink';
  return (
    <div className="mt-5">
      <p
        className={`inline-grid grid-cols-[auto_auto] items-center rounded-label border-2 p-0.5 ${tone}`}
      >
        <span className="sr-only">IUCN Red List status: {status.word}</span>
        <span
          aria-hidden="true"
          className="mono border border-current px-2.5 py-1.5 font-bold"
        >
          {status.code}
        </span>
        <span
          aria-hidden="true"
          className="border border-current px-2.5 py-1.5 text-sm font-bold tracking-[0.06em] uppercase"
        >
          {status.word}
        </span>
      </p>
      <p className="mt-1.5 text-xs text-ink-2">IUCN Red List status</p>
    </div>
  );
};
