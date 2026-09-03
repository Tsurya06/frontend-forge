import styles from "./VisualizerComponents.module.css";

interface ExplanationBarProps {
  step: number;
  totalSteps: number;
  explanation: string;
  line: number;
  phase: string;
}

export function ExplanationBar({
  step,
  totalSteps,
  explanation,
  line,
  phase,
}: ExplanationBarProps) {
  return (
    <div className={styles.explanationCard}>
      <div className={styles.explanationHeader}>
        <div className={styles.explanationStepBadge}>
          Step {step + 1} of {totalSteps}
        </div>
        <div className={styles.explanationMeta}>
          <span className={styles.metaPill}>Executing Line {line}</span>
          <span className={styles.metaPillPhase}>{phase.toUpperCase()}</span>
        </div>
      </div>
      <p className={styles.explanationText}>{explanation}</p>
    </div>
  );
}
