import styles from "./Card.module.css";

interface CardProps {
  readonly children: React.ReactNode;
  readonly header?: React.ReactNode;
  readonly footer?: React.ReactNode;
  readonly padding?: "compact" | "default" | "spacious";
  readonly onClick?: () => void;
  readonly className?: string;
}

export function Card({
  children,
  header,
  footer,
  padding = "default",
  onClick,
  className,
}: Readonly<CardProps>) {
  const Tag = onClick ? "button" : "div";

  const cardClass = [
    styles.card,
    styles[padding],
    onClick ? styles.clickable : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      className={cardClass}
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >
      {header && <div className={styles.header}>{header}</div>}
      {children}
      {footer && <div className={styles.footer}>{footer}</div>}
    </Tag>
  );
}
