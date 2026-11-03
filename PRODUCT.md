# Product

<!-- impeccable:product-schema 1 -->

> Written from the owner's brief by a design subagent with no interview channel. Facts marked _(inferred)_ were not confirmed by the owner; revisit them.

## Platform

web (installable PWA; mobile-first)

## Stack

TanStack Start (React 19, SSR on a Cloudflare Worker, free plan, 10 ms CPU) · TanStack Query · Tailwind CSS v4 (tokens via `@theme`) · self-hosted fonts via `@fontsource` / `@fontsource-variable` only · no component library · inline SVG icons. Owner-decided.

## Users

- Curious people who just arrived somewhere, or are about to: travellers, people who moved city, people on a walk who want to know "what could I see here?" Mostly on phones, often outdoors. _(inferred from "most traffic will be phones")_
- Hiring managers and developers evaluating the build as a portfolio piece by Syailendra Ginting. They open it on a laptop, try a city or two, and read the code.

## Product Purpose

Pick any city in the world and see what lives near it: species ranked by how often they are actually observed within 10, 25 or 50 km, from iNaturalist research-grade observations. Open a species for its photos, summary, taxonomy and recent sightings near that city. Success: a visitor names a city, and within one screen sees real, local, photographed life they did not know was there.

## Positioning

Place first, not species first. iNaturalist and field-guide apps start from an organism; this starts from a map coordinate and answers "what is common here", ranked by real observation counts, for any of thousands of cities, with no account.

## Operating Context

- City lookup via Open-Meteo geocoding (name, admin1, country, country_code, population, lat/lng, GeoNames id).
- "Near me" (browser geolocation) is deferred: no reverse geocoding yet. Cities are picked by name.
- iNaturalist API v1: `observations/species_counts` (lat/lng/radius, research grade, iconic taxa filter, month filter, pages of ~30), `taxa/<id>` (taxon_photos with attribution, wikipedia_summary, ancestors, conservation_status, establishment_means), `observations` (recent sightings).
- Routes: `/`, `/place/<geonameId>`, `/species/<taxonId>?place=<geonameId>&radius=<km>`, `/privacy`, `/terms`, `/accessibility`, `/credits`, `/offline`, plus 404 and error.
- Pagination: numbered pages `?page=1..10`, 30 species per page (max 300 per search).
- The browser talks only to our Worker; the Worker calls iNaturalist and Open-Meteo (photos included).
- Domain fixed: https://fieldguide.engg.app. Public repo github.com/sg208/fieldguide, MIT.

## Capabilities and Constraints

- Species groups = iNat iconic taxa: Birds (Aves), Plants (Plantae), Insects (Insecta), Mammals (Mammalia), Reptiles (Reptilia), Amphibians (Amphibia), Fish (Actinopterygii), Fungi, Mollusks (Mollusca), Arachnids (Arachnida). "Protozoa/Chromista" are out of the filter.
- Counts are observation counts within the radius, not population estimates. Never word them as abundance.
- iNat can rate-limit; every data surface needs an error / rate-limited state.
- Every photo must display its iNat attribution string and license.
- Credits owed: iNaturalist (data, photo licences), Open-Meteo geocoding (CC BY 4.0), GeoNames (CC BY 4.0).
- Privacy: no cookies, no analytics, no storage except the service-worker cache on device. Cloudflare processes IPs as host. (When Near me ships: coordinates go to our server and iNaturalist only after a tap.)
- Working name "Field Guide"; may change, domain may not.

## Brand Commitments

- Must not resemble the sibling project pokedex.engg.app (loud flat poster: square corners, giant display type, flat saturated blocks).
- Owner rejects generic "AI nature app" styling: green gradient hero, leaf emoji, glassmorphism.

## Evidence on Hand

- All content is live third-party data (iNat, Wikipedia via iNat). No testimonials, users, metrics or press exist; none may be invented.
- No logo or brand assets exist before this design pass.

## Product Principles

1. Photos are evidence. Every image is a real observation with a named photographer and licence, shown, not hidden.
2. Place before taxonomy. The city is the subject; species are what the city contains.
3. Counts are honest. Say "observations near here", never "population" or "abundance".
4. Nothing follows you. No account, no cookies, no tracking, no third-party calls from the browser.
5. Light on the wire. SSR pages must render fast on a phone on mobile data and fit a 10 ms Worker budget.

## Accessibility & Inclusion

WCAG 2.2 AA: contrast, visible focus, 24px minimum target (44px on touch), reduced motion, one h1 per page, ARIA 1.2 combobox for city search, skip link. Scientific names in italics must keep a non-italic accessible reading (no meaning in italics alone).
