// A static table: Intl would differ between Worker, browser and ICU builds.
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

/** English month name for 1-12; empty string outside that range. */
export const monthLabel = (month: number): string => MONTHS[month - 1] ?? '';
