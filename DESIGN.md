---
name: Field Guide
description: What lives near any city, mounted as specimens in a herbarium cabinet.
colors:
  board: "#E4E8E1"
  sheet: "#FCFCFA"
  ink: "#15191B"
  ink-2: "#4A524E"
  rule: "#D3D9D1"
  edge: "#737D76"
  stamp: "#4A3A92"
  stamp-soft: "#E9E5F6"
  on-stamp: "#FFFFFF"
  redlist: "#B3261E"
  introduced: "#8A5A00"
  endemic: "#1F5E8C"
  cover-africa: "#8A5A12"
  cover-asia: "#9B2F2A"
  cover-europe: "#1F4E79"
  cover-namerica: "#1E5E5E"
  cover-samerica: "#6B3466"
  cover-oceania: "#0E5F86"
  cover-antarctica: "#3E4A52"
  cover-neutral: "#3E4A52"
typography:
  hero:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.4rem + 5.2vw, 5.25rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 80"
  place:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.6rem + 4vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 80"
  title:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.6rem + 3vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 80"
  headline:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 650
    lineHeight: 1.1
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 87"
  drawer-name:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 87"
  card-name:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 650
    lineHeight: 1.2
    fontVariation: "'wdth' 87"
  read:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    fontVariation: "'wdth' 100"
  body:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    fontVariation: "'wdth' 100"
  control:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 550
    lineHeight: 1.3
  label:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.06em"
  caption:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.06em"
  mono:
    fontFamily: "Red Hat Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.92em"
    fontWeight: 500
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
rounded:
  label: "2px"
  sheet: "3px"
  control: "6px"
  tab: "6px 6px 0 0"
  chip: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "14": "56px"
  "18": "72px"
  "22": "88px"
components:
  button-primary:
    backgroundColor: "{colors.stamp}"
    textColor: "{colors.on-stamp}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.board}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  chip:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.chip}"
    padding: "0 14px"
    height: "40px"
  chip-checked:
    backgroundColor: "{colors.stamp}"
    textColor: "{colors.on-stamp}"
  specimen-card:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "10px 12px"
  folder-cover:
    backgroundColor: "{colors.cover-asia}"
    textColor: "{colors.on-stamp}"
    rounded: "0 3px 3px 3px"
    padding: "20px 20px 24px"
  licence-box:
    textColor: "{colors.ink}"
    typography: "{typography.mono}"
    rounded: "{rounded.label}"
    padding: "0 4px"
  badge-threat:
    textColor: "{colors.redlist}"
    typography: "{typography.caption}"
    rounded: "{rounded.label}"
    padding: "0 6px"
    height: "22px"
  pager-current:
    backgroundColor: "{colors.stamp}"
    textColor: "{colors.on-stamp}"
    rounded: "{rounded.control}"
    size: "44px"
  input-sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "56px"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.board}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
---

# Design System: Field Guide

## Overview

**Creative North Star: "The Herbarium Cabinet"**

Every species near a city is a mounted specimen: a white sheet pinned to a pale enamel board, a photo, and a ruled collection label underneath (rank, common name, italic scientific name, observation count, photo credit). Every place is a species folder whose cover takes its continent colour. The visitor opens a drawer, reads labels, and leaves knowing who took every photo. The photo credit is the most designed object on a card, because the product's first principle is that photos are evidence.

The system is calm reading furniture, not a nature app and not a poster. Density is high in the grid (two columns on phones, five at 1280) but each sheet is quiet: one photo, one label, hairline rules. Colour is held back to three jobs: continent colour on folder covers and drawer cover strips, accession-stamp violet for action, focus and current state, and conservation red for threat. Everything else is ink on paper on enamel. Depth is soft and physical: sheets lift off the board with paper shadows; nothing is hard-edged or offset.

Confirmed rejections (PRODUCT.md brand commitments): it must not resemble the sibling pokedex.engg.app (square corners, giant flat type blocks, flat saturated full-bleed bands), and it rejects the generic nature-app look (green gradient hero, leaf emoji, glassmorphism).

**Key Characteristics:**
- Enamel board ground, white mounting sheets with 3px corners and soft paper shadows.
- Ruled specimen labels: hairline `rule` dividers, uppercase field labels, mono for every number and code.
- Continent-coloured folder covers as contained boxes with a tab, never full-bleed.
- Violet accession-stamp ink only for action, focus and current state.
- Archivo variable, semi-condensed (wdth 80) for display, wdth 87 for headings, wdth 100 for reading.
- State shown by line, fill and weight, never colour alone.

## Colors

