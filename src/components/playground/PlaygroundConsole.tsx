import { useRef, useEffect } from "react";
import styles from "@/pages/playground/Playground.module.css";
import type { ConsoleLine } from "./types";

export interface PlaygroundConsoleProps {
  readonly output: readonly ConsoleLine[];
}

function getLineStyle(type: ConsoleLine["type"]): string {
  switch (type) {
    case "error":
      return styles.errorLine ?? "";
    case "warn":
      return styles.warnLine ?? "";
    case "info":
      return styles.infoLine ?? "";
    case "result":
      return styles.resultLine ?? "";
    default:
      return styles.logLine ?? "";
  }
}

function getPrefix(type: ConsoleLine["type"]): string {
  switch (type) {
    case "error":
      return "✗";
    case "warn":
      return "⚠";
    case "info":
      return "ℹ";
    case "result":
      return "→";
    default:
      return "›";
  }
}

export function PlaygroundConsole({
  output,
}: Readonly<PlaygroundConsoleProps>) {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className={styles.consoleOutput} ref={consoleRef}>
      {output.length === 0 ? (
        <div className={styles.emptyConsole}>
          <span className={styles.emptyIcon}>💡</span>
          <p className={styles.emptyText}>
            Click <strong>&quot;▶ Run&quot;</strong> or press{" "}
            <strong>⌘+Enter</strong> to execute
          </p>
          <span className={styles.emptySub}>
            Outputs, return values, errors, and async logs stream here
          </span>
        </div>
      ) : (
        output.map((line) => (
          <div
            key={line.id}
            className={`${styles.consoleLine} ${getLineStyle(line.type)}`}
          >
            <span className={styles.consolePrefix}>{getPrefix(line.type)}</span>
            <span className={styles.consoleText}>{line.text}</span>
          </div>
        ))
      )}
    </div>
  );
}
