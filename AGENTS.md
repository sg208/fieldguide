# AGENTS.md

- PROJECT: fieldguide — what lives near any city, from iNaturalist research-grade observations; TanStack Start + TanStack Query SSR on a Cloudflare Worker (`README.md:3`)
- STATUS: v0.1.0 built on `develop`; deploy target https://fieldguide.engg.app (sg208 account, from `main` only)
- LEARNINGS: `.enggflo/learning.md` · DECISIONS: `.enggflo/brain.md`

## Commands

Verified with pnpm 10 and Node 24 (`package.json` scripts).

```bash
pnpm install          # fresh clone: run `pnpm routes:generate` (or type-check) once — src/routeTree.gen.ts is gitignored
pnpm dev              # vite dev (workerd via @cloudflare/vite-plugin)
pnpm build            # vite build -> dist/client + dist/server
pnpm preview          # serve the production build in workerd
pnpm test             # vitest run (unit node env; component specs opt into happy-dom per file)
pnpm test:e2e         # Playwright: builds, previews on 4311, desktop + 375px mobile; real upstreams
pnpm lint             # eslint . (explicit return types are errors)
pnpm type-check       # tsr generate && tsc --noEmit
pnpm format           # prettier --write . (design/, DESIGN.md, PRODUCT.md ignored)
pnpm run deploy       # pnpm build && wrangler deploy (from main only; CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID)
```

## Task routing

| Task                   | Route                                                                      |
| ---------------------- | -------------------------------------------------------------------------- |
| feature build          | `/enggflo-ship` (commits + pushes current branch, no PR)                   |
| bug                    | `/enggflo-bugfix`                                                          |
| UI / visual            | `impeccable` skill, reading `PRODUCT.md`, `DESIGN.md`, `design/HANDOFF.md` |
| backlog item           | `/enggflo-backlog`                                                         |
| dependency review      | `/enggflo-maintenance`                                                     |
| promote develop → main | `/enggflo-release` (deploy source = `main`)                                |

## Architecture

| Concept      | Path / state                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| stack        | TanStack Start 1.169 (React 19.3) · TanStack Query 5 + `@tanstack/react-router-ssr-query` · Tailwind v4 · `@cloudflare/vite-plugin` · Vite 8 · pnpm 10 · Node 24 (`package.json`)                                                                                                                                                                                                                                                                                                                       |
| Worker       | `wrangler.jsonc` main `@tanstack/react-start/server-entry`, `nodejs_compat`, custom domain `fieldguide.engg.app`, `workers_dev:false`, `preview_urls:false`; `vite.config.ts` plugin order cloudflare(ssr) → tanstackStart → react → tailwind                                                                                                                                                                                                                                                           |
| routes       | `src/routes/`: `index` (home + city search) · `place.$placeId` (geonameId; search `group radius month page`) · `species.$taxonId` (search `place radius`) · `privacy terms accessibility credits offline` · `__root.tsx` (head, skip link, Header/Footer, 404/error)                                                                                                                                                                                                                                    |
| data layer   | `src/server/`: `upstream.ts` (8s timeout, User-Agent, 404/429 → typed errors) · `edgeCache.ts` (`caches.default`, `CACHE_SCHEMA` key prefix, stale-on-error, `waitUntil`) · `inat.ts` · `geocode.ts` (Open-Meteo; unknown id answers 400 → NotFoundError) · `fns.ts` (createServerFn + validators)                                                                                                                                                                                                      |
| queries      | `src/queries/{places,species}.ts` — queryOptions factories, keys include every filter; loaders `ensureQueryData` so SSR HTML is dehydrated                                                                                                                                                                                                                                                                                                                                                              |
| validation   | `src/lib/validation.ts` + `groups.ts` — radius {10,25,50} default 25, month 1–12, page 1–10, group whitelist → iNat iconic taxa; bad radius 307-redirects to the clean URL                                                                                                                                                                                                                                                                                                                              |
| shared lib   | single sources, import never re-declare: `src/lib/inatParams.ts` (iNat request params; Worker `fns.ts` + browser fallback) · `cacheTtl.ts` (edge TTL s; query staleTime = ×1000) · `paging.ts` (`PER_PAGE` 30, `LIST_CAP`, `totalPagesFor`) · `months.ts` (`monthLabel`) · `requireId.ts` (bad id → `notFound()`) · `offlinePages.ts` (`PAGES_CACHE`, pinned to `sw.js` by `tests/unit/sw.spec.ts`) · `securityHeaders.ts` `PHOTO_HOSTS` (CSP `img-src`; `sw.js` hosts pinned by test) <!-- enggflo --> |
| security     | `src/start.ts` requestMiddleware [csrf (serverFn only), security headers from `src/lib/securityHeaders.ts`]; `public/_headers` mirrors them for static assets (sync by hand); CSP Report-Only                                                                                                                                                                                                                                                                                                           |
| sanitizing   | `src/lib/sanitize.ts` DOM-free allowlist for Wikipedia summaries; `src/components/SafeHtml.tsx` = the only `dangerouslySetInnerHTML`                                                                                                                                                                                                                                                                                                                                                                    |
| components   | `src/components/` shared (Header, Footer, ShareButton, PhotoCredit, SpeciesCard/Grid, FilterBar, GroupTabs, Pagination, SearchBox combobox, LegalPage, SystemPage, RouteStates, icons) + `home/` `place/` `species/` page parts                                                                                                                                                                                                                                                                         |
| PWA          | `public/manifest.webmanifest`, `public/sw.js` (navigations network-first → 302 `/offline`; `/assets/*` + iNat photos cache-first; `/_serverFn/*` never), `src/components/RegisterSW.tsx` (prod only), icons from `scripts/build-icons.mjs`                                                                                                                                                                                                                                                              |
| styling      | `src/styles.css` — `@theme` tokens from `design/HANDOFF.md` §2, light + dark, Archivo + Red Hat Mono (`@fontsource-variable`)                                                                                                                                                                                                                                                                                                                                                                           |
| design       | `PRODUCT.md`, `DESIGN.md`, `design/HANDOFF.md` (wins over comps), `design/comps/*.html`, `design/screens/*.png` — herbarium specimen-cabinet direction                                                                                                                                                                                                                                                                                                                                                  |
| data sources | iNaturalist API v1 (research grade, `locale=en`), Open-Meteo geocoding (GeoNames, CC BY 4.0); photos hotlinked from `inaturalist-open-data.s3.amazonaws.com` / `static.inaturalist.org`                                                                                                                                                                                                                                                                                                                 |
| CI/CD        | none — no `.github/`; deploy is manual                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| branches     | `main` = default + deploy source · `develop` = integration · work `<type>/<slug>` off `develop`                                                                                                                                                                                                                                                                                                                                                                                                         |

