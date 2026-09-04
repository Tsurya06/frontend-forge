import styles from "./VisualizerComponents.module.css";

interface ConsoleOutputViewProps {
  readonly logs: readonly string[] | string[];
  readonly hideHeader?: boolean;
}

export function ConsoleOutputView({
  logs,
  hideHeader = false,
}: Readonly<ConsoleOutputViewProps>) {
  return (
    <div className={styles.consoleCard}>
      {!hideHeader && (
        <div className={styles.consoleHeader}>
          <div className={styles.consoleControls}>
            <span className={`${styles.consoleDot} ${styles.dotRed}`} />
            <span className={`${styles.consoleDot} ${styles.dotYellow}`} />
            <span className={`${styles.consoleDot} ${styles.dotGreen}`} />
            <span className={styles.consoleTitle}>Console Output (stdout)</span>
          </div>
          <span className={styles.consoleCount}>
            {logs.length} output{logs.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      <div className={styles.consoleBody}>
        {logs.length === 0 ? (
          <div className={styles.consolePlaceholder}>
            <span className={styles.consolePrompt}>&gt;</span>
            <span className={styles.consoleText}>No output yet. Step forward to execute...</span>
          </div>
        ) : (
          logs.map((log, idx) => (
            <div key={`${idx}-${log}`} className={styles.consoleLine}>
              <span className={styles.consolePrompt}>&gt;</span>
              <span className={styles.consoleText}>{log}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
