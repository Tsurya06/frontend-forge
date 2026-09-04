import { useLocation } from "react-router-dom";
import styles from "./PageTransition.module.css";

interface PageTransitionProps {
  readonly children: React.ReactNode;
}

/**
 * Wraps page content so that every route change replays a smooth
 * fadeSlideIn animation on the incoming view.
 * The `key` on the wrapper forces React to remount it on location change,
 * which re-triggers the CSS animation automatically.
 */
export function PageTransition({ children }: Readonly<PageTransitionProps>) {
  const location = useLocation();
  const isDaily = location.pathname === "/daily" || location.pathname.startsWith("/daily");

  if (isDaily) {
    return <>{children}</>;
  }

  return (
    <div key={location.key} className={styles.pageTransition}>
      {children}
    </div>
  );
}
