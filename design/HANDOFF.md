# Field Guide — engineering handoff

Design source: `design/comps/*.html` (open via any static server, e.g. `npx serve design/comps`). Screens: `design/screens/` (390 and 1440 wide, light, plus dark for home/place/species). Product truth: `PRODUCT.md`. Visual system: `DESIGN.md`.

The comps are the composition to match. Where this document and a comp disagree, this document wins (it carries the orchestrator's later decisions).

## 0. Decisions that override the original brief

| Topic | Decision |
| --- | --- |
| Routes | `/`, `/place/<geonameId>`, `/species/<taxonId>?place=<geonameId>&radius=<km>`, `/privacy`, `/terms`, `/accessibility`, `/credits`, `/offline`. Comps link to `*.html` files; map them to these routes. |
| Near me | **Deferred.** Not in the MVP UI. Copy for it is in §8.9 for later. |
| Pagination | Numbered pages via `?page=1..10`, 30 per page, SSR. No "load more", no infinite scroll. Max 300 species per search. |
| Network | Browser talks only to our Worker. **Photos too**: serve iNat images through a Worker route (e.g. `/img/<photoId>/<size>.<ext>`), or the privacy copy in §8.6 becomes false. If you hotlink instead, change that paragraph before launch. |
| Storage | No cookies, no localStorage/sessionStorage/IndexedDB. Service-worker Cache Storage only. |
| Name | Keep "Field Guide". It matches the domain and the world. |

## 1. Direction in one paragraph

A natural-history collection, not a nature app. The page ground is the pale enamel of a herbarium cabinet; each species is a white mounting sheet with a ruled specimen label under its photo (rank, common name, italic scientific name, observation count, photo credit). Each place is a species folder whose cover takes its continent colour. Violet accession-stamp ink is the only action colour. Archivo (semi-condensed for names) carries the type; Red Hat Mono is reserved for measurements: coordinates, counts, dates, licence codes, ranks.

What makes it not-the-pokedex: soft paper shadows and 3px sheet corners, photo-led cards, continent colour only on folder covers (a contained box with a tab, never full-bleed) and drawer tabs, calm reading type, no edge-to-edge colour bands.

The photo credit is the most designed object on a card: a captioned label field ("PHOTO"), the photographer in ink, the licence code in a mono box.

## 2. Tokens (Tailwind v4)

`src/styles/app.css`:

```css
@import "tailwindcss";
@import "@fontsource-variable/archivo/wdth.css";        /* normal, wght 100–900 + wdth 62–125 */
@import "@fontsource-variable/archivo/wght-italic.css"; /* italic for scientific names */
@import "@fontsource-variable/red-hat-mono/wght.css";   /* normal, wght 300–700 */

:root {
  --board: #E4E8E1;  --sheet: #FCFCFA;  --ink: #15191B;  --ink-2: #4A524E;
  --rule: #D3D9D1;   --edge: #737D76;
  --stamp: #4A3A92;  --stamp-soft: #E9E5F6;  --on-stamp: #FFFFFF;
  --redlist: #B3261E; --introduced: #8A5A00; --endemic: #1F5E8C;
  --cover-africa: #8A5A12; --cover-asia: #9B2F2A; --cover-europe: #1F4E79;
  --cover-namerica: #1E5E5E; --cover-samerica: #6B3466; --cover-oceania: #0E5F86;
  --cover-antarctica: #3E4A52; --cover-neutral: #3E4A52;
  --shadow-sheet: 0 1px 2px rgb(21 25 27 / .08), 0 3px 10px -2px rgb(21 25 27 / .10);
  --shadow-lift:  0 2px 4px rgb(21 25 27 / .10), 0 10px 24px -6px rgb(21 25 27 / .18);
  color-scheme: light dark;
}
@media (prefers-color-scheme: dark) {
  :root {
    --board: #101312;  --sheet: #191D1B;  --ink: #E6EAE5;  --ink-2: #A3ADA6;
    --rule: #2C332F;   --edge: #6B756F;
    --stamp: #B3A6F2;  --stamp-soft: #2A2448;  --on-stamp: #15122B;
    --redlist: #FF8A80; --introduced: #E3B45C; --endemic: #8CC4EE;
    --cover-africa: #6F4A0F; --cover-asia: #7E2622; --cover-europe: #1A4066;
    --cover-namerica: #184D4D; --cover-samerica: #572A53; --cover-oceania: #0B4E6E;
    --cover-antarctica: #333D44; --cover-neutral: #333D44;
    --shadow-sheet: 0 1px 2px rgb(0 0 0 / .4), 0 3px 10px -2px rgb(0 0 0 / .45);
    --shadow-lift:  0 2px 4px rgb(0 0 0 / .45), 0 10px 24px -6px rgb(0 0 0 / .6);
  }
}

@theme inline {
  --color-board: var(--board);   --color-sheet: var(--sheet);
  --color-ink: var(--ink);       --color-ink-2: var(--ink-2);
  --color-rule: var(--rule);     --color-edge: var(--edge);
  --color-stamp: var(--stamp);   --color-stamp-soft: var(--stamp-soft); --color-on-stamp: var(--on-stamp);
  --color-redlist: var(--redlist); --color-introduced: var(--introduced); --color-endemic: var(--endemic);
  --color-cover-africa: var(--cover-africa); --color-cover-asia: var(--cover-asia);
  --color-cover-europe: var(--cover-europe); --color-cover-namerica: var(--cover-namerica);
  --color-cover-samerica: var(--cover-samerica); --color-cover-oceania: var(--cover-oceania);
  --color-cover-antarctica: var(--cover-antarctica); --color-cover-neutral: var(--cover-neutral);
  --shadow-sheet: var(--shadow-sheet); --shadow-lift: var(--shadow-lift);
}

@theme {
  --font-sans: "Archivo Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Red Hat Mono Variable", ui-monospace, "SF Mono", Menlo, monospace;

  --text-micro: 0.75rem;   --text-micro--line-height: 1.3;   /* field labels, uppercase, +0.06em */
  --text-xs: 0.8125rem;    --text-xs--line-height: 1.4;      /* credits rows, captions */
  --text-sm: 0.875rem;     --text-sm--line-height: 1.45;
  --text-base: 1rem;       --text-base--line-height: 1.55;
  --text-read: 1.0625rem;  --text-read--line-height: 1.6;    /* summaries, legal body */
  --text-h3: 1.0625rem;    --text-h3--line-height: 1.2;      /* card names (1rem on phones) */
  --text-h2: 1.375rem;     --text-h2--line-height: 1.2;
  --text-title: clamp(2.25rem, 1.6rem + 3vw, 3.5rem);     --text-title--line-height: 0.98;   /* species, legal, system h1 */
  --text-place: clamp(2.5rem, 1.6rem + 4vw, 4.25rem);     --text-place--line-height: 0.95;   /* place h1 */
  --text-hero: clamp(2.5rem, 1.4rem + 5.2vw, 5.25rem);    --text-hero--line-height: 0.98;    /* home h1 */

  --radius-sheet: 3px;  --radius-label: 2px;  --radius-control: 6px;  --radius-tab: 6px 6px 0 0;  --radius-chip: 9999px;

  --ease-settle: cubic-bezier(.2, .8, .2, 1);
}
```

Spacing: Tailwind default 4px scale. Rhythm used: 8 / 12 / 16 / 20 / 24 / 32 / 40 / 56 / 72 / 88. Card gaps 12 (phone) and 20 (≥1024).

Type rules:
- Display (h1, drawer names): weight 700, `font-stretch: 80%`, tracking `-0.03em`. Section h2/h3: weight 650, `font-stretch: 87%`.
- Scientific names: `font-style: italic; font-stretch: 100%` plus `lang="la"` on the element. Italics alone carry no meaning.
- Mono only for numbers and codes: `font-variant-numeric: tabular-nums; font-size: .92em; font-weight: 500; letter-spacing: -.02em`.
- Field labels: 12px, 600, uppercase, +0.06em, `--ink-2`.
- Current item in a nav list (legal doc nav): stamp-soft fill + weight 700. No coloured side borders anywhere.
- Selection: `::selection { background: var(--stamp); color: var(--on-stamp) }`. Focus: `outline: 2px solid var(--stamp); outline-offset: 2px` (white on folder covers).

Verified contrast (light / dark): ink on board 14.3 / 15.4; ink-2 on sheet 7.8 / 7.4; stamp on sheet 8.8 / 7.8; on-stamp on stamp 9.1 / 8.4; white on every cover ≥ 5.9; edge (control borders) on board 3.4, on sheet 4.2; redlist on sheet 6.4 / 7.5.

## 3. Fonts

```
pnpm add @fontsource-variable/archivo@^5.3.0 @fontsource-variable/red-hat-mono@^5.3.0
```

Import only the three CSS files in §2. Latin payload is about 88 KB (Archivo wdth) + 38 KB (italic) + 22 KB (mono); `unicode-range` fetches latin-ext and Vietnamese only when a name needs them. Cyrillic, CJK and other scripts fall back to the system font (observer names like 航一帆 and Дмитрий Осипов render fine that way). Preload only `archivo-latin-wdth-normal.woff2`.

## 4. Icons

Lucide geometry, inlined as SVG components, 24 viewBox, `stroke-width: 1.75`, round caps/joins, `currentColor`, 20px in buttons and 18px inline. Always `aria-hidden="true"`; the control carries the name.

| Icon | Lucide name | Used in |
| --- | --- | --- |
| search | `search` | city field, Change city, 404 |
| arrow-left / arrow-right | `arrow-left`, `arrow-right` | back link, pager, gallery |
| share | `share-2` | Share |
| external | `external-link` | iNaturalist, Wikipedia, sightings |
| close | `x` | combobox clear |
| check | `check` | "Link copied" toast |
| alert | `circle-alert` | error states |
| retry | `rotate-ccw` | Try again |
| offline | `wifi-off` | offline page |

No icons on group chips: text only, by design.

## 5. Layout

Breakpoints: Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280). Container: `max-width: 1280px; padding-inline: 16px` (32px from `md`). No horizontal page scroll at 320px or wider; the chip row scrolls inside itself.

