import { useState, useCallback } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = useCallback(() => {
    setDrawerOpen((prev) => !prev);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  return (
    <div className={styles.layout}>
      {/* Top Header */}
      <Header onMenuToggle={toggleDrawer} />

      {/* Slide-in Navigation Drawer (Mobile & Tablet) */}
      <div
        className={`${styles.drawerBackdrop} ${drawerOpen ? styles.drawerBackdropOpen : ""}`}
        onClick={closeDrawer}
        role="presentation"
        aria-hidden="true"
      />
      <aside
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}
        aria-label="Mobile Navigation"
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>⚡ Navigation & Curriculum</span>
          <button
            type="button"
            className={styles.closeDrawerBtn}
            onClick={closeDrawer}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <Sidebar onNavigate={closeDrawer} />
      </aside>

      {/* Main Content Area */}
      <main className={styles.content}>{children}</main>
    </div>
  );
}
