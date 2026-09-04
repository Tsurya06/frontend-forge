import { Palette } from "lucide-react";
import styles from "@/pages/coding/CodingDetail.module.css";
import type { ProblemEditorHeaderProps } from "./types";

export function ProblemEditorHeader({
  isHtmlCss,
  selectedLang,
  editorTheme,
  onSelectLang,
  onSelectTheme,
  onResetCode,
}: Readonly<ProblemEditorHeaderProps>) {
  return (
    <div className={styles.editorHeader}>
      <div className={styles.editorTitleGroup}>
        <span className={styles.editorCodeIcon}>&lt;/&gt;</span>
        <span className={styles.editorTitle}>Code</span>
        <select
          className={styles.langSelect}
          value={selectedLang}
          onChange={(e) =>
            onSelectLang(
              e.target.value as "javascript" | "typescript" | "html",
            )
          }
        >
          {isHtmlCss ? (
            <option value="html">HTML / CSS</option>
          ) : (
            <>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
            </>
          )}
        </select>
      </div>

      <div className={styles.editorActionsGroup}>
        <div className={styles.themeSelectorGroup}>
          <Palette size={12} className={styles.themeIcon} />
          <select
            className={styles.themeSelect}
            value={editorTheme}
            onChange={(e) => onSelectTheme(e.target.value)}
            title="Choose Editor Theme"
            aria-label="Editor Theme"
          >
            <option value="vs-dark">VS Dark</option>
            <option value="one-dark">One Dark</option>
            <option value="github-dark">GitHub Dark</option>
            <option value="dracula">Dracula</option>
            <option value="light">Light</option>
            <option value="hc-black">High Contrast</option>
          </select>
        </div>
        <span className={styles.savedStatus}>Auto-saved</span>
        <button
          type="button"
          className={styles.editorToolBtn}
          onClick={onResetCode}
          title="Reset to Starter Code"
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
}
