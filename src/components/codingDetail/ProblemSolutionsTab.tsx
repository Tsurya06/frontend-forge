import { CodeBlock } from "@/components/code/CodeBlock";
import styles from "@/pages/coding/CodingDetail.module.css";
import type { ProblemSolutionsTabProps, SolutionTier } from "./types";

function resolveSolutionDetails(
  problem: ProblemSolutionsTabProps["problem"],
  tier: SolutionTier,
): { code: string; approach: string } {
  if (tier === "beginner" && problem.beginnerImplementation) {
    return {
      code: problem.beginnerImplementation,
      approach:
        problem.beginnerApproach ||
        problem.naiveApproach ||
        "Baseline implementation for core requirements.",
    };
  }

  if (tier === "intermediate" && problem.intermediateImplementation) {
    return {
      code: problem.intermediateImplementation,
      approach:
        problem.intermediateApproach ||
        "Enhanced implementation with additional argument handling.",
    };
  }

  if (tier === "expert" && problem.expertImplementation) {
    return {
      code: problem.expertImplementation,
      approach: problem.expertApproach || problem.optimalApproach,
    };
  }

  return {
    code: problem.implementation,
    approach: problem.optimalApproach,
  };
}

export function ProblemSolutionsTab({
  problem,
  selectedTier,
  isHtmlCss,
  onSelectTier,
  onLoadSolution,
}: Readonly<ProblemSolutionsTabProps>) {
  const { code: activeCode, approach: activeApproach } = resolveSolutionDetails(
    problem,
    selectedTier,
  );

  return (
    <div className={styles.solutionsTabContent}>
      <div className={styles.solutionHeader}>
        <h2 className={styles.editorialHeading}>
          Progressive 3-Tier Solutions
        </h2>
        <div className={styles.tierSelector}>
          {problem.beginnerImplementation && (
            <button
              type="button"
              className={`${styles.tierBtn} ${selectedTier === "beginner" ? styles.tierBtnActiveBeginner : ""}`}
              onClick={() => onSelectTier("beginner")}
            >
              🟢 Beginner
            </button>
          )}
          {problem.intermediateImplementation && (
            <button
              type="button"
              className={`${styles.tierBtn} ${selectedTier === "intermediate" ? styles.tierBtnActiveIntermediate : ""}`}
              onClick={() => onSelectTier("intermediate")}
            >
              🟡 Intermediate
            </button>
          )}
          {problem.expertImplementation && (
            <button
              type="button"
              className={`${styles.tierBtn} ${selectedTier === "expert" ? styles.tierBtnActiveExpert : ""}`}
              onClick={() => onSelectTier("expert")}
            >
              🟣 Expert / Production
            </button>
          )}
        </div>
      </div>

      <div className={styles.solutionApproachBox}>
        <span className={styles.approachHeading}>
          Architecture & Approach:
        </span>
        <p className={styles.approachText}>{activeApproach}</p>
        <button
          type="button"
          className={styles.loadSolutionBtn}
          onClick={() => onLoadSolution(activeCode)}
        >
          📥 Load this solution into Editor
        </button>
      </div>

      <CodeBlock
        code={activeCode}
        language={isHtmlCss ? "html" : "javascript"}
        title={`${selectedTier.toUpperCase()} SOLUTION`}
        showLineNumbers
      />
    </div>
  );
}
