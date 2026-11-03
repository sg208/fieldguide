import type { QueryClient } from '@tanstack/react-query';
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Footer } from '../components/Footer';
import { Header, type HeaderVariant } from '../components/Header';
import { RouteFocus } from '../components/RouteFocus';
import { RegisterSW } from '../components/RegisterSW';
import { NotFound, RouteError } from '../components/RouteStates';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '../lib/site';
import appCss from '../styles.css?url';

const variantFor = (pathname: string): HeaderVariant => {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/place/') || pathname.startsWith('/species/')) {
    return 'app';
  }
  return 'system';
};

const RootDocument = (): ReactNode => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <div className="flex min-h-svh flex-col">
          <Header variant={variantFor(pathname)} />
          <main id="main" className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
        <RouteFocus />
        <RegisterSW />
        <Scripts />
      </body>
    </html>
  );
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title: `${SITE_NAME}: ${SITE_TAGLINE}` },
        { name: 'description', content: SITE_DESCRIPTION },
        {
          name: 'theme-color',
          content: '#E4E8E1',
          media: '(prefers-color-scheme: light)',
        },
        {
          name: 'theme-color',
          content: '#101312',
          media: '(prefers-color-scheme: dark)',
        },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary' },
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'icon', href: '/icons/icon.svg', type: 'image/svg+xml' },
        {
          rel: 'icon',
          href: '/icons/icon-192.png',
          type: 'image/png',
          sizes: '192x192',
        },
        { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
      ],
    }),
    component: RootDocument,
    notFoundComponent: NotFound,
    errorComponent: RouteError,
  }
);
