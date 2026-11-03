# Field Guide

What lives near any city in the world, from iNaturalist research-grade observations. Search a city, pick a radius of 10, 25 or 50 km, and browse the species recorded around it, most observed first. Live at https://fieldguide.engg.app.

## Features

- City search with a keyboard-friendly combobox, powered by Open-Meteo geocoding
- Species lists per place, filtered by group (birds, plants, insects and more), radius and month, 30 per page
- Species pages with photos, a summary, lineage, conservation status and recent sightings near the place you came from
- Every photo shows its photographer and licence
- Light and dark themes that follow the system setting
- Installable as an app; pages you opened recently still work offline
- No accounts, no cookies, no analytics

## Stack

- TanStack Start (React 19, SSR) with TanStack Router and TanStack Query
- Cloudflare Workers, through the Cloudflare Vite plugin
- Tailwind CSS v4
- Vitest and Testing Library for unit and component tests, Playwright and axe-core for end-to-end and accessibility checks
- pnpm 10, Node 24

The browser only talks to the Worker. Server functions call iNaturalist and Open-Meteo and cache the answers with the Cache API on the deployed domain.

## Scripts

```bash
pnpm install          # install dependencies
pnpm dev              # dev server
pnpm build            # production build
pnpm preview          # serve the production build
pnpm test             # unit and component tests
pnpm test:e2e         # build, serve on port 4311, run Playwright (needs network)
pnpm lint             # eslint
pnpm type-check       # generate routes, then tsc
pnpm format           # prettier --write
pnpm run deploy       # build and wrangler deploy (from main only)
pnpm routes:generate  # regenerate src/routeTree.gen.ts
```

On a fresh clone, run `pnpm routes:generate` or `pnpm type-check` once: `src/routeTree.gen.ts` is generated and not committed. The first time you run the end-to-end tests, install the browser with `pnpm exec playwright install chromium`.

See [DEPLOYMENT.md](DEPLOYMENT.md) for how the site is built and deployed.

## Credits

- Observations, species data and photos come from [iNaturalist](https://www.inaturalist.org). Only research-grade observations are used. Each photo keeps its own licence and credits its photographer on the page.
- City search by [Open-Meteo](https://open-meteo.com) geocoding, CC BY 4.0, built on [GeoNames](https://www.geonames.org) data, CC BY 4.0.
- Fonts: Archivo and Red Hat Mono, SIL Open Font License.
- Icons: [Lucide](https://lucide.dev), ISC licence.

## License

MIT. See [LICENSE](LICENSE).
