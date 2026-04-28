/**
 * AppWithDevTools
 *
 * Root component that wraps the full app with:
 *  - QueryClientProvider  (React Query server state)
 *  - ReactQueryDevtools   (visual cache inspector, shown in dev mode)
 *
 * This is what main.tsx renders. Having it in its own file lets tests
 * import and assert that DevTools is present without touching main.tsx.
 */
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import { TASKS_STALE_TIME, TASKS_GC_TIME } from './hooks/useTasks';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * Caching strategy:
       *  - staleTime: cached data is considered fresh for 30 s → no unnecessary
       *    background refetches while the user navigates quickly.
       *  - gcTime: inactive data is kept in memory for 5 min → instant display
       *    when the user revisits a view, even after navigating away.
       *  - retry: 2 automatic retries on network failure before showing an error.
       */
      staleTime: TASKS_STALE_TIME,
      gcTime: TASKS_GC_TIME,
      retry: 2,
    },
  },
});

const AppWithDevTools: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <App />
    {/* DevTools panel — only bundled in development builds (tree-shaken in prod) */}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default AppWithDevTools;
