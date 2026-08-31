import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

const BOOKMARKS_KEY = 'feeq-bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>(BOOKMARKS_KEY, []);

  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks]);

  const addBookmark = useCallback(
    (id: string) => {
      setBookmarks((prev) => (prev.includes(id) ? prev : [...prev, id]));
    },
    [setBookmarks],
  );

  const removeBookmark = useCallback(
    (id: string) => {
      setBookmarks((prev) => prev.filter((b) => b !== id));
    },
    [setBookmarks],
  );

  const isBookmarked = useCallback(
    (id: string) => bookmarkSet.has(id),
    [bookmarkSet],
  );

  const toggleBookmark = useCallback(
    (id: string) => {
      if (bookmarkSet.has(id)) {
        removeBookmark(id);
      } else {
        addBookmark(id);
      }
    },
    [bookmarkSet, addBookmark, removeBookmark],
  );

  const getBookmarks = useCallback(() => bookmarks, [bookmarks]);

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
  }, [setBookmarks]);

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
    getBookmarks,
    clearBookmarks,
  };
}
