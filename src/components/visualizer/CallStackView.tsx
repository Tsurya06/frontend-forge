import { Layers, Info, Inbox, ExternalLink } from "lucide-react";
import type { CallFrame } from "@/utils/runtimeVisualizerEngine";
import styles from "./VisualizerComponents.module.css";

interface CallStackViewProps {
  readonly stack: readonly CallFrame[] | CallFrame[];
  readonly onSelectHeapRef?: (ref: string) => void;
  readonly onInfoClick?: () => void;
}

export function CallStackView({
  stack,
  onSelectHeapRef,
  onInfoClick,
}: Readonly<CallStackViewProps>) {
  return (
    <div className={styles.panelCard}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleGroup}>
          <Layers size={14} className={styles.accentIcon} />
          <h3 className={styles.panelTitle}>Call Stack</h3>
          {onInfoClick && (
            <button
              type="button"
              className={styles.infoIconBtn}
              onClick={onInfoClick}
              title="Learn what the Call Stack is"
              aria-label="Call Stack information"
            >
              <Info size={11} />
            </button>
          )}
        </div>
        <span className={styles.panelBadge}>LIFO · {stack.length} frame{stack.length !== 1 ? "s" : ""}</span>
      </div>

      <div className={styles.stackContainer}>
        {stack.length === 0 ? (
          <div className={styles.emptyNotice}>
            <Inbox size={20} className={styles.emptyIcon} />
            <span className={styles.emptyText}>Stack is Empty (Idle)</span>
          </div>
        ) : (
          // Display top of stack first
          [...stack].reverse().map((frame, idx) => {
            const isTop = idx === 0;
            return (
              <div
                key={frame.id}
                className={`${styles.stackFrame} ${isTop ? styles.stackFrameActive : ""}`}
              >
                <div className={styles.frameHeader}>
                  <div className={styles.frameNameRow}>
                    <span className={styles.frameBadge}>{isTop ? "ACTIVE" : "CALLER"}</span>
                    <span className={styles.frameName}>{frame.name}</span>
                  </div>
                  <span className={styles.frameLine}>Line {frame.line}</span>
                </div>

                {frame.variables.length > 0 && (
                  <div className={styles.frameVars}>
                    {frame.variables.map((v) => (
                      <div key={v.name} className={styles.varRow}>
                        <span className={styles.varName}>{v.name}:</span>
                        {v.heapRef ? (
                          <button
                            type="button"
                            className={styles.heapRefBadge}
                            onClick={() => onSelectHeapRef?.(v.heapRef!)}
                            title={`Inspect Heap object at ${v.heapRef}`}
                          >
                            <ExternalLink size={10} />
                            <span>{v.heapRef}</span>
                          </button>
                        ) : (
                          <span
                            className={`${styles.varVal} ${
                              v.type === "number"
                                ? styles.valNumber
                                : v.type === "string"
                                ? styles.valString
                                : styles.valDefault
                            }`}
                          >
                            {v.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