| Page | < 640 | 640–1023 | ≥ 1024 | ≥ 1280 |
| --- | --- | --- | --- | --- |
| Home hero | single column | single | 7/5 split: text + two-sheet figure | same |
| Home drawers | 2 cols, gap 12 | 2 cols | 4 cols, gap 16 | 4 |
| Place grid | 2 cols, gap 12 | 3 cols | 4 cols, gap 20 | 5 cols |
| Place controls | chips scroll row; radius + month row below | same | chips wrap in one row; radius + month row, left aligned | same |
| Species top | gallery (bleeds to the screen edge), then label sheet | same | 7/5: gallery / label sheet | same |
| Species body | about, lineage, sightings stacked | same | 7/5: about / lineage; sightings full width | same |
| Legal | doc nav as chips above sheet | same | 220px sticky left nav + sheet; text column max 68ch | same |
| 404 / offline | text, then the mount figure | same | 5/6: figure / text | same |

## 6. Components

Props use TypeScript string unions, no `enum`.

### SiteHeader
`variant: 'home' | 'app' | 'system'`. Mark (link to `/`, accessible name "Field Guide home") + right action: home → "Credits" link; app → "Change city" (link to `/` with focus on the city field via `/#city`); system → none. Height 60, bottom hairline.

### SkipLink
First focusable element. "Skip to content" → `#main`; on place pages "Skip to species" → `#results`. Hidden until focused, then a violet pill at top-left.

