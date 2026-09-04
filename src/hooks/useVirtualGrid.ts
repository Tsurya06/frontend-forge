import { useState, useEffect, useRef, useCallback } from "react";

interface UseVirtualGridOptions {
  initialCount?: number;
  batchSize?: number;
}

export function useVirtualGrid<T>(
  items: T[],
  { initialCount = 16, batchSize = 12 }: UseVirtualGridOptions = {},
) {
  const [prevItems, setPrevItems] = useState(items);
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset visible count whenever the source item list changes (adjust state during render)
  if (items !== prevItems) {
    setPrevItems(items);
    setVisibleCount(initialCount);
  }

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + batchSize, items.length));
  }, [items.length, batchSize]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first && first.isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: "250px",
        threshold: 0.1,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return {
    visibleItems,
    hasMore,
    loadMore,
    sentinelRef,
    totalCount: items.length,
    renderedCount: visibleItems.length,
  };
}
