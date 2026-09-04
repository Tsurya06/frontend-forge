import styles from "./Badge.module.css";

type BadgeVariant =
  "beginner" | "intermediate" | "advanced" | "senior" | "category" | "tag";

interface BadgeProps {
  readonly children: React.ReactNode;
  readonly variant?: BadgeVariant;
  readonly size?: "small" | "medium";
  readonly className?: string;
}

export function Badge({
  children,
  variant = "tag",
  size = "small",
  className,
}: Readonly<BadgeProps>) {
  const badgeClass = [styles.badge, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");

  return <span className={badgeClass}>{children}</span>;
}