Ink on paper on enamel, with one stamp ink for doing and a set of muted continent covers for places. Light values are normative here; dark values are in the sidecar and switch with `prefers-color-scheme`.

### Primary
- **Accession-Stamp Violet** (`stamp`): primary buttons, checked chips, the month switch "on" track, the current pager page, the skip link, `::selection`, the 2px focus ring, the "Opened" return flag and its outline. Text on it is `on-stamp`.
- **Stamp Wash** (`stamp-soft`): the quiet "current" fill: active combobox option, current lineage row, current legal-nav item on desktop.

### Secondary
- **Continent Covers** (`cover-africa`, `cover-asia`, `cover-europe`, `cover-namerica`, `cover-samerica`, `cover-oceania`, `cover-antarctica`, `cover-neutral`): deep, desaturated cabinet-label colours, each carrying white text at 5.9:1 or better. Used only on folder covers, folder tabs, drawer cover strips and the species page "Back to {City}" button. Legal pages use `cover-neutral`.

### Tertiary
- **Conservation Red** (`redlist`): threatened badges (CR, EN, VU), the IUCN status stamp, the 3px top rule on error and rate-limited state blocks.
- **Introduced Amber** (`introduced`) and **Endemic Blue** (`endemic`): outline-only establishment badges, rendered only when the data supplies the field.

### Neutral
- **Cabinet Enamel** (`board`): the page ground, the site header, the sticky control strip.
- **Mounting Sheet** (`sheet`): every card, label sheet, table, document body, chip and secondary button.
- **Label Ink** (`ink`): body text, names, filled radius segments, chip hover border.
- **Faded Ink** (`ink-2`): scientific names, field labels, meta lines, captions, ledes.
- **Hairline Rule** (`rule`): label dividers, header and footer rules, skeleton blocks, the drawer pull.
- **Control Edge** (`edge`): 1px borders on buttons, chips, inputs, the switch, licence boxes, dashed empty-photo outlines (3.4:1 on board, 4.2:1 on sheet).

### Named Rules
**The Stamp Rule.** Violet means action, focus or current, and nothing else. Never decoration, never body links, never badges.

**The Covers-Only Rule.** Continent colour lives on folder covers, folder tabs, drawer cover strips and the Back-to-place button. It never fills a band edge to edge and never tints a sheet.

**The Status-Has-a-Field Rule.** Red, amber and blue badges appear only when the API supplies the status; their colour is always paired with a word and a border form (threat gets a double border).

## Typography

**Display Font:** Archivo Variable (wdth 62–125, wght 100–900, with ui-sans-serif, system-ui)
**Body Font:** Archivo Variable (italic file for scientific names)
**Label/Mono Font:** Red Hat Mono Variable (with ui-monospace, SF Mono, Menlo)

**Character:** One sans family doing three jobs by width alone: semi-condensed and tight for names on covers and sheets, slightly condensed for headings, normal width for reading. Red Hat Mono is the measuring instrument: coordinates, counts, dates, ranks, licence codes.

### Hierarchy
- **Hero** (700, wdth 80, `hero` clamp up to 84px, 0.98): the home h1 "What lives near", completed by the city combobox set at the same size on the line below.
- **Place** (700, wdth 80, `place` clamp up to 68px, 0.95): the city name on the folder cover.
- **Title** (700, wdth 80, `title` clamp up to 56px, 0.98): species, legal and system h1. The 404 and offline h1 run slightly larger (clamp(2.25rem, 1.5rem + 3.4vw, 4rem)).
- **Headline** (650, wdth 87, 22px): section h2s (results head, cabinet, about, lineage, ledger, legal sections) and state-block h3s (700).
- **Drawer name** (700, wdth 87, 22px, 26px from 1024): city names in the home drawers.
- **Card name** (650, wdth 87, 16px, 17px from 1024): specimen common names.
- **Read** (400, 17px, max 68ch): summaries, legal body, folder region and count line.
- **Body** (400, 16px, 1.55): default text. Meta and secondary lines at 14px in `ink-2`.
- **Control** (550–600, 15px): chips, switch labels, buttons, doc-nav links.
- **Label** (600, 12px, +0.06em, uppercase, `ink-2`): specimen-label field names: dl terms, lineage ranks, table heads, the "Radius" legend, folder tab (+0.08em).
- **Caption** (600, 11px, +0.06em, uppercase): the "PHOTO" caption on credits, badges (650), the "Opened" flag (650).
- **Mono** (500, 0.92em, tabular, -0.02em): every number and code. Counts in a label row go to 600.

### Named Rules
**The Measurement Rule.** Mono is for numbers and codes only (coordinates, counts, dates, licence and country codes, ranks, page numbers). Words, including rank names and "None", stay in Archivo.

