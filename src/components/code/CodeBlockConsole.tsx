import styles from "./CodeBlock.module.css";
import type { CodeBlockConsoleProps } from "./types";
import { getConsoleLineClass, getConsolePrefix } from "./codeBlockUtils";

export function CodeBlockConsole({
  showConsole,
  isRunning,
  executionTime,
  consoleOutput,
  onClear,
  onClose,
}: Readonly<CodeBlockConsoleProps>) {
  if (!showConsole) return null;

  return (
    <div className={styles.inlineConsole}>
      <div className={styles.consoleHeader}>
        <div className={styles.consoleTitle}>
          <span>📟 Console Output</span>
          {executionTime !== null && (
            <span className={styles.execTime}>
              ⏱ {executionTime.toFixed(1)}ms
            </span>
          )}
        </div>
        <div className={styles.consoleActions}>
          <button
            type="button"
            className={styles.clearConsoleBtn}
            onClick={onClear}
          >
            Clear
          </button>
          <button
            type="button"
            className={styles.closeConsoleBtn}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>
      <div className={styles.consoleBody}>
        {consoleOutput.length === 0 ? (
          <span className={styles.emptyLog}>
            {isRunning ? "Executing code..." : "No console output recorded."}
          </span>
        ) : (
          consoleOutput.map((l) => (
            <div
              key={l.id}
              className={`${styles.consoleLine} ${getConsoleLineClass(l.type)}`}
            >
              <span className={styles.consolePrefix}>
                {getConsolePrefix(l.type)}
              </span>
              <span className={styles.consoleText}>{l.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
