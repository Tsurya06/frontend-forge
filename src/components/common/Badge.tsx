import styles from "./Badge.module.css";

type BadgeVariant =
  "beginner" | "intermediate" | "advanced" | "senior" | "category" | "tag";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "small" | "medium";
  className?: string;
}

export function Badge({
  children,
  variant = "tag",
  size = "small",
  className,
}: BadgeProps) {
  const badgeClass = [styles.badge, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");

  return <span className={badgeClass}>{children}</span>;
}