**The Width-Not-Weight Rule.** Hierarchy comes from width first: wdth 80 for display, 87 for headings, 100 for reading. Scientific names are italic at wdth 100 and always carry `lang="la"`.

## Layout

Container max 1280px, 16px side padding (32px from 768). The page is a board with sheets laid on it, spaced on a 4px module; the rhythm in use is 8 / 12 / 16 / 20 / 24 / 32 / 40 / 56 / 72 / 88.

- **Home:** single column on phones; from 1024 a 7/5 split of hero text and two flat-mounted sheets (absolutely placed, square, not tilted). Drawers 2 columns (gap 12), 4 columns from 768 (gap 16). "How to read a label" goes 5/7 from 1024.
- **Place:** folder cover inside the container (20px top margin), then a sticky control strip on the board with a bottom hairline. Chips scroll inside their own row on phones and wrap from 1024. Specimen grid 2 / 3 (640) / 4 (1024, gap 20) / 5 (1280) columns; cards use subgrid rows so the credit rows line up across each row.
- **Species:** 7/5 from 1024 for gallery and label sheet, then 7/5 for about and lineage; the sightings ledger runs full width. The gallery bleeds to the screen edge on phones (86% slides so the next one peeks).
- **Legal:** doc nav as chips above the sheet; from 1024 a 220px sticky left nav plus the document sheet, text column 68ch.
- **404 / offline:** text then mount figure on phones; 5/6 figure/text from 1024.
- Breakpoints: 640, 768, 1024, 1280. No horizontal page scroll from 320px.

## Elevation & Depth

Physical and soft: sheets sit on the board with a two-layer paper shadow and lift on hover. Depth is never conveyed with borders around cards or with offset hard shadows. In dark mode the shadows deepen to black at 40–60% so sheets still read as lifted.

### Shadow Vocabulary
- **Sheet** (`box-shadow: 0 1px 2px rgb(21 25 27 / .08), 0 3px 10px -2px rgb(21 25 27 / .10)`): every resting sheet: specimen cards, drawers, label sheet, gallery figures, lineage, ledger table, legal document, folder cover, state blocks.
- **Lift** (`box-shadow: 0 2px 4px rgb(21 25 27 / .10), 0 10px 24px -6px rgb(21 25 27 / .18)`): hovered cards and drawers (with `translateY(-2px)`), the home hero sheets, the combobox listbox, the toast.

### Named Rules
**The Paper Rule.** A surface that holds content is a sheet: `sheet` fill, 3px corners, Sheet shadow. It lifts 2px to the Lift shadow on hover over 200ms `cubic-bezier(.2,.8,.2,1)`, and only the shadow changes under reduced motion.

## Shapes

Small, honest corners from a cabinet: 3px on sheets and covers, 2px on everything that is a printed label (licence box, badge, label holder, dl boxes, status stamp, notices), 6px on controls (buttons, inputs, pager items, toast), pills only for group chips and doc-nav chips. The folder is the one compound shape: a 6px-topped tab sitting on a cover with radius `0 3px 3px 3px`, so the tab reads as attached. The "Opened" flag is a small violet ribbon with a notched bottom. Rules carry state: solid ink fills the chosen radius segments, hairlines mark the rest; a 3px ink rule under the hero field turns violet on focus.

## Components

### Buttons
Tactile and plain, like cabinet hardware.
- **Shape:** gently rounded (6px), min height 44px, 0 16px padding, 600 weight 15px, icon gap 8px.
- **Primary:** violet fill and border, `on-stamp` text; hover brightens (`filter: brightness(1.12)`).
- **Secondary:** sheet fill, 1px `edge` border, ink text; hover fills with board and the border goes ink.
- **Ghost:** transparent; hover gets a sheet fill and a `rule` border (header "Change city").
- **On cover:** transparent with a 70% white border and white text; white focus ring. Icon-only 44px on phones.
- **Disabled pager ends:** 45% opacity, no pointer events, `aria-disabled`.
- **Focus:** 2px violet outline, 2px offset, everywhere.

### Chips
- **Style:** 40px tall pills (44px hit area), sheet fill, 1px `edge` border, 15px 550, text only, no icons.
- **State:** hover border ink; checked = violet fill, `on-stamp` text; focus ring offset 2.

### Cards / Containers
- **Corner Style:** 3px.
- **Background:** `sheet` on `board`.
- **Shadow Strategy:** Sheet at rest, Lift on hover (see Elevation).
- **Border:** none on the card; internal hairline `rule` dividers between photo, label and credit.
- **Internal Padding:** 10px 12px on the label, 8px 12px 10px on the credit; label sheets 20px (28px from 1024).

