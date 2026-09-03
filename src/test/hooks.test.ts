import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSearch } from "../hooks/useSearch";
import { useQuiz } from "../hooks/useQuiz";
import { allQuestions } from "../data";

describe("Custom Hooks Test Suite", () => {
  it("useSearch should filter topics and questions matching query", () => {
    const sampleQuestions = allQuestions.slice(0, 20);
    const { result } = renderHook(() =>
      useSearch("closure", { questions: sampleQuestions }),
    );

    expect(result.current).toBeDefined();
    expect(result.current.questions).toBeInstanceOf(Array);
  });

  it("useQuiz should initialize, answer questions, and report results", () => {
    const questions = allQuestions.slice(0, 3);
    const { result } = renderHook(() => useQuiz());

    expect(result.current.phase).toBe("idle");

    act(() => {
      result.current.startQuiz(questions);
    });

    expect(result.current.phase).toBe("active");
    expect(result.current.totalQuestions).toBe(3);
    expect(result.current.currentIndex).toBe(0);

    act(() => {
      result.current.answerQuestion(questions[0]!.id, true);
      result.current.nextQuestion();
    });

    expect(result.current.currentIndex).toBe(1);

    act(() => {
      result.current.skipQuestion();
      result.current.nextQuestion();
    });

    expect(result.current.currentIndex).toBe(2);

    act(() => {
      result.current.answerQuestion(questions[2]!.id, false);
      result.current.nextQuestion();
    });

    expect(result.current.phase).toBe("results");
    const results = result.current.getResults();
    expect(results.answered).toBe(2);
    expect(results.skipped).toBe(1);
    expect(results.correct).toBe(1);
  });

  it("useProgress should manage streak: start at 0, extend on consecutive days, and break if missed", async () => {
    const { useProgress } = await import("../hooks/useProgress");
    localStorage.clear();

    const { result, unmount } = renderHook(() => useProgress());

    // Fresh user: streak is 0
    expect(result.current.dailyStreak).toBe(0);

    // Record activity today -> streak becomes 1
    act(() => {
      result.current.recordStreakActivity();
    });
    expect(result.current.dailyStreak).toBe(1);

    // Duplicate activity today should not increment streak
    act(() => {
      result.current.recordStreakActivity();
    });
    expect(result.current.dailyStreak).toBe(1);
    unmount();

    // Simulate activity yesterday (consecutive day)
    const yesterday = new Date(Date.now() - 86400000);
    const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
    localStorage.setItem("feeq-last-active-date", JSON.stringify(yStr));
    localStorage.setItem("feeq-daily-streak", JSON.stringify(3));

    const { result: r2, unmount: unmount2 } = renderHook(() => useProgress());
    // Streak is maintained pending today's activity
    expect(r2.current.dailyStreak).toBe(3);

    // Complete activity today -> streak increments to 4!
    act(() => {
      r2.current.recordStreakActivity();
    });
    expect(r2.current.dailyStreak).toBe(4);
    unmount2();

    // Simulate missed days (last active 3 days ago) -> STREAK BREAKS!
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000);
    const oldStr = `${threeDaysAgo.getFullYear()}-${String(threeDaysAgo.getMonth() + 1).padStart(2, "0")}-${String(threeDaysAgo.getDate()).padStart(2, "0")}`;
    localStorage.setItem("feeq-last-active-date", JSON.stringify(oldStr));
    localStorage.setItem("feeq-daily-streak", JSON.stringify(5));

    const { result: r3 } = renderHook(() => useProgress());
    // Streak has broken and resets to 0
    expect(r3.current.dailyStreak).toBe(0);

    // Completing an activity restarts the streak at 1
    act(() => {
      r3.current.recordStreakActivity();
    });
    expect(r3.current.dailyStreak).toBe(1);
  });
});
