import { useCallback, useEffect } from "react";
import { STORAGE_KEYS } from "@/constants/storage";
import { useLocalStorage } from "./useLocalStorage";

const KEYS = {
  questions: STORAGE_KEYS.COMPLETED_QUESTIONS,
  coding: STORAGE_KEYS.COMPLETED_CODING,
  machineCoding: STORAGE_KEYS.COMPLETED_MACHINE_CODING,
  systemDesign: STORAGE_KEYS.COMPLETED_SYSTEM_DESIGN,
  recentlyViewed: STORAGE_KEYS.RECENTLY_VIEWED,
  dailyStreak: STORAGE_KEYS.DAILY_STREAK,
  lastActiveDate: STORAGE_KEYS.LAST_ACTIVE_DATE,
} as const;

export type CompletionType =
  "question" | "coding" | "machineCoding" | "systemDesign";

const MAX_RECENTLY_VIEWED = 20;

const formatLocalYMD = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function useProgress() {
  const [completedQuestions, setCompletedQuestions] = useLocalStorage<string[]>(
    KEYS.questions,
    [],
  );
  const [completedCoding, setCompletedCoding] = useLocalStorage<string[]>(
    KEYS.coding,
    [],
  );
  const [completedMachineCoding, setCompletedMachineCoding] = useLocalStorage<
    string[]
  >(KEYS.machineCoding, []);
  const [completedSystemDesign, setCompletedSystemDesign] = useLocalStorage<
    string[]
  >(KEYS.systemDesign, []);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<string[]>(
    KEYS.recentlyViewed,
    [],
  );
  const [dailyStreak, setDailyStreak] = useLocalStorage<number>(
    KEYS.dailyStreak,
    0,
  );
  const [lastActiveDate, setLastActiveDate] = useLocalStorage<string>(
    KEYS.lastActiveDate,
    "",
  );

  // Check if streak has broken due to missed day(s)
  useEffect(() => {
    const today = formatLocalYMD(new Date());
    const yesterday = formatLocalYMD(new Date(Date.now() - 86400000));

    if (!lastActiveDate) {
      if (dailyStreak > 0) {
        setDailyStreak(0);
      }
      return;
    }

    // Active today or yesterday means streak is alive
    if (lastActiveDate === today || lastActiveDate === yesterday) {
      return;
    }

    // More than 1 calendar day without activity: STREAK BREAKS!
    if (dailyStreak > 0) {
      setDailyStreak(0);
    }
  }, [lastActiveDate, dailyStreak, setDailyStreak]);

  // Record an active learning interaction today to preserve/extend streak
  const recordStreakActivity = useCallback(() => {
    const today = formatLocalYMD(new Date());
    const yesterday = formatLocalYMD(new Date(Date.now() - 86400000));

    setLastActiveDate((prevDate) => {
      if (prevDate === today) {
        // Already recorded activity today
        return today;
      }

      setDailyStreak((prevStreak) => {
        if (prevDate === yesterday) {
          // Consecutive day streak extension!
          return (prevStreak || 0) + 1;
        } else {
          // Streak was 0 / broken or starting anew
          return 1;
        }
      });

      return today;
    });
  }, [setLastActiveDate, setDailyStreak]);

  const getSetterForType = useCallback(
    (type: CompletionType) => {
      switch (type) {
        case "question":
          return setCompletedQuestions;
        case "coding":
          return setCompletedCoding;
        case "machineCoding":
          return setCompletedMachineCoding;
        case "systemDesign":
          return setCompletedSystemDesign;
      }
    },
    [
      setCompletedQuestions,
      setCompletedCoding,
      setCompletedMachineCoding,
      setCompletedSystemDesign,
    ],
  );

  const getListForType = useCallback(
    (type: CompletionType): string[] => {
      switch (type) {
        case "question":
          return completedQuestions;
        case "coding":
          return completedCoding;
        case "machineCoding":
          return completedMachineCoding;
        case "systemDesign":
          return completedSystemDesign;
      }
    },
    [
      completedQuestions,
      completedCoding,
      completedMachineCoding,
      completedSystemDesign,
    ],
  );

  const markComplete = useCallback(
    (id: string, type: CompletionType) => {
      const setter = getSetterForType(type);
      setter((prev) => (prev.includes(id) ? prev : [...prev, id]));
      recordStreakActivity();
    },
    [getSetterForType, recordStreakActivity],
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

  const getRecentlyViewed = useCallback(() => recentlyViewed, [recentlyViewed]);

  return {
    completedQuestions,
    completedCoding,
    completedMachineCoding,
    completedSystemDesign,
    recentlyViewed,
    dailyStreak,
    lastActiveDate,
    recordStreakActivity,
    markComplete,
    isComplete,
    getCompletionPercentage,
    addRecentlyViewed,
    getRecentlyViewed,
  };
}
