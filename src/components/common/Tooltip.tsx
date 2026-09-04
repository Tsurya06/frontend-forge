import styles from "./Tooltip.module.css";

interface TooltipProps {
  readonly text: string;
  readonly children: React.ReactNode;
}

export function Tooltip({ text, children }: Readonly<TooltipProps>) {
  return (
    <span className={styles.wrapper}>
      {children}
      <span className={styles.tooltip} role="tooltip">
        {text}
      </span>
    </span>
  );
}
