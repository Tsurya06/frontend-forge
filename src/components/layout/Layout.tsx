import { useState, useCallback } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const layoutClass = [
    styles.layout,
    sidebarOpen ? styles.open : "",
    collapsed ? styles.collapsed : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={layoutClass}>
      <div className={styles.sidebar}>
        <Sidebar onNavigate={closeSidebar} />
      </div>
      <div
        className={styles.backdrop}
        onClick={closeSidebar}
        role="presentation"
      />
      <div className={styles.main}>
        <div className={styles.header}>
          <Header onMenuToggle={toggleSidebar} />
        </div>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
