import styles from "./CodeBlock.module.css";
import type { CodeBlockPreviewProps } from "./types";

export function CodeBlockPreview({
  showHtmlPreview,
  previewDoc,
}: Readonly<CodeBlockPreviewProps>) {
  if (!showHtmlPreview) return null;

  return (
    <div className={styles.htmlPreviewContainer}>
      <div className={styles.previewBar}>
        <div className={styles.previewBarLeft}>
          <span className={styles.previewLiveDot} />
          <span className={styles.previewBarTitle}>
            Live Interactive Preview
          </span>
        </div>
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
