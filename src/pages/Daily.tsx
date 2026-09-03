import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  Code2,
  BookOpen,
  Terminal,
  CheckCircle2,
  Circle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Play,
} from "lucide-react";
import { useProgressContext } from "@/context/ProgressContext";
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

            <div
              className={`${styles.streakCard} ${
                dailyStreak === 0 ? styles.streakCardBroken : ""
              }`}
            >
              <Flame
                size={26}
                className={
                  dailyStreak > 0 ? styles.streakFlame : styles.streakFlameBroken
                }
              />
              <div className={styles.streakInfo}>
                <span className={styles.streakNumber}>
                  {dailyStreak} Day{dailyStreak === 1 ? "" : "s"}
                </span>
                <span className={styles.streakSub}>
                  {dailyStreak > 0
                    ? "Active Streak"
                    : "Streak Broken • Solve 1 today!"}
                </span>
              </div>
            </div>
          </div>

          {/* ── Daily Calendar Day Selector ── */}
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
                <div className={styles.typeBadge}>
                  <Code2 size={13} />
                  <span>ALGORITHM / POLYFILL</span>
                </div>
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
                  <Play size={12} fill="currentColor" />
                  <span>Solve in Coding Workspace</span>
                  <ArrowRight size={13} />
                </Link>

                <button
                  type="button"
                  className={`${styles.completeBtn} ${isCodingDone ? styles.completed : ""}`}
                  onClick={() => markComplete(dailyCoding.id, "coding")}
                >
                  {isCodingDone ? (
                    <CheckCircle2 size={13} />
                  ) : (
                    <Circle size={13} />
                  )}
                  <span>{isCodingDone ? "Solved" : "Mark Solved"}</span>
                </button>
              </div>
            </div>
          )}

          {/* ── 2. Daily Core Concept Question ── */}
          {dailyTheory && (
            <div className={styles.challengeCard}>
              <div className={styles.cardTop}>
                <div className={`${styles.typeBadge} ${styles.theoryBadge}`}>
                  <BookOpen size={13} />
                  <span>THEORY &amp; INTERNALS</span>
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
                    <span>Hide Answer</span>
                    <ChevronUp size={13} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.toggleAnswerBtn}
                  onClick={() => setShowAnswer(true)}
                >
                  <span>Reveal Solution &amp; Deep Dive</span>
                  <ChevronDown size={13} />
                </button>
              )}

              <div className={styles.cardActions}>
                <Link
                  to={`/topics/${dailyTheory.topicId}`}
                  className={styles.secondaryBtn}
                >
                  <span>View Full Topic</span>
                  <ArrowRight size={13} />
                </Link>

                <button
                  type="button"
                  className={`${styles.completeBtn} ${isTheoryDone ? styles.completed : ""}`}
                  onClick={() => markComplete(dailyTheory.id, "question")}
                >
                  {isTheoryDone ? (
                    <CheckCircle2 size={13} />
                  ) : (
                    <Circle size={13} />
                  )}
                  <span>{isTheoryDone ? "Solved" : "Mark Solved"}</span>
                </button>
              </div>
            </div>
          )}

          {/* ── 3. Daily Machine Coding Task ── */}
          {dailyMachine && (
            <div className={styles.challengeCard}>
              <div className={styles.cardTop}>
                <div className={`${styles.typeBadge} ${styles.machineBadge}`}>
                  <Terminal size={13} />
                  <span>MACHINE CODING TASK</span>
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
                  <span>Open Interactive Component Builder</span>
                  <ArrowRight size={13} />
                </Link>

                <button
                  type="button"
                  className={`${styles.completeBtn} ${isMachineDone ? styles.completed : ""}`}
                  onClick={() => markComplete(dailyMachine.id, "machineCoding")}
                >
                  {isMachineDone ? (
                    <CheckCircle2 size={13} />
                  ) : (
                    <Circle size={13} />
                  )}
                  <span>{isMachineDone ? "Solved" : "Mark Solved"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
