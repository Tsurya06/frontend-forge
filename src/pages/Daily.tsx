import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useProgressContext } from "@/context/ProgressContext";
import { LeftQuickNav } from "@/components/layout/LeftQuickNav";
import { Badge } from "@/components/common/Badge";
import {
  allQuestions,
  allCodingProblems,
  allMachineCodingProblems,
} from "@/data";
import type {
  Difficulty,
  Question,
  CodingProblem,
  MachineCodingProblem,
} from "@/types";
import styles from "./Daily.module.css";

const difficultyVariant: Record<
  Difficulty,
  "beginner" | "intermediate" | "advanced" | "senior"
> = {
  Beginner: "beginner",
  Intermediate: "intermediate",
  Advanced: "advanced",
  Senior: "senior",
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function dateSeed(dayOffset = 0): number {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export default function Daily() {
  const {
    completedQuestions,
    completedCoding,
    completedMachineCoding,
    markComplete,
    dailyStreak,
  } = useProgressContext();

  const [selectedDayOffset, setSelectedDayOffset] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Daily picked challenges based on seed
  const { dailyCoding, dailyTheory, dailyMachine } = useMemo(() => {
    const random = seededRandom(dateSeed(selectedDayOffset));
    const codingIdx = Math.floor(random() * allCodingProblems.length);
    const theoryIdx = Math.floor(random() * allQuestions.length);
    const machineIdx = Math.floor(random() * allMachineCodingProblems.length);

    return {
      dailyCoding: allCodingProblems[codingIdx] as CodingProblem,
      dailyTheory: allQuestions[theoryIdx] as Question,
      dailyMachine: allMachineCodingProblems[
        machineIdx
      ] as MachineCodingProblem,
    };
  }, [selectedDayOffset]);

  const today = new Date();
  const currentDay = today.getDate();
  const monthName = today
    .toLocaleString("default", { month: "short" })
    .toUpperCase();

  const isCodingDone = dailyCoding && completedCoding.includes(dailyCoding.id);
  const isTheoryDone =
    dailyTheory && completedQuestions.includes(dailyTheory.id);
  const isMachineDone =
    dailyMachine && completedMachineCoding.includes(dailyMachine.id);

  const totalDailyDone =
    (isCodingDone ? 1 : 0) + (isTheoryDone ? 1 : 0) + (isMachineDone ? 1 : 0);

  return (
    <div className={styles.pageLayout}>
      {/* ── Left Quick-Nav Sidebar (Desktop) ── */}
      <LeftQuickNav />

      {/* ── Main Daily Challenge Scroll Area ── */}
      <main className={styles.scrollArea}>
        <div className={styles.dailyContent}>
          {/* Header Banner */}
          <div className={styles.headerBanner}>
            <div className={styles.headerLeft}>
              <div className={styles.calendarBadge}>
                <span className={styles.calDay}>{currentDay}</span>
                <span className={styles.calMonth}>{monthName}</span>
              </div>
              <div>
                <h1 className={styles.pageTitle}>Daily Coding Challenge</h1>
                <p className={styles.pageSubtitle}>
                  Day {currentDay} • Solve daily questions to build interview
                  consistency and earn monthly badges.
                </p>
              </div>
            </div>

            <div className={styles.streakCard}>
              <span className={styles.streakFlame}>🔥</span>
              <div className={styles.streakInfo}>
                <span className={styles.streakNumber}>
                  {dailyStreak || 1} Days
                </span>
                <span className={styles.streakSub}>Active Streak</span>
              </div>
            </div>
          </div>

          {/* ── LeetCode Calendar Day Selector ── */}
          <div className={styles.calendarStrip}>
            <div className={styles.stripHeader}>
              <span className={styles.stripTitle}>
                {monthName} 2026 Daily Progress
              </span>
              <span className={styles.stripStatus}>
                {totalDailyDone}/3 Tasks Solved Today
              </span>
            </div>

            <div className={styles.dayButtonsRow}>
              {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
                const targetDate = new Date();
                targetDate.setDate(today.getDate() + offset);
                const dayNum = targetDate.getDate();
                const isSelected = selectedDayOffset === offset;
                const isCurrentToday = offset === 0;

                return (
                  <button
                    key={offset}
                    type="button"
                    className={`${styles.dayBtn} ${isSelected ? styles.dayBtnSelected : ""} ${isCurrentToday ? styles.dayBtnToday : ""}`}
                    onClick={() => {
                      setSelectedDayOffset(offset);
                      setShowAnswer(false);
                    }}
                  >
                    <span className={styles.dayBtnLabel}>
                      {targetDate.toLocaleString("default", {
                        weekday: "narrow",
                      })}
                    </span>
                    <span className={styles.dayBtnNum}>{dayNum}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 1. Daily Coding Challenge (Algorithm & Polyfill) ── */}
          {dailyCoding && (
            <div className={styles.challengeCard}>
              <div className={styles.cardTop}>
                <div className={styles.typeBadge}>💻 ALGORITHM / POLYFILL</div>
                <Badge
                  variant={difficultyVariant[dailyCoding.difficulty]}
                  size="small"
                >
                  {dailyCoding.difficulty === "Beginner"
                    ? "Easy"
                    : dailyCoding.difficulty === "Intermediate"
                      ? "Med."
                      : "Hard"}
                </Badge>
              </div>

              <h2 className={styles.challengeTitle}>{dailyCoding.title}</h2>
              <p className={styles.challengeDesc}>{dailyCoding.problem}</p>

              <div className={styles.tagChips}>
                {dailyCoding.tags.map((t) => (
                  <span key={t} className={styles.tagChip}>
                    {t}
                  </span>
                ))}
              </div>

              <div className={styles.cardActions}>
                <Link
                  to={`/coding/${dailyCoding.id}`}
                  className={styles.primaryBtn}
                >
                  ▶ Solve in LeetCode Workspace →
                </Link>

                <button
                  type="button"
                  className={`${styles.completeBtn} ${isCodingDone ? styles.completed : ""}`}
                  onClick={() => markComplete(dailyCoding.id, "coding")}
                >
                  {isCodingDone ? "✓ Solved" : "○ Mark Solved"}
                </button>
              </div>
            </div>
          )}

          {/* ── 2. Daily Core Concept Question ── */}
          {dailyTheory && (
            <div className={styles.challengeCard}>
              <div className={styles.cardTop}>
                <div className={`${styles.typeBadge} ${styles.theoryBadge}`}>
                  📖 THEORY & INTERNALS
                </div>
                <Badge
                  variant={difficultyVariant[dailyTheory.difficulty]}
                  size="small"
                >
                  {dailyTheory.difficulty === "Beginner"
                    ? "Easy"
                    : dailyTheory.difficulty === "Intermediate"
                      ? "Med."
                      : "Hard"}
                </Badge>
              </div>

              <h2 className={styles.challengeTitle}>{dailyTheory.question}</h2>

              {showAnswer ? (
                <div className={styles.answerBox}>
                  {dailyTheory.shortAnswer && (
                    <div className={styles.answerSummary}>
                      <strong>Key Takeaway:</strong> {dailyTheory.shortAnswer}
                    </div>
                  )}
                  <div className={styles.answerDetail}>
                    {dailyTheory.answer || dailyTheory.explanation}
                  </div>
                  {dailyTheory.code && (
                    <pre className={styles.codeSnippet}>
                      <code>{dailyTheory.code}</code>
                    </pre>
                  )}
                  <button
                    type="button"
                    className={styles.toggleAnswerBtn}
                    onClick={() => setShowAnswer(false)}
                  >
                    Hide Answer ▴
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.toggleAnswerBtn}
                  onClick={() => setShowAnswer(true)}
                >
                  Reveal Solution & Deep Dive ▾
                </button>
              )}

              <div className={styles.cardActions}>
                <Link
                  to={`/topics/${dailyTheory.topicId}`}
                  className={styles.secondaryBtn}
                >
                  View Full Topic →
                </Link>

                <button
                  type="button"
                  className={`${styles.completeBtn} ${isTheoryDone ? styles.completed : ""}`}
                  onClick={() => markComplete(dailyTheory.id, "question")}
                >
                  {isTheoryDone ? "✓ Solved" : "○ Mark Solved"}
                </button>
              </div>
            </div>
          )}

          {/* ── 3. Daily Machine Coding Task ── */}
          {dailyMachine && (
            <div className={styles.challengeCard}>
              <div className={styles.cardTop}>
                <div className={`${styles.typeBadge} ${styles.machineBadge}`}>
                  🏗️ MACHINE CODING TASK
                </div>
                <Badge
                  variant={difficultyVariant[dailyMachine.difficulty]}
                  size="small"
                >
                  {dailyMachine.difficulty === "Beginner"
                    ? "Easy"
                    : dailyMachine.difficulty === "Intermediate"
                      ? "Med."
                      : "Hard"}
                </Badge>
              </div>

              <h2 className={styles.challengeTitle}>{dailyMachine.title}</h2>
              <p className={styles.challengeDesc}>
                {dailyMachine.problemStatement}
              </p>

              <div className={styles.cardActions}>
                <Link
                  to={`/machine-coding/${dailyMachine.id}`}
                  className={styles.primaryBtn}
                >
                  Open Interactive Component Builder →
                </Link>

                <button
                  type="button"
                  className={`${styles.completeBtn} ${isMachineDone ? styles.completed : ""}`}
                  onClick={() => markComplete(dailyMachine.id, "machineCoding")}
                >
                  {isMachineDone ? "✓ Solved" : "○ Mark Solved"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
