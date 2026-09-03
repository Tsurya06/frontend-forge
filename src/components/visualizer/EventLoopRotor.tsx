import { RefreshCw, Info } from "lucide-react";
import styles from "./VisualizerComponents.module.css";

interface EventLoopRotorProps {
  status:
    | "stack-running"
    | "checking-microtasks"
    | "draining-microtask"
    | "checking-macrotasks"
    | "pulling-macrotask"
    | "idle";
  onInfoClick?: () => void;
}

export function EventLoopRotor({ status, onInfoClick }: EventLoopRotorProps) {
  const isSpinning = status !== "idle";

  const getStatusDetails = () => {
    switch (status) {
      case "stack-running":
        return {
          title: "Executing Call Stack",
          desc: "Synchronous frames currently running",
          badgeColor: "blue",
        };
      case "checking-microtasks":
        return {
          title: "Inspecting Microtasks",
          desc: "Call stack empty! Inspecting VIP Microtask queue",
          badgeColor: "purple",
        };
      case "draining-microtask":
        return {
          title: "Draining Microtasks",
          desc: "Resolving Promises and queueMicrotasks to completion",
          badgeColor: "gold",
        };
      case "checking-macrotasks":
        return {
          title: "Inspecting Macrotasks",
          desc: "Microtasks cleared! Checking Callback Task Queue",
          badgeColor: "teal",
        };
      case "pulling-macrotask":
        return {
          title: "Pulling 1 Macrotask",
          desc: "Dequeuing single timer/event callback to Call Stack",
          badgeColor: "orange",
        };
      case "idle":
      default:
        return {
          title: "Idle State",
          desc: "Waiting for new tasks or user interaction",
          badgeColor: "gray",
        };
    }
  };

  const details = getStatusDetails();

  return (
    <div className={styles.rotorCard}>
      <div className={styles.rotorVisual}>
        <div
          className={`${styles.rotorWheel} ${
            isSpinning ? styles.rotorSpinning : styles.rotorIdle
          }`}
        >
          <RefreshCw size={14} className={styles.rotorSvg} />
        </div>
        <div className={styles.rotorPulseRing} />
      </div>

      <div className={styles.rotorContent}>
        <div className={styles.rotorInfoGroup}>
          <div className={styles.rotorHeader}>
            <div className={styles.rotorLabelRow}>
              <span className={styles.rotorLabel}>EVENT LOOP COORDINATOR</span>
              {onInfoClick && (
                <button
                  type="button"
                  className={styles.infoIconBtn}
                  onClick={onInfoClick}
                  title="Learn how the Event Loop works"
                  aria-label="Event loop information"
                >
                  <Info size={11} />
                </button>
              )}
            </div>
            <span className={`${styles.statusPill} ${styles[details.badgeColor]}`}>
              {status}
            </span>
          </div>
          <div className={styles.rotorDesc}>
            <strong>{details.title}</strong> — {details.desc}
          </div>
        </div>
      </div>
    </div>
  );
}
