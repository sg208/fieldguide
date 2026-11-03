import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { NotFound, RouteError } from './components/RouteStates';
import { routeTree } from './routeTree.gen';

export const getRouter = (): ReturnType<
  typeof createRouter<typeof routeTree, 'never', false>
> => {
  // staleTime lives on each query factory (src/queries/*); only retry and
  // focus refetching are set here. Server renders never retry.
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: typeof window === 'undefined' ? 0 : 1,
        refetchOnWindowFocus: false,
      },
    },
  });
  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultNotFoundComponent: NotFound,
    defaultErrorComponent: RouteError,
  });
  setupRouterSsrQueryIntegration({ router, queryClient });
  return router;
};

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