### CityCombobox (ARIA 1.2 combobox + listbox)
Props: `id`, `size: 'hero' | 'sheet'`, `onSelect(place: GeoResult)`.
- Markup: `<label for="city">City</label>` (visible field label), `<input role="combobox" aria-expanded aria-controls="city-list" aria-autocomplete="list" aria-activedescendant autocomplete="off" spellcheck="false">`, `<ul role="listbox" id="city-list">` with `<li role="option" id aria-selected>`.
- Home (`size='hero'`): the field completes the h1 "What lives near" on the line below, set at the same display size (700, `font-stretch: 80%`), transparent background, 3px ink bottom rule (violet on focus), search icon at the right end, placeholder "your city?". Visible `<label for="city">City</label>` sits under the rule, followed by the hint. The h1 carries a visually hidden " any city?" so it reads as a full question.
- Sheet size (Change city): input height 56, sheet background, `--edge` border, focus ring on the wrapper (`:focus-within`).
- Option row: active option = stamp-soft fill only (no side bar); name (650, matched substring underlined 2px, not coloured), second line "admin1, country · population" (population rounded: 2.0M, 250K, 18K; omit when absent), right-aligned country code in a mono box. Min height 56.
- Fetch: our Worker `GET /api/geocode?q=` after 2 characters, debounce 250 ms, abort stale requests, max 8 results, keep Open-Meteo's ranking (population-led).
- States: closed · loading ("Looking up “{q}”…" as a disabled option, plus `aria-busy` on the listbox) · results · no results · error. A polite live region (`role="status"`, visually hidden) announces "{n} cities found" or the message.
- Keyboard: ↓/↑ move the active option (wrap); ↓ on a closed field with text opens it; Enter selects the active option (if none is active and the list has one result, select it; otherwise do nothing); Esc closes, second Esc clears; Tab closes without selecting; Home/End move the caret (do not hijack); Alt+↓ opens without moving. Pointer: click selects; hover sets active.
- Clear button (x, 44×44, "Clear city search") appears when there is text.
- Select → navigate to `/place/<geonameId>`. Never submit free text without a selection; the form's submit selects the first option when there is exactly one.
- Same-name cities: never auto-pick. "La Paz" returns Mexico first; the second line is what disambiguates.

### Drawer (featured city)
Props: `geonameId, name, region, country, continent, lat, lng`. Link to `/place/<id>`. Cover strip (continent colour, uppercase continent name, white), label holder (name 22–26px 700, region + country, coordinates `3.58° N  98.66° E` in mono, 2 decimals, `white-space: nowrap`), drawer pull (44×6 rule-coloured bar, decorative). States: hover lifts 2px with `--shadow-lift`; focus ring on the card; active returns to 0.

Featured set (verified GeoNames ids):

| City | id | Region, country | Continent |
| --- | --- | --- | --- |
| Medan | 1214520 | North Sumatra, Indonesia | Asia |
| Lagos | 2332459 | Lagos, Nigeria | Africa |
| Reykjavik | 3413829 | Capital Region, Iceland | Europe |
| La Paz | 3911925 | La Paz Department, Bolivia | South America |
| Ulaanbaatar | 2028462 | Ulaanbaatar, Mongolia | Asia |
| Vancouver | 6173331 | British Columbia, Canada | North America |
| Nairobi | 184745 | Nairobi County, Kenya | Africa |
| Cairns | 2172797 | Queensland, Australia | Oceania |

Hard-code these (name, region, coords) so the home page needs no API call.

### FolderCover (place header; also legal)
Props: `continent | 'neutral'`, `title`, `region`, `speciesCount`, `radiusKm`, `lat`, `lng`, `population?`. A folder sitting on the board: the tab (continent name) and the cover box both live **inside** the page container; cover radius `0 3px 3px 3px` (legal: `3px`, no tab), `--shadow-sheet`, padding 20/20/24 (≥1024: 28/32/32), white text. Never stretch the cover edge to edge. Legal pages use the neutral cover with no tab (a blank tab would be decoration). Contents: h1 (city), region line ("North Sumatra, Indonesia"), sentence "**411** species observed within 25 km" (number in mono 600), and a locality `<dl>`: Coordinates, Population, Records ("iNaturalist, research grade"). The dl is an inline row on phones (labels visually hidden, Records hidden) and a ruled two-column label box at ≥1024. Share button top-right (icon-only 44×44 on phones with accessible name "Share Medan"; outlined white with label from 640).
Continent comes from `country_code` via a static ISO-3166 → continent map in the Worker (Open-Meteo does not return continent). Antarctica uses its own cover. Unknown → neutral.

