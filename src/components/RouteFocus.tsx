import { useRouterState } from '@tanstack/react-router';
import { useEffect, useRef, type ReactNode } from 'react';

/** After a client-side navigation resolves, moves focus to the new page's h1 (or #main) so screen readers announce the page. */
export const RouteFocus = (): ReactNode => {
  const pathname = useRouterState({
    select: (state) => state.resolvedLocation?.pathname,
  });
  const previous = useRef(pathname);

  useEffect((): (() => void) | undefined => {
    if (pathname === undefined || previous.current === pathname) return undefined;
    previous.current = pathname;
    const frame = requestAnimationFrame((): void => {
      const main = document.getElementById('main');
      const target = main?.querySelector<HTMLElement>('h1') ?? main;
      if (target && !target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      target?.focus({ preventScroll: true });
    });
    return (): void => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
};
