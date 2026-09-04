import type * as Monaco from "monaco-editor";
import type { CodingProblem, Difficulty } from "@/types";
import { STORAGE_KEYS } from "@/constants/storage";
import type { UserSubmission } from "./types";

export const difficultyVariant: Record<
  Difficulty,
  "beginner" | "intermediate" | "advanced" | "senior"
> = {
  Beginner: "beginner",
  Intermediate: "intermediate",
  Advanced: "advanced",
  Senior: "senior",
};

const HTML_CSS_CATEGORIES = ["CSS", "HTML & CSS", "HTML", "Accessibility"];

export function isHtmlCssProblem(problem: {
  readonly category: string;
  readonly implementation: string;
}): boolean {
  if (
    HTML_CSS_CATEGORIES.some((c) =>
      problem.category.toLowerCase().includes(c.toLowerCase()),
    )
  ) {
    return true;
  }
  const trimmed = problem.implementation.trimStart();
  return trimmed.startsWith("<!--") || trimmed.startsWith("<");
}

export function generateStarterCode(problem: CodingProblem): string {
  if (isHtmlCssProblem(problem)) {
    return `<!-- Write your implementation for ${problem.title} below -->\n\n<!-- HTML Structure -->\n<div class="container">\n  <!-- Your HTML here -->\n</div>\n\n<style>\n/* Your CSS here */\n\n</style>\n`;
  }

  const trimmed = problem.implementation.trim();
  let targetCode = trimmed;
  const fnOrClassMatch = trimmed.match(
    /(?:(?:async\s+)?function\s+[a-zA-Z0-9_$]+|class\s+[a-zA-Z0-9_$]+|[A-Za-z0-9_$]+(?:\.prototype)?\.[a-zA-Z0-9_$]+\s*=\s*(?:async\s+)?function|(?:const|let|var)\s+[a-zA-Z0-9_$]+\s*=\s*(?:async\s+)?(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>)/,
  );
  if (fnOrClassMatch && typeof fnOrClassMatch.index === "number") {
    targetCode = trimmed.slice(fnOrClassMatch.index);
  }

  let openParen = 0;
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < targetCode.length; i++) {
    const ch = targetCode[i];
    if (inString) {
      if (ch === stringChar && targetCode[i - 1] !== "\\") inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true;
      stringChar = ch;
      continue;
    }
    if (ch === "(") openParen++;
    else if (ch === ")") openParen--;
    else if (ch === "{" && openParen === 0) {
      const sig = targetCode.slice(0, i).trim().replace(/^\/\/.*$/gm, "").trim();
      return `/**\n * Problem: ${problem.title}\n * Difficulty: ${problem.difficulty}\n * Category: ${problem.category}\n */\n\n${sig} {\n  // Write your solution here\n  \n}\n`;
    }
  }

  return `/**\n * Problem: ${problem.title}\n * Difficulty: ${problem.difficulty}\n * Category: ${problem.category}\n */\n\nfunction solution() {\n  // Write your solution here\n  \n}\n`;
}

export function registerMonacoThemes(monaco: typeof Monaco): void {
  monaco.editor.defineTheme("dracula", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6272a4", fontStyle: "italic" },
      { token: "keyword", foreground: "ff79c6", fontStyle: "bold" },
      { token: "string", foreground: "f1fa8c" },
      { token: "number", foreground: "bd93f9" },
      { token: "type", foreground: "8be9fd" },
    ],
    colors: {
      "editor.background": "#282a36",
      "editor.foreground": "#f8f8f2",
      "editorLineNumber.foreground": "#6272a4",
    },
  });

  monaco.editor.defineTheme("one-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "5c6370", fontStyle: "italic" },
      { token: "keyword", foreground: "c678dd" },
      { token: "string", foreground: "98c379" },
      { token: "number", foreground: "d19a66" },
    ],
    colors: {
      "editor.background": "#21252b",
      "editor.foreground": "#abb2bf",
    },
  });

  monaco.editor.defineTheme("github-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "8b949e", fontStyle: "italic" },
      { token: "keyword", foreground: "ff7b72" },
      { token: "string", foreground: "a5d6ff" },
      { token: "number", foreground: "79c0ff" },
    ],
    colors: {
      "editor.background": "#0d1117",
      "editor.foreground": "#c9d1d9",
    },
  });
}

export function getStorageCode(problemId: string, defaultCode: string): string {
  try {
    const key = STORAGE_KEYS.problemCode(problemId);
    const savedCode = localStorage.getItem(key);
    const isCorrupted =
      savedCode &&
      (savedCode.includes("cache = new WeakMap() {") ||
        savedCode.includes("new WeakMap() {"));
    if (isCorrupted) {
      localStorage.removeItem(key);
      return defaultCode;
    }
    return savedCode || defaultCode;
  } catch {
    return defaultCode;
  }
}

export function saveStorageCode(problemId: string, code: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.problemCode(problemId), code);
  } catch (e) {
    console.warn("Failed to save code to localStorage:", e);
  }
}

export function removeStorageCode(problemId: string): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.problemCode(problemId));
  } catch (e) {
    console.warn("Failed to remove code from localStorage:", e);
  }
}

export function getStorageSubmissions(problemId: string): UserSubmission[] {
  try {
    const storedSubs = localStorage.getItem(
      STORAGE_KEYS.problemSubmissions(problemId),
    );
    return storedSubs ? JSON.parse(storedSubs) : [];
  } catch {
    return [];
  }
}

export function saveStorageSubmissions(
  problemId: string,
  submissions: readonly UserSubmission[],
): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.problemSubmissions(problemId),
      JSON.stringify(submissions),
    );
  } catch (e) {
    console.warn("Failed to save submissions to localStorage:", e);
  }
}
