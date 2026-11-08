import { notFound } from '@tanstack/react-router';
import { parseId } from './validation';

// An id that is not a positive integer can never exist: answer 404, not 500.
export const requireId = (value: unknown): number => {
  const id = parseId(value);
  if (id === null) throw notFound();
  return id;
};
