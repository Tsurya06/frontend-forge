import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Clock,
  Bookmark,
  Award,
  Play,
  Sparkles,
  ArrowRight,
  Target,
  Trophy,
} from "lucide-react";
import { allSprintDays } from "@/data/interviewSprint";
import { useInterviewSprintProgress } from "@/hooks/useInterviewSprintProgress";
import { WeakAreasModal } from "@/components/interviewSprint/WeakAreasModal";
import styles from "./InterviewSprintOverview.module.css";

interface InterviewSprintOverviewProps {
  /** If rendered embedded inside Roadmap page */
  isEmbedded?: boolean;
}

export default function InterviewSprintOverview({
  isEmbedded = false,
}: InterviewSprintOverviewProps) {
  const navigate = useNavigate();
  const {
    state,
    completedDaysCount,
    completionPercentage,
    revisionDays,
    averageQuizScore,
    nextUnfinishedDay,
  } = useInterviewSprintProgress();

  const [weakAreasOpen, setWeakAreasOpen] = useState(false);

  const getStatus = (dayNum: number) => {
    const prog = state.dayProgress[dayNum];
    if (prog?.completed) return "Completed";
    if (
      prog?.lastPracticedAt ||
      prog?.quizScore !== undefined ||
      prog?.exerciseAttempted
    )
      return "In Progress";
    return "Not Started";
  };

  return (
    <div className={isEmbedded ? styles.embeddedContainer : styles.pageContainer}>
      {/* ── Sprint Hero / Header Card ── */}
      <section className={styles.sprintHeroCard}>
        <div className={styles.heroTop}>
          <div className={styles.heroText}>
            <div className={styles.badgeRow}>
              <span className={styles.trackBadge}>
                <Sparkles size={13} /> 7-DAY MASTERY SPRINT
              </span>
            </div>
            <h1 className={styles.heroTitle}>
              Intensive Frontend & React Architecture Sprint
            </h1>
            <p className={styles.heroSubtitle}>
              A rigorous 7-day curriculum covering React rendering internals, advanced hook patterns, Core Web Vitals optimization, browser engines, enterprise security/a11y, RTL testing, and timed capstone assessments.
            </p>
          </div>

          {/* Overall Sprint Progress Widget */}
          <div className={styles.progressWidget}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>Sprint Progress</span>
              <span className={styles.progressPercent}>{completionPercentage}%</span>
            </div>
            <div className={styles.progressBarTrack} role="progressbar" aria-valuenow={completionPercentage} aria-valuemin={0} aria-valuemax={100}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${Math.max(completionPercentage > 0 ? 6 : 0, completionPercentage)}%` }}
              />
            </div>
            <div className={styles.progressStatsRow}>
              <span>{completedDaysCount} of 7 Days Complete</span>
              {averageQuizScore !== null && (
                <span>Avg Quiz: {averageQuizScore}%</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className={styles.heroActionsBar}>
          <div className={styles.primaryActions}>
            <button
              type="button"
              className={styles.continueBtn}
              onClick={() => navigate(`/interview-sprint/${nextUnfinishedDay}`)}
            >
              <Play size={15} fill="currentColor" />
              <span>
                {completedDaysCount === 0
                  ? "Start Day 1"
                  : completedDaysCount === 7
                  ? "Review Sprint"
                  : `Continue: Day ${nextUnfinishedDay}`}
              </span>
            </button>

            <button
              type="button"
              className={styles.weakAreasBtn}
              onClick={() => setWeakAreasOpen(true)}
            >
              <Target size={15} />
              <span>
                Review Weak Areas {revisionDays.length > 0 ? `(${revisionDays.length})` : ""}
              </span>
            </button>

            <Link to="/interview-sprint/mock" className={styles.mockBtn}>
              <Trophy size={15} />
              <span>Timed Capstone Assessment</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Seven Day Cards Grid ── */}
      <section className={styles.cardsGridSection}>
        <div className={styles.gridHeader}>
          <h2 className={styles.gridHeading}>7-Day Daily Syllabus</h2>
          <span className={styles.gridSubtext}>
            ~75–90 mins per day · Lessons, Code Examples, Quizzes & Hands-on Coding
          </span>
        </div>

        <div className={styles.sevenDaysGrid}>
          {allSprintDays.map((day) => {
            const status = getStatus(day.day);
            const prog = state.dayProgress[day.day];
            const isCompleted = status === "Completed";
            const isInProgress = status === "In Progress";

            let statusClass = styles.statusNotStarted;
            if (isCompleted) statusClass = styles.statusCompleted;
            else if (isInProgress) statusClass = styles.statusInProgress;

            return (
              <div key={day.day} className={`${styles.dayCard} ${isCompleted ? styles.dayCardCompleted : ""}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.dayBadge}>DAY {day.day}</div>
                  <span className={`${styles.statusBadge} ${statusClass}`}>
                    {status}
                  </span>
                </div>

                <h3 className={styles.cardTitle}>
                  <Link to={`/interview-sprint/${day.day}`} className={styles.titleLink}>
                    {day.title}
                  </Link>
                </h3>

                <p className={styles.cardTagline}>{day.tagline}</p>

                {/* Objectives Snippet */}
                <ul className={styles.objectivesList}>
                  {day.objectives.slice(0, 3).map((obj, oIdx) => (
                    <li key={oIdx} className={styles.objectiveItem}>
                      <span className={styles.bullet}>•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>

                {/* Card Meta & Badges */}
                <div className={styles.cardMeta}>
                  <span className={styles.metaTime}>
                    <Clock size={13} /> ~{day.estimatedMinutes} mins
                  </span>

                  {prog?.quizScore !== undefined && (
                    <span className={styles.metaQuiz}>
                      <Award size={13} /> Quiz: {prog.quizScore}%
                    </span>
                  )}

                  {prog?.needsRevision && (
                    <span className={styles.metaRevision}>
                      <Bookmark size={13} /> Revision Flagged
                    </span>
                  )}
                </div>

                {/* Card Footer Action */}
                <div className={styles.cardFooter}>
                  <Link
                    to={`/interview-sprint/${day.day}`}
                    className={styles.cardActionBtn}
                  >
                    <span>{isCompleted ? "Review Lesson" : "Start Lesson"}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Weak Areas Modal */}
      <WeakAreasModal
        isOpen={weakAreasOpen}
        onClose={() => setWeakAreasOpen(false)}
        dayProgress={state.dayProgress}
      />
    </div>
  );
}
