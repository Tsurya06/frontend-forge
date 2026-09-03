import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface ShortcutCallbacks {
  onNext?: () => void;
  onPrevious?: () => void;
  onBookmark?: () => void;
  onMarkComplete?: () => void;
  onShowShortcuts?: () => void;
}

const SEQUENCE_TIMEOUT = 1000;

function isEditableTarget(el: EventTarget | null): boolean {
  const active = document.activeElement;
  const target = el instanceof HTMLElement ? el : null;

  for (const candidate of [target, active]) {
    if (!candidate || !(candidate instanceof HTMLElement)) continue;
    if (candidate === document.body || candidate === document.documentElement) continue;
    const tag = candidate.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    if (candidate.isContentEditable) return true;
    if (candidate.closest("input, textarea, select, [contenteditable='true'], .monaco-editor")) return true;
  }

  return false;
}

export function useKeyboardShortcuts(callbacks: ShortcutCallbacks = {}) {
  const navigate = useNavigate();
  const sequenceBuffer = useRef<string[]>([]);
  const sequenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbacksRef = useRef(callbacks);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  const handleSequence = useCallback(
    (keys: string[]) => {
      const combo = keys.join(" ");
      let target = "";

      switch (combo) {
        case "g d":
          target = "/";
          break;
        case "g t":
          target = "/topics";
          break;
        case "g c":
          target = "/coding";
          break;
        case "g m":
          target = "/machine-coding";
          break;
        case "g b":
          target = "/bookmarks";
          break;
        case "g v":
          target = "/visualizer";
          break;
      }

      if (target) {
        navigate(target);
        // Ensure focus is restored to the window so subsequent shortcuts work immediately
        setTimeout(() => {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          window.focus();
        }, 50);
      }
    },
    [navigate],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Escape always blurs any focused inputs/search
      if (key === "escape") {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        window.focus();
        return;
      }

      // Ignore standard modifier combos (Ctrl+C, Cmd+K, etc.)
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Ignore when typing inside an editable field or editor
      if (isEditableTarget(e.target)) return;

      // 1. Focus Search
      if (key === "/") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          "[data-search-input]",
        );
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
        return;
      }

      // 2. Toggle Shortcuts Cheatsheet
      if (key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        callbacksRef.current.onShowShortcuts?.();
        return;
      }

      // 3. Next item / scroll down
      if (key === "j") {
        if (callbacksRef.current.onNext) {
          callbacksRef.current.onNext();
        } else {
          const container = document.querySelector("main") || window;
          container.scrollBy({ top: 160, behavior: "smooth" });
        }
        return;
      }

      // 4. Previous item / scroll up
      if (key === "k") {
        if (callbacksRef.current.onPrevious) {
          callbacksRef.current.onPrevious();
        } else {
          const container = document.querySelector("main") || window;
          container.scrollBy({ top: -160, behavior: "smooth" });
        }
        return;
      }

      // 5. Bookmark
      if (key === "b") {
        callbacksRef.current.onBookmark?.();
        return;
      }

      // 6. Mark Complete
      if (key === "m") {
        callbacksRef.current.onMarkComplete?.();
        return;
      }

      // 7. Sequential Navigation ('g' prefix)
      if (key === "g") {
        if (sequenceTimer.current) clearTimeout(sequenceTimer.current);
        sequenceBuffer.current = ["g"];
        sequenceTimer.current = setTimeout(() => {
          sequenceBuffer.current = [];
        }, SEQUENCE_TIMEOUT);
        return;
      }

      if (
        sequenceBuffer.current.length > 0 &&
        sequenceBuffer.current[0] === "g"
      ) {
        if (sequenceTimer.current) clearTimeout(sequenceTimer.current);
        const seq = [...sequenceBuffer.current, key];
        sequenceBuffer.current = [];
        handleSequence(seq);
        return;
      }

      // Any other key resets sequence buffer
      sequenceBuffer.current = [];
    };

    // Use capture phase on window so shortcuts are reliably captured anywhere
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      if (sequenceTimer.current) clearTimeout(sequenceTimer.current);
    };
  }, [handleSequence]);
}
