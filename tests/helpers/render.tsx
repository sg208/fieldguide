import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

type Options = { path?: string; queryClient?: QueryClient };

// Component specs call this instead of render(): `Link` needs a router and
// useQuery needs a QueryClient. The tree is a throwaway memory router whose
// root renders `ui`, so hrefs and navigation work without the real route tree.
// Await it: the router loads before the first paint.
export const renderWithProviders = async (
  ui: ReactElement,
  { path = '/', queryClient = createTestQueryClient() }: Options = {}
): Promise<RenderResult & { queryClient: QueryClient }> => {
  const rootRoute = createRootRoute({
    component: (): ReactNode => (
      <>
        {ui}
        <Outlet />
      </>
    ),
  });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  await router.load();
  const result = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
  return { ...result, queryClient };
};

export const createTestQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  });
