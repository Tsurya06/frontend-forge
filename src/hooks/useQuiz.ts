import { useState, useCallback, useMemo } from "react";
import type { Question } from "@/types";

type QuizPhase = "idle" | "configuring" | "active" | "results";

interface QuizAnswer {
  questionId: string;
  correct: boolean;
}

interface QuizResults {
  totalQuestions: number;
  answered: number;
  correct: number;
  skipped: number;
  score: number;
  answers: QuizAnswer[];
  skippedIds: string[];
}

interface QuizState {
  phase: QuizPhase;
  questions: Question[];
  currentIndex: number;
  answers: QuizAnswer[];
  skippedIds: string[];
}

const INITIAL_STATE: QuizState = {
  phase: "idle",
  questions: [],
  currentIndex: 0,
  answers: [],
  skippedIds: [],
};

export function useQuiz() {
  const [state, setState] = useState<QuizState>(INITIAL_STATE);

  const currentQuestion = useMemo(
    () => state.questions[state.currentIndex],
    [state.questions, state.currentIndex],
  );

  const isLastQuestion = useMemo(
    () => state.currentIndex >= state.questions.length - 1,
    [state.currentIndex, state.questions.length],
  );

  const startQuiz = useCallback((questions: Question[]) => {
    setState({
      phase: "active",
      questions,
      currentIndex: 0,
      answers: [],
      skippedIds: [],
    });
  }, []);

  const answerQuestion = useCallback((questionId: string, correct: boolean) => {
    setState((prev) => {
      if (prev.phase !== "active") return prev;
      const already = prev.answers.some((a) => a.questionId === questionId);
      if (already) return prev;
      return {
        ...prev,
        answers: [...prev.answers, { questionId, correct }],
      };
    });
  }, []);

  const skipQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== "active") return prev;
      const current = prev.questions[prev.currentIndex];
      if (!current) return prev;
      const alreadySkipped = prev.skippedIds.includes(current.id);
      return {
        ...prev,
        skippedIds: alreadySkipped
          ? prev.skippedIds
          : [...prev.skippedIds, current.id],
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== "active") return prev;
      if (prev.currentIndex >= prev.questions.length - 1) {
        return { ...prev, phase: "results" };
      }
      return { ...prev, currentIndex: prev.currentIndex + 1 };
    });
  }, []);

  const resetQuiz = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const getResults = useCallback((): QuizResults => {
    const correct = state.answers.filter((a) => a.correct).length;
    const total = state.questions.length;
    return {
      totalQuestions: total,
      answered: state.answers.length,
      correct,
      skipped: state.skippedIds.length,
      score: total > 0 ? Math.round((correct / total) * 100) : 0,
      answers: state.answers,
      skippedIds: state.skippedIds,
    };
  }, [state.answers, state.questions.length, state.skippedIds]);

  return {
    phase: state.phase,
    currentQuestion,
    currentIndex: state.currentIndex,
    totalQuestions: state.questions.length,
    isLastQuestion,
    startQuiz,
    answerQuestion,
    skipQuestion,
    nextQuestion,
    resetQuiz,
    getResults,
  };
}
