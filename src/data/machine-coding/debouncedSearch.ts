import type { MachineCodingProblem } from "../../types";

export const debouncedSearchProblem: MachineCodingProblem = {
  id: "mc-debounced-search",
  title: "Debounced API Search",
  difficulty: "Intermediate",
  category: "Machine Coding",
  tags: [
    "debounce",
    "search",
    "api",
    "abort-controller",
    "stale-response",
    "loading-state",
    "useEffect",
  ],
  problemStatement: `Build a Debounced API Search component in React that fetches search results from an API after the user stops typing for a specified delay. The component must handle loading, error, and empty states, and protect against stale responses where an earlier slow request resolves after a later fast one.

The debounce logic should be implemented as a custom hook. When a new keystroke arrives before the debounce timer fires, the timer resets. Once the debounced value updates, a fetch is triggered. If the user types again during a pending request, the previous request should be cancelled via AbortController. The component should show a minimum loading indicator duration to avoid flash-of-loading for fast responses.

This is one of the most commonly asked machine coding problems because it combines debouncing, async data fetching, race condition handling, and clean state management — all critical for real production apps.`,
  functionalRequirements: [
    "Text input that triggers an API search after a debounce delay (300ms)",
    "Display search results in a list below the input",
    "Show a loading indicator while the API request is in flight",
    "Show an error message with a retry button on failure",
    "Show an empty state message when no results match",
    "Cancel previous in-flight requests when a new debounced search fires",
    "Protect against stale responses overwriting newer results",
    "Clear results when the input is cleared",
  ],
  nonFunctionalRequirements: [
    "Debounce implemented as a reusable custom hook",
    "AbortController used for request cancellation",
    "Minimum loading duration (200ms) to prevent loading state flash",
    "Accessible: input has label, results have list semantics, loading announced via aria-live",
  ],
  componentHierarchy: `DebouncedSearch
├── SearchInput
│   ├── Label
│   ├── Input
│   └── ClearButton
├── LoadingIndicator
├── ErrorState
│   └── RetryButton
├── EmptyState
└── ResultsList
    └── ResultItem (per result)`,
  stateDesign: `const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 300);

interface SearchResult {
  id: number;
  title: string;
  description: string;
}

type SearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; results: SearchResult[] }
  | { status: 'error'; message: string };

const [state, setState] = useState<SearchState>({ status: 'idle' });
const abortControllerRef = useRef<AbortController | null>(null);
const requestCounterRef = useRef(0);`,
  architecture: `The component architecture separates concerns into layers: a useDebounce hook handles the timing logic, a useSearch hook handles the API integration with cancellation and stale-response protection, and the main component handles rendering.

The useDebounce hook uses a setTimeout that resets on each value change. The useSearch hook watches the debounced query, cancels any previous request, creates a new AbortController, and fetches data. A monotonically increasing counter tracks request order — when a response arrives, the counter is checked to ensure it's still the latest request. The component renders one of four branches based on the discriminated union state.`,
  implementation: `import React, { useState, useEffect, useRef, useCallback } from 'react';

interface SearchResult {
  id: number;
  title: string;
  description: string;
}

type SearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; results: SearchResult[] }
  | { status: 'error'; message: string };

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const MOCK_DATA: SearchResult[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: \`Result Item \${i + 1}\`,
  description: \`Description for search result number \${i + 1} with detailed information.\`,
}));

async function mockSearchApi(query: string, signal: AbortSignal): Promise<SearchResult[]> {
  const delay = 300 + Math.random() * 700;
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, delay);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

  const lower = query.toLowerCase();
  return MOCK_DATA.filter(
    (item) =>
      item.title.toLowerCase().includes(lower) ||
      item.description.toLowerCase().includes(lower)
  );
}

function useSearch(debouncedQuery: string) {
  const [state, setState] = useState<SearchState>({ status: 'idle' });
  const abortRef = useRef<AbortController | null>(null);
  const counterRef = useRef(0);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState({ status: 'idle' });
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const requestId = ++counterRef.current;

    setState({ status: 'loading' });
    const startTime = Date.now();

    try {
      const results = await mockSearchApi(query, controller.signal);
      if (requestId !== counterRef.current) return;

      const elapsed = Date.now() - startTime;
      const minDuration = 200;
      if (elapsed < minDuration) {
        await new Promise((r) => setTimeout(r, minDuration - elapsed));
      }

      if (requestId !== counterRef.current) return;
      setState({ status: 'success', results });
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      if (requestId !== counterRef.current) return;
      setState({ status: 'error', message: (err as Error).message });
    }
  }, []);

  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  return { state, retry: () => search(debouncedQuery) };
}

export default function DebouncedSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { state, retry } = useSearch(debouncedQuery);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16, fontFamily: 'system-ui' }}>
      <h2 style={{ margin: '0 0 12px' }}>Search</h2>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <label htmlFor="search-input" style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
          Search items
        </label>
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search…"
          aria-describedby="search-status"
          style={{
            width: '100%', padding: '10px 36px 10px 12px', fontSize: 14,
            border: '2px solid #e2e8f0', borderRadius: 8, outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Clear search"
            style={{
              position: 'absolute', right: 8, bottom: 8,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#94a3b8', fontSize: 18, lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>

      <div id="search-status" aria-live="polite">
        {state.status === 'loading' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 16, color: '#64748b' }}>
            <div
              style={{
                width: 20, height: 20, border: '2px solid #e2e8f0',
                borderTopColor: '#3b82f6', borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
              }}
            />
            Searching…
            <style>{\`@keyframes spin { to { transform: rotate(360deg); } }\`}</style>
          </div>
        )}

        {state.status === 'error' && (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <p style={{ color: '#ef4444', fontWeight: 600 }}>Search failed</p>
            <p style={{ color: '#64748b', margin: '4px 0 12px' }}>{state.message}</p>
            <button
              onClick={retry}
              style={{
                padding: '8px 20px', background: '#3b82f6', color: '#fff',
                border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500,
              }}
            >
              Retry
            </button>
          </div>
        )}

        {state.status === 'success' && state.results.length === 0 && (
          <div style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>
            <p style={{ fontSize: 36, margin: 0 }}>🔍</p>
            <p style={{ fontWeight: 600 }}>No results for "{debouncedQuery}"</p>
          </div>
        )}

        {state.status === 'success' && state.results.length > 0 && (
          <>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>
              {state.results.length} result{state.results.length !== 1 ? 's' : ''} for "{debouncedQuery}"
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} role="list">
              {state.results.map((result) => (
                <li
                  key={result.id}
                  style={{
                    padding: '12px 14px', borderBottom: '1px solid #f1f5f9',
                    background: '#fff',
                  }}
                >
                  <h4 style={{ margin: '0 0 4px', fontSize: 15, color: '#1e293b' }}>{result.title}</h4>
                  <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.4 }}>
                    {result.description}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}`,
  accessibility: `The input has a visible <label> associated by htmlFor/id. The search status region (loading, error, results) is wrapped in an aria-live="polite" container announced by screen readers. The input uses aria-describedby to link to the status. Results use semantic list elements. The clear button has an aria-label. The loading spinner is purely visual; the "Searching…" text is read by assistive technology.`,
  performance: `Debouncing reduces API calls by ~80% compared to searching on every keystroke. AbortController cancels in-flight requests, freeing network resources. The request counter prevents stale responses from overwriting newer data. The minimum loading duration of 200ms prevents flicker for fast responses — if the response arrives in 50ms, the loading state still shows for at least 200ms. The mock data filter is O(n) per search.`,
  edgeCases: [
    "User types and immediately clears — debounce resets, state returns to idle",
    "Rapid typing produces multiple debounced values — each aborts the previous request",
    "API responds out of order — request counter discards stale responses",
    "Component unmounts during pending request — AbortController in cleanup prevents state update",
    "Empty search after results are shown — results cleared, return to idle",
    "Network error vs abort error — only network errors show error state; aborts are silent",
    "Very long query string — API may need server-side truncation",
  ],
  testingStrategy: [
    "Unit test: useDebounce fires after specified delay and resets on new value",
    "Unit test: useSearch transitions through loading → success states",
    "Unit test: useSearch handles error and exposes retry function",
    "Integration test: typing produces results after debounce delay",
    "Integration test: clearing input returns to idle state",
    "Integration test: retry after error re-fetches successfully",
    "Race condition test: simulate slow first request, fast second — verify second result wins",
    "Cleanup test: unmounting during fetch does not cause state update warnings",
  ],
  improvements: [
    "Add search result highlighting (bold the matching substring)",
    "Cache previous search results and show instantly on repeated queries",
    "Add search filters (category, date range) alongside text search",
    "Implement search-as-you-type with progressive result refinement",
    "Add keyboard navigation for search results list",
  ],
  followUpQuestions: [
    "Why use a request counter in addition to AbortController for stale response protection?",
    "How would you implement a caching layer for search results?",
    "What is the minimum loading duration technique and why is it important for UX?",
    "How would you unit test the debounce behavior with fake timers?",
  ],
};
