import { Globe, Zap, Clock, Info } from "lucide-react";
import type { WebApiTask, QueueItem } from "@/utils/runtimeVisualizerEngine";
import styles from "./VisualizerComponents.module.css";

interface TaskQueuesViewProps {
  webApis: WebApiTask[];
  microtasks: QueueItem[];
  macrotasks: QueueItem[];
  onInfoClick?: (area: "webapis" | "microtasks" | "macrotasks") => void;
}

export function TaskQueuesView({
  webApis,
  microtasks,
  macrotasks,
  onInfoClick,
}: TaskQueuesViewProps) {
  return (
    <div className={styles.queuesContainer}>
      {/* ── 1. Web APIs Background Worker Threads ── */}
      <div className={styles.panelCard}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleGroup}>
            <Globe size={14} className={styles.webApiIcon} />
            <h3 className={styles.panelTitle}>Web APIs</h3>
            {onInfoClick && (
              <button
                type="button"
                className={styles.infoIconBtn}
                onClick={() => onInfoClick("webapis")}
                title="Learn how Web APIs work"
                aria-label="Web APIs information"
              >
                <Info size={11} />
              </button>
            )}
          </div>
          <span className={styles.panelBadge}>Browser Threads ({webApis.length})</span>
        </div>

        <div className={styles.queueList}>
          {webApis.length === 0 ? (
            <div className={styles.emptyNoticeMini}>No Active Browser Timers / Network Tasks</div>
          ) : (
            webApis.map((api) => (
              <div key={api.id} className={styles.webApiCard}>
                <div className={styles.webApiHeader}>
                  <span className={styles.webApiTag}>{api.type}</span>
                  <span className={styles.webApiDuration}>{api.duration}</span>
                </div>
                <span className={styles.webApiLabel}>{api.label}</span>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${api.progress}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── 2. Microtask Queue (VIP Priority) ── */}
      <div className={`${styles.panelCard} ${styles.microtaskCard}`}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleGroup}>
            <Zap size={14} className={styles.vipIcon} />
            <h3 className={styles.panelTitle}>Microtask Queue</h3>
            {onInfoClick && (
              <button
                type="button"
                className={styles.infoIconBtn}
                onClick={() => onInfoClick("microtasks")}
                title="Learn how the Microtask Queue works"
                aria-label="Microtask queue information"
              >
                <Info size={11} />
              </button>
            )}
          </div>
          <span className={`${styles.panelBadge} ${styles.vipBadge}`}>
            VIP Priority ({microtasks.length})
          </span>
        </div>

        <div className={styles.queueList}>
          {microtasks.length === 0 ? (
            <div className={styles.emptyNoticeMini}>Microtask Queue is Empty</div>
          ) : (
            microtasks.map((item, idx) => (
              <div key={item.id} className={styles.queueItemCardMicro}>
                <div className={styles.queueItemMeta}>
                  <span className={styles.queueIndex}>#{idx + 1}</span>
                  <span className={styles.queueSource}>{item.source}</span>
                </div>
                <div className={styles.queueLabel}>{item.label}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── 3. Callback / Macrotask Queue ── */}
      <div className={styles.panelCard}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleGroup}>
            <Clock size={14} className={styles.macroIcon} />
            <h3 className={styles.panelTitle}>Macrotask Queue</h3>
            {onInfoClick && (
              <button
                type="button"
                className={styles.infoIconBtn}
                onClick={() => onInfoClick("macrotasks")}
                title="Learn how the Macrotask Queue works"
                aria-label="Macrotask queue information"
              >
                <Info size={11} />
              </button>
            )}
          </div>
          <span className={styles.panelBadge}>FIFO ({macrotasks.length})</span>
        </div>

        <div className={styles.queueList}>
          {macrotasks.length === 0 ? (
            <div className={styles.emptyNoticeMini}>Macrotask Queue is Empty</div>
          ) : (
            macrotasks.map((item, idx) => (
              <div key={item.id} className={styles.queueItemCardMacro}>
                <div className={styles.queueItemMeta}>
                  <span className={styles.queueIndex}>#{idx + 1}</span>
                  <span className={styles.queueSource}>{item.source}</span>
                </div>
                <div className={styles.queueLabel}>{item.label}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
