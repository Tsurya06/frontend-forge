import { transpileToJS, formatValue } from "@/utils/codeRunner";
import styles from "./CodeBlock.module.css";
import type { ConsoleOutputLine } from "./types";

export const NON_PLAYGROUND_LANGUAGES = new Set([
  "text",
  "txt",
  "plain",
  "plaintext",
  "ascii",
  "tree",
  "bash",
  "sh",
  "shell",
  "terminal",
  "markdown",
  "md",
  "output",
  "log",
  "pseudo",
  "pseudocode",
  "dir",
  "directory",
]);

export function isTreeOrDiagram(text: string): boolean {
  const trimmed = text.trim();
  if (
    trimmed.includes("├──") ||
    trimmed.includes("└──") ||
    trimmed.includes("│  ") ||
    trimmed.includes("├───") ||
    trimmed.includes("|--")
  ) {
    return true;
  }
  const lines = trimmed.split("\n");
  const treeLikeLines = lines.filter((l) =>
    /^[├└│|\s-]+[a-zA-Z0-9_./-]+/.test(l.trim()),
  );
  if (treeLikeLines.length >= 2 && treeLikeLines.length >= lines.length * 0.4) {
    return true;
  }
  return false;
}

export function detectCodeTypes(code: string, language: string) {
  const langLower = (language || "").toLowerCase().trim();
  const isTree = isTreeOrDiagram(code);
  const isNonCode = NON_PLAYGROUND_LANGUAGES.has(langLower) || isTree;

  const isReact =
    !isNonCode &&
    (["react", "jsx", "tsx"].includes(langLower) ||
      code.includes("import React") ||
      code.includes("from 'react'") ||
      code.includes('from "react"') ||
      code.includes("from 'react-dom'") ||
      code.includes('from "react-dom"') ||
      code.includes("export default function") ||
      code.includes("export default class"));

  const isHtmlCss =
    !isNonCode &&
    !isReact &&
    (["html", "markup", "css", "web"].includes(langLower) ||
      code.trim().startsWith("<!--") ||
      code.trim().startsWith("<!DOCTYPE") ||
      code.trim().startsWith("<div") ||
      code.trim().startsWith("<style"));

  const isPreviewable = isHtmlCss || isReact;

  const hasEsModules =
    code.includes("import ") ||
    code.includes("export ") ||
    isReact;

  const isRunnableJS =
    !isNonCode &&
    !isPreviewable &&
    !hasEsModules &&
    ["javascript", "typescript", "js", "ts"].includes(langLower);

  return { isNonCode, isHtmlCss, isReact, isPreviewable, isRunnableJS };
}

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

export function runSandboxCode(
  code: string,
  appendLine: (type: ConsoleOutputLine["type"], ...args: unknown[]) => void,
  onComplete: (elapsed: number) => void,
) {
  const startTime = performance.now();
  const sandboxConsole = {
    log: (...args: unknown[]) => appendLine("log", ...args),
    warn: (...args: unknown[]) => appendLine("warn", ...args),
    error: (...args: unknown[]) => appendLine("error", ...args),
    info: (...args: unknown[]) => appendLine("info", ...args),
    clear: () => {},
    table: (...args: unknown[]) => appendLine("log", ...args),
  };

  const jsCode = transpileToJS(code);

  try {
    const runner = new Function(
      "console",
      "setTimeout",
      "setInterval",
      "clearTimeout",
      "clearInterval",
      "Promise",
      `
      return (async () => {
        ${jsCode}
      })();
      `,
    );

    const res = runner(
      sandboxConsole,
      window.setTimeout.bind(window),
      window.setInterval.bind(window),
      window.clearTimeout.bind(window),
      window.clearInterval.bind(window),
      Promise,
    );

    if (res && typeof res.then === "function") {
      res
        .then((val: unknown) => {
          onComplete(performance.now() - startTime);
          if (val !== undefined) {
            appendLine("result", `← ${formatValue(val)}`);
          }
        })
        .catch((err: unknown) => {
          const msg = err instanceof Error ? err.message : String(err);
          appendLine("error", `Runtime Error: ${msg}`);
          onComplete(performance.now() - startTime);
        });
    } else {
      onComplete(performance.now() - startTime);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    appendLine("error", `Execution Error: ${msg}`);
    onComplete(performance.now() - startTime);
  }
}

export function getConsoleLineClass(type: ConsoleOutputLine["type"]): string {
  switch (type) {
    case "error":
      return styles.consoleError ?? "";
    case "warn":
      return styles.consoleWarn ?? "";
    case "result":
      return styles.consoleResult ?? "";
    default:
      return styles.consoleLog ?? "";
  }
}

export function getConsolePrefix(type: ConsoleOutputLine["type"]): string {
  switch (type) {
    case "error":
      return "✗";
    case "warn":
      return "⚠";
    case "result":
      return "→";
    default:
      return "›";
  }
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildSmartPreview(source: string, lang: string): string {
  const isPureCSS =
    lang.toLowerCase() === "css" ||
    (!source.includes("<") && !source.includes("</"));

  if (isPureCSS) {
    // Extract selector class names from CSS (e.g., .card, .box-content, .box-border, etc.)
    const classMatches = Array.from(source.matchAll(/\.([a-zA-Z0-9_-]+)/g))
      .map((m) => m[1])
      .filter((c): c is string => Boolean(c));
    const uniqueClasses = Array.from(new Set(classMatches)).filter(
      (c) =>
        ![
          "hover",
          "focus",
          "active",
          "before",
          "after",
          "disabled",
          "checked",
        ].includes(c),
    );

    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body {
        font-family: system-ui, -apple-system, sans-serif;
        padding: 20px;
        margin: 0;
        background: #f7f7f8;
        color: #2d2d2d;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
      }
      .demo-canvas {
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: center;
        width: 100%;
        max-width: 480px;
      }
      .demo-card-fallback {
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        padding: 20px;
        width: 100%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        text-align: center;
      }
      /* Injected CSS */
      ${source}
    </style>
  </head>
  <body>
    <div class="demo-canvas">
      ${
        uniqueClasses.length > 0
          ? uniqueClasses
              .map(
                (cls) =>
                  `<div class="${cls} demo-card-fallback"><strong>.${cls}</strong><p style="margin:4px 0 0;font-size:12px;color:#6b6b6b">CSS styles & animations active</p></div>`,
              )
              .join("")
          : `<div class="card demo-card-fallback"><strong>CSS Animation / Style Demo</strong><p style="margin:4px 0 0;font-size:12px;color:#6b6b6b">Live render testbed</p></div>`
      }
    </div>
  </body>
</html>`;
  }

  if (source.includes("<html") || source.includes("<body")) {
    return source;
  }

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 32px 20px;
        margin: 0;
        background: #f8fafc;
        color: #0f172a;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
      }
    </style>
  </head>
  <body>${source}</body>
</html>`;
}
