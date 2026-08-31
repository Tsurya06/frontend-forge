import { useState, useMemo, useCallback } from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { allQuestions, categories } from '@/data';
import type { Difficulty } from '@/types';
import styles from './Quiz.module.css';

const difficultyVariant: Record<Difficulty, 'beginner' | 'intermediate' | 'advanced' | 'senior'> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
  Senior: 'senior',
};

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i] as T;
    shuffled[i] = shuffled[j] as T;
    shuffled[j] = temp;
  }
  return shuffled;
}

export default function Quiz() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [questionCount, setQuestionCount] = useState(10);
  const [showAnswer, setShowAnswer] = useState(false);

  const {
    phase,
    currentQuestion,
    currentIndex,
    totalQuestions,
    isLastQuestion,
    startQuiz,
    answerQuestion,
    skipQuestion,
    nextQuestion,
    resetQuiz,
    getResults,
  } = useQuiz();

  const availableQuestions = useMemo(() => {
    let qs = [...allQuestions];
    if (categoryFilter !== 'all') {
      qs = qs.filter(q => q.category === categoryFilter);
    }
    if (difficultyFilter !== 'all') {
      qs = qs.filter(q => q.difficulty === difficultyFilter);
    }
    return qs;
  }, [categoryFilter, difficultyFilter]);

  const handleStart = useCallback(() => {
    const selected = shuffleArray(availableQuestions).slice(0, questionCount);
    startQuiz(selected);
    setShowAnswer(false);
  }, [availableQuestions, questionCount, startQuiz]);

  const handleAnswer = useCallback((correct: boolean) => {
    if (!currentQuestion) return;
    answerQuestion(currentQuestion.id, correct);
    if (isLastQuestion) {
      nextQuestion();
    } else {
      setShowAnswer(false);
      nextQuestion();
    }
  }, [currentQuestion, answerQuestion, isLastQuestion, nextQuestion]);

  const handleSkip = useCallback(() => {
    skipQuestion();
    setShowAnswer(false);
    nextQuestion();
  }, [skipQuestion, nextQuestion]);

  const handleReset = useCallback(() => {
    resetQuiz();
    setShowAnswer(false);
  }, [resetQuiz]);

  const results = phase === 'results' ? getResults() : null;

  if (phase === 'idle' || phase === 'configuring') {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Quiz Mode</h1>
          <p className={styles.subtitle}>Test your knowledge with a quick quiz</p>
        </header>

        <Card>
          <div className={styles.config}>
            <div className={styles.configRow}>
              <label className={styles.configLabel} htmlFor="quiz-category">Category</label>
              <select
                id="quiz-category"
                className={styles.select}
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className={styles.configRow}>
              <label className={styles.configLabel} htmlFor="quiz-difficulty">Difficulty</label>
              <select
                id="quiz-difficulty"
                className={styles.select}
                value={difficultyFilter}
                onChange={e => setDifficultyFilter(e.target.value)}
              >
                <option value="all">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            <div className={styles.configRow}>
              <label className={styles.configLabel} htmlFor="quiz-count">Questions</label>
              <select
                id="quiz-count"
                className={styles.select}
                value={questionCount}
                onChange={e => setQuestionCount(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>
            </div>

            <p className={styles.availableCount}>
              {availableQuestions.length} questions available
            </p>

            <button
              type="button"
              className={styles.startBtn}
              onClick={handleStart}
              disabled={availableQuestions.length === 0}
            >
              Start Quiz
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (phase === 'active' && currentQuestion) {
    const progressPct = totalQuestions > 0
      ? Math.round(((currentIndex + 1) / totalQuestions) * 100)
      : 0;

    return (
      <div className={styles.page}>
        <div className={styles.quizHeader}>
          <span className={styles.quizProgress}>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <ProgressBar value={progressPct} size="sm" />
        </div>

        <Card>
          <div className={styles.questionCard}>
            <div className={styles.questionMeta}>
              <Badge variant={difficultyVariant[currentQuestion.difficulty]} size="small">
                {currentQuestion.difficulty}
              </Badge>
              <Badge variant="category" size="small">{currentQuestion.category}</Badge>
            </div>

            <h2 className={styles.questionText}>{currentQuestion.question}</h2>

            {!showAnswer && (
              <button
                type="button"
                className={styles.revealBtn}
                onClick={() => setShowAnswer(true)}
              >
                Reveal Answer
              </button>
            )}

            {showAnswer && (
              <div className={styles.answerSection}>
                <div className={styles.answerText}>
                  <h3>Answer</h3>
                  <p>{currentQuestion.shortAnswer}</p>
                  {currentQuestion.explanation && (
                    <>
                      <h3>Explanation</h3>
                      <p>{currentQuestion.explanation}</p>
                    </>
                  )}
                </div>

                <div className={styles.answerActions}>
                  <button
                    type="button"
                    className={`${styles.answerBtn} ${styles.correctBtn}`}
                    onClick={() => handleAnswer(true)}
                  >
                    {"✓ I knew this"}
                  </button>
                  <button
                    type="button"
                    className={`${styles.answerBtn} ${styles.incorrectBtn}`}
                    onClick={() => handleAnswer(false)}
                  >
                    {"✗ Didn't know"}
                  </button>
                  <button
                    type="button"
                    className={`${styles.answerBtn} ${styles.skipBtn}`}
                    onClick={handleSkip}
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (phase === 'results' && results) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Quiz Results</h1>
        </header>

        <Card>
          <div className={styles.resultsCard}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreValue}>{results.score}%</span>
              <span className={styles.scoreLabel}>Score</span>
            </div>

            <div className={styles.resultsStats}>
              <div className={styles.resultStat}>
                <span className={styles.resultStatValue}>{results.correct}</span>
                <span className={styles.resultStatLabel}>Correct</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultStatValue}>{results.answered - results.correct}</span>
                <span className={styles.resultStatLabel}>Incorrect</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultStatValue}>{results.skipped}</span>
                <span className={styles.resultStatLabel}>Skipped</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultStatValue}>{results.totalQuestions}</span>
                <span className={styles.resultStatLabel}>Total</span>
              </div>
            </div>

            <div className={styles.resultsActions}>
              <button type="button" className={styles.startBtn} onClick={handleStart}>
                Retake Quiz
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={handleReset}>
                New Configuration
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
