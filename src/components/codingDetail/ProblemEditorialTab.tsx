import styles from "@/pages/coding/CodingDetail.module.css";
import type { ProblemEditorialTabProps } from "./types";

export function ProblemEditorialTab({
  problem,
}: Readonly<ProblemEditorialTabProps>) {
  return (
    <div className={styles.editorialTabContent}>
      <h2 className={styles.editorialHeading}>
        Editorial & Architectural Deep Dive
      </h2>
      <div className={styles.editorialBlock}>
        <h3 className={styles.subHeading}>💡 Optimal Approach</h3>
        <p className={styles.editorialText}>{problem.optimalApproach}</p>
      </div>

      {problem.naiveApproach && (
        <div className={styles.editorialBlock}>
          <h3 className={styles.subHeading}>
            ⚠️ Naive Approach & Limitations
          </h3>
          <p className={styles.editorialText}>{problem.naiveApproach}</p>
        </div>
      )}

      {problem.theoryAndConcepts && (
        <div className={styles.editorialBlock}>
          <h3 className={styles.subHeading}>
            📖 Core JavaScript Internals
          </h3>
          <div className={styles.theoryBox}>
            {problem.theoryAndConcepts.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      )}

      {problem.interviewTraps && problem.interviewTraps.length > 0 && (
        <div className={styles.trapsBox}>
          <h3 className={styles.trapsHeading}>
            ⚠️ Common Interview Traps
          </h3>
          <ul className={styles.trapsList}>
            {problem.interviewTraps.map((trap, i) => (
              <li key={i}>{trap}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
