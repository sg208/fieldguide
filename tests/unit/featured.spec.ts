import { describe, expect, it } from 'vitest';
import { continentFromCountry } from '../../src/lib/continents';
import { FEATURED_CITIES, formatCoordinates } from '../../src/lib/featured';

describe('featured cities', () => {
  it('lists eight unique places, La Paz being the Bolivian one', () => {
    expect(FEATURED_CITIES).toHaveLength(8);
    expect(new Set(FEATURED_CITIES.map((city) => city.geonameId)).size).toBe(8);
    const laPaz = FEATURED_CITIES.find((city) => city.name === 'La Paz');
    expect(laPaz?.geonameId).toBe(3911925);
    expect(laPaz?.country).toBe('Bolivia');
  });

  it('keeps each continent consistent with its country code', () => {
    for (const city of FEATURED_CITIES) {
      expect(city.continent, city.name).toBe(
        continentFromCountry(city.countryCode)
      );
    }
  });

  it('formats coordinates with hemisphere letters and two decimals', () => {
    expect(formatCoordinates(3.58333, 98.66667)).toBe(
      '3.58°\u202FN\u00A0\u00A098.67°\u202FE'
    );
    expect(formatCoordinates(-16.5, -68.15)).toBe(
      '16.50°\u202FS\u00A0\u00A068.15°\u202FW'
    );
  });
});
