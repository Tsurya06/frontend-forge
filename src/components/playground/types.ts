export type PlaygroundLanguage = "javascript" | "typescript" | "react" | "html";

export type PlaygroundTab = "console" | "preview";

export interface ConsoleLine {
  readonly id: string;
  readonly type: "log" | "warn" | "error" | "info" | "result";
  readonly text: string;
  readonly timestamp: number;
}

export interface TemplateItem {
  readonly id: string;
  readonly name: string;
  readonly difficulty: "Beginner" | "Intermediate" | "Advanced" | "Senior";
  readonly category: string;
  readonly description: string;
  readonly language: string;
  readonly type: "snippet" | "coding";
  readonly code: string;
}

export interface ThemeOption {
  readonly id: string;
  readonly name: string;
}
