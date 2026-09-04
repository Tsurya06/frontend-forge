/**
 * Editor & Runtime Workspace Constants
 */

export const EDITOR_THEMES = [
  { id: "vs-dark", label: "VS Dark" },
  { id: "one-dark", label: "One Dark" },
  { id: "github-dark", label: "GitHub Dark" },
  { id: "dracula", label: "Dracula" },
  { id: "light", label: "Light" },
  { id: "hc-black", label: "High Contrast" },
] as const;

export type EditorThemeId = (typeof EDITOR_THEMES)[number]["id"];

export const DEFAULT_EDITOR_THEME: EditorThemeId = "vs-dark";

export const SPLIT_BOUNDS = {
  // Coding Workspace (left/right & editor/test panel)
  WORKSPACE_H_MIN: 15,
  WORKSPACE_H_MAX: 85,
  WORKSPACE_V_MIN: 15,
  WORKSPACE_V_MAX: 85,

  // Visualizer (X & Y split)
  VIZ_X_MIN: 25,
  VIZ_X_MAX: 75,
  VIZ_Y_MIN: 25,
  VIZ_Y_MAX: 80,
  VIZ_DEFAULT_X: 48,
  VIZ_DEFAULT_Y: 58,
} as const;

export const RUNNER_CONFIG = {
  DEFAULT_TIMEOUT_MS: 5000,
  EVALUATION_DEBOUNCE_MS: 60,
  AUTO_PLAY_BASE_INTERVAL_MS: 1800,
} as const;
