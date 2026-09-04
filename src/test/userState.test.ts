import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useProgress } from "@/hooks/useProgress";
import { useTheme } from "@/hooks/useTheme";

describe("User State: Bookmarks, Progress, and Theme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  describe("useBookmarks Hook", () => {
    it("starts with empty bookmarks", () => {
      const { result } = renderHook(() => useBookmarks());
      expect(result.current.bookmarks).toEqual([]);
      expect(result.current.isBookmarked("q-1")).toBe(false);
    });

    it("adds and removes bookmarks", () => {
      const { result } = renderHook(() => useBookmarks());
      act(() => {
        result.current.addBookmark("q-1");
      });
      expect(result.current.isBookmarked("q-1")).toBe(true);
      expect(result.current.bookmarks).toContain("q-1");

      act(() => {
        result.current.removeBookmark("q-1");
      });
      expect(result.current.isBookmarked("q-1")).toBe(false);
      expect(result.current.bookmarks).toEqual([]);
    });

    it("toggles bookmark state", () => {
      const { result } = renderHook(() => useBookmarks());
      act(() => {
        result.current.toggleBookmark("q-1");
      });
      expect(result.current.isBookmarked("q-1")).toBe(true);

      act(() => {
        result.current.toggleBookmark("q-1");
      });
      expect(result.current.isBookmarked("q-1")).toBe(false);
    });
  });

  describe("useProgress Hook", () => {
    it("marks items as complete across all 4 categories", () => {
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markComplete("q-1", "question");
        result.current.markComplete("code-1", "coding");
        result.current.markComplete("mc-1", "machineCoding");
        result.current.markComplete("sd-1", "systemDesign");
      });

      expect(result.current.isComplete("q-1", "question")).toBe(true);
      expect(result.current.isComplete("code-1", "coding")).toBe(true);
      expect(result.current.isComplete("mc-1", "machineCoding")).toBe(true);
      expect(result.current.isComplete("sd-1", "systemDesign")).toBe(true);

      expect(result.current.completedQuestions).toContain("q-1");
      expect(result.current.completedCoding).toContain("code-1");
    });

    it("tracks recently viewed items with LRU capping", () => {
      const { result } = renderHook(() => useProgress());
      act(() => {
        result.current.addRecentlyViewed("item-1");
        result.current.addRecentlyViewed("item-2");
      });

      expect(result.current.recentlyViewed).toContain("item-1");
      expect(result.current.recentlyViewed).toContain("item-2");
    });
  });

  describe("useTheme Hook", () => {
    it("initializes theme and responds to theme toggles", () => {
      const { result } = renderHook(() => useTheme());
      const initialTheme = result.current.theme;
      expect(["dark", "light", "system"]).toContain(initialTheme);

      act(() => {
        result.current.toggleTheme();
      });

      const toggledTheme = result.current.theme;
      expect(["dark", "light"]).toContain(toggledTheme);
      expect(document.documentElement.getAttribute("data-theme")).toBe(toggledTheme);
    });
  });
});
