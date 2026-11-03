import type { ReactNode } from 'react';
import { GROUPS, type GroupKey } from '../lib/groups';

type Props = {
  value: GroupKey;
  onChange: (group: GroupKey) => void;
};

/** HANDOFF GroupChips: single-select radio group; arrow keys move and select. */
export const GroupTabs = ({ value, onChange }: Props): ReactNode => (
  <fieldset className="m-0 min-w-0 border-0 p-0">
    <legend className="sr-only">Species group</legend>
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-0.5 [scrollbar-width:none] md:-mx-8 md:px-8 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
      {GROUPS.map((group) => (
        <label key={group.key} className="relative flex-none">
          <input
            type="radio"
            name="group"
            value={group.key}
            checked={value === group.key}
            onChange={() => onChange(group.key)}
            className="peer absolute inset-0 m-0 size-full cursor-pointer opacity-0"
          />
          <span className="inline-flex min-h-11 items-center whitespace-nowrap rounded-chip border border-edge bg-sheet px-3.5 text-[0.9375rem] font-medium peer-checked:border-stamp peer-checked:bg-stamp peer-checked:text-on-stamp peer-hover:border-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-stamp peer-checked:peer-hover:border-stamp">
            {group.label}
          </span>
        </label>
      ))}
    </div>
  </fieldset>
);
