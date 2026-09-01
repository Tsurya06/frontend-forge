import type { MachineCodingProblem } from "../../types";

export const infiniteScrollProblem: MachineCodingProblem = {
  id: "mc-infinite-scroll",
  title: "Infinite Scroll with IntersectionObserver",
  difficulty: "Advanced",
  category: "Machine Coding",
  tags: [
    "react",
    "infinite-scroll",
    "intersection-observer",
    "pagination",
    "performance",
    "lazy-loading",
  ],

  problemStatement: `Build an Infinite Scroll component in React that automatically loads more content as the user scrolls near the bottom of the list. Instead of traditional pagination buttons, content loads seamlessly, creating a continuous browsing experience similar to social media feeds. The implementation must use the IntersectionObserver API for efficient scroll detection.

This problem tests your understanding of the IntersectionObserver API, async data fetching patterns, loading/error states, and performance optimization. The component should handle rapid scrolling, network errors, empty results, and the "end of data" scenario gracefully. It should also support a manual "Load More" fallback button for accessibility and prevent duplicate fetches when a request is already in flight.`,

  functionalRequirements: [
    "Automatically fetch next page when sentinel element enters viewport",
    "Display loading spinner while fetching new data",
    "Show error state with retry button on fetch failure",
    'Display "end of list" message when all data is loaded',
    "Prevent duplicate requests while a fetch is in progress",
    "Support pull-to-refresh to reload from the beginning",
    'Manual "Load More" button as fallback/accessibility alternative',
  ],

  nonFunctionalRequirements: [
    "IntersectionObserver for scroll detection (not scroll events)",
    "Threshold and rootMargin configurable for prefetch timing",
    "Cleanup observer on unmount to prevent memory leaks",
    "Smooth integration with any data-fetching library",
  ],

  componentHierarchy: `InfiniteScroll
├── ItemList
│   └── Item (repeated, growing list)
├── SentinelElement (observed by IntersectionObserver)
├── LoadingSpinner (shown during fetch)
├── ErrorState (shown on fetch failure)
│   └── RetryButton
└── EndOfListMessage`,

  stateDesign: `// State shape
interface InfiniteScrollState {
  items: Item[];           // accumulated items from all pages
  page: number;            // current page number
  isLoading: boolean;      // whether a fetch is in progress
  hasMore: boolean;        // whether more pages exist
  error: Error | null;     // last fetch error, if any
}

// Items accumulate (append, never replace) on each page fetch.
// \`hasMore\` becomes false when the API returns fewer items than pageSize
// or an explicit total count is reached.
// The sentinel element is only observed when !isLoading && hasMore.`,

  architecture: `The component uses a sentinel element (an invisible div) placed at the bottom of the list. An IntersectionObserver watches this sentinel, and when it enters the viewport (or its rootMargin zone), it triggers the next page fetch. The observer is configured with a \`rootMargin\` of "200px" to start loading before the user reaches the absolute bottom, creating a seamless experience.

The fetch function is guarded by \`isLoading\` and \`hasMore\` flags to prevent duplicate requests. New items are appended to the existing array (never replacing it) to maintain scroll position. The observer is disconnected and reconnected whenever the loading state changes, ensuring it doesn't fire during an active fetch. On unmount, the observer is fully disconnected. Error states show a retry button that re-attempts the failed fetch.`,

  implementation: `import React, { useState, useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollProps<T> {
  fetchItems: (page: number) => Promise<{ data: T[]; hasMore: boolean }>;
  renderItem: (item: T, index: number) => React.ReactNode;
  pageSize?: number;
  rootMargin?: string;
  threshold?: number;
}

export default function InfiniteScroll<T>({
  fetchItems,
  renderItem,
  rootMargin = '200px',
  threshold = 0.1,
}: InfiniteScrollProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchItems(page);
      setItems((prev) => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setPage((p) => p + 1);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch'));
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [page, hasMore, fetchItems]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingRef.current) {
          loadMore();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, hasMore, rootMargin, threshold]);

  useEffect(() => {
    loadMore();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = useCallback(() => {
    setError(null);
    loadMore();
  }, [loadMore]);

  const handleRefresh = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    isLoadingRef.current = false;
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 16,
      }}>
        <span style={{ fontSize: 14, color: '#6b7280' }}>
          {items.length} items loaded
        </span>
        <button
          onClick={handleRefresh}
          style={{
            padding: '6px 14px', fontSize: 13,
            border: '1px solid #d1d5db', borderRadius: 4,
            background: '#fff', cursor: 'pointer',
          }}
        >
          Refresh
        </button>
      </div>

      <div role="list">
        {items.map((item, index) => (
          <div key={index} role="listitem">
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {hasMore && !error && (
        <div ref={sentinelRef} style={{ height: 1 }} aria-hidden="true" />
      )}

      {isLoading && (
        <div style={{
          display: 'flex', justifyContent: 'center', padding: 32,
        }}>
          <div style={{
            width: 32, height: 32, border: '3px solid #e5e7eb',
            borderTopColor: '#2563eb', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{\`@keyframes spin { to { transform: rotate(360deg) } }\`}</style>
        </div>
      )}

      {error && (
        <div style={{
          textAlign: 'center', padding: 32, color: '#dc2626',
        }}>
          <p style={{ marginBottom: 12 }}>{error.message}</p>
          <button
            onClick={handleRetry}
            style={{
              padding: '8px 20px', background: '#dc2626', color: '#fff',
              border: 'none', borderRadius: 6, cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <div style={{
          textAlign: 'center', padding: 24, color: '#9ca3af', fontSize: 14,
        }}>
          You&apos;ve reached the end of the list
        </div>
      )}

      {!hasMore && items.length === 0 && !isLoading && (
        <div style={{
          textAlign: 'center', padding: 48, color: '#6b7280',
        }}>
          <p style={{ fontSize: 18 }}>No items to display</p>
        </div>
      )}

      {hasMore && !isLoading && !error && (
        <div style={{ textAlign: 'center', padding: 16 }}>
          <button
            onClick={loadMore}
            style={{
              padding: '8px 20px', border: '1px solid #d1d5db',
              borderRadius: 6, background: '#fff', cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}`,

  accessibility: `The item list uses \`role="list"\` with \`role="listitem"\` on each entry for screen reader structure. The sentinel element has \`aria-hidden="true"\` since it's not meaningful content. Loading state is communicated via the visible spinner and could be enhanced with an \`aria-live="polite"\` region. The "Load More" button provides a non-scroll-dependent alternative for users who can't or prefer not to scroll. Error messages are displayed inline with a clear retry action. The refresh button provides a way to restart without page reload.`,

  performance: `IntersectionObserver is significantly more efficient than scroll event listeners because it runs outside the main thread and doesn't cause layout thrashing. The \`rootMargin\` of "200px" starts loading before the user reaches the bottom, masking network latency. A ref (\`isLoadingRef\`) prevents race conditions more reliably than state, since refs update synchronously. Items are appended to the array rather than spread into a new array from all pages. The observer is properly disconnected on cleanup to prevent memory leaks. For very long lists, windowing/virtualization should be added to limit DOM nodes.`,

  edgeCases: [
    "Rapid scrolling should not trigger multiple simultaneous fetches",
    "Network error during fetch should show error state and allow retry",
    "Empty first page response should show appropriate empty state",
    "API returning exact pageSize items (ambiguous hasMore) needs careful handling",
    "Component unmounting during a pending fetch should not cause state updates",
  ],

  testingStrategy: [
    "Unit test: initial render triggers first page fetch",
    "Unit test: IntersectionObserver callback triggers subsequent fetches",
    "Unit test: isLoading prevents duplicate concurrent fetches",
    "Unit test: error state displays retry button that re-fetches",
    "Integration test: items accumulate across multiple page loads",
    "Integration test: end-of-list state appears when hasMore is false",
  ],

  improvements: [
    "Add virtualization (react-window) for long lists to limit DOM nodes",
    "Implement scroll position restoration for browser back navigation",
    "Add skeleton loading placeholders instead of a simple spinner",
    "Support bidirectional infinite scroll (load previous items on scroll up)",
    "Add optimistic loading with prefetch of next page",
  ],

  followUpQuestions: [
    "How does IntersectionObserver differ from scroll event listeners in terms of performance?",
    "How would you implement scroll position restoration when navigating back to this page?",
    "What is windowing/virtualization and when would you add it to infinite scroll?",
    "How would you implement cursor-based pagination instead of page numbers?",
  ],
};
