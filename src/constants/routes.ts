/**
 * Type-Safe Route Paths
 * Centralizes all internal routing paths avoiding hardcoded href / navigate strings.
 */

export const ROUTES = {
  HOME: "/",
  ROADMAP: "/roadmap",
  TOPICS: "/topics",
  TOPIC_SHORT: "/topic",
  CODING: "/coding",
  CODING_DETAIL: (problemId: string = ":problemId") => `/coding/${problemId}`,
  MACHINE_CODING: "/machine-coding",
  MACHINE_CODING_DETAIL: (problemId: string = ":problemId") =>
    `/machine-coding/${problemId}`,
  SYSTEM_DESIGN: "/system-design",
  SYSTEM_DESIGN_DETAIL: (problemId: string = ":problemId") =>
    `/system-design/${problemId}`,
  DAILY: "/daily",
  PLAYGROUND: "/playground",
  BOOKMARKS: "/bookmarks",
  PROGRESS: "/progress",
  SEARCH: "/search",
  SETTINGS: "/settings",
  VISUALIZER: "/visualizer",
  RUNTIME: "/runtime",
  SENIOR: "/senior",
  QUIZ: "/quiz",
  FLASHCARDS: "/flashcards",
  INTERVIEW: "/interview",
  CATEGORY: (category: string = ":category") => `/${category}`,
  TOPIC_DETAIL: (category: string = ":category", topicId: string = ":topicId") =>
    `/${category}/${topicId}`,
} as const;

export const CATEGORIES = [
  "javascript",
  "html",
  "css",
  "browser",
  "react",
  "redux",
  "typescript",
  "performance",
  "testing",
  "security",
  "design-patterns",
  "git",
  "build-tools",
  "package-management",
  "code-quality",
  "accessibility",
] as const;

export type CategorySlug = (typeof CATEGORIES)[number];
