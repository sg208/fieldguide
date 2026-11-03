import { useEffect, type ReactNode } from 'react';

/** Registers /sw.js after the page has loaded; production builds only (a dev SW would cache stale modules). */
export const RegisterSW = (): ReactNode => {
  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
    const register = (): void => {
      void navigator.serviceWorker.register('/sw.js', { scope: '/' });
    };
    if (document.readyState === 'complete') {
      register();
      return;
    }
    window.addEventListener('load', register, { once: true });
    return (): void => window.removeEventListener('load', register);
  }, []);
  return null;
};
