import { useState, useEffect, useCallback, useMemo } from "react";
import {
  loadSprintProgress,
  updateDayProgress,
  saveMockInterviewResult,
  resetSprintProgress,
} from "@/services/interviewSprintStorage";
import type {
  SprintProgressState,
  DayProgress,
  MockInterviewResult,
} from "@/data/interviewSprint/types";

export function useInterviewSprintProgress() {
  const [state, setState] = useState<SprintProgressState>(() => loadSprintProgress());

  // Listen for local and cross-tab storage changes
  useEffect(() => {
    const handleUpdate = () => {
      setState(loadSprintProgress());
    };

    window.addEventListener("feeq-sprint-progress-changed", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("feeq-sprint-progress-changed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const completedDaysCount = useMemo(() => {
    return Object.values(state.dayProgress).filter((d) => d.completed).length;
  }, [state.dayProgress]);

  const completionPercentage = useMemo(() => {
    return Math.round((completedDaysCount / 7) * 100);
  }, [completedDaysCount]);

  const revisionDays = useMemo(() => {
    return Object.values(state.dayProgress)
      .filter((d) => d.needsRevision)
      .map((d) => d.day);
  }, [state.dayProgress]);

  const averageQuizScore = useMemo(() => {
    const scoredDays = Object.values(state.dayProgress).filter(
      (d) => typeof d.quizScore === "number"
    );
    if (scoredDays.length === 0) return null;
    const sum = scoredDays.reduce((acc, d) => acc + (d.quizScore || 0), 0);
    return Math.round(sum / scoredDays.length);
  }, [state.dayProgress]);

  const exercisesAttemptedCount = useMemo(() => {
    return Object.values(state.dayProgress).filter((d) => d.exerciseAttempted || d.exerciseCompleted).length;
  }, [state.dayProgress]);

  const exercisesSolvedCount = useMemo(() => {
    return Object.values(state.dayProgress).filter((d) => d.exerciseCompleted).length;
  }, [state.dayProgress]);

  // Next unfinished lesson day
  const nextUnfinishedDay = useMemo(() => {
    for (let day = 1; day <= 7; day++) {
      if (!state.dayProgress[day]?.completed) {
        return day;
      }
    }
    return 1;
  }, [state.dayProgress]);

  const toggleDayCompletion = useCallback((day: number) => {
    const updated = updateDayProgress(day, (prev) => ({
      ...prev,
      completed: !prev.completed,
    }));
    setState(updated);
  }, []);

  const toggleDayRevision = useCallback((day: number) => {
    const updated = updateDayProgress(day, (prev) => ({
      ...prev,
      needsRevision: !prev.needsRevision,
    }));
    setState(updated);
  }, []);

  const recordQuizScore = useCallback((day: number, score: number, answersRecord: Record<string, string>) => {
    const updated = updateDayProgress(day, (prev) => ({
      ...prev,
      quizScore: score,
      quizAnswered: answersRecord,
    }));
    setState(updated);
  }, []);

  const recordExerciseAttempt = useCallback((day: number, completed = false) => {
    const updated = updateDayProgress(day, (prev) => ({
      ...prev,
      exerciseAttempted: true,
      exerciseCompleted: completed || prev.exerciseCompleted,
    }));
    setState(updated);
  }, []);

  const recordMockResult = useCallback((result: MockInterviewResult) => {
    const updated = saveMockInterviewResult(result);
    setState(updated);
  }, []);

  const resetAll = useCallback(() => {
    const fresh = resetSprintProgress();
    setState(fresh);
  }, []);

  return {
    state,
    completedDaysCount,
    completionPercentage,
    revisionDays,
    averageQuizScore,
    exercisesAttemptedCount,
    exercisesSolvedCount,
    nextUnfinishedDay,
    toggleDayCompletion,
    toggleDayRevision,
    recordQuizScore,
    recordExerciseAttempt,
    recordMockResult,
    resetAll,
    getDayProgress: (day: number): DayProgress =>
      state.dayProgress[day] || { day, completed: false, needsRevision: false },
  };
}
