import { useState, useCallback } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Modal } from "@/components/common/Modal";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

const SHORTCUT_SECTIONS = [
  {
    title: "Sequential Navigation",
    items: [
      { keys: "g d", desc: "Go to Dashboard" },
      { keys: "g t", desc: "Go to Topics Curriculum" },
      { keys: "g c", desc: "Go to Coding Challenges" },
      { keys: "g m", desc: "Go to Machine Coding" },
      { keys: "g b", desc: "Go to Bookmarks" },
    ],
  },
  {
    title: "Global Quick Actions",
    items: [
      { keys: "/", desc: "Focus search bar" },
      { keys: "?", desc: "Show keyboard shortcuts cheatsheet" },
      { keys: "j", desc: "Next item / card" },
      { keys: "k", desc: "Previous item / card" },
      { keys: "b", desc: "Toggle bookmark on active problem" },
      { keys: "m", desc: "Mark active problem complete" },
    ],
  },
];

export function Layout({ children }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  useKeyboardShortcuts({
    onShowShortcuts: () => setShortcutsModalOpen(true),
  });

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

      {/* Keyboard Shortcuts Modal */}
      <Modal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
        title="⌨️ Keyboard Shortcuts"
      >
        <div className={styles.shortcutsContainer}>
          {SHORTCUT_SECTIONS.map((sec) => (
            <div key={sec.title}>
              <div className={styles.shortcutsSectionTitle}>{sec.title}</div>
              <div className={styles.shortcutGrid}>
                {sec.items.map((item) => (
                  <div key={item.keys} className={styles.shortcutRow}>
                    <span className={styles.shortcutDesc}>{item.desc}</span>
                    <kbd className={styles.shortcutKey}>{item.keys}</kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
