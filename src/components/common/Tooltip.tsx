import styles from "./Tooltip.module.css";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export function Tooltip({ text, children }: TooltipProps) {
  return (
    <span className={styles.wrapper}>
      {children}
      <span className={styles.tooltip} role="tooltip">
        {text}
      </span>
    </span>
  );
}
