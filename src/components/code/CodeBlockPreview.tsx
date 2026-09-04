import styles from "./CodeBlock.module.css";
import type { CodeBlockPreviewProps } from "./types";

export function CodeBlockPreview({
  showHtmlPreview,
  previewDoc,
  onClose,
}: Readonly<CodeBlockPreviewProps>) {
  if (!showHtmlPreview) return null;

  return (
    <div className={styles.htmlPreviewContainer}>
      <div className={styles.previewBar}>
        <span>🌐 Live Interactive Component Preview</span>
        <button
          type="button"
          className={styles.closeConsoleBtn}
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <iframe
        title="Live Component Preview"
        className={styles.previewIframe}
        srcDoc={previewDoc}
        sandbox="allow-scripts allow-modals allow-forms allow-popups"
      />
    </div>
  );
}
