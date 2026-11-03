// One-off: rasterise design/icon*.svg into public/icons (PNG). Run by hand, commit the result.
//   node scripts/build-icons.mjs
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync } from 'node:fs';

const OUT = 'public/icons';
mkdirSync(OUT, { recursive: true });

for (const name of ['icon', 'icon-maskable', 'icon-monochrome']) {
  copyFileSync(`design/${name}.svg`, `${OUT}/${name}.svg`);
}

// [source svg, output png, size]. iOS ignores transparency and rounds corners
// itself, so the apple-touch-icon renders from the full-bleed maskable source.
const PNGS = [
  ['icon', 'icon-192', 192],
  ['icon', 'icon-512', 512],
  ['icon-maskable', 'icon-maskable-512', 512],
  ['icon-maskable', 'apple-touch-icon', 180],
];

for (const [source, output, size] of PNGS) {
  execFileSync(
    'npx',
    [
      '--yes',
      '@resvg/resvg-js-cli',
      '--fit-width',
      String(size),
      `design/${source}.svg`,
      `${OUT}/${output}.png`,
    ],
    { stdio: 'inherit' }
  );
}
