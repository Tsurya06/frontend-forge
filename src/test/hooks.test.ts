import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearch } from '../hooks/useSearch';
import { useQuiz } from '../hooks/useQuiz';
import { allQuestions } from '../data';

describe('Custom Hooks Test Suite', () => {
  it('useSearch should filter topics and questions matching query', () => {
    const sampleQuestions = allQuestions.slice(0, 20);
    const { result } = renderHook(() =>
      useSearch('closure', { questions: sampleQuestions })
    );

    expect(result.current).toBeDefined();
    expect(result.current.questions).toBeInstanceOf(Array);
  });

  it('useQuiz should initialize, answer questions, and report results', () => {
    const questions = allQuestions.slice(0, 3);
    const { result } = renderHook(() => useQuiz());

    expect(result.current.phase).toBe('idle');

    act(() => {
      result.current.startQuiz(questions);
    });

    expect(result.current.phase).toBe('active');
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

    expect(result.current.phase).toBe('results');
    const results = result.current.getResults();
    expect(results.answered).toBe(2);
    expect(results.skipped).toBe(1);
    expect(results.correct).toBe(1);
  });
});
