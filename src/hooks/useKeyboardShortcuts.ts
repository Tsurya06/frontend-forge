import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface ShortcutCallbacks {
  onNext?: () => void;
  onPrevious?: () => void;
  onBookmark?: () => void;
  onMarkComplete?: () => void;
  onShowShortcuts?: () => void;
}

const SEQUENCE_TIMEOUT = 800;

function isEditableTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  return el.isContentEditable;
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
      const combo = keys.join(' ');
      switch (combo) {
        case 'g d':
          navigate('/');
          break;
        case 'g t':
          navigate('/topics');
          break;
        case 'g c':
          navigate('/coding');
          break;
        case 'g m':
          navigate('/machine-coding');
          break;
        case 'g b':
          navigate('/bookmarks');
          break;
      }
    },
    [navigate],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();

      if (key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          '[data-search-input]',
        );
        searchInput?.focus();
        return;
      }

      if (key === '?') {
        e.preventDefault();
        callbacksRef.current.onShowShortcuts?.();
        return;
      }

      if (key === 'j') {
        callbacksRef.current.onNext?.();
        return;
      }

      if (key === 'k') {
        callbacksRef.current.onPrevious?.();
        return;
      }

      if (key === 'b') {
        callbacksRef.current.onBookmark?.();
        return;
      }

      if (key === 'm') {
        callbacksRef.current.onMarkComplete?.();
        return;
      }

      if (key === 'g') {
        if (sequenceTimer.current) clearTimeout(sequenceTimer.current);
        sequenceBuffer.current = ['g'];
        sequenceTimer.current = setTimeout(() => {
          sequenceBuffer.current = [];
        }, SEQUENCE_TIMEOUT);
        return;
      }

      if (sequenceBuffer.current.length > 0 && sequenceBuffer.current[0] === 'g') {
        if (sequenceTimer.current) clearTimeout(sequenceTimer.current);
        const seq = [...sequenceBuffer.current, key];
        sequenceBuffer.current = [];
        handleSequence(seq);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (sequenceTimer.current) clearTimeout(sequenceTimer.current);
    };
  }, [handleSequence]);
}
