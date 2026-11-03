import { DEFAULT_GROUP, GROUPS, type GroupKey } from './groups';

export const RADII = [10, 25, 50] as const;
export type Radius = (typeof RADII)[number];
export const DEFAULT_RADIUS: Radius = 25;
export const MAX_PAGE = 10;

const toInteger = (value: unknown): number | null => {
  if (typeof value === 'number') return Number.isInteger(value) ? value : null;
  if (typeof value === 'string' && /^-?\d+$/.test(value)) return Number(value);
  return null;
};

export const parseId = (value: unknown): number | null => {
  const id = toInteger(value);
  return id !== null && id > 0 ? id : null;
};

export const parseRadius = (value: unknown): Radius => {
  const radius = toInteger(value);
  return RADII.find((allowed) => allowed === radius) ?? DEFAULT_RADIUS;
};

export const parseMonth = (value: unknown): number | undefined => {
  const month = toInteger(value);
  return month !== null && month >= 1 && month <= 12 ? month : undefined;
};

export const parseGroup = (value: unknown): GroupKey =>
  GROUPS.find((group) => group.key === value)?.key ?? DEFAULT_GROUP;

export const parsePage = (value: unknown): number => {
  const page = toInteger(value);
  return page !== null && page >= 1 && page <= MAX_PAGE ? page : 1;
};

export type PlaceSearch = {
  group: GroupKey;
  radius: Radius;
  month: number | undefined;
  page: number;
};

export const placeSearchSchema = (
  search: Record<string, unknown>
): PlaceSearch => ({
  group: parseGroup(search.group),
  radius: parseRadius(search.radius),
  month: parseMonth(search.month),
  page: parsePage(search.page),
});
