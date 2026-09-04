import styles from "./Skeleton.module.css";

interface SkeletonProps {
  readonly variant?: "text" | "card" | "list";
  readonly lines?: number;
  readonly className?: string;
}

export function Skeleton({
  variant = "text",
  lines = 3,
  className,
}: Readonly<SkeletonProps>) {
  if (variant === "card") {
    return (
      <div
        className={`${styles.skeleton} ${styles.card} ${className ?? ""}`}
        aria-hidden="true"
      />
    );
  }

  if (variant === "list") {
    return (
      <div className={`${styles.list} ${className ?? ""}`} aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className={`${styles.skeleton} ${styles.listItem}`} />
        ))}
      </div>
    );
  }

  return (
    <div className={className} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className={`${styles.skeleton} ${styles.text}`} />
      ))}
    </div>
  );
}
