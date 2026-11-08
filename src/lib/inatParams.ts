import { groupToIconicTaxa, type GroupKey } from './groups';
import type { SightingsParams, SpeciesCountsParams } from './inatMap';
import type { Radius } from './validation';

export type SpeciesListInput = {
  placeId: number;
  group: GroupKey;
  radius: Radius;
  month?: number;
  page: number;
};

export type SightingsInput = {
  taxonId: number;
  placeId: number;
  radius: Radius;
};

type PlaceCoordinates = { latitude: number; longitude: number };

// Shared by the Worker (src/server/fns.ts) and the browser fallback
// (src/queries/species.ts) so both ask iNaturalist the same question.
export const speciesCountsParams = (
  place: PlaceCoordinates,
  input: SpeciesListInput
): SpeciesCountsParams => ({
  lat: place.latitude,
  lng: place.longitude,
  radius: input.radius,
  iconicTaxa: groupToIconicTaxa(input.group),
  month: input.month,
  page: input.page,
});

export const sightingsParams = (
  place: PlaceCoordinates,
  input: SightingsInput
): SightingsParams => ({
  taxonId: input.taxonId,
  lat: place.latitude,
  lng: place.longitude,
  radius: input.radius,
});
