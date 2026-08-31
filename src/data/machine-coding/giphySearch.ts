import type { MachineCodingProblem } from '../../types';

export const giphySearchProblem: MachineCodingProblem = {
  id: 'mc-giphy-search',
  title: 'Giphy Search',
  difficulty: 'Intermediate',
  category: 'Machine Coding',
  tags: ['api', 'search', 'debounce', 'image-grid', 'pagination', 'responsive', 'loading-state'],
  problemStatement: `Build a Giphy-style GIF search application in React that allows users to type a search query, fetches matching GIFs from a mock API, and displays them in a responsive masonry-like grid. The component should debounce the search input to avoid excessive API calls.

The application should handle loading, error, and empty states gracefully. Results should display in a responsive grid that adapts columns based on viewport width. Implement pagination with a "Load More" button that appends new results to the existing grid without clearing previous ones. Each GIF card should show the title on hover and support a click-to-copy-URL action.

This problem tests debounced input handling, API integration patterns, responsive CSS layouts, and incremental data loading.`,
  functionalRequirements: [
    'Search input with debounced API calls (300ms delay)',
    'Display GIF results in a responsive grid (2–4 columns depending on viewport)',
    'Show loading indicator during API requests',
    'Show error state with retry option on API failure',
    'Show empty state when no results match the query',
    '"Load More" button to fetch and append the next page of results',
    'Show GIF title overlay on hover',
    'Click on a GIF to copy its URL to clipboard with visual feedback',
  ],
  nonFunctionalRequirements: [
    'Debounce prevents excessive API calls while typing',
    'Cancel previous in-flight request when a new search is initiated (race condition protection)',
    'Responsive grid layout using CSS Grid or Flexbox',
    'Accessible: images have alt text, loading state announced to screen readers',
  ],
  componentHierarchy: `GiphySearch
├── SearchInput
├── StatusBar (result count, loading indicator)
├── GifGrid
│   └── GifCard (per result)
│       ├── GifImage
│       └── TitleOverlay
├── LoadMoreButton
├── LoadingSpinner
├── ErrorMessage
└── EmptyState`,
  stateDesign: `interface Gif {
  id: string;
  title: string;
  url: string;         // original GIF URL
  previewUrl: string;  // smaller preview
  width: number;
  height: number;
}

const [query, setQuery] = useState('');
const [debouncedQuery, setDebouncedQuery] = useState('');
const [gifs, setGifs] = useState<Gif[]>([]);
const [page, setPage] = useState(0);
const [totalCount, setTotalCount] = useState(0);
const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
const [error, setError] = useState('');
const hasMore = gifs.length < totalCount;`,
  architecture: `The component uses a debounced search pattern. When the user types, a debounce timer delays the actual API call. Each new keystroke resets the timer. When the debounce fires, it sets the debouncedQuery which triggers a useEffect to fetch data. An AbortController cancels any in-flight request when a new one starts, preventing race conditions. The "Load More" button increments the page offset and appends results. A mock API function simulates network latency and responses for demonstration.`,
  implementation: `import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Gif {
  id: string;
  title: string;
  url: string;
  previewUrl: string;
  width: number;
  height: number;
}

interface ApiResponse {
  data: Gif[];
  totalCount: number;
}

const PAGE_SIZE = 12;

async function mockFetchGifs(query: string, offset: number, signal: AbortSignal): Promise<ApiResponse> {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 600 + Math.random() * 400);
    signal.addEventListener('abort', () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); });
  });

  if (!query.trim()) return { data: [], totalCount: 0 };

  const totalCount = query.length * 8;
  const data: Gif[] = Array.from({ length: Math.min(PAGE_SIZE, totalCount - offset) }, (_, i) => {
    const idx = offset + i;
    const w = 200 + (idx % 3) * 50;
    const h = 150 + (idx % 4) * 40;
    return {
      id: \`gif-\${query}-\${idx}\`,
      title: \`\${query} GIF #\${idx + 1}\`,
      url: \`https://via.placeholder.com/\${w}x\${h}/6366f1/ffffff?text=\${encodeURIComponent(query)}+\${idx + 1}\`,
      previewUrl: \`https://via.placeholder.com/\${w}x\${h}/6366f1/ffffff?text=\${encodeURIComponent(query)}+\${idx + 1}\`,
      width: w,
      height: h,
    };
  });

  return { data, totalCount };
}

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function GiphySearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchGifs = useCallback(async (searchQuery: string, offset: number, append: boolean) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');
    setErrorMsg('');

    try {
      const result = await mockFetchGifs(searchQuery, offset, controller.signal);
      setGifs((prev) => (append ? [...prev, ...result.data] : result.data));
      setTotalCount(result.totalCount);
      setStatus('idle');
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setErrorMsg((err as Error).message);
        setStatus('error');
      }
    }
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setGifs([]);
      setTotalCount(0);
      setPage(0);
      setStatus('idle');
      return;
    }
    setPage(0);
    fetchGifs(debouncedQuery, 0, false);
  }, [debouncedQuery, fetchGifs]);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchGifs(debouncedQuery, nextPage * PAGE_SIZE, true);
  };

  const copyUrl = async (gif: Gif) => {
    try {
      await navigator.clipboard.writeText(gif.url);
      setCopiedId(gif.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch { /* clipboard not available */ }
  };

  const hasMore = gifs.length < totalCount;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <h1 style={{ textAlign: 'center', margin: '0 0 16px' }}>GIF Search</h1>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for GIFs…"
          aria-label="Search GIFs"
          style={{
            width: '100%', padding: '12px 16px', fontSize: 16,
            border: '2px solid #e2e8f0', borderRadius: 8, outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {status === 'loading' && gifs.length === 0 && (
          <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            ⏳
          </span>
        )}
      </div>

      {debouncedQuery && gifs.length > 0 && (
        <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 12px' }}>
          Showing {gifs.length} of {totalCount} results for "{debouncedQuery}"
        </p>
      )}

      {status === 'error' && (
        <div role="alert" style={{ textAlign: 'center', padding: 32 }}>
          <p style={{ color: '#ef4444', fontWeight: 600 }}>Failed to load GIFs</p>
          <p style={{ color: '#64748b', margin: '4px 0 12px' }}>{errorMsg}</p>
          <button
            onClick={() => fetchGifs(debouncedQuery, page * PAGE_SIZE, page > 0)}
            style={{ padding: '8px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      )}

      {status !== 'error' && debouncedQuery && gifs.length === 0 && status !== 'loading' && (
        <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
          <p style={{ fontSize: 48, margin: 0 }}>🔍</p>
          <p style={{ fontWeight: 600 }}>No GIFs found for "{debouncedQuery}"</p>
        </div>
      )}

      {gifs.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 12,
          }}
          role="list"
          aria-label="GIF results"
        >
          {gifs.map((gif) => (
            <div
              key={gif.id}
              role="listitem"
              onClick={() => copyUrl(gif)}
              style={{
                position: 'relative', borderRadius: 8, overflow: 'hidden',
                cursor: 'pointer', background: '#f1f5f9',
              }}
            >
              <img
                src={gif.previewUrl}
                alt={gif.title}
                loading="lazy"
                style={{ width: '100%', display: 'block', aspectRatio: \`\${gif.width}/\${gif.height}\` }}
              />
              <div
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '24px 8px 8px', color: '#fff', fontSize: 12, fontWeight: 500,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                }}
              >
                {copiedId === gif.id ? '✓ Copied!' : gif.title}
              </div>
            </div>
          ))}
        </div>
      )}

      {status === 'loading' && gifs.length > 0 && (
        <div role="status" aria-live="polite" style={{ textAlign: 'center', padding: 20, color: '#64748b' }}>
          Loading more…
        </div>
      )}

      {hasMore && status !== 'loading' && status !== 'error' && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            onClick={loadMore}
            style={{
              padding: '10px 28px', background: '#6366f1', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: 14,
            }}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}`,
  accessibility: `All images have descriptive alt text using the GIF title. The search input has an aria-label. The grid uses role="list" and role="listitem" for structure. Loading states are announced with aria-live="polite". Error messages use role="alert" for immediate announcement. The "copied" feedback is visual — for full a11y, a visually hidden live region should also announce it.`,
  performance: `Search input is debounced at 300ms to prevent excessive API calls. AbortController cancels in-flight requests when a new search starts, preventing race conditions. Images use loading="lazy" for native lazy loading. The grid uses CSS auto-fill for responsive layout without JavaScript resize listeners. Results are appended on "Load More" rather than re-fetching all pages.`,
  edgeCases: [
    'Rapid typing — debounce prevents intermediate API calls; abort cancels stale ones',
    'Empty search query — clears results and returns to idle state',
    'API returns zero results — friendly empty state with the search query shown',
    'Load More at the last page — button hidden when gifs.length >= totalCount',
    'Clipboard API unavailable (HTTP context) — catch and silently fail',
    'Very long search query — the mock API handles it; in production, truncate or validate',
  ],
  testingStrategy: [
    'Unit test: useDebounce delays value updates by the specified amount',
    'Unit test: mockFetchGifs returns correct page size and total count',
    'Integration test: typing triggers debounced search and displays results',
    'Integration test: clearing input resets to idle state',
    'Integration test: Load More appends new results without removing existing ones',
    'Integration test: error state shows retry button that re-fetches',
    'Accessibility test: images have alt text and grid has list semantics',
  ],
  improvements: [
    'Add infinite scroll using IntersectionObserver instead of Load More button',
    'Implement a masonry layout for better visual fit of variable-height GIFs',
    'Add trending GIFs as default content before user searches',
    'Implement GIF detail modal with larger preview and sharing options',
    'Add search history with recent queries dropdown',
  ],
  followUpQuestions: [
    'How would you implement infinite scroll instead of a Load More button?',
    'How would you build a true masonry grid layout in CSS or JS?',
    'What strategies would you use to prevent stale responses from a real API?',
    'How would you handle rate limiting from the Giphy API?',
  ],
};
