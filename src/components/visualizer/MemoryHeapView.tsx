import { Boxes, Info, ExternalLink } from "lucide-react";
import type { HeapObject } from "@/utils/runtimeVisualizerEngine";
import styles from "./VisualizerComponents.module.css";

interface MemoryHeapViewProps {
  readonly heap: readonly HeapObject[] | HeapObject[];
  readonly highlightAddress?: string;
  readonly onSelectAddress?: (addr: string) => void;
  readonly onInfoClick?: () => void;
}

export function MemoryHeapView({
  heap,
  highlightAddress,
  onSelectAddress,
  onInfoClick,
}: Readonly<MemoryHeapViewProps>) {
  return (
    <div className={styles.panelCard}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleGroup}>
          <Boxes size={14} className={styles.accentIcon} />
          <h3 className={styles.panelTitle}>Memory Heap</h3>
          {onInfoClick && (
            <button
              type="button"
              className={styles.infoIconBtn}
              onClick={onInfoClick}
              title="Learn what the Memory Heap is"
              aria-label="Memory Heap information"
            >
              <Info size={11} />
            </button>
          )}
        </div>
        <span className={styles.panelBadge}>
          Dynamic Allocations ({heap.length})
        </span>
      </div>

      <div className={styles.heapGrid}>
        {heap.length === 0 ? (
          <div className={styles.emptyNotice}>
            <Boxes size={20} className={styles.emptyIcon} />
            <span className={styles.emptyText}>No Heap Allocations</span>
          </div>
        ) : (
          heap.map((obj) => {
            const isTarget = highlightAddress === obj.address;
            return (
              <div
                key={obj.address}
                className={`${styles.heapBlock} ${
                  isTarget ? styles.heapBlockHighlighted : ""
                } ${obj.isCollecting ? styles.heapBlockCollecting : ""}`}
                onClick={() => onSelectAddress?.(obj.address)}
              >
                <div className={styles.heapBlockHeader}>
                  <div className={styles.heapBlockMeta}>
                    <span className={styles.hexAddress}>{obj.address}</span>
                    <span className={styles.objTypeBadge}>{obj.type}</span>
                  </div>
                  <span className={styles.objLabel}>{obj.label}</span>
                </div>

                <div className={styles.heapProps}>
                  {obj.properties.map((p) => (
                    <div key={p.key} className={styles.heapPropRow}>
                      <span className={styles.propKey}>{p.key}:</span>
                      {p.isRef && p.refAddress ? (
                        <button
                          type="button"
                          className={styles.heapRefBadge}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAddress?.(p.refAddress!);
                          }}
                        >
                          <ExternalLink size={10} />
                          <span>{p.refAddress}</span>
                        </button>
                      ) : (
                        <span className={styles.propVal}>{p.value}</span>
                      )}
                    </div>
                  ))}
                </div>

                {obj.isMarked !== undefined && (
                  <div className={styles.gcFooter}>
                    <span
                      className={`${styles.gcTag} ${
                        obj.isMarked ? styles.gcReachable : styles.gcUnreachable
                      }`}
                    >
                      {obj.isMarked ? "✓ Reachable (Marked)" : "✗ Unreachable (Sweep)"}
                    </span>
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
