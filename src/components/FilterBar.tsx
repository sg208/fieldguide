import type { ReactNode } from 'react';
import type { GroupKey } from '../lib/groups';
import { monthLabel } from '../lib/months';
import { RADII, type Radius } from '../lib/validation';
import { GroupTabs } from './GroupTabs';

export type FilterPatch = {
  group?: GroupKey;
  radius?: Radius;
  month?: number | undefined;
};

type Props = {
  group: GroupKey;
  radius: Radius;
  month: number | undefined;
  /** 1-12, the month the switch offers while no month is chosen. */
  currentMonth: number;
  onChange: (patch: FilterPatch) => void;
};

/** Sticky filter form: group chips, radius scale bar, month switch (HANDOFF 6). */
export const FilterBar = ({
  group,
  radius,
  month,
  currentMonth,
  onChange,
}: Props): ReactNode => {
  const shownMonth = month ?? currentMonth;
  return (
    <form
      aria-label="Filter species"
      onSubmit={(event) => event.preventDefault()}
      className="sticky top-0 z-10 border-b border-rule bg-board"
    >
      <div className="wrap grid gap-2.5 py-3 lg:gap-3">
        <GroupTabs
          value={group}
          onChange={(next) => onChange({ group: next })}
        />
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2.5 lg:justify-start lg:gap-x-12">
          <fieldset className="m-0 flex min-w-0 items-center gap-2.5 border-0 p-0">
            <legend className="field float-left mr-2.5 p-0">Radius</legend>
            <div className="relative ml-1 grid h-11 grid-cols-[repeat(3,64px)]">
              <span
                aria-hidden="true"
                className="mono absolute top-0.5 left-0 -translate-x-1/2 text-xs text-ink-2"
              >
                0
              </span>
              {RADII.map((value, index) => (
                <label
                  key={value}
                  className="relative flex cursor-pointer flex-col justify-end"
                >
                  <input
                    type="radio"
                    name="radius"
                    value={value}
                    checked={radius === value}
                    onChange={() => onChange({ radius: value })}
                    className="peer absolute inset-0 m-0 size-full cursor-pointer opacity-0"
                  />
                  <span className="sr-only">{value} km</span>
                  <span
                    aria-hidden="true"
                    className="mono absolute top-0.5 right-[-1px] translate-x-1/2 text-xs text-ink-2 peer-checked:font-bold peer-checked:text-ink"
                  >
                    {value}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-2.5 border border-ink ${index === 0 ? '' : 'border-l-0'} ${
                      value <= radius ? 'bg-ink' : 'bg-sheet'
                    } peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-stamp`}
                  />
                </label>
              ))}
            </div>
            <span
              aria-hidden="true"
              className="mono -mb-0.5 self-end text-xs text-ink-2"
            >
              km
            </span>
          </fieldset>
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 text-[0.9375rem] font-medium">
            <input
              type="checkbox"
              role="switch"
              name="month"
              value={shownMonth}
              checked={month !== undefined}
              onChange={(event) =>
                onChange({
                  month: event.target.checked ? shownMonth : undefined,
                })
              }
              className="relative m-0 h-[26px] w-11 flex-none cursor-pointer appearance-none rounded-[13px] border border-edge bg-sheet transition-colors after:absolute after:top-[3px] after:left-[3px] after:size-[18px] after:rounded-full after:bg-edge after:transition-transform after:duration-[180ms] after:ease-settle after:content-[''] checked:border-stamp checked:bg-stamp checked:after:translate-x-[18px] checked:after:bg-on-stamp"
            />
            <span>{monthLabel(shownMonth)} only</span>
          </label>
        </div>
      </div>
    </form>
  );
};
