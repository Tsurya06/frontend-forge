import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

const KEYS = {
  questions: 'feeq-completed-questions',
  coding: 'feeq-completed-coding',
  machineCoding: 'feeq-completed-machine-coding',
  systemDesign: 'feeq-completed-system-design',
  recentlyViewed: 'feeq-recently-viewed',
  dailyStreak: 'feeq-daily-streak',
  lastActiveDate: 'feeq-last-active-date',
} as const;

export type CompletionType = 'question' | 'coding' | 'machineCoding' | 'systemDesign';

const MAX_RECENTLY_VIEWED = 20;

export function useProgress() {
  const [completedQuestions, setCompletedQuestions] = useLocalStorage<string[]>(
    KEYS.questions,
    [],
  );
  const [completedCoding, setCompletedCoding] = useLocalStorage<string[]>(
    KEYS.coding,
    [],
  );
  const [completedMachineCoding, setCompletedMachineCoding] = useLocalStorage<string[]>(
    KEYS.machineCoding,
    [],
  );
  const [completedSystemDesign, setCompletedSystemDesign] = useLocalStorage<string[]>(
    KEYS.systemDesign,
    [],
  );
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<string[]>(
    KEYS.recentlyViewed,
    [],
  );
  const [dailyStreak, setDailyStreak] = useLocalStorage<number>(
    KEYS.dailyStreak,
    1,
  );
  const [lastActiveDate, setLastActiveDate] = useLocalStorage<string>(
    KEYS.lastActiveDate,
    new Date().toISOString().slice(0, 10),
  );

  // Update daily streak
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (lastActiveDate === yesterday) {
        setDailyStreak(prev => (prev || 0) + 1);
      } else {
        setDailyStreak(1);
      }
      setLastActiveDate(today);
    }
  }, [lastActiveDate, setDailyStreak, setLastActiveDate]);

  const getSetterForType = useCallback(
    (type: CompletionType) => {
      switch (type) {
        case 'question':
          return setCompletedQuestions;
        case 'coding':
          return setCompletedCoding;
        case 'machineCoding':
          return setCompletedMachineCoding;
        case 'systemDesign':
          return setCompletedSystemDesign;
      }
    },
    [setCompletedQuestions, setCompletedCoding, setCompletedMachineCoding, setCompletedSystemDesign],
  );

  const getListForType = useCallback(
    (type: CompletionType): string[] => {
      switch (type) {
        case 'question':
          return completedQuestions;
        case 'coding':
          return completedCoding;
        case 'machineCoding':
          return completedMachineCoding;
        case 'systemDesign':
          return completedSystemDesign;
      }
    },
    [completedQuestions, completedCoding, completedMachineCoding, completedSystemDesign],
  );

  const markComplete = useCallback(
    (id: string, type: CompletionType) => {
      const setter = getSetterForType(type);
      setter((prev) => (prev.includes(id) ? prev : [...prev, id]));
    },
    [getSetterForType],
  );

  const isComplete = useCallback(
    (id: string, type: CompletionType): boolean => {
      return getListForType(type).includes(id);
    },
    [getListForType],
  );

  const getCompletionPercentage = useCallback(
    (total: number, type: CompletionType): number => {
      if (total === 0) return 0;
      return Math.round((getListForType(type).length / total) * 100);
    },
    [getListForType],
  );

  const addRecentlyViewed = useCallback(
    (id: string) => {
      setRecentlyViewed((prev) => {
        const filtered = prev.filter((item) => item !== id);
        return [id, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
      });
    },
    [setRecentlyViewed],
  );

  const getRecentlyViewed = useCallback(
    () => recentlyViewed,
    [recentlyViewed],
  );

  return {
    completedQuestions,
    completedCoding,
    completedMachineCoding,
    completedSystemDesign,
    recentlyViewed,
    dailyStreak,
    markComplete,
    isComplete,
    getCompletionPercentage,
    addRecentlyViewed,
    getRecentlyViewed,
  };
}