## Test profile

| field       | value                                                                                                                                                                                                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| runner      | Vitest 5 (`vitest.config.ts`, node env) + Testing Library; Playwright 1.64 + `@axe-core/playwright` (`playwright.config.ts`)                                                                                                                                                         |
| command     | `pnpm test` · `pnpm test:e2e` · one file `./node_modules/.bin/vitest run tests/unit/inat.spec.ts`                                                                                                                                                                                    |
| conventions | `tests/unit/*.spec.ts` pure + server · `tests/components/*.spec.tsx` start with `// @vitest-environment happy-dom` and use `tests/helpers/render.tsx` `renderWithProviders` · `tests/e2e/*.e2e.ts` scoped locators, real upstreams (London 2643743, Medan 1214520, Milky Stork 4745) |
| levels      | unit ✓ · component ✓ · e2e ✓ (SSR, axe incl. dark, mobile 375, errors, headers, PWA offline, search flow)                                                                                                                                                                            |
| enforced_by | local only (no CI)                                                                                                                                                                                                                                                                   |

## Gotchas

- `rtk` output filtering can hide vitest/eslint/prettier results — use `rtk proxy …` or `./node_modules/.bin/vitest` for authoritative output
- Edge cache stores mapped objects: bump `CACHE_SCHEMA` (`src/server/edgeCache.ts`) on any mapped-shape change (`.enggflo/learning.md` edge-cache-schema-version)
- iNat taxon `conservation_status.status` is the IUCN code (`EN`); `geoprivacy` `obscured|private` drives the hidden-location note
- iNaturalist rate-limits Cloudflare's shared egress IPs: `upstream.ts` retries a 429 once; then `src/lib/browserFallback.ts` lets the browser ask `api.inaturalist.org` directly (mappers shared via `src/lib/inatMap.ts`, CSP `connect-src` allows it, `/privacy` says so), and `RouteError` auto-retries a busy SSR page once per 30s
- Server errors lose their class over server-fn serialization; `src/lib/rateLimit.ts` `isRateLimited` detects by name/message
- Route files export only `Route` (TanStack code-splitting) — shared constants go in `src/lib/` <!-- enggflo -->
- `validateSearch` on `/place/$placeId` returns a partial (defaults stripped) so `<Link>` callers needn't pass `search`; read with `placeSearchSchema(Route.useSearch())`
- Defining `src/start.ts` disables Start's automatic CSRF middleware — it is re-added explicitly there
- Cache API only works on the deployed custom domain, not locally; Workers Free plan = 10 ms CPU (error 1102 if exceeded)
- Privacy page promises no cookies/analytics/localStorage; photos load straight from iNaturalist (stated in `/privacy`) — keep copy and code in sync
- Port 4311 is the e2e preview port; other local projects hold 4321–4324 — `lsof -iTCP:<port> -sTCP:LISTEN` first
- `README.md` — human-owned title line

## Learnings

- Log: `.enggflo/learning.md` — append only via `/enggflo-init "<mistake>"`
- Decisions and open threads: `.enggflo/brain.md`

## References <!-- enggflo -->

- @tanstack/react-router, @tanstack/react-start, @tanstack/react-query, @tanstack/react-router-ssr-query, @tanstack/router-cli — https://tanstack.com/llms.txt (llms.txt)
- react, react-dom, eslint-plugin-react-hooks — https://react.dev/llms.txt (llms.txt)
- @fontsource-variable/archivo, @fontsource-variable/red-hat-mono — https://fontsource.org/llms.txt (llms.txt)
- vite — https://vite.dev/llms.txt (llms.txt)
- vitest — https://vitest.dev/llms.txt (llms.txt)
- prettier — https://prettier.io/llms.txt (llms.txt)
