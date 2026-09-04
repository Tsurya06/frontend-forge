import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { allQuestions, categories } from "@/data";
import type { Question, Difficulty } from "@/types";
import styles from "./Interview.module.css";

type ExperienceLevel = "Junior" | "Mid" | "Senior";
type Phase = "config" | "active" | "results";

interface AnswerRecord {
  questionId: string;
  answered: boolean;
  confidence: number;
}

const difficultyVariant: Record<
  Difficulty,
  "beginner" | "intermediate" | "advanced" | "senior"
> = {
  Beginner: "beginner",
  Intermediate: "intermediate",
  Advanced: "advanced",
  Senior: "senior",
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

function getQuestionsForLevel(
  level: ExperienceLevel,
  focus: string,
): Question[] {
  let pool = [...allQuestions];

  if (focus !== "all") {
    pool = pool.filter((q) => q.category === focus);
  }

  switch (level) {
    case "Junior":
      pool = pool.filter(
        (q) => q.difficulty === "Beginner" || q.difficulty === "Intermediate",
      );
      break;
    case "Mid":
      pool = pool.filter(
        (q) => q.difficulty === "Intermediate" || q.difficulty === "Advanced",
      );
      break;
    case "Senior":
      pool = pool.filter(
        (q) => q.difficulty === "Advanced" || q.difficulty === "Senior",
      );
      break;
  }

  return shuffleArray(pool);
}

export default function Interview() {
  const [phase, setPhase] = useState<Phase>("config");
  const [level, setLevel] = useState<ExperienceLevel>("Mid");
  const [focus, setFocus] = useState("all");
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (phase !== "active") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("results");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const handleStart = useCallback(() => {
    const qs = getQuestionsForLevel(level, focus).slice(
      0,
      Math.ceil(duration * 0.5),
    );
    setQuestions(qs);
    setCurrentIndex(0);
    setAnswers([]);
    setShowAnswer(false);
    setTimeLeft(duration * 60);
    setPhase("active");
  }, [level, focus, duration]);

  const handleAnswer = useCallback(
    (confidence: number) => {
      if (!currentQuestion) return;
      setAnswers((prev) => [
        ...prev,
        {
          questionId: currentQuestion.id,
          answered: true,
          confidence,
        },
      ]);
      setShowAnswer(false);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase("results");
      }
    },
    [currentQuestion, currentIndex, questions.length],
  );

  const handleSkip = useCallback(() => {
    if (!currentQuestion) return;
    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        answered: false,
        confidence: 0,
      },
    ]);
    setShowAnswer(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase("results");
    }
  }, [currentQuestion, currentIndex, questions.length]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const categoryScores = useMemo(() => {
    if (phase !== "results") return {};
    const scores: Record<
      string,
      { total: number; answered: number; totalConfidence: number }
    > = {};
    answers.forEach((a) => {
      const q = questions.find((qu) => qu.id === a.questionId);
      if (!q) return;
      const cat = q.category;
      if (!scores[cat]) {
        scores[cat] = { total: 0, answered: 0, totalConfidence: 0 };
      }
      const entry = scores[cat]!;
      entry.total++;
      if (a.answered) {
        entry.answered++;
        entry.totalConfidence += a.confidence;
      }
    });
    return scores;
  }, [phase, answers, questions]);

  if (phase === "config") {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Technical Skill Assessment</h1>
          <p className={styles.subtitle}>
            Timed competency benchmark across frontend domains
          </p>
        </header>

        <Card>
          <div className={styles.config}>
            <div className={styles.configRow}>
              <label className={styles.configLabel} htmlFor="iv-level">
                Experience Level
              </label>
              <select
                id="iv-level"
                className={styles.select}
                value={level}
                onChange={(e) => setLevel(e.target.value as ExperienceLevel)}
              >
                <option value="Junior">Junior</option>
                <option value="Mid">Mid-Level</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            <div className={styles.configRow}>
              <label className={styles.configLabel} htmlFor="iv-focus">
                Focus Area
              </label>
              <select
                id="iv-focus"
                className={styles.select}
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
              >
                <option value="all">General (All Areas)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.configRow}>
              <label className={styles.configLabel} htmlFor="iv-duration">
                Duration (minutes)
              </label>
              <select
                id="iv-duration"
                className={styles.select}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
            </div>

            <button
              type="button"
              className={styles.startBtn}
              onClick={handleStart}
            >
              Start Assessment
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (phase === "active" && currentQuestion) {
    const progressPct =
      questions.length > 0
        ? Math.round(((currentIndex + 1) / questions.length) * 100)
        : 0;

    return (
      <div className={styles.page}>
        <div className={styles.interviewHeader}>
          <div className={styles.timerRow}>
            <span
              className={`${styles.timer} ${timeLeft < 60 ? styles.timerWarning : ""}`}
            >
              {formatTime(timeLeft)}
            </span>
            <span className={styles.questionCounter}>
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <ProgressBar value={progressPct} size="sm" />
        </div>

        <Card>
          <div className={styles.questionCard}>
            <div className={styles.questionMeta}>
              <Badge
                variant={difficultyVariant[currentQuestion.difficulty]}
                size="small"
              >
                {currentQuestion.difficulty}
              </Badge>
              <Badge variant="category" size="small">
                {currentQuestion.category}
              </Badge>
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
                <p className={styles.answerText}>
                  {currentQuestion.shortAnswer}
                </p>

                <div className={styles.confidenceRow}>
                  <span className={styles.confidenceLabel}>
                    Rate your confidence:
                  </span>
                  <div className={styles.confidenceBtns}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={styles.confidenceBtn}
                        onClick={() => handleAnswer(n)}
                        aria-label={`Confidence ${n} out of 5`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              className={styles.skipBtn}
              onClick={handleSkip}
            >
              Skip
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (phase === "results") {
    const totalAnswered = answers.filter((a) => a.answered).length;
    const totalSkipped = answers.filter((a) => !a.answered).length;
    const avgConfidence =
      totalAnswered > 0
        ? (
            answers
              .filter((a) => a.answered)
              .reduce((sum, a) => sum + a.confidence, 0) / totalAnswered
          ).toFixed(1)
        : "0";
    const overallScore =
      questions.length > 0
        ? Math.round((totalAnswered / questions.length) * 100)
        : 0;

    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Assessment Performance Report</h1>
          <p className={styles.subtitle}>
            {level} level - {focus === "all" ? "General" : focus}
          </p>
        </header>

        <Card>
          <div className={styles.resultsCard}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreValue}>{overallScore}%</span>
              <span className={styles.scoreLabel}>Answered</span>
            </div>

            <div className={styles.resultsStats}>
              <div className={styles.resultStat}>
                <span className={styles.resultStatValue}>{totalAnswered}</span>
                <span className={styles.resultStatLabel}>Answered</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultStatValue}>{totalSkipped}</span>
                <span className={styles.resultStatLabel}>Skipped</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultStatValue}>{avgConfidence}</span>
                <span className={styles.resultStatLabel}>Avg Confidence</span>
              </div>
            </div>
          </div>
        </Card>

        {Object.keys(categoryScores).length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Category Scores</h2>
            <div className={styles.catScoreList}>
              {Object.entries(categoryScores).map(([catId, data]) => {
                const cat = categories.find((c) => c.id === catId);
                const pct =
                  data.total > 0
                    ? Math.round((data.answered / data.total) * 100)
                    : 0;
                return (
                  <div key={catId} className={styles.catScoreRow}>
                    <span className={styles.catScoreName}>
                      {cat?.icon} {cat?.title ?? catId}
                    </span>
                    <ProgressBar value={pct} size="sm" showPercentage />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div className={styles.resultsActions}>
          <button
            type="button"
            className={styles.startBtn}
            onClick={handleStart}
          >
            Retake
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => setPhase("config")}
          >
            New Configuration
          </button>
        </div>
      </div>
    );
  }

  return null;
}
