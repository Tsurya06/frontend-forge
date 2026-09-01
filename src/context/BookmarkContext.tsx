import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";

type BookmarkContextValue = ReturnType<typeof useBookmarks>;

const BookmarkContext = createContext<BookmarkContextValue | null>(null);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const bookmarks = useBookmarks();
  return (
    <BookmarkContext.Provider value={bookmarks}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarkContext(): BookmarkContextValue {
  const ctx = useContext(BookmarkContext);
  if (!ctx) {
    throw new Error(
      "useBookmarkContext must be used within a BookmarkProvider",
    );
  }
  return ctx;
}
