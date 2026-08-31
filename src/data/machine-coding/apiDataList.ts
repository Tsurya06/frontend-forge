import type { MachineCodingProblem } from '../../types';

export const apiDataListProblem: MachineCodingProblem = {
  id: 'mc-api-data-list',
  title: 'API Data List',
  difficulty: 'Beginner',
  category: 'Machine Coding',
  tags: ['api', 'fetch', 'loading-state', 'error-handling', 'retry', 'empty-state', 'useEffect'],
  problemStatement: `Build an API Data List component that fetches data from a REST endpoint, displays it in a structured list, and properly handles all asynchronous states: loading, success, error, and empty results.

The component should show a loading spinner while data is being fetched, an error message with a retry button when the request fails, and a friendly empty-state illustration when the API returns zero results. Data should be displayed in a clean card-based layout with relevant metadata. The component must gracefully handle race conditions when the user triggers multiple fetches in quick succession (e.g., via a refresh button or filter change).

This is a foundational pattern used in virtually every production React app — demonstrating mastery of async data fetching, state machines for request lifecycle, and resilient UX.`,
  functionalRequirements: [
    'Fetch data from a configurable API endpoint on mount',
    'Display a loading spinner/skeleton while the request is in flight',
    'Render data items in a card or list layout showing key fields',
    'Show an error message with a "Retry" button when fetch fails',
    'Display an empty-state message when the response is an empty array',
    'Support a manual refresh button to re-fetch data',
    'Abort in-flight requests on unmount to prevent state updates on unmounted components',
  ],
  nonFunctionalRequirements: [
    'Use a clear state-machine pattern (idle → loading → success/error) to avoid impossible states',
    'Accessible: loading spinner has role="status" and aria-live for screen readers',
    'Responsive layout that adapts from single-column mobile to multi-column desktop',
  ],
  componentHierarchy: `ApiDataList
├── RefreshButton
├── LoadingSpinner (shown during fetch)
├── ErrorMessage (shown on failure)
│   └── RetryButton
├── EmptyState (shown when data is empty)
└── DataGrid
    └── DataCard (per item)
        ├── CardTitle
        └── CardMeta`,
  stateDesign: `type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// Usage
const [state, setState] = useState<RequestState<Item[]>>({ status: 'idle' });

interface Item {
  id: number;
  title: string;
  body: string;
  userId: number;
}`,
  architecture: `The component uses a discriminated union (tagged state machine) for request state instead of separate boolean flags. This eliminates impossible states like { loading: true, error: 'something' }. A custom useFetch hook encapsulates the fetch logic, AbortController management, and state transitions. The hook exposes the current state and a refetch function. The main component pattern-matches on state.status to render the appropriate UI branch.`,
  implementation: `import React, { useState, useEffect, useCallback } from 'react';

interface Item {
  id: number;
  title: string;
  body: string;
  userId: number;
}

type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function useFetch<T>(url: string) {
  const [state, setState] = useState<RequestState<T>>({ status: 'idle' });

  const fetchData = useCallback(async () => {
    setState({ status: 'loading' });
    const controller = new AbortController();

    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
      const data: T = await res.json();
      setState({ status: 'success', data });
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setState({ status: 'error', error: (err as Error).message });
      }
    }

    return () => controller.abort();
  }, [url]);

  useEffect(() => {
    const cleanup = fetchData();
    return () => { cleanup.then((abort) => abort()); };
  }, [fetchData]);

  return { state, refetch: fetchData };
}

function LoadingSpinner() {
  return (
    <div role="status" aria-live="polite" style={{ textAlign: 'center', padding: 40 }}>
      <div
        style={{
          width: 36, height: 36, border: '3px solid #e2e8f0',
          borderTopColor: '#3b82f6', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto',
        }}
      />
      <p style={{ marginTop: 12, color: '#64748b' }}>Loading data…</p>
      <style>{\`@keyframes spin { to { transform: rotate(360deg); } }\`}</style>
    </div>
  );
}

function ErrorMessage({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" style={{ textAlign: 'center', padding: 40 }}>
      <p style={{ fontSize: 18, fontWeight: 600, color: '#ef4444' }}>Something went wrong</p>
      <p style={{ color: '#64748b', margin: '8px 0 16px' }}>{message}</p>
      <button
        onClick={onRetry}
        style={{
          padding: '8px 20px', background: '#3b82f6', color: '#fff',
          border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500,
        }}
      >
        Retry
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
      <p style={{ fontSize: 48, margin: 0 }}>📭</p>
      <p style={{ fontWeight: 600, fontSize: 18 }}>No items found</p>
      <p>Try adjusting your filters or check back later.</p>
    </div>
  );
}

function DataCard({ item }: { item: Item }) {
  return (
    <article
      style={{
        padding: 16, border: '1px solid #e2e8f0', borderRadius: 8,
        background: '#fff', marginBottom: 12,
      }}
    >
      <h3 style={{ margin: '0 0 8px', fontSize: 16, color: '#1e293b' }}>{item.title}</h3>
      <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.5 }}>{item.body}</p>
      <span style={{ display: 'inline-block', marginTop: 8, fontSize: 12, color: '#94a3b8' }}>
        User #{item.userId}
      </span>
    </article>
  );
}

export default function ApiDataList() {
  const { state, refetch } = useFetch<Item[]>('https://jsonplaceholder.typicode.com/posts');

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Posts</h2>
        <button
          onClick={() => refetch()}
          disabled={state.status === 'loading'}
          aria-label="Refresh data"
          style={{
            padding: '6px 14px', border: '1px solid #cbd5e1', borderRadius: 6,
            background: '#fff', cursor: 'pointer', fontWeight: 500,
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {state.status === 'loading' && <LoadingSpinner />}
      {state.status === 'error' && <ErrorMessage message={state.error} onRetry={() => refetch()} />}
      {state.status === 'success' && state.data.length === 0 && <EmptyState />}
      {state.status === 'success' && state.data.length > 0 && (
        <div role="list" aria-label="Data items">
          {state.data.map((item) => (
            <div role="listitem" key={item.id}>
              <DataCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`,
  accessibility: `The loading spinner has role="status" and aria-live="polite" so screen readers announce when data is loading. The error message uses role="alert" to immediately announce failures. The data list uses role="list" and role="listitem" for semantic structure. The refresh button has an aria-label and is disabled during loading. Each DataCard is an <article> element providing semantic grouping.`,
  performance: `The custom hook uses AbortController to cancel in-flight requests on unmount or refetch, preventing memory leaks and state updates on unmounted components. The discriminated union state avoids redundant re-renders from multiple setState calls. For large lists, consider virtualization (react-window) or pagination. Memoize DataCard with React.memo if the list is long and parent re-renders frequently.`,
  edgeCases: [
    'Rapid refresh clicks — abort previous request before starting new one',
    'Component unmounts during fetch — AbortController prevents setState on unmounted component',
    'API returns 200 but invalid JSON — catch parsing error and show error state',
    'Network timeout — set a timeout on fetch and show appropriate error',
    'API returns partial data — validate shape before rendering to avoid runtime crashes',
  ],
  testingStrategy: [
    'Unit test: useFetch transitions through idle → loading → success states correctly',
    'Unit test: useFetch transitions to error state on network failure',
    'Integration test: component renders loading spinner, then data cards on successful fetch',
    'Integration test: retry button re-fetches and shows data on second attempt',
    'Integration test: empty state shown when API returns empty array',
    'Mock test: MSW or jest.mock to simulate various API responses',
  ],
  improvements: [
    'Add skeleton loading placeholders instead of a plain spinner',
    'Implement pagination or infinite scroll for large datasets',
    'Add client-side search/filter over fetched data',
    'Cache responses in memory or localStorage to reduce redundant requests',
    'Add optimistic updates and stale-while-revalidate pattern',
  ],
  followUpQuestions: [
    'How would you implement stale-while-revalidate caching for this data?',
    'What are the trade-offs between a discriminated union and boolean flags for async state?',
    'How would you add pagination: offset-based vs cursor-based?',
    'How would you test this component using Mock Service Worker (MSW)?',
  ],
};
