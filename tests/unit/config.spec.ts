import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// wrangler.jsonc allows comments and trailing commas
const parseJsonc = (text: string): Record<string, unknown> =>
  JSON.parse(text.replace(/,(\s*[}\]])/g, '$1'));

const wrangler = parseJsonc(readFileSync('wrangler.jsonc', 'utf8'));

describe('wrangler.jsonc', () => {
  it('serves fieldguide.engg.app as a custom domain', () => {
    expect(wrangler.routes).toEqual([
      { pattern: 'fieldguide.engg.app', custom_domain: true },
    ]);
  });

  it('disables workers.dev and preview URLs', () => {
    expect(wrangler.workers_dev).toBe(false);
    expect(wrangler.preview_urls).toBe(false);
  });

  it('pins a compatibility date and the Start server entry', () => {
    expect(wrangler.compatibility_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(wrangler.main).toBe('@tanstack/react-start/server-entry');
  });
});
