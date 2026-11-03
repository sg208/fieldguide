import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { placeSearchQuery } from '../queries/places';
import { CloseIcon, SearchIcon } from './icons';
import {
  PlaceResultList,
  optionId,
  statusMessage,
  type ListState,
} from './PlaceResultList';

const DEBOUNCE_MS = 250; // WHY: HANDOFF §CityCombobox, one request per pause in typing
const MIN_CHARS = 2;
const LIST_ID = 'city-list';

export const SearchBox = (): ReactNode => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const query = text.trim();
  const debounced = useDebouncedValue(query, DEBOUNCE_MS);
  const isReady = debounced.length >= MIN_CHARS;
  const search = useQuery({ ...placeSearchQuery(debounced), enabled: isReady });
  const places = search.data ?? [];

  const isShown = isOpen && query.length >= MIN_CHARS;
  const state: ListState =
    debounced !== query || search.isPending
      ? 'loading'
      : search.isError
        ? 'error'
        : places.length === 0
          ? 'empty'
          : 'results';
  const hasActive = isShown && state === 'results' && activeIndex >= 0;

  const close = (): void => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const select = (index: number): void => {
    const place = places[index];
    if (!place) return;
    close();
    void navigate({
      to: '/place/$placeId',
      params: { placeId: String(place.id) },
    });
  };

  const selectCurrent = (): void => {
    if (state !== 'results' || !isShown) return;
    if (activeIndex >= 0) select(activeIndex);
    else if (places.length === 1) select(0);
  };

  const move = (step: 1 | -1): void => {
    if (state !== 'results' || places.length === 0) return;
    setIsOpen(true);
    setActiveIndex((current) => {
      if (current < 0) return step === 1 ? 0 : places.length - 1;
      return (current + step + places.length) % places.length;
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'ArrowDown' && event.altKey) {
      event.preventDefault();
      setIsOpen(query.length >= MIN_CHARS);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      move(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      selectCurrent();
    } else if (event.key === 'Escape') {
      if (isShown) close();
      else setText('');
    } else if (event.key === 'Tab') {
      close();
    }
  };

  const handleClear = (): void => {
    setText('');
    close();
    inputRef.current?.focus();
  };

  return (
    <form
      role="search"
      className="mt-1 max-w-[680px]"
      onSubmit={(event) => {
        event.preventDefault();
        selectCurrent();
      }}
    >
      <div className="relative">
        <div className="flex items-center gap-3 border-b-[3px] border-ink focus-within:border-stamp">
          <input
            ref={inputRef}
            id="city"
            type="text"
            role="combobox"
            aria-expanded={isShown}
            aria-controls={LIST_ID}
            aria-autocomplete="list"
            aria-activedescendant={
              hasActive ? optionId(LIST_ID, activeIndex) : undefined
            }
            aria-describedby="city-hint"
            autoComplete="off"
            spellCheck={false}
            placeholder="your city?"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setActiveIndex(-1);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onBlur={close}
            className="field-hero min-w-0 w-full flex-1 border-0 bg-transparent pt-1 pb-2 text-hero font-bold tracking-[-0.03em] text-ink outline-none [font-stretch:80%] placeholder:text-ink-2 placeholder:opacity-75"
          />
          {text !== '' && (
            <button
              type="button"
              aria-label="Clear city search"
              onMouseDown={(event) => event.preventDefault()}
              onClick={handleClear}
              className="btn btn-ghost size-11 shrink-0 p-0"
            >
              <CloseIcon />
            </button>
          )}
          <SearchIcon className="!size-[clamp(28px,4vw,44px)] stroke-[2.25] text-ink" />
        </div>
        {isShown && (
          <PlaceResultList
            id={LIST_ID}
            query={query}
            state={state}
            places={places}
            activeIndex={activeIndex}
            onActivate={setActiveIndex}
          />
        )}
      </div>
      <p id="city-hint" className="mt-2.5 text-sm text-ink-2">
        <label htmlFor="city" className="field mr-1 text-ink">
          City
        </label>{' '}
        Type at least two letters, then pick from the list. Try Medan, Lagos or
        Reykjavik.
      </p>
      <p role="status" className="sr-only">
        {isShown ? statusMessage(state, query, places.length) : ''}
      </p>
    </form>
  );
};