### GroupChips
Single-select radio group in a `<fieldset>` (legend "Species group", visually hidden). Values → iNat `iconic_taxa`: All (none), Birds `Aves`, Plants `Plantae`, Insects `Insecta`, Mammals `Mammalia`, Reptiles `Reptilia`, Amphibians `Amphibia`, Fish `Actinopterygii`, Fungi `Fungi`, Mollusks `Mollusca`, Arachnids `Arachnida`. Chip: 40px tall with a 44px hit area (2px row padding), pill, sheet background, `--edge` border; hover border ink; checked = violet fill, `--on-stamp` text; focus ring offset 2. Arrow keys move and select (native radio behaviour). URL: `?group=Aves`. Changing a chip resets `page` to 1.

### RadiusScale (signature control)
Radio group legend "Radius". Looks like a map scale bar: ticks 0 · 10 · 25 · 50, unit "km", three equal 64px segments (equal width on purpose, not proportional). Segments from 0 up to the chosen radius fill solid ink; the rest are open (sheet fill, ink outline). The chosen tick label is ink 700; the others ink-2. Each segment is a 44px-tall label with a visually hidden "10 km" / "25 km" / "50 km". Arrow keys change the value. State is carried by fill and weight, never colour alone. URL: `?radius=10|25|50` (default 25). Resets page to 1.

