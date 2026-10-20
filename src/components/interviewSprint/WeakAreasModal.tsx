import { Link } from "react-router-dom";
import { Modal } from "@/components/common/Modal";
import { AlertCircle, CheckCircle, ArrowRight, Bookmark, Award } from "lucide-react";
import { allSprintDays } from "@/data/interviewSprint";
import type { DayProgress } from "@/data/interviewSprint/types";
import styles from "./WeakAreasModal.module.css";

interface WeakAreasModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayProgress: Record<number, DayProgress>;
}

export function WeakAreasModal({
  isOpen,
  onClose,
  dayProgress,
}: WeakAreasModalProps) {
  const weakDays = allSprintDays.filter((day) => {
    const prog = dayProgress[day.day];
    if (!prog) return false;
    const isBookmarked = prog.needsRevision;
    const isLowScore = typeof prog.quizScore === "number" && prog.quizScore < 80;
    return isBookmarked || isLowScore;
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🎯 Weak Areas & Revision Queue">
      <div className={styles.modalContent}>
        <p className={styles.description}>
          Focus on topics you marked for revision or where quiz scores are below 80%. Targeted spaced repetition maximizes long-term conceptual retention and architectural mastery.
        </p>

        {weakDays.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconBox}>
              <CheckCircle size={36} className={styles.emptyIcon} />
            </div>
            <h4 className={styles.emptyTitle}>No Weak Areas Flagged!</h4>
            <p className={styles.emptyText}>
              All completed quizzes scored 80% or higher, and no topics are currently marked for revision. Excellent work!
            </p>
          </div>
        ) : (
          <div className={styles.weakList}>
            {weakDays.map((day) => {
              const prog = dayProgress[day.day];
              const score = prog?.quizScore;
              const isBookmarked = prog?.needsRevision;

              return (
                <div key={day.day} className={styles.weakCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.dayBadge}>Day {day.day}</div>
                    <div className={styles.badgesGroup}>
                      {isBookmarked && (
                        <span className={styles.flagBadge}>
                          <Bookmark size={12} /> Needs Revision
                        </span>
                      )}
                      {typeof score === "number" && score < 80 && (
                        <span className={styles.scoreBadge}>
                          <Award size={12} /> Quiz: {score}%
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className={styles.cardTitle}>{day.title}</h4>
                  <p className={styles.cardTagline}>{day.tagline}</p>

                  <div className={styles.trapsSection}>
                    <span className={styles.trapsHeading}>
                      <AlertCircle size={14} /> Key Traps to Review:
                    </span>
                    <ul className={styles.trapsList}>
                      {day.misconceptions.slice(0, 2).map((m, idx) => (
                        <li key={idx} className={styles.trapItem}>
                          <strong>Myth:</strong> {m.myth}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.cardFooter}>
                    <Link
                      to={`/interview-sprint/${day.day}`}
                      className={styles.jumpLink}
                      onClick={onClose}
                    >
                      <span>Review Day {day.day} Lesson</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
