import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Play,
} from "lucide-react";
import { useInterviewSprintProgress } from "@/hooks/useInterviewSprintProgress";
import { getSprintDay } from "@/data/interviewSprint";
import styles from "./SprintDashboardWidget.module.css";

export function SprintDashboardWidget() {
  const navigate = useNavigate();
  const {
    state,
    completedDaysCount,
    completionPercentage,
    revisionDays,
    averageQuizScore,
    exercisesAttemptedCount,
    exercisesSolvedCount,
    nextUnfinishedDay,
  } = useInterviewSprintProgress();

  const currentDayLesson = useMemo(
    () => getSprintDay(state.currentDay || nextUnfinishedDay),
    [state.currentDay, nextUnfinishedDay]
  );

  // Derive next recommended action
  const nextRecommendedAction = useMemo(() => {
    if (completedDaysCount === 0) {
      return "Start Day 1: React Fundamentals & Rendering";
    }
    const currentProgress = state.dayProgress[nextUnfinishedDay];
    if (currentProgress && currentProgress.quizScore === undefined) {
      return `Complete Day ${nextUnfinishedDay} Quiz & Concept Check`;
    }
    if (completedDaysCount === 7) {
      return "Take the 45-minute Timed Capstone Assessment";
    }
    return `Continue Day ${nextUnfinishedDay}: ${currentDayLesson?.title || "Next Lesson"}`;
  }, [completedDaysCount, nextUnfinishedDay, state.dayProgress, currentDayLesson]);

  return (
    <div className={styles.sprintWidget} aria-label="7-Day Mastery Sprint Progress">
      <div className={styles.topRow}>
        <div className={styles.badgeGroup}>
          <span className={styles.trackBadge}>
            <Sparkles size={13} /> 7-DAY MASTERY SPRINT
          </span>
          <span className={styles.dayBadge}>Day {state.currentDay || nextUnfinishedDay} of 7</span>
        </div>
        <span className={styles.percentText}>{completionPercentage}%</span>
      </div>

      <div className={styles.progressTrack} role="progressbar" aria-valuenow={completionPercentage} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={styles.progressBar}
          style={{ width: `${Math.max(completionPercentage > 0 ? 6 : 0, completionPercentage)}%` }}
        />
      </div>

      {/* Grid of 4 compact metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Lessons Done</span>
          <span className={styles.metricValue}>{completedDaysCount} / 7</span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Quiz Score</span>
          <span className={styles.metricValue}>
            {averageQuizScore !== null ? `${averageQuizScore}%` : "—"}
          </span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Exercises</span>
          <span className={styles.metricValue}>
            {exercisesSolvedCount} solved ({exercisesAttemptedCount} tried)
          </span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Revision</span>
          <span className={styles.metricValue}>
            {revisionDays.length} flagged
          </span>
        </div>
      </div>

      {/* Next Action Box */}
      <div className={styles.nextActionBox}>
        <span className={styles.actionPrompt}>Next Action:</span>
        <span className={styles.actionDesc}>{nextRecommendedAction}</span>
      </div>

      {/* Controls */}
      <div className={styles.buttonRow}>
        <button
          type="button"
          className={styles.continueSprintBtn}
          onClick={() => navigate(`/interview-sprint/${nextUnfinishedDay}`)}
        >
          <Play size={14} fill="currentColor" />
          <span>Continue Sprint</span>
        </button>
        <Link to="/interview-sprint" className={styles.viewPlanLink}>
          <span>View Plan</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
