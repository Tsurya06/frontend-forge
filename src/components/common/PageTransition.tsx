import { useRef } from "react";
import { useLocation } from "react-router-dom";
import styles from "./PageTransition.module.css";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Wraps page content so that every route change replays a smooth
 * fadeSlideIn animation on the incoming view.
 * The `key` on the wrapper forces React to remount it on location change,
 * which re-triggers the CSS animation automatically.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const prevKey = useRef(location.key);

  // Only animate when the route actually changes
  if (location.key !== prevKey.current) {
    prevKey.current = location.key;
  }

  return (
    <div key={location.key} className={styles.pageTransition}>
      {children}
    </div>
  );
}
