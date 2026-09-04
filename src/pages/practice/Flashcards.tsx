import { useState, useMemo } from "react";
import { useFlashcards } from "@/hooks/useFlashcards";
import { Card } from "@/components/common/Card";
import { ProgressBar } from "@/components/common/ProgressBar";
import { allQuestions, categories } from "@/data";
import type { Question } from "@/types";
import styles from "./Flashcards.module.css";

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

export default function Flashcards() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cardCount, setCardCount] = useState(20);
  const [started, setStarted] = useState(false);

  const availableCards = useMemo(() => {
    let qs = [...allQuestions];
    if (categoryFilter !== "all") {
      qs = qs.filter((q) => q.category === categoryFilter);
    }
    return qs;
  }, [categoryFilter]);

  const [cards, setCards] = useState<Question[]>([]);

  const {
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
  } = useFlashcards(cards);

  const handleStart = () => {
    const selected = shuffleArray(availableCards).slice(0, cardCount);
    setCards(selected);
    setStarted(true);
    reset();
  };

  const handleReset = () => {
    setStarted(false);
    setCards([]);
    reset();
  };

  const progressPct =
    totalCards > 0 ? Math.round(((currentIndex + 1) / totalCards) * 100) : 0;

  if (!started || cards.length === 0) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Flashcards</h1>
          <p className={styles.subtitle}>Review concepts with flip cards</p>
        </header>

        <Card>
          <div className={styles.config}>
            <div className={styles.configRow}>
              <label className={styles.configLabel} htmlFor="fc-category">
                Category
              </label>
              <select
                id="fc-category"
                className={styles.select}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.configRow}>
              <label className={styles.configLabel} htmlFor="fc-count">
                Number of Cards
              </label>
              <select
                id="fc-count"
                className={styles.select}
                value={cardCount}
                onChange={(e) => setCardCount(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>

            <p className={styles.availableCount}>
              {availableCards.length} cards available
            </p>

            <button
              type="button"
              className={styles.startBtn}
              onClick={handleStart}
              disabled={availableCards.length === 0}
            >
              Start Flashcards
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const isFinished =
    currentIndex >= totalCards - 1 &&
    (progress.easy.includes(currentCard?.id ?? "") ||
      progress.hard.includes(currentCard?.id ?? "") ||
      progress.skipped.includes(currentCard?.id ?? ""));

  if (isFinished || !currentCard) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Session Complete</h1>
        </header>

        <Card>
          <div className={styles.resultsCard}>
            <div className={styles.resultsStats}>
              <div className={styles.resultStat}>
                <span className={styles.resultStatValue}>
                  {progress.easy.length}
                </span>
                <span className={styles.resultStatLabel}>Easy</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultStatValue}>
                  {progress.hard.length}
                </span>
                <span className={styles.resultStatLabel}>Hard</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultStatValue}>
                  {progress.skipped.length}
                </span>
                <span className={styles.resultStatLabel}>Skipped</span>
              </div>
            </div>

            <div className={styles.resultsActions}>
              <button
                type="button"
                className={styles.startBtn}
                onClick={handleStart}
              >
                New Session
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={handleReset}
              >
                Change Settings
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.fcHeader}>
        <span className={styles.fcProgress}>
          Card {currentIndex + 1} of {totalCards}
        </span>
        <ProgressBar value={progressPct} size="sm" />
      </div>

      <div className={styles.cardContainer}>
        <div
          className={`${styles.flipCard} ${isFlipped ? styles.flipped : ""}`}
          onClick={flip}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              flip();
            }
          }}
          aria-label={
            isFlipped
              ? "Showing answer, click to show question"
              : "Showing question, click to reveal answer"
          }
        >
          <div className={styles.flipCardInner}>
            <div className={styles.flipCardFront}>
              <span className={styles.cardLabel}>Question</span>
              <p className={styles.cardText}>{currentCard.question}</p>
              <span className={styles.tapHint}>Tap to flip</span>
            </div>
            <div className={styles.flipCardBack}>
              <span className={styles.cardLabel}>Answer</span>
              <p className={styles.cardText}>{currentCard.shortAnswer}</p>
              {currentCard.explanation && (
                <p className={styles.cardExplanation}>
                  {currentCard.explanation}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.controlBtn}
          onClick={previous}
          disabled={currentIndex === 0}
        >
          {"← Previous"}
        </button>
        <button type="button" className={styles.controlBtn} onClick={flip}>
          Flip
        </button>
        <button
          type="button"
          className={styles.controlBtn}
          onClick={next}
          disabled={currentIndex >= totalCards - 1}
        >
          {"Next →"}
        </button>
      </div>

      <div className={styles.ratingControls}>
        <button
          type="button"
          className={`${styles.ratingBtn} ${styles.easyBtn}`}
          onClick={markEasy}
        >
          Easy
        </button>
        <button
          type="button"
          className={`${styles.ratingBtn} ${styles.hardBtn}`}
          onClick={markHard}
        >
          Hard
        </button>
        <button
          type="button"
          className={`${styles.ratingBtn} ${styles.skipRatingBtn}`}
          onClick={skip}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
