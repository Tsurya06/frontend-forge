import { useState, useCallback, useRef } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { Card } from "@/components/common/Card";
import { Modal } from "@/components/common/Modal";
import styles from "./Settings.module.css";

const STORAGE_KEYS = [
  "feeq-completed-questions",
  "feeq-completed-coding",
  "feeq-completed-machine-coding",
  "feeq-recently-viewed",
  "feeq-bookmarks",
  "feeq-notes",
  "feeq-theme",
  "feeq-flashcard-progress",
];

export default function Settings() {
  const { theme, setTheme } = useThemeContext();
  const [showResetModal, setShowResetModal] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(() => {
    const data: Record<string, unknown> = {};
    STORAGE_KEYS.forEach((key) => {
      const val = localStorage.getItem(key);
      if (val !== null) {
        try {
          data[key] = JSON.parse(val);
        } catch {
          data[key] = val;
        }
      }
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feeq-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target?.result as string);
          if (typeof data !== "object" || data === null) {
            setImportStatus("Invalid file format");
            return;
          }
          let imported = 0;
          Object.entries(data).forEach(([key, value]) => {
            if (STORAGE_KEYS.includes(key)) {
              localStorage.setItem(key, JSON.stringify(value));
              imported++;
            }
          });
          setImportStatus(
            `Imported ${imported} settings. Reload page to apply.`,
          );
        } catch {
          setImportStatus("Failed to parse file");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    [],
  );

  const handleReset = useCallback(() => {
    STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    setShowResetModal(false);
    window.location.reload();
  }, []);

  const shortcuts = [
    { keys: "/", description: "Focus search" },
    { keys: "?", description: "Show shortcuts" },
    { keys: "j", description: "Next item" },
    { keys: "k", description: "Previous item" },
    { keys: "b", description: "Toggle bookmark" },
    { keys: "m", description: "Mark complete" },
    { keys: "g d", description: "Go to Dashboard" },
    { keys: "g t", description: "Go to Topics" },
    { keys: "g c", description: "Go to Coding" },
    { keys: "g m", description: "Go to Machine Coding" },
    { keys: "g b", description: "Go to Bookmarks" },
    { keys: "g v", description: "Go to JS Visualizer" },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Theme</h2>
        <Card>
          <div className={styles.themeOptions}>
            {(["light", "dark", "system"] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.themeBtn} ${theme === t ? styles.activeTheme : ""}`}
                onClick={() => setTheme(t)}
              >
                <span className={styles.themeIcon}>
                  {t === "light" ? "☀️" : t === "dark" ? "🌙" : "💻"}
                </span>
                <span className={styles.themeName}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Data Management</h2>
        <Card>
          <div className={styles.dataActions}>
            <div className={styles.dataRow}>
              <div>
                <h3 className={styles.dataTitle}>Export Data</h3>
                <p className={styles.dataDesc}>
                  Download all your progress and settings as JSON
                </p>
              </div>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={handleExport}
              >
                Export
              </button>
            </div>

            <div className={styles.dataRow}>
              <div>
                <h3 className={styles.dataTitle}>Import Data</h3>
                <p className={styles.dataDesc}>
                  Restore from a previously exported JSON file
                </p>
              </div>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={handleImport}
              >
                Import
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className={styles.hiddenInput}
                onChange={handleFileChange}
                aria-label="Import data file"
              />
            </div>

            {importStatus && (
              <p className={styles.importStatus}>{importStatus}</p>
            )}

            <div className={styles.dataRow}>
              <div>
                <h3 className={`${styles.dataTitle} ${styles.dangerTitle}`}>
                  Reset All Progress
                </h3>
                <p className={styles.dataDesc}>
                  Clear all progress, bookmarks, and notes
                </p>
              </div>
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.dangerBtn}`}
                onClick={() => setShowResetModal(true)}
              >
                Reset
              </button>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Keyboard Shortcuts</h2>
        <Card>
          <div className={styles.shortcutList}>
            {shortcuts.map((s) => (
              <div key={s.keys} className={styles.shortcutRow}>
                <kbd className={styles.shortcutKey}>{s.keys}</kbd>
                <span className={styles.shortcutDesc}>{s.description}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset All Progress"
      >
        <div className={styles.resetModalContent}>
          <p>Are you sure you want to reset all progress? This will clear:</p>
          <ul>
            <li>All completed questions</li>
            <li>All completed coding problems</li>
            <li>All bookmarks</li>
            <li>All notes</li>
            <li>Recently viewed history</li>
          </ul>
          <p>
            <strong>This action cannot be undone.</strong>
          </p>
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => setShowResetModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.dangerBtn}`}
              onClick={handleReset}
            >
              Yes, Reset Everything
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
