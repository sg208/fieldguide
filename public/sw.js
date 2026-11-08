// Field Guide service worker. Hand-written (no build step): bump VERSION to
// invalidate every cache. Never caches /_serverFn/* or non-GET requests.
const VERSION = 'v1';
const SHELL = `fieldguide-shell-${VERSION}`;
// Prefix must match PAGES_CACHE in src/lib/offlinePages.ts (tests/unit/sw.spec.ts pins it).
const PAGES = `fieldguide-pages-${VERSION}`;
const ASSETS = `fieldguide-assets-${VERSION}`;
const PHOTOS = `fieldguide-photos-${VERSION}`;
const CURRENT = [SHELL, PAGES, ASSETS, PHOTOS];

const PRECACHE = [
  '/manifest.webmanifest',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];
// Must stay within PHOTO_HOSTS in src/lib/securityHeaders.ts (CSP img-src).
const PHOTO_HOSTS = [
  'inaturalist-open-data.s3.amazonaws.com',
  'static.inaturalist.org',
];
const MAX_PAGES = 40;
const MAX_PHOTOS = 300;

// Keep the newest `max` entries; Cache.keys() lists oldest first.
const trim = async (name, max) => {
  const cache = await self.caches.open(name);
  const keys = await cache.keys();
  await Promise.all(
    keys
      .slice(0, Math.max(0, keys.length - max))
      .map((key) => cache.delete(key))
  );
};

const store = async (name, request, response, max) => {
  const cache = await self.caches.open(name);
  await cache.put(request, response);
  if (max) await trim(name, max);
};

// Opaque (no-cors cross-origin image) responses are fine to keep.
const isCacheable = (response) => response.ok || response.type === 'opaque';

const handleNavigation = async (event) => {
  const { request } = event;
  try {
    const response = await fetch(request);
    if (response.ok)
      event.waitUntil(store(PAGES, request, response.clone(), MAX_PAGES));
    return response;
  } catch {
    const saved = await self.caches.match(request);
    if (saved) return saved;
    // Redirect instead of serving the /offline HTML at this URL: the app would
    // hydrate for the requested route and fail its loader offline.
    if (await self.caches.match('/offline'))
      return Response.redirect(`${self.location.origin}/offline`, 302);
    return Response.error();
  }
};

const handleCacheFirst = async (event, name, max) => {
  const { request } = event;
  const hit = await self.caches.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (isCacheable(response))
    event.waitUntil(store(name, request, response.clone(), max));
  return response;
};

const precache = async () => {
  const cache = await self.caches.open(SHELL);
  await cache.addAll(PRECACHE);
  // /offline hydrates, so its hashed scripts and styles must be on hand too,
  // or the page breaks as soon as the network is gone.
  const response = await fetch('/offline');
  if (!response.ok) throw new Error('offline page unavailable');
  await cache.put('/offline', response.clone());
  const paths = (await response.text()).match(/\/assets\/[^"'\s<>\\]+/g) ?? [];
  const assets = await self.caches.open(ASSETS);
  await Promise.allSettled(
    [...new Set(paths)].map(async (path) => {
      const asset = await fetch(path);
      if (asset.ok) await assets.put(path, asset);
    })
  );
};

const cleanUp = async () => {
  const names = await self.caches.keys();
  await Promise.all(
    names
      .filter((name) => !CURRENT.includes(name))
      .map((name) => self.caches.delete(name))
  );
  await self.clients.claim();
};

self.addEventListener('install', (event) => {
  event.waitUntil(precache());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(cleanUp());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (PHOTO_HOSTS.includes(url.hostname)) {
    event.respondWith(handleCacheFirst(event, PHOTOS, MAX_PHOTOS));
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (
    url.pathname.startsWith('/_serverFn/') ||
    url.pathname.startsWith('/api/')
  )
    return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(event));
  } else if (url.pathname.startsWith('/assets/')) {
    event.respondWith(handleCacheFirst(event, ASSETS));
  }
});
