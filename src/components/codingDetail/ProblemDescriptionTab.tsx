import { Badge } from "@/components/common/Badge";
import styles from "@/pages/coding/CodingDetail.module.css";
import type { ProblemDescriptionTabProps } from "./types";

export function ProblemDescriptionTab({
  problem,
  currentIndex,
  completed,
  difficultyVariant,
}: Readonly<ProblemDescriptionTabProps>) {
  return (
    <div className={styles.descriptionTabContent}>
      {/* Problem Header */}
      <div className={styles.problemHeaderRow}>
        <h1 className={styles.problemTitle}>
          {currentIndex + 1}. {problem.title}
        </h1>
        {completed && <span className={styles.solvedTag}>Solved ✓</span>}
      </div>

      {/* Difficulty & Badges Row */}
      <div className={styles.badgeRow}>
        <Badge
          variant={difficultyVariant[problem.difficulty]}
          size="small"
        >
          {problem.difficulty === "Beginner"
            ? "Easy"
            : problem.difficulty === "Intermediate"
              ? "Medium"
              : "Hard"}
        </Badge>

        <div className={styles.tagGroup}>
          {problem.tags.map((t) => (
            <span key={t} className={styles.topicBadge}>
              🏷️ {t}
            </span>
          ))}
        </div>

        <span className={styles.companyBadge}>
          🏢 {problem.category || "JavaScript"}
        </span>
      </div>

      {/* Problem Description Statement */}
      <div className={styles.problemBodyText}>
        {problem.problem.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {/* Examples */}
      <div className={styles.examplesSection}>
        {problem.examples.map((ex, idx) => (
          <div key={idx} className={styles.exampleBox}>
            <span className={styles.exampleTitle}>Example {idx + 1}:</span>
            <div className={styles.exampleCodeBox}>
              <div className={styles.exampleRow}>
                <span className={styles.exampleLabel}>Input:</span>
                <span className={styles.exampleVal}>{ex.input}</span>
              </div>
              <div className={styles.exampleRow}>
                <span className={styles.exampleLabel}>Output:</span>
                <span className={styles.exampleVal}>{ex.output}</span>
              </div>
              {ex.explanation && (
                <div className={styles.exampleRow}>
                  <span className={styles.exampleLabel}>Explanation:</span>
                  <span className={styles.exampleExplanation}>
                    {ex.explanation}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Constraints */}
      {problem.requirements && problem.requirements.length > 0 && (
        <div className={styles.constraintsSection}>
          <span className={styles.constraintsTitle}>
            Constraints & Requirements:
          </span>
          <ul className={styles.constraintsList}>
            {problem.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
            <li>
              Time Complexity: <code>{problem.timeComplexity}</code>
            </li>
            <li>
              Space Complexity: <code>{problem.spaceComplexity}</code>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