### Inputs / Fields
- **Hero combobox:** transparent, set at hero display size, 3px ink bottom rule that turns violet on focus with the search icon; visible "City" field label and hint under the rule.
- **Sheet combobox:** 56px tall, sheet fill, 1px `edge` border, 6px radius, focus ring on the wrapper. Listbox on a sheet with Lift shadow; active option gets the stamp wash only; matched text underlined 2px; country code in a mono label box.
- **Month switch:** 44×26 track with `edge` border; on = violet track, knob slides 18px over 180ms.

### Navigation
- **Header:** 60px on the board with a bottom hairline; violet label-tag mark plus "Field Guide" at 700 wdth 87; one right action.
- **Pager:** 44px mono page numbers, 6px radius; current = violet fill, 700; phones show "Page 1 of 10" between Prev and Next.
- **Legal doc nav:** chips on phones (current = violet fill); from 1024 a sticky vertical list, current = stamp wash + 700.
- **Footer:** top hairline, 14px `ink-2`, 44px nav links.

### Specimen Card (signature)
Square photo with 3px top corners, hairline, then the label: "No. {rank}" in mono 12px `ink-2`, common name, italic scientific name, optional badges, a ruled row with the count in mono 600 + "obs.". Below another hairline, the credit field: "PHOTO" caption on its own line, photographer in ink 500, and the licence code in a mono box (12px 600, 1px `edge` border, 2px radius, never broken). "All rights reserved" is plain `ink-2`, unboxed. The whole card is the link via an overlay; the credit sits above it so it stays selectable. Focus draws a violet ring around the whole card, offset 3.

### Return Flag "Opened" (signature)
On the specimen you came back from (`:target`), the card gets a 2px violet outline (offset 3) and a violet ribbon tab "OPENED" pinned over its top-right edge. It scales in from 0.96 over 240ms; static under reduced motion.

### Radius Scale Bar (signature)
The radius filter is drawn as a map scale bar: ticks 0 · 10 · 25 · 50 in mono 13px, three equal 64px segments 10px tall with 1px ink outlines, "km" unit. Segments up to the chosen radius fill solid ink; the chosen tick goes ink 700, others `ink-2`. State is carried by fill and weight, not colour.

### Folder Cover
Tab (continent name, 30px, uppercase 12px +0.08em, white) on a cover in the continent colour with the Sheet shadow, inside the container. Holds the city h1, region line, the count sentence with the number in mono 600, and from 1024 a ruled two-column locality label box (10% white fill, 45% white border, 2px radius).

### Drawer
Sheet with a continent cover strip (uppercase continent name, white), an inset label holder (1px `rule` border, 2px radius) with the city name, region and mono coordinates, and a 44×6 `rule` drawer pull.

### Status Stamp and Badges
The IUCN stamp is a double red rule (2px outer, 1px inner) holding the mono code and the uppercase word. Badges are 22px, 1px border in the status colour, 11px 650 uppercase; threat adds an inset second border.

### State Block
A sheet with h3, paragraph and actions; error and rate-limited add a 3px red top rule. Empty states use a dashed `edge` outline. No label above the heading.

## Do's and Don'ts

### Do:
- **Do** mount every content surface as a sheet: `sheet` fill, 3px corners, Sheet shadow, Lift on hover.
- **Do** keep continent colour inside folder covers, tabs, drawer strips and the Back-to-place button, inside the page container.
- **Do** set every number and code in Red Hat Mono, tabular, and every word in Archivo.
- **Do** show every photo's credit as text beside it: the "PHOTO" caption, the photographer, the licence in a mono box.
- **Do** carry state by line, fill and weight (filled scale segments, double threat border, solid vs hairline) as well as colour.
- **Do** use the 2px violet focus ring with 2px offset (white on covers, offset 3 around whole cards).

### Don't:
- **Don't** use violet for decoration, body links or badges.
- **Don't** stretch a cover or any flat colour edge to edge, set square-cornered giant type blocks, or use hard offset shadows (the pokedex.engg.app look).
- **Don't** use green gradient heroes, leaf emoji or glassmorphism.
- **Don't** put an uppercase label or kicker above a section or state heading; field labels name data inside a label. The folder tab and drawer cover strip naming the continent are part of the folder object, not kickers.
- **Don't** put coloured side borders on list items or nav; current items use the stamp wash or violet fill.
- **Don't** put icons on group chips, or truncate a credit or break inside a licence code.
- **Don't** tilt the hero sheets; they are mounted square.
