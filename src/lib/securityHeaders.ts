// Keep PHOTO_HOSTS in public/sw.js and the img-src in public/_headers in sync.
export const PHOTO_HOSTS = [
  'inaturalist-open-data.s3.amazonaws.com',
  'static.inaturalist.org',
] as const;

const photoSources = PHOTO_HOSTS.map((host) => `https://${host}`).join(' ');

const CSP_REPORT_ONLY = [
  "default-src 'self'",
  `img-src 'self' data: ${photoSources}`,
  "connect-src 'self' https://api.inaturalist.org",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

// Keep public/_headers (static assets) in sync with this list.
export const buildSecurityHeaders = (): Record<string, string> => ({
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(self), payment=(), usb=()',
  'Content-Security-Policy-Report-Only': CSP_REPORT_ONLY,
});
