import styles from "@/pages/playground/Playground.module.css";
import type { PlaygroundLanguage, ThemeOption } from "./types";

export interface PlaygroundHeaderProps {
  readonly language: PlaygroundLanguage;
  readonly onLanguageChange: (lang: PlaygroundLanguage) => void;
  readonly selectedTheme: string;
  readonly onThemeChange: (theme: string) => void;
  readonly themes: readonly ThemeOption[];
  readonly templatesCount: number;
  readonly onOpenTemplates: () => void;
  readonly isRunning: boolean;
  readonly onRun: () => void;
  readonly onFormat: () => void;
  readonly isFullscreen: boolean;
  readonly onToggleFullscreen: () => void;
  readonly onClear: () => void;
  readonly onReset: () => void;
}

export function PlaygroundHeader({
  language,
  onLanguageChange,
  selectedTheme,
  onThemeChange,
  themes,
  templatesCount,
  onOpenTemplates,
  isRunning,
  onRun,
  onFormat,
  isFullscreen,
  onToggleFullscreen,
  onClear,
  onReset,
}: Readonly<PlaygroundHeaderProps>) {
  return (
    <div className={styles.toolbar}>
      {/* Language Selector */}
      <div className={styles.toolbarGroup}>
        <label className={styles.toolbarLabel} htmlFor="lang-select">
          Mode / Language:
        </label>
        <select
          id="lang-select"
          className={styles.select}
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as PlaygroundLanguage)}
          aria-label="Language"
        >
          <option value="typescript">TypeScript</option>
          <option value="javascript">JavaScript</option>
          <option value="react">⚛️ React 18 / 19 (JSX &amp; TSX Live)</option>
          <option value="html">🌐 HTML &amp; CSS (Web Component Preview)</option>
        </select>
      </div>

      <div className={styles.toolbarSeparator} />

      {/* Theme Selector */}
      <div className={styles.toolbarGroup}>
        <label className={styles.toolbarLabel} htmlFor="theme-select">
          🎨 Theme:
        </label>
        <select
          id="theme-select"
          className={styles.select}
          value={selectedTheme}
          onChange={(e) => onThemeChange(e.target.value)}
          aria-label="Editor Theme"
        >
          {themes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.toolbarSeparator} />

      {/* Templates & Snippets Modal Trigger Button */}
      <button
        type="button"
        className={styles.templatesToolbarBtn}
        onClick={onOpenTemplates}
        title="Open Templates, Polyfills & Practice Snippets"
      >
        <span>📑 Snippets &amp; Templates</span>
        <span className={styles.templatesBadge}>{templatesCount}</span>
      </button>

      {/* Run Button */}
      <button
        type="button"
        className={isRunning ? styles.runBtnRunning : styles.runBtn}
        onClick={onRun}
        disabled={isRunning}
        aria-label="Run code"
        title="Run code (⌘+Enter / Ctrl+Enter)"
      >
        {isRunning
          ? "⏳ Running..."
          : language === "html" || language === "react"
            ? "▶ Run & Preview"
            : "▶ Run"}
      </button>

      {/* Format Button */}
      <button
        type="button"
        className={styles.formatBtn}
        onClick={onFormat}
        aria-label="Auto Format Code"
        title="Auto Format (Shift+Alt+F)"
      >
        ✨ Format
      </button>

      {/* Fullscreen Button */}
      <button
        type="button"
        className={styles.fullscreenBtn}
        onClick={onToggleFullscreen}
        aria-label={isFullscreen ? "Exit Fullscreen" : "Open Fullscreen"}
        title={isFullscreen ? "Exit Fullscreen (Esc)" : "Open Fullscreen"}
      >
        {isFullscreen ? "🗗 Exit" : "⛶ Fullscreen"}
      </button>

      <button
        type="button"
        className={styles.toolbarBtn}
        onClick={onClear}
        aria-label="Clear output"
      >
        🧹 Clear
      </button>

      <button
        type="button"
        className={styles.toolbarBtn}
        onClick={onReset}
        aria-label="Reset code"
      >
        ↺ Reset
      </button>

      <div className={styles.toolbarSpacer} />

      <div className={styles.shortcutHint}>
        <span>⌘+Enter to run</span>
        <span>•</span>
        <span>⌥⇧F to format</span>
      </div>
    </div>
  );
}
