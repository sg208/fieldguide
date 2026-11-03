import { describe, expect, it } from 'vitest';
import { buildSecurityHeaders } from '../../src/lib/securityHeaders';

describe('buildSecurityHeaders', () => {
  const headers = buildSecurityHeaders();

  it('sends HSTS for one year without includeSubDomains', () => {
    expect(headers['Strict-Transport-Security']).toBe('max-age=31536000');
  });

  it('sends the basic hardening headers', () => {
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['X-Frame-Options']).toBe('DENY');
  });

  it('allows geolocation for self only', () => {
    expect(headers['Permissions-Policy']).toBe(
      'camera=(), microphone=(), geolocation=(self), payment=(), usb=()'
    );
  });

  it('ships the CSP in Report-Only mode', () => {
    expect(headers).not.toHaveProperty('Content-Security-Policy');
    const csp = headers['Content-Security-Policy-Report-Only'];
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("connect-src 'self'");
    expect(csp).toContain(
      "img-src 'self' data: https://inaturalist-open-data.s3.amazonaws.com https://static.inaturalist.org"
    );
    expect(csp).toContain("script-src 'self' 'unsafe-inline'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("manifest-src 'self'");
    expect(csp).toContain("worker-src 'self'");
  });
});