### MonthToggle
`<input type="checkbox" role="switch">` labelled "{Month} only" (current month in the user's locale, e.g. "November only"). 44×26 track; on = violet. Maps to iNat `month=<1-12>` (that month in any year). URL: `?month=11`. Describe it in the results heading: "Birds in November, most observed first".

### SpecimenCard
Props: `rank, taxonId, commonName?, scientificName, count, photo { url, width, height, attribution, licenseCode } | null, status?: 'CR'|'EN'|'VU', establishment?: 'introduced'|'endemic', isReturnTarget`.
- `<li id="t-<taxonId>">` containing one `<a>` to `/species/<taxonId>?place=<id>&radius=<km>`; the link's `::after` covers the card. The credit line sits outside the link, above it in z-order, so it can be selected.
- Photo: square, `object-fit: cover`, `width=240 height=240` attributes, `srcset` small (240w) + medium (500w), `sizes="(min-width:1024px) 240px, 46vw"`, `loading="lazy"` except the first 4, `alt=""` (the name follows; decorative here). Missing photo: sheet-coloured square with a centred dashed outline and the text "No photo yet".
- Label: "No. {rank}" (mono 12, ink-2), common name h3 (fall back to the scientific name, then no italic line), scientific name italic ink-2, badges, ruled row "**17** obs." (mono 600).
- Credit row (second subgrid row of the card, so the rule lines up across a row): caption "PHOTO" (11px, 600, uppercase, ink-2) on its own line; photographer in ink 13px weight 500; licence in a mono box (`.lic`: 12px 600, 1px `--edge` border, 2px radius, `white-space: nowrap`). "All rights reserved" is plain ink-2 text, not boxed. Never truncated; wraps between words, never inside a licence code. Grid cards use `grid-template-rows: subgrid; grid-row: span 2` so the photo+label row and the credit row align across each row of cards.
- Badges: 22px, 1px border in the status colour, uppercase 11px 650. Threatened (CR, EN, VU) red with a double border; Introduced amber; Endemic blue. Render a badge only when the API supplies the field (see §7.3).
- States: hover lift 2px + `--shadow-lift` (motion §9); focus-visible ring 2px violet offset 3 around the whole card; pressed returns to 0; loading = skeleton (below). Return flag: when `isReturnTarget`, outline 2px violet and a violet tab "Opened" pinned top-right.

### SkeletonCard
Same box: square rule-coloured block + three bars (30% / 80% / 60%). Gentle opacity breathe 1.6s; no shimmer gradient; static under reduced motion. Grid gets `aria-busy="true"` and a hidden status "Loading species…".

### ResultsHeader
h2 built from filters: "{Group|All groups}{ in Month}, most observed first". Right side: "Page 1 of 10 · species 1–30 of 411" (ink-2, 14px).

### Pager
`<nav aria-label="Pages">`. Prev / Next are links (`aria-disabled="true"` and no href at the ends). ≥640: numbered links 1…10 with ellipsis (show first, last, current ±1); current = violet fill, `aria-current="page"`. <640: "Page 1 of 10" text between Prev/Next. 44×44 targets. Page count = `min(10, ceil(total / 30))`. Out-of-range `?page` → the server redirects to the last valid page (302). After a client-side page change, move focus to the results h2 (`#results`, `tabindex="-1"`) and scroll it into view.
Footnote under the pager: "Field Guide lists the 300 most observed species for each search. Counts are research-grade iNaturalist observations inside the circle, not population sizes." Show the first sentence only when `total > 300`.

### ShareButton
Props: `title, url`. If `navigator.share` exists: `navigator.share({ title, text, url })`; ignore AbortError. Otherwise `navigator.clipboard.writeText(url)` and show the toast "Link copied" (2.5s, `role="status"`). If the clipboard fails: toast "Couldn’t copy. The link is in your address bar." Share URL = the canonical URL including current filters (`?group&radius&month&page`).

### Toast
Ink background, board text, check icon, bottom-centre on phones (16px above safe-area inset), bottom-left on desktop. One at a time. Enters by a 12px rise + fade, 180ms.

### BackToPlace (species page)
Rendered only with a valid `place` param. Folder-tab style button in the place's cover colour: arrow-left + "Back to {City}". href = `/place/<id>?radius=<km>#t-<taxonId>`. If the previous history entry is that place page (same-origin `document.referrer` path match), intercept the click and call `history.back()`, which restores scroll, filters and page. Otherwise follow the href; the `#t-` fragment scrolls to the card when it is on page 1 and `:target` turns on the return flag. No storage involved.

### PhotoGallery
Props: `photos[] { url (medium), width, height, attribution }` (up to 6 from `taxon_photos`). One horizontal scroll-snap strip at every size (`<ul tabindex="0" aria-label="Photos of {name}, scroll sideways">`). Each item is a `<figure>`: 4:3 image (`object-fit: cover`, intrinsic `width/height` set), `<figcaption>` with the **full** attribution string (minus ", uploaded by …") and "n/6" in mono. Phones: slides are 86% wide so the next one peeks. ≥768: one slide per view, Prev/Next 44px buttons and "1 of 6 photos". Buttons scroll by one slide (`scrollBy` with `behavior: 'smooth'`, or 'auto' under reduced motion) and disable at the ends. First image eager, rest lazy. Alt text: "{Common name}, photo {n} of {total}".

### StatusStamp
Conservation status from `taxon.conservation_status` (global/IUCN). Code in mono + word in uppercase inside a double red rule; under it "IUCN Red List status" (or the `authority` string). Words: CR Critically endangered, EN Endangered, VU Vulnerable, NT Near threatened, LC Least concern, DD Data deficient, EW Extinct in the wild, EX Extinct. LC/NT/DD use ink, not red. None → omit the stamp.

### Facts list
`<dl>` ruled rows: "Near {City}" → "{n} observations within {r} km"; "Worldwide" → "{n} observations" (`observations_count`, `Intl.NumberFormat`); "Group" → iconic taxon label.

### Lineage
`<nav aria-labelledby>` with an ordered list of ancestors (from `taxon.ancestors`, skip ranks below kingdom that iNat marks as `stateofmatter`/life). Row: rank (field-label style: 12px 600 uppercase, ink-2, 88px column) + scientific name (600; italic for genus and below) + common name (ink-2). Current species row: `aria-current="page"`, stamp-soft background. The class row links to the place filtered by that group when it is one of the iconic taxa.

### SightingsLedger
Our Worker: `GET observations?taxon_id&lat&lng&radius&quality_grade=research&order_by=observed_on&per_page=6`. Table with caption via h2 "Recent sightings near {City}" and sub "Research-grade observations within {r} km, newest first." Columns: Date (mono, "13 May 2026" via `Intl.DateTimeFormat(undefined, { day:'numeric', month:'short', year:'numeric' })`), Place (`place_guess`, else "No place name given"), Observer (`user.name`, else `user.login`), link "View" + external icon with hidden text "observation from {date} on iNaturalist". <640 each row becomes a three-line block with the link on the right. Zero rows → "No research-grade sightings within {r} km yet. See all records on iNaturalist." with the link.

### ObscuredNote
On species pages where `conservation_status.geoprivacy` is `obscured` or `private`, show the note in §8.4. (Threatened species in iNat are obscured by default.)

### StateBlock (empty / error / rate-limited)
Sheet box, h3 + paragraph + actions; error and rate-limited variants have a 3px red top rule and `role="alert"`; empty uses `role="status"`. Copy in §8.3. No label above the heading.

### SiteFooter
Credit paragraph + nav (Credits, Privacy, Terms, Accessibility, Source on GitHub, MIT licence). Nav links 44px tall.

## 7. Data presentation rules

### 7.1 Numbers and places
- Coordinates: 3 decimals on the place page (`3.583° N · 98.667° E`), 2 on drawers. Hemisphere letters, never negative numbers.
- Population: "2.49 million", "118,918" below a million; omit the row when absent.
- Use the place name exactly as Open-Meteo returns it (it returns "Reykjavik" without the accent; do not "fix" names).
- Counts are always "observations" or "obs.", never "sightings of individuals", "population" or "abundance".

### 7.2 Photo credits
- Card (compact): parse `attribution`: drop ", uploaded by …"; `(c) NAME, some rights reserved (CC BY-NC)` → `© NAME · CC BY-NC`; `(c) NAME, all rights reserved` → `© NAME · All rights reserved`; `no rights reserved` → `No rights reserved (CC0)`. If the string does not parse, show it verbatim.
- Species gallery: the full string (minus "uploaded by").
- Never hide, truncate, or move a credit into a tooltip. If a photo has no attribution, do not show the photo.
- Owner decision pending: iNat returns many "all rights reserved" default photos. Showing them with credit is how iNat itself does it, but for a public portfolio prefer the first CC-licensed photo in `taxon_photos` when the default is ARR.

### 7.3 Badges
- Threatened: global `conservation_status.status` in {CR, EN, VU} (iNat lowercases them in `species_counts`; uppercase for display).
- Introduced / Endemic: only when `establishment_means` arrives. iNat fills it for `place_id` queries, not lat/lng circles, so expect it to be mostly absent. The "Introduced" badge on the snail card in the comp is illustrative. Do not infer it.

## 8. UX copy

### 8.1 Global
- `<title>`: Home "Field Guide: what lives near any city"; Place "{City}, {Country}: {n} species within {r} km · Field Guide"; Species "{Common} ({Scientific}) near {City} · Field Guide" (without place: "{Common} ({Scientific}) · Field Guide").
- Meta description, home: "Pick any city and see the birds, plants, insects and other species people have observed near it, from iNaturalist research-grade records."
- Skip link: "Skip to content" / "Skip to species".

### 8.2 Home
- h1: "What lives near" (+ hidden " any city?"), completed by the city field (placeholder "your city?").
- Lede (after the field): "Birds, plants, insects and more, ranked by how often people have photographed and identified them within 10, 25 or 50 km. Every record is an iNaturalist research-grade observation."
- Field label: "City" · hint "Type at least two letters, then pick from the list. Try Medan, Lagos or Reykjavik."
- Combobox messages: "Looking up “{q}”…" · "No city called “{q}”. Check the spelling, or try the nearest larger city." · "City search isn’t responding. Try again in a moment." · live: "{n} cities found."
- Hero figure caption (≥1024): "From the Medan drawer, 25 km" (two static sheets mounted square, not tilted: Eastern Cattle-Egret, Asian Weaver Ant, with their credits; ship these photos as static assets with credits intact).
- Drawers: h2 "Or open a drawer" · sub "Eight cities on six continents."
- "How to read a label": h2 as given; body "Each species gets a sheet. The number is how many research-grade observations people have shared near the city, not how many animals live there. A common bird near a busy park will outrank a rare one in the hills." Key: "Common and scientific name — As iNaturalist lists them. The italic line is the species." · "Observations — Research-grade records inside the radius you chose." · "Photo credit — The photographer and their licence. Every photo keeps its credit."

### 8.3 Place
- Count sentence: "{n} species observed within {r} km" (1 → "1 species").
- Controls: legend "Species group" (hidden) · "Radius" · "{Month} only".
- Results h2: "{All groups|Birds|…}{ in {Month}}, most observed first"; meta "Page {p} of {P} · species {a}–{b} of {n}".
- Pager: "Prev" · "Next" · "Page {p} of {P}".
- Empty (filter): h3 "No {group lower} on record here yet" · "Nobody has shared a research-grade {group lower} observation within {r} km of {City}{ in {Month}}. Try a wider radius or any month." Actions: "Widen to {next} km" (hidden at 50) · "Show all months" (only when month is on) · at 50 km with no month: "Show all groups".
- Empty (whole place, 0 species): h3 "Nothing recorded near {City} yet" · "No one has shared research-grade observations within {r} km. iNaturalist coverage is thin in some places; a wider radius often helps." Action "Widen to 50 km" / "Search another city".
- Rate-limited (HTTP 429 from iNat): h3 "iNaturalist is busy right now" · "iNaturalist asked us to slow down. Your filters are kept; try again in a minute." Action "Try again".
- Error (other): h3 "We couldn’t load these species" · "The species list didn’t arrive. It’s usually brief. If it keeps happening, tell us on GitHub." Actions "Try again" · "Report on GitHub".
- Unknown geonameId: 404 page.
- Share: "Share" (accessible "Share {City}") · toast "Link copied" · "Couldn’t copy. The link is in your address bar." · share text "What lives near {City}: {n} species within {r} km".

### 8.4 Species
- "Back to {City}" · facts labels "Near {City}", "Worldwide", "Group" · "IUCN Red List status".
- Obscured note: "iNaturalist hides the exact location of threatened species, so a sighting can sit several kilometres from the point shown on its record."
- Links: "iNaturalist" (external icon) · "Wikipedia" (only when `wikipedia_url`) · "Share".
- About h2 "About"; source line "Summary from Wikipedia, CC BY-SA 4.0." No summary: "No Wikipedia summary for this species yet." + iNaturalist link.
- Lineage h2 "Lineage". Sightings: see §6. Without `place`: hide Back, "Near" fact, and sightings; show "Pick a city to see sightings near it." with the combobox link.
- Error: "We couldn’t load this species. Try again in a moment." + Try again.

### 8.5 System pages
- 404: title "Not in the collection" · "There is no page at this address. The link may have a typo, or the place or species ID no longer exists on iNaturalist or GeoNames." Actions "Search a city" · "Open the Medan drawer". Figure label rows: Specimen "None on file", Locality "Unknown", Status "404".
- Error (500): title "Something went wrong" · "Field Guide hit an error loading this page. Try again, or start from a city." Actions "Try again" · "Search a city". Figure Status "Error".
- Offline: title "You’re offline" · "Field Guide needs a connection to look up new places and species. Pages you opened recently are saved on this device and still work." Action "Try again" (reloads). List h2 "Saved on this device", rows "{Title}" + "Place · {r} km" or "Species", built from `caches.open(...)` keys at runtime. None saved: "Nothing saved yet. Pages you open while online are kept here for next time."

### 8.6 Privacy (`/privacy`) — full copy
Header: "Privacy" · "No account, no cookies, no tracking."
At a glance: Cookies **None** · Analytics or ads **None** · Accounts **None** · Saved on your device **Page cache**.

**What Field Guide collects.** Nothing about you. There are no accounts, no cookies, no analytics, no advertising and no tracking scripts. Field Guide does not use local storage or any other browser storage to identify you.

**What your browser sends.** When you search for a city or open a page, your browser asks our server at fieldguide.engg.app for it. Our server then asks the data providers on your behalf:
- Open-Meteo receives the city name you type, to find matching places.
- iNaturalist receives the coordinates of the city you picked, the radius, and the filters you chose, to return species, photos and sightings.

These requests come from our server, not from your browser, so the providers do not see your IP address. Photos are passed through our server too.

**Hosting.** Field Guide runs on Cloudflare. Like any host, Cloudflare processes your IP address and basic request details to deliver pages and protect the site from abuse. See Cloudflare’s privacy policy (https://www.cloudflare.com/privacypolicy/).

**Saved on your device.** Field Guide is an installable web app. Its service worker keeps a copy of the app and of pages you recently opened in your browser’s cache, so they load fast and work offline. This cache stays on your device and is never sent to us. Clear it any time by clearing site data for fieldguide.engg.app in your browser settings.

**Your location.** Field Guide never asks for your location. You pick a city by name.

**Links to other sites.** Species pages link to iNaturalist and Wikipedia. Those sites have their own privacy policies once you follow a link.

**Changes and contact.** If this page changes, the date below changes with it, and the history is public in the source repository (https://github.com/sg208/fieldguide). Questions: open an issue there.

Last updated {date of launch}.

Two lines must change if the build changes: hotlinked photos (→ "Photos load directly from iNaturalist’s image servers, which see your IP address.") and Workers logging (if Workers Logs/observability is on → "Our server keeps request logs for up to {n} days to debug errors; they include your IP address.").

### 8.7 Terms (`/terms`)
Header: "Terms" · "Free to use, offered as is."

**What this is.** Field Guide is a free, non-commercial portfolio project by Syailendra Ginting. It shows public data from iNaturalist and Open-Meteo. It is not affiliated with or endorsed by iNaturalist, the California Academy of Sciences, the National Geographic Society, Open-Meteo or GeoNames.

**The data.** Species lists, counts, photos and sightings come from iNaturalist research-grade observations. They show where people have recorded species, not a complete survey. Do not rely on them for safety decisions such as identifying edible fungi or plants, dangerous animals, or medical matters.

**Photos and text.** Every photo belongs to the photographer credited under it and is shown under the licence they chose. If you reuse a photo, follow its licence, not ours. Species summaries come from Wikipedia under CC BY-SA 4.0.

**The code.** The source code is MIT-licensed at github.com/sg208/fieldguide. The MIT licence covers the code only, not the data or photos.

**Fair use of the service.** Please don’t scrape or load-test the site. It runs on a free hosting tier and shares iNaturalist’s rate limits.

**No warranty.** Field Guide is provided as is, without warranty of any kind. It may be wrong, out of date or unavailable.

**Contact.** Open an issue at github.com/sg208/fieldguide. Last updated {date}.

### 8.8 Accessibility (`/accessibility`)
Header: "Accessibility" · "Built to WCAG 2.2 AA."

**Our target.** Field Guide aims to meet WCAG 2.2 level AA on current versions of Chrome, Safari, Firefox and Edge, with VoiceOver, TalkBack and NVDA.

**What we did.**
- Every page has one main heading, landmarks and a skip link.
- City search follows the ARIA combobox pattern: arrow keys move through results, Enter picks one, Escape closes the list.
- Filters are standard radio buttons and switches, so they work with a keyboard and screen readers. The radius scale shows the chosen distance by fill and weight, not colour alone.
- Text and controls meet AA contrast in light and dark mode. Focus is always visible.
- Touch targets are at least 44 by 44 pixels, apart from inline text links.
- Motion is limited to small lifts and fades and switches off when your device asks for reduced motion.
- Photos on species pages have text alternatives; photo credits are real text you can select and read aloud.

**Known gaps.** Photo descriptions are generic ("Milky Stork, photo 2 of 6") because iNaturalist photos do not come with descriptions. Wikipedia summaries can contain specialist terms. Some observer names are in scripts our font does not include; they use your system font.

**Tell us.** If something gets in your way, open an issue at github.com/sg208/fieldguide with the page and what happened. Last reviewed {date}.

### 8.9 Credits (`/credits`)
Header: "Credits" · "Field Guide is built on other people’s work."

**Observations and photos — iNaturalist.** Species, counts, photos and sightings come from iNaturalist (inaturalist.org), a joint initiative of the California Academy of Sciences and the National Geographic Society. Only research-grade observations are used. Each photo is © its photographer and shown under the licence printed beside it.

**Species summaries — Wikipedia.** Short summaries come from Wikipedia via iNaturalist, under CC BY-SA 4.0.

**City search — Open-Meteo and GeoNames.** Geocoding by Open-Meteo (open-meteo.com), CC BY 4.0, using place data from GeoNames (geonames.org), CC BY 4.0.

**Type.** Archivo by Omnibus-Type and Red Hat Mono by Red Hat, both under the SIL Open Font License, self-hosted via Fontsource.

**Icons.** Lucide (lucide.dev), ISC licence.

**Made by.** Syailendra Ginting. Source code: github.com/sg208/fieldguide (MIT).

### 8.10 Later: Near me (deferred)
Button "Use my location" (locate icon) under the city field. Hint: "Your browser will ask first. We send the coordinates to our server and iNaturalist to find species, and keep nothing." Denied: "Location is off for this site. Pick a city instead." Unavailable: "Couldn’t get your location. Pick a city instead." Privacy section to add: "**Your location.** Only if you tap Use my location, your browser shares your approximate coordinates with our server, which passes them to iNaturalist to find species near you. We do not store them."

## 9. Motion

| Moment | Spec | Reduced motion |
| --- | --- | --- |
| Card / drawer hover | `translateY(-2px)` + shadow-sheet → shadow-lift, 200ms `--ease-settle` | shadow change only |
| Switch knob | translateX 18px, 180ms `--ease-settle` | instant |
| Results swap (client filter/page) | skeleton immediately; new cards fade in 160ms, no stagger | instant |
| Return flag | on `:target`, the card outline and "Opened" tab appear with a 240ms scale from 0.96 → 1 on the tab | static |
| Toast | rise 12px + fade, 180ms in, 140ms out | fade only |
| Gallery Prev/Next | `scrollBy` smooth | `behavior: 'auto'` |

No page-transition library, no entrance animations on scroll, no parallax. Content is visible by default with JS off.

## 10. Accessibility checklist (engineer-owned)
- One `h1` per page (home hero, place city, species common name, legal title, system title).
- Landmarks: `header`, `main#main`, `nav` (filters are a `form` with `aria-label="Filter species"`), `footer`.
- Focus order follows reading order; sticky filter bar never covers the focused card (`scroll-padding-top` = filter bar height on `html`).
- Client-side result updates: announce "{n} species, page {p} of {P}" in a polite live region; move focus only on pager use.
- Links that open iNat/Wikipedia stay in the same tab; external icon is decorative and the name says the destination.
- Scientific names: `lang="la"`.
- Every interactive target ≥ 24×24; buttons, chips, segments, pager items ≥ 44×44.
- Test with 200% text zoom and 320px width: chips scroll, cards stay two columns down to 340px, then one column below 340px.

## 11. PWA

`/manifest.webmanifest`:

```json
{
  "id": "/",
  "name": "Field Guide",
  "short_name": "Field Guide",
  "description": "See what lives near any city, from iNaturalist research-grade observations.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#E4E8E1",
  "theme_color": "#E4E8E1",
  "lang": "en",
  "categories": ["education", "reference"],
  "icons": [
    { "src": "/icons/icon.svg", "type": "image/svg+xml", "sizes": "any", "purpose": "any" },
    { "src": "/icons/icon-maskable.svg", "type": "image/svg+xml", "sizes": "any", "purpose": "maskable" },
    { "src": "/icons/icon-192.png", "type": "image/png", "sizes": "192x192", "purpose": "any" },
    { "src": "/icons/icon-512.png", "type": "image/png", "sizes": "512x512", "purpose": "any" },
    { "src": "/icons/icon-maskable-512.png", "type": "image/png", "sizes": "512x512", "purpose": "maskable" },
    { "src": "/icons/icon-monochrome.svg", "type": "image/svg+xml", "sizes": "any", "purpose": "monochrome" }
  ]
}
```

- `<meta name="theme-color" content="#E4E8E1" media="(prefers-color-scheme: light)">` and `content="#101312"` for dark.
- `apple-touch-icon` 180×180 PNG from `icon.svg` on the violet ground (iOS ignores transparency and rounds corners itself, so render it from `icon-maskable.svg`, full-bleed).
- `favicon.svg` = `icon.svg`; `favicon.ico` 32×32 fallback.
- Icon sources: `design/icon.svg` (rounded, for "any"), `design/icon-maskable.svg` (full-bleed, mark inside the 80% safe circle), `design/icon-monochrome.svg` (single colour, cut-outs). Rasterise the PNGs once at build time (e.g. `npx @resvg/resvg-js-cli`) and commit them. Preview: `design/screens/icons.png`.
- Icon concept: a specimen label tag (the card's label) on accession violet. Not a pin, not a leaf.
- Service worker: precache the app shell, fonts, icons and `/offline`; runtime cache place/species HTML and `/img/*` with stale-while-revalidate, capped (e.g. 40 pages, 300 images); navigation fallback `/offline`. Never cache `/api/geocode`.

## 12. Do not get wrong
1. Every photo shows its credit, in text, everywhere it appears (cards compact, gallery full). No credit → no photo.
2. Counts are observations, not populations. Keep the wording.
3. Same-name cities: always show admin1 + country in the list; never auto-select the first "La Paz".
4. Continent colour comes from a country-code map you maintain in code; Open-Meteo has no continent field.
5. Images through the Worker, or rewrite the privacy paragraph. Nothing else in the browser may call a third party.
6. No storage APIs except Cache Storage. The return flag uses the URL fragment and history, not storage.
7. Violet means "action, focus or current" only. Do not use it for decoration, links in body text, or badges.
8. Threatened-species locations are obscured by iNat; show the note, never present those coordinates as exact.
9. `?page` is capped at 10 and at the real last page; redirect beyond it.
10. Keep the pokedex out: no full-bleed flat colour sections at all (the folder cover is a contained box), no square-cornered giant type blocks, no hard offset shadows.
11. Mono is for numbers and codes only (coordinates, counts, dates, licence codes, ranks). Words like rank names or "None" use Archivo.
12. Every scientific name carries `lang="la"`.

## 13. Comp vs handoff (where they differ, this file wins)

The comps are static HTML approximations. Build to this document; these are the known gaps:

1. Home drawers: 4 columns from `lg` (1024), as in §5 (the comp switches at 768).
2. 404 / offline h1: `--text-title` (max 3.5rem), as for species and legal (the comp uses up to 4rem).
3. Legal doc nav below 1024: the current item is a violet-filled chip (`--stamp` / `--on-stamp`, `aria-current="page"`), matching the comp; ≥1024 it is stamp-soft fill + 700.
4. "Back to {City}": radius `--radius-tab` (6px 6px 0 0), as in §6 (the comp rounds all corners).
5. Legal cover: padding steps at `lg` like the place cover; h1 line-height 0.98.
6. Token names: use the `@theme` names in §2 (`--radius-*`, `--text-*`, `--ease-settle`); the comps' `--r-*` names are local shorthands with the same values.
7. Theme: system `prefers-color-scheme` only. The comps' `data-theme` override exists only for previewing screenshots; do not ship a toggle (it would need storage).
