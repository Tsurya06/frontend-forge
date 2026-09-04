import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  readonly value: number;
  readonly label?: string;
  readonly showPercentage?: boolean;
  readonly size?: "sm" | "md" | "lg";
  readonly color?: "primary" | "success" | "warning" | "error" | "accent";
}

export function ProgressBar({
  value,
  label,
  showPercentage = false,
  size = "md",
  color = "primary",
}: Readonly<ProgressBarProps>) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={styles.wrapper}>
      {(label ?? showPercentage) && (
        <div className={styles.labelRow}>
          {label && <span className={styles.label}>{label}</span>}
          {showPercentage && (
            <span className={styles.percentage}>{Math.round(clamped)}%</span>
          )}
        </div>
      )}
      <div
        className={`${styles.track} ${styles[size]}`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? `Progress: ${Math.round(clamped)}%`}
      >
        <div
          className={`${styles.fill} ${styles[color]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
