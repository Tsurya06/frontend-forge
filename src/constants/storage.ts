/**
 * Centralized Web Storage Keys
 * Eliminates scattered string literals across localStorage and sessionStorage operations.
 */

export const STORAGE_KEYS = {
  // Theme & Preferences
  THEME: "feeq-theme",
  LEGACY_THEME: "theme",
  EDITOR_THEME: "feeq-editor-theme",
  PLAYGROUND_THEME: "feeq-playground-theme",
  CODE_THEME: "feeq-code-theme",
  SIDEBAR_COLLAPSED: "sidebar_collapsed",

  // Progress & Activity Tracking
  BOOKMARKS: "feeq-bookmarks",
  COMPLETED_QUESTIONS: "feeq-completed-questions",
  COMPLETED_CODING: "feeq-completed-coding",
  COMPLETED_MACHINE_CODING: "feeq-completed-machine-coding",
  COMPLETED_SYSTEM_DESIGN: "feeq-completed-system-design",
  RECENTLY_VIEWED: "feeq-recently-viewed",
  NOTES: "feeq-notes",
  FLASHCARD_PROGRESS: "feeq-flashcard-progress",
  DAILY_STREAK: "feeq-daily-streak",
  LAST_ACTIVE_DATE: "feeq-last-active-date",

  // Workspace Splitter Positions
  VIZ_SPLIT_X: "feeq-viz-split-x",
  VIZ_SPLIT_Y: "feeq-viz-split-y",

  // Dynamic Key Generators
  problemCode: (problemId: string): string => `feeq-code-${problemId}`,
  problemSubmissions: (problemId: string): string => `feeq-subs-${problemId}`,
} as const;

export const SESSION_KEYS = {
  PLAYGROUND_SNIPPET: "feeq-playground-snippet",
  PLAYGROUND_MODE: "feeq-playground-mode",
} as const;

/**
 * All backup/export-relevant storage keys for Settings page export & reset
 */
export const EXPORTABLE_STORAGE_KEYS = [
  STORAGE_KEYS.COMPLETED_QUESTIONS,
  STORAGE_KEYS.COMPLETED_CODING,
  STORAGE_KEYS.COMPLETED_MACHINE_CODING,
  STORAGE_KEYS.COMPLETED_SYSTEM_DESIGN,
  STORAGE_KEYS.RECENTLY_VIEWED,
  STORAGE_KEYS.BOOKMARKS,
  STORAGE_KEYS.NOTES,
  STORAGE_KEYS.THEME,
  STORAGE_KEYS.FLASHCARD_PROGRESS,
  STORAGE_KEYS.DAILY_STREAK,
  STORAGE_KEYS.LAST_ACTIVE_DATE,
] as const;
