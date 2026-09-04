import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProgressContext } from "@/context/ProgressContext";
import { STORAGE_KEYS } from "@/constants/storage";
import {
  Code2,
  BookOpen,
  Calendar,
  Map,
  Binary,
  Terminal,
  Network,
  Crown,
  Activity,
  PlayCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Flame,
} from "lucide-react";
import styles from "./LeftQuickNav.module.css";

export function LeftQuickNav() {
  const location = useLocation();
  const { completedCoding, completedQuestions } = useProgressContext();
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) === "true";
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(next));
      } catch {}
      return next;
    });
  };

  const totalSolved = completedCoding.length;
  const totalTopics = completedQuestions.length;

  return (
    <nav
      className={`${styles.leftNav} ${collapsed ? styles.leftNavCollapsed : ""}`}
      aria-label="Quick Navigation"
    >
      {/* Sidebar Collapse/Expand Toggle */}
      <div className={styles.topControlRow}>
        {!collapsed && <span className={styles.navHeaderTitle}>Navigation</span>}
        <button
          type="button"
          className={styles.collapseBtn}
          onClick={toggleCollapse}
          title={collapsed ? "Expand sidebar (full view)" : "Collapse sidebar (icon view)"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
        </button>
      </div>

      {/* Primary Navigation */}
      <div className={styles.primaryNav}>
        <Link
          to="/coding"
          className={`${styles.navItem} ${location.pathname === "/coding" || location.pathname === "/" ? styles.active : ""}`}
          title="Problems"
        >
          <span className={styles.navIcon}><Code2 size={16} /></span>
          {!collapsed && <span className={styles.navLabel}>Problems</span>}
        </Link>
        <Link
          to="/topics"
          className={`${styles.navItem} ${location.pathname === "/topics" ? styles.active : ""}`}
          title="Topics"
        >
          <span className={styles.navIcon}><BookOpen size={16} /></span>
          {!collapsed && <span className={styles.navLabel}>Topics</span>}
        </Link>
        <Link
          to="/daily"
          className={`${styles.navItem} ${location.pathname === "/daily" ? styles.active : ""}`}
          title="Daily"
        >
          <span className={styles.navIcon}><Calendar size={16} /></span>
          {!collapsed && <span className={styles.navLabel}>Daily</span>}
        </Link>
        <Link
          to="/roadmap"
          className={`${styles.navItem} ${location.pathname === "/roadmap" ? styles.active : ""}`}
          title="Study Plan"
        >
          <span className={styles.navIcon}><Map size={16} /></span>
          {!collapsed && <span className={styles.navLabel}>Study Plan</span>}
        </Link>
      </div>

      <div className={styles.divider} />

      {/* Practice Tracks */}
      <div className={styles.myListsSection}>
        {!collapsed && (
          <div className={styles.listHeader}>
            <span className={styles.listTitle}>Practice</span>
          </div>
        )}

        <div className={styles.listItems}>
          <Link to="/coding" className={styles.listItem} title="Polyfills (28)">
            <span className={styles.starIcon}><Binary size={15} /></span>
            {!collapsed && <span className={styles.listItemName}>Polyfills</span>}
            {!collapsed && <span className={styles.badge}>28</span>}
          </Link>

          <Link to="/machine-coding" className={styles.listItem} title="Machine Coding (35)">
            <span className={styles.starIcon}><Terminal size={15} /></span>
            {!collapsed && <span className={styles.listItemName}>Machine Coding</span>}
            {!collapsed && <span className={styles.badge}>35</span>}
          </Link>

          <Link to="/system-design" className={styles.listItem} title="System Design (9)">
            <span className={styles.starIcon}><Network size={15} /></span>
            {!collapsed && <span className={styles.listItemName}>System Design</span>}
            {!collapsed && <span className={styles.badge}>9</span>}
          </Link>

          <Link to="/senior" className={styles.listItem} title="Staff Guide">
            <span className={styles.starIcon}><Crown size={15} /></span>
            {!collapsed && <span className={styles.listItemName}>Staff Guide</span>}
          </Link>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Study Tools */}
      <div className={styles.myListsSection}>
        {!collapsed && (
          <div className={styles.listHeader}>
            <span className={styles.listTitle}>Tools</span>
          </div>
        )}

        <div className={styles.listItems}>
          <Link to="/visualizer" className={styles.listItem} title="JS Visualizer (NEW)">
            <span className={styles.starIcon}><Activity size={15} /></span>
            {!collapsed && <span className={styles.listItemName}>JS Visualizer</span>}
            {!collapsed && <span className={styles.badge} style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>NEW</span>}
          </Link>

          <Link to="/playground" className={styles.listItem} title="Sandbox">
            <span className={styles.starIcon}><PlayCircle size={15} /></span>
            {!collapsed && <span className={styles.listItemName}>Sandbox</span>}
          </Link>
        </div>
      </div>

      {/* Footer Progress */}
      {!collapsed && (
        <div className={styles.footerNote}>
          <div className={styles.progressStatus}>
            <Flame size={14} className={styles.flameIcon} />
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
      )}
    </nav>
  );
}
