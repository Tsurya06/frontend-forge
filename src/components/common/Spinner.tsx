import styles from "./Spinner.module.css";

interface SpinnerProps {
  readonly size?: "sm" | "md" | "lg";
  readonly className?: string;
}

export function Spinner({ size = "md", className }: Readonly<SpinnerProps>) {
  return (
    <div
      className={`${styles.spinner} ${styles[size]} ${className ?? ""}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
