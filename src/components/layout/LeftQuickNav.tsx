import { Link, useLocation } from "react-router-dom";
import { useProgressContext } from "@/context/ProgressContext";
import styles from "./LeftQuickNav.module.css";

export function LeftQuickNav() {
  const location = useLocation();
  const { completedCoding, completedQuestions } = useProgressContext();

  const totalSolved = completedCoding.length;
  const totalTopics = completedQuestions.length;

  return (
    <nav className={styles.leftNav} aria-label="Quick Navigation">
      {/* Primary Navigation */}
      <div className={styles.primaryNav}>
        <Link
          to="/coding"
          className={`${styles.navItem} ${location.pathname === "/coding" || location.pathname === "/" ? styles.active : ""}`}
        >
          <span className={styles.navIcon}>💻</span>
          <span className={styles.navLabel}>Problems</span>
        </Link>
        <Link
          to="/topics"
          className={`${styles.navItem} ${location.pathname === "/topics" ? styles.active : ""}`}
        >
          <span className={styles.navIcon}>📚</span>
          <span className={styles.navLabel}>Topics</span>
        </Link>
        <Link
          to="/daily"
          className={`${styles.navItem} ${location.pathname === "/daily" ? styles.active : ""}`}
        >
          <span className={styles.navIcon}>⚡</span>
          <span className={styles.navLabel}>Daily</span>
        </Link>
        <Link
          to="/roadmap"
          className={`${styles.navItem} ${location.pathname === "/roadmap" ? styles.active : ""}`}
        >
          <span className={styles.navIcon}>🗺️</span>
          <span className={styles.navLabel}>Study Plan</span>
        </Link>
      </div>

      <div className={styles.divider} />

      {/* Practice Tracks */}
      <div className={styles.myListsSection}>
        <div className={styles.listHeader}>
          <span className={styles.listTitle}>Practice</span>
        </div>

        <div className={styles.listItems}>
          <Link to="/coding" className={styles.listItem}>
            <span className={styles.starIcon}>⚡</span>
            <span className={styles.listItemName}>Polyfills</span>
            <span className={styles.badge}>28</span>
          </Link>

          <Link to="/machine-coding" className={styles.listItem}>
            <span className={styles.starIcon}>🏗️</span>
            <span className={styles.listItemName}>Machine Coding</span>
            <span className={styles.badge}>35</span>
          </Link>

          <Link to="/system-design" className={styles.listItem}>
            <span className={styles.starIcon}>📐</span>
            <span className={styles.listItemName}>System Design</span>
            <span className={styles.badge}>9</span>
          </Link>

          <Link to="/senior" className={styles.listItem}>
            <span className={styles.starIcon}>👔</span>
            <span className={styles.listItemName}>Staff Guide</span>
          </Link>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Study Tools */}
      <div className={styles.myListsSection}>
        <div className={styles.listHeader}>
          <span className={styles.listTitle}>Tools</span>
        </div>

        <div className={styles.listItems}>
          <Link to="/playground" className={styles.listItem}>
            <span className={styles.starIcon}>🛠️</span>
            <span className={styles.listItemName}>Sandbox</span>
          </Link>

          <Link to="/bookmarks" className={styles.listItem}>
            <span className={styles.starIcon}>⭐</span>
            <span className={styles.listItemName}>Bookmarks</span>
          </Link>

          <Link to="/progress" className={styles.listItem}>
            <span className={styles.starIcon}>📊</span>
            <span className={styles.listItemName}>Progress</span>
          </Link>
        </div>
      </div>

      {/* Footer Progress */}
      <div className={styles.footerNote}>
        <div className={styles.progressStatus}>
          <span className={styles.flameIcon}>🔥</span>
          <span className={styles.progressText}>
            {totalSolved > 0
              ? `${totalSolved} solved · ${totalTopics} topics`
              : "Start solving problems"}
          </span>
        </div>
        <Link to="/progress" className={styles.profileLink}>
          View Progress →
        </Link>
      </div>
    </nav>
  );
}
