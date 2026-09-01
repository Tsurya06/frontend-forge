import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markup";
import { transpileToJS, formatValue } from "@/utils/codeRunner";
import styles from "./CodeBlock.module.css";

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
  disablePlayground?: boolean;
}

const NON_PLAYGROUND_LANGUAGES = new Set([
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

function isTreeOrDiagram(text: string): boolean {
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
    /^[├└│|\s\-]+[a-zA-Z0-9_\-./]+/.test(l.trim()),
  );
  if (treeLikeLines.length >= 2 && treeLikeLines.length >= lines.length * 0.4) {
    return true;
  }
  return false;
}

interface ConsoleOutputLine {
  id: string;
  type: "log" | "warn" | "error" | "info" | "result";
  text: string;
}

export function CodeBlock({
  code,
  language,
  title,
  showLineNumbers = false,
  disablePlayground = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<ConsoleOutputLine[]>([]);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const langLower = (language || "").toLowerCase().trim();
  const isTree = isTreeOrDiagram(code);
  const isNonCode = NON_PLAYGROUND_LANGUAGES.has(langLower) || isTree;

  const isHtmlCss =
    !isNonCode &&
    (["html", "markup", "css", "web"].includes(langLower) ||
      code.trim().startsWith("<!--") ||
      code.trim().startsWith("<!DOCTYPE") ||
      code.trim().startsWith("<div") ||
      code.trim().startsWith("<style"));

  const isRunnableJS =
    !isNonCode &&
    ["javascript", "typescript", "js", "ts", "jsx", "tsx"].includes(
      langLower,
    ) &&
    !isHtmlCss;

  const isPlaygroundEligible =
    !disablePlayground && !isNonCode && code.trim().length > 0;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  // Robust in-place JavaScript / TypeScript runner
  const handleRunCode = useCallback(() => {
    if (isHtmlCss) {
      setShowHtmlPreview((prev) => !prev);
      return;
    }

    setShowConsole(true);
    setIsRunning(true);
    setConsoleOutput([]);
    setExecutionTime(null);

    const startTime = performance.now();

    const appendLine = (
      type: ConsoleOutputLine["type"],
      ...args: unknown[]
    ) => {
      const text = args.map(formatValue).join(" ");
      setConsoleOutput((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type,
          text,
        },
      ]);
    };

    const sandboxConsole = {
      log: (...args: unknown[]) => appendLine("log", ...args),
      warn: (...args: unknown[]) => appendLine("warn", ...args),
      error: (...args: unknown[]) => appendLine("error", ...args),
      info: (...args: unknown[]) => appendLine("info", ...args),
      clear: () => setConsoleOutput([]),
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
            const elapsed = performance.now() - startTime;
            setExecutionTime(elapsed);
            setIsRunning(false);
            if (val !== undefined) {
              appendLine("result", `← ${formatValue(val)}`);
            }
          })
          .catch((err: unknown) => {
            const msg = err instanceof Error ? err.message : String(err);
            appendLine("error", `Runtime Error: ${msg}`);
            setExecutionTime(performance.now() - startTime);
            setIsRunning(false);
          });
      } else {
        const elapsed = performance.now() - startTime;
        setExecutionTime(elapsed);
        setIsRunning(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      appendLine("error", `Execution Error: ${msg}`);
      setExecutionTime(performance.now() - startTime);
      setIsRunning(false);
    }
  }, [code, isHtmlCss]);

  const grammarLang = language === "html" ? "markup" : language;
  const grammar = Prism.languages[grammarLang];

  // Render line-by-line to prevent any line collapsing
  const highlightedLines = useMemo(() => {
    const rawLines = code.split("\n");
    return rawLines.map((line) => {
      if (!line) return "&nbsp;";
      return grammar
        ? Prism.highlight(line, grammar, grammarLang)
        : escapeHtml(line);
    });
  }, [code, grammar, grammarLang]);

  // Smart HTML & CSS live preview document generation
  const previewDoc = useMemo(() => {
    if (!isHtmlCss) return "";
    return buildSmartPreview(code, language);
  }, [code, isHtmlCss, language]);

  // Clean compact title for top bar (preventing long question text from crowding)
  const displayTitle = title && title.length <= 28 ? title : null;

  return (
    <div className={styles.codeBlock}>
      <div className={styles.header}>
        {/* Window Control Dots */}
        <div className={styles.windowControls} aria-hidden="true">
          <span className={styles.dotRed} />
          <span className={styles.dotYellow} />
          <span className={styles.dotGreen} />
        </div>

        <div className={styles.titleWrapper}>
          <span className={styles.languageBadge}>{language.toUpperCase()}</span>
          {displayTitle && <span className={styles.title}>{displayTitle}</span>}
        </div>

        <div className={styles.actions}>
          {isRunnableJS && (
            <button
              type="button"
              className={isRunning ? styles.runBtnRunning : styles.runBtn}
              onClick={handleRunCode}
              disabled={isRunning}
              aria-label="Run code in place"
              title="Run code snippet right here"
            >
              {isRunning ? "⏳ Running..." : "▶ Run"}
            </button>
          )}

          {isHtmlCss && (
            <button
              type="button"
              className={
                showHtmlPreview ? styles.previewBtnActive : styles.runBtn
              }
              onClick={() => setShowHtmlPreview((prev) => !prev)}
              aria-label="Live HTML/CSS Preview"
              title="Toggle Live Visual Preview"
            >
              {showHtmlPreview ? "✕ Hide Preview" : "👁️ Live Preview"}
            </button>
          )}

          {isPlaygroundEligible && (
            <Link
              to={`/playground`}
              onClick={() => {
                sessionStorage.setItem("feeq-playground-snippet", code);
                if (isHtmlCss) {
                  sessionStorage.setItem("feeq-playground-mode", "web");
                }
              }}
              className={styles.playgroundBtn}
              title="Open in Code Playground"
            >
              🛠️ Playground
            </Link>
          )}

          <button
            type="button"
            className={`${styles.copyButton} ${copied ? styles.copied : ""}`}
            onClick={handleCopy}
            aria-label="Copy code to clipboard"
          >
            {copied ? "✓ Copied" : "📋 Copy"}
          </button>
        </div>
      </div>

      <pre
        className={`${styles.pre} ${showLineNumbers ? styles.withLineNumbers : ""}`}
      >
        <code className={`language-${grammarLang}`}>
          {highlightedLines.map((htmlLine, i) => (
            <div
              key={i}
              className={styles.codeLine}
              dangerouslySetInnerHTML={{ __html: htmlLine }}
            />
          ))}
        </code>
      </pre>

      {/* Live HTML/CSS Component Preview Frame */}
      {showHtmlPreview && (
        <div className={styles.htmlPreviewContainer}>
          <div className={styles.previewBar}>
            <span>🌐 Live Interactive Component Preview</span>
            <button
              type="button"
              className={styles.closeConsoleBtn}
              onClick={() => setShowHtmlPreview(false)}
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
      )}

      {/* Interactive In-Place Execution Console for JS */}
      {showConsole && (
        <div className={styles.inlineConsole}>
          <div className={styles.consoleHeader}>
            <div className={styles.consoleTitle}>
              <span>📟 Console Output</span>
              {executionTime !== null && (
                <span className={styles.execTime}>
                  ⏱ {executionTime.toFixed(1)}ms
                </span>
              )}
            </div>
            <div className={styles.consoleActions}>
              <button
                type="button"
                className={styles.clearConsoleBtn}
                onClick={() => setConsoleOutput([])}
              >
                Clear
              </button>
              <button
                type="button"
                className={styles.closeConsoleBtn}
                onClick={() => setShowConsole(false)}
              >
                ✕
              </button>
            </div>
          </div>
          <div className={styles.consoleBody}>
            {consoleOutput.length === 0 ? (
              <span className={styles.emptyLog}>
                {isRunning
                  ? "Executing code..."
                  : "No console output recorded."}
              </span>
            ) : (
              consoleOutput.map((l) => (
                <div
                  key={l.id}
                  className={`${styles.consoleLine} ${
                    l.type === "error"
                      ? styles.consoleError
                      : l.type === "warn"
                        ? styles.consoleWarn
                        : l.type === "result"
                          ? styles.consoleResult
                          : styles.consoleLog
                  }`}
                >
                  <span className={styles.consolePrefix}>
                    {l.type === "error"
                      ? "✗"
                      : l.type === "warn"
                        ? "⚠"
                        : l.type === "result"
                          ? "→"
                          : "›"}
                  </span>
                  <span className={styles.consoleText}>{l.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildSmartPreview(source: string, lang: string): string {
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
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body {
        font-family: system-ui, -apple-system, sans-serif;
        padding: 20px;
        margin: 0;
        background: #ffffff;
        color: #2d2d2d;
      }
    </style>
  </head>
  <body>${source}</body>
</html>`;
}
