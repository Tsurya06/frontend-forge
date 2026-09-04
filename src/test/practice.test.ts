import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFlashcards } from "@/hooks/useFlashcards";
import { useQuiz } from "@/hooks/useQuiz";
import type { Question } from "@/types";

const mockQuestions: Question[] = [
  {
    id: "q-1",
    question: "What is Event Loop?",
    answer: "Detailed event loop explanation",
    category: "JavaScript",
    difficulty: "Intermediate",
    type: "Conceptual",
    topicId: "event-loop",
    shortAnswer: "A concurrency model",
    tags: ["event-loop", "async"],
  },
  {
    id: "q-2",
    question: "What is Virtual DOM?",
    answer: "Detailed virtual DOM explanation",
    category: "React",
    difficulty: "Beginner",
    type: "Conceptual",
    topicId: "react-core",
    shortAnswer: "An in-memory representation of DOM",
    tags: ["vdom", "react"],
  },
  {
    id: "q-3",
    question: "What is CSS Grid?",
    answer: "Detailed CSS grid explanation",
    category: "CSS",
    difficulty: "Beginner",
    type: "Conceptual",
    topicId: "css-layouts",
    shortAnswer: "A 2D layout system",
    tags: ["css", "grid"],
  },
];

describe("Practice Module: Flashcards & Quiz Engines", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("useFlashcards Hook", () => {
    it("initializes with first card, face up", () => {
      const { result } = renderHook(() => useFlashcards(mockQuestions));
      expect(result.current.currentIndex).toBe(0);
      expect(result.current.currentCard?.id).toBe("q-1");
      expect(result.current.isFlipped).toBe(false);
      expect(result.current.totalCards).toBe(3);
    });

    it("toggles flipped state when flip() is called", () => {
      const { result } = renderHook(() => useFlashcards(mockQuestions));
      act(() => {
        result.current.flip();
      });
      expect(result.current.isFlipped).toBe(true);

      act(() => {
        result.current.flip();
      });
      expect(result.current.isFlipped).toBe(false);
    });

    it("advances card and resets flip on next()", () => {
      const { result } = renderHook(() => useFlashcards(mockQuestions));
      act(() => {
        result.current.flip();
      });
      expect(result.current.isFlipped).toBe(true);

      act(() => {
        result.current.next();
      });
      expect(result.current.currentIndex).toBe(1);
      expect(result.current.currentCard?.id).toBe("q-2");
      expect(result.current.isFlipped).toBe(false);
    });

    it("tracks easy and hard categorization", () => {
      const { result } = renderHook(() => useFlashcards(mockQuestions));
      act(() => {
        result.current.markEasy();
      });
      expect(result.current.progress.easy).toContain("q-1");
      expect(result.current.currentIndex).toBe(1);

      act(() => {
        result.current.markHard();
      });
      expect(result.current.progress.hard).toContain("q-2");
      expect(result.current.currentIndex).toBe(2);
    });

    it("does not advance beyond last card", () => {
      const { result } = renderHook(() => useFlashcards(mockQuestions));
      act(() => {
        result.current.next();
        result.current.next();
        result.current.next();
      });
      expect(result.current.currentIndex).toBe(2);
    });
  });

  describe("useQuiz Hook", () => {
    it("starts in idle phase and transitions to active phase on startQuiz", () => {
      const { result } = renderHook(() => useQuiz());
      expect(result.current.phase).toBe("idle");

      act(() => {
        result.current.startQuiz(mockQuestions);
      });
      expect(result.current.phase).toBe("active");
      expect(result.current.currentIndex).toBe(0);
      expect(result.current.totalQuestions).toBe(3);
      expect(result.current.currentQuestion?.id).toBe("q-1");
    });

    it("records correct/incorrect answers and advances questions", () => {
      const { result } = renderHook(() => useQuiz());
      act(() => {
        result.current.startQuiz(mockQuestions);
      });

      // Answer question 1 correctly
      act(() => {
        result.current.answerQuestion("q-1", true);
        result.current.nextQuestion();
      });
      expect(result.current.currentIndex).toBe(1);

      // Answer question 2 incorrectly
      act(() => {
        result.current.answerQuestion("q-2", false);
        result.current.nextQuestion();
      });
      expect(result.current.currentIndex).toBe(2);

      // Skip question 3
      act(() => {
        result.current.skipQuestion();
      });

      const stats = result.current.getResults();
      expect(stats.totalQuestions).toBe(3);
      expect(stats.answered).toBe(2);
      expect(stats.correct).toBe(1);
      expect(stats.skipped).toBe(1);
      expect(stats.score).toBe(33); // 1 out of 3 = 33%
    });

    it("allows resetting the quiz back to initial state", () => {
      const { result } = renderHook(() => useQuiz());
      act(() => {
        result.current.startQuiz(mockQuestions);
        result.current.resetQuiz();
      });
      expect(result.current.phase).toBe("idle");
      expect(result.current.totalQuestions).toBe(0);
    });
  });
});
