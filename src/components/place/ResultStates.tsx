import type { ReactNode } from 'react';
import { GROUPS, type GroupKey } from '../../lib/groups';
import type { Radius } from '../../lib/validation';
import { REPO_URL } from '../../lib/site';
import { RetryIcon } from '../icons';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const monthLabel = (month: number): string => MONTHS[month - 1] ?? '';

const NEXT_RADIUS: Record<Radius, Radius | null> = { 10: 25, 25: 50, 50: null };

export const groupLabel = (group: GroupKey): string =>
  GROUPS.find((entry) => entry.key === group)?.label ?? 'All';

const Block = ({
  title,
  children,
  actions,
  isAlert,
}: {
  title: string;
  children: ReactNode;
  actions: ReactNode;
  isAlert: boolean;
}): ReactNode => (
  <div
    role={isAlert ? 'alert' : 'status'}
    className={`grid max-w-[640px] gap-3 rounded-sheet bg-sheet p-5 shadow-sheet ${
      isAlert ? 'border-t-[3px] border-redlist' : ''
    }`}
  >
    <h3 className="text-h2">{title}</h3>
    <p className="max-w-[56ch] text-ink-2">{children}</p>
    <div className="mt-1 flex flex-wrap gap-2">{actions}</div>
  </div>
);

type EmptyProps = {
  placeName: string;
  group: GroupKey;
  radius: Radius;
  month: number | undefined;
  onWiden: (radius: Radius) => void;
  onAllMonths: () => void;
  onAllGroups: () => void;
};

/** HANDOFF 8.3 empty state: filtered list with zero species. */
export const EmptyState = ({
  placeName,
  group,
  radius,
  month,
  onWiden,
  onAllMonths,
  onAllGroups,
}: EmptyProps): ReactNode => {
  const next = NEXT_RADIUS[radius];
  const isFiltered = group !== 'all' || month !== undefined;
  const noun = group === 'all' ? 'species' : groupLabel(group).toLowerCase();
  const inMonth = month === undefined ? '' : ` in ${monthLabel(month)}`;
  const title = isFiltered
    ? `No ${noun} on record here yet`
    : `Nothing recorded near ${placeName} yet`;
  const body = isFiltered
    ? `Nobody has shared a research-grade ${noun} observation within ${radius} km of ${placeName}${inMonth}. Try a wider radius or any month.`
    : `No one has shared research-grade observations within ${radius} km. iNaturalist coverage is thin in some places; a wider radius often helps.`;
  return (
    <Block
      title={title}
      isAlert={false}
      actions={
        <>
          {next !== null && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onWiden(next)}
            >
              Widen to {next} km
            </button>
          )}
          {month !== undefined && (
            <button type="button" className="btn" onClick={onAllMonths}>
              Show all months
            </button>
          )}
          {next === null && month === undefined && group !== 'all' && (
            <button type="button" className="btn" onClick={onAllGroups}>
              Show all groups
            </button>
          )}
        </>
      }
    >
      {body}
    </Block>
  );
};

/** HANDOFF 8.3: HTTP 429 from iNaturalist, or any other failure. Error text is never shown. */
export const ErrorState = ({
  isRateLimited,
  onRetry,
}: {
  isRateLimited: boolean;
  onRetry: () => void;
}): ReactNode => (
  <Block
    isAlert
    title={
      isRateLimited
        ? 'iNaturalist is busy right now'
        : 'We couldn’t load these species'
    }
    actions={
      <>
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          <RetryIcon />
          Try again
        </button>
        {!isRateLimited && (
          <a className="btn" href={`${REPO_URL}/issues`}>
            Report on GitHub
          </a>
        )}
      </>
    }
  >
    {isRateLimited
      ? 'iNaturalist asked us to slow down. Your filters are kept; try again in a minute.'
      : 'The species list didn’t arrive. It’s usually brief. If it keeps happening, tell us on GitHub.'}
  </Block>
);
