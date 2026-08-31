import styles from "./Card.module.css";

interface CardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: "compact" | "default" | "spacious";
  onClick?: () => void;
  className?: string;
}

export function Card({
  children,
  header,
  footer,
  padding = "default",
  onClick,
  className,
}: CardProps) {
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
    <Tag className={cardClass} onClick={onClick} type={onClick ? "button" : undefined}>
      {header && <div className={styles.header}>{header}</div>}
      {children}
      {footer && <div className={styles.footer}>{footer}</div>}
    </Tag>
  );
}
