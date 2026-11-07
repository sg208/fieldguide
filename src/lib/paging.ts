import { MAX_PAGE } from './validation';

export const PER_PAGE = 30;
export const LIST_CAP = PER_PAGE * MAX_PAGE;

export const totalPagesFor = (total: number): number =>
  Math.min(Math.ceil(total / PER_PAGE), MAX_PAGE);
