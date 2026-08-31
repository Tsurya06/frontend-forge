import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Question } from '@/types';

interface FlashcardProgress {
  easy: string[];
  hard: string[];
  skipped: string[];
}

const FLASHCARD_PROGRESS_KEY = 'feeq-flashcard-progress';

export function useFlashcards(cards: Question[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useLocalStorage<FlashcardProgress>(
    FLASHCARD_PROGRESS_KEY,
    { easy: [], hard: [], skipped: [] },
  );

  const currentCard = useMemo(
    () => cards[currentIndex],
    [cards, currentIndex],
  );

  const totalCards = cards.length;

  const flip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const next = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < totalCards - 1 ? prev + 1 : prev));
  }, [totalCards]);

  const previous = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const addToCategory = useCallback(
    (category: keyof FlashcardProgress) => {
      const card = cards[currentIndex];
      if (!card) return;
      setProgress((prev) => ({
        ...prev,
        [category]: prev[category].includes(card.id)
          ? prev[category]
          : [...prev[category], card.id],
      }));
    },
    [cards, currentIndex, setProgress],
  );

  const markEasy = useCallback(() => {
    addToCategory('easy');
    next();
  }, [addToCategory, next]);

  const markHard = useCallback(() => {
    addToCategory('hard');
    next();
  }, [addToCategory, next]);

  const skip = useCallback(() => {
    addToCategory('skipped');
    next();
  }, [addToCategory, next]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setProgress({ easy: [], hard: [], skipped: [] });
  }, [setProgress]);

  return {
    currentCard,
    currentIndex,
    totalCards,
    isFlipped,
    progress,
    flip,
    next,
    previous,
    markEasy,
    markHard,
    skip,
    reset,
  };
}
