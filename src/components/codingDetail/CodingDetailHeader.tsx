import { Link } from "react-router-dom";
import { Eye, Play, UploadCloud, Star } from "lucide-react";
import styles from "@/pages/coding/CodingDetail.module.css";
import type { CodingDetailHeaderProps } from "./types";

export function CodingDetailHeader({
  problem,
  prevProblem,
  nextProblem,
  isRunning,
  isHtmlCss,
  completed,
  bookmarked,
  passCount,
  failCount,
  hasSubmissions,
  onRun,
  onSubmit,
  onPrev,
  onNext,
  onRandom,
  onToggleBookmark,
}: Readonly<CodingDetailHeaderProps>) {
  return (
    <header
      className={styles.topToolbar}
      aria-label={`Coding workspace: ${problem.title}`}
    >
      <div className={styles.toolbarLeft}>
        <Link
          to="/coding"
          className={styles.problemListLink}
          title="Back to Problem List"
        >
          <span>☰ Problem List</span>
        </Link>

        <div className={styles.prevNextGroup}>
          <button
            type="button"
            className={styles.pagerBtn}
            onClick={onPrev}
            disabled={!prevProblem}
            title={prevProblem ? `Previous: ${prevProblem.title}` : "First problem"}
            aria-label="Previous problem"
          >
            ‹
          </button>
          <button
            type="button"
            className={styles.pagerBtn}
            onClick={onNext}
            disabled={!nextProblem}
            title={nextProblem ? `Next: ${nextProblem.title}` : "Last problem"}
            aria-label="Next problem"
          >
            ›
          </button>
          <button
            type="button"
            className={styles.pagerBtn}
            onClick={onRandom}
            title="Pick Random Problem"
            aria-label="Random problem"
          >
            🔀
          </button>
        </div>
      </div>

      {/* Center Primary Action Buttons */}
      <div className={styles.toolbarCenter}>
        <button
          type="button"
          className={styles.runBtn}
          onClick={onRun}
          disabled={isRunning}
          title={
            isHtmlCss
              ? "Preview HTML/CSS output"
              : "Run Code against Testcases"
          }
        >
          <span className={styles.runIcon}>
            {isHtmlCss ? <Eye size={13} /> : <Play size={12} fill="currentColor" />}
          </span>
          <span>
            {isRunning ? "Running..." : isHtmlCss ? "Preview" : "Run"}
          </span>
        </button>

        <button
          type="button"
          className={`${styles.submitBtn} ${completed ? styles.submitBtnDone : ""}`}
          onClick={onSubmit}
          disabled={isRunning}
          title={
            isHtmlCss
              ? "Submit & Preview"
              : "Submit Solution & Validate All Testcases"
          }
        >
          <UploadCloud size={14} className={styles.submitIcon} />
          <span>Submit{completed ? " ✓" : ""}</span>
          {hasSubmissions && (
            <span className={styles.submitStats}>
              <span className={styles.passCount}>✓{passCount}</span>
              <span className={styles.failCount}>✕{failCount}</span>
            </span>
          )}
        </button>
      </div>

      {/* Right Tools */}
      <div className={styles.toolbarRight}>
        <button
          type="button"
          className={`${styles.toolIconBtn} ${bookmarked ? styles.bookmarked : ""}`}
          onClick={onToggleBookmark}
          title={bookmarked ? "Remove Bookmark" : "Bookmark Problem"}
          aria-label="Bookmark"
        >
          <Star size={16} fill={bookmarked ? "currentColor" : "none"} />
        </button>
      </div>
    </header>
  );
}
