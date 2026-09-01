import styles from "./PageSkeleton.module.css";

interface PageSkeletonProps {
  variant?: "problem" | "grid" | "detail" | "editor";
}

export function PageSkeleton({ variant = "problem" }: PageSkeletonProps) {
  if (variant === "grid") {
    return (
      <div className={styles.gridContainer} aria-hidden="true">
        {/* Header Shimmer */}
        <div className={styles.headerSkeleton}>
          <div className={styles.titleShimmer} />
          <div className={styles.subtitleShimmer} />
          <div className={styles.pillsRowShimmer}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.pillShimmer} />
            ))}
          </div>
        </div>

        {/* Card Grid Shimmer */}
        <div className={styles.cardsGrid}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className={styles.cardShimmer}>
              <div className={styles.cardTopShimmer}>
                <div className={styles.cardTitleShimmer} />
                <div className={styles.cardBadgeShimmer} />
              </div>
              <div className={styles.cardDescShimmer} />
              <div className={styles.cardDescShimmerShort} />
              <div className={styles.cardFooterShimmer}>
                <div className={styles.tagShimmer} />
                <div className={styles.tagShimmer} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "editor") {
    return (
      <div className={styles.editorLoadingSkeleton} aria-hidden="true">
        <div className={styles.editorGutter}>
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className={styles.gutterLine}>
              {i + 1}
            </div>
          ))}
        </div>
        <div className={styles.editorLines}>
          <div className={styles.codeLine} style={{ width: "45%" }} />
          <div className={styles.codeLine} style={{ width: "65%" }} />
          <div className={styles.codeLine} style={{ width: "30%" }} />
          <div className={styles.codeLineIndent} style={{ width: "70%" }} />
          <div className={styles.codeLineIndent} style={{ width: "55%" }} />
          <div className={styles.codeLineIndent} style={{ width: "80%" }} />
          <div className={styles.codeLine} style={{ width: "20%" }} />
          <div className={styles.codeLine} style={{ width: "50%" }} />
          <div className={styles.codeLineIndent} style={{ width: "60%" }} />
          <div className={styles.codeLineIndent} style={{ width: "40%" }} />
          <div className={styles.codeLine} style={{ width: "25%" }} />
        </div>
      </div>
    );
  }

  // Default "problem" / "detail" split pane layout skeleton
  return (
    <div className={styles.problemContainer} aria-hidden="true">
      {/* Left Spec Pane */}
      <div className={styles.leftSpecPane}>
        <div className={styles.breadcrumbShimmer} />
        <div className={styles.specTitleShimmer} />
        <div className={styles.metaRowShimmer}>
          <div className={styles.badgeShimmer} />
          <div className={styles.badgeShimmer} />
          <div className={styles.badgeShimmer} />
        </div>

        <div className={styles.sectionHeaderShimmer} />
        <div className={styles.textLineShimmer} />
        <div className={styles.textLineShimmer} />
        <div className={styles.textLineShimmer} style={{ width: "80%" }} />

        <div className={styles.boxShimmer} />

        <div className={styles.sectionHeaderShimmer} />
        <div className={styles.textLineShimmer} />
        <div className={styles.textLineShimmer} style={{ width: "60%" }} />
      </div>

      {/* Right Code Editor & Runner Pane */}
      <div className={styles.rightEditorPane}>
        <div className={styles.editorHeaderShimmer}>
          <div className={styles.tabShimmer} />
          <div className={styles.tabShimmer} />
          <div className={styles.spacer} />
          <div className={styles.btnShimmer} />
          <div className={styles.btnShimmer} />
        </div>

        <div className={styles.editorBodyShimmer}>
          <div className={styles.editorGutter}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className={styles.gutterLine}>
                {i + 1}
              </div>
            ))}
          </div>
          <div className={styles.editorLines}>
            <div className={styles.codeLine} style={{ width: "50%" }} />
            <div className={styles.codeLine} style={{ width: "70%" }} />
            <div className={styles.codeLineIndent} style={{ width: "60%" }} />
            <div className={styles.codeLineIndent} style={{ width: "80%" }} />
            <div className={styles.codeLineIndent} style={{ width: "45%" }} />
            <div className={styles.codeLine} style={{ width: "30%" }} />
            <div className={styles.codeLine} style={{ width: "55%" }} />
          </div>
        </div>

        <div className={styles.consolePaneShimmer}>
          <div className={styles.consoleHeaderShimmer}>
            <div className={styles.tabShimmer} />
            <div className={styles.tabShimmer} />
          </div>
          <div className={styles.consoleBodyShimmer}>
            <div className={styles.consoleLineShimmer} style={{ width: "40%" }} />
            <div className={styles.consoleLineShimmer} style={{ width: "65%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
