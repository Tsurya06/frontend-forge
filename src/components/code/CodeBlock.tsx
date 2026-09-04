import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import Prism from "@/lib/prism";
import { formatValue } from "@/utils/codeRunner";
import { ROUTES, SESSION_KEYS } from "@/constants";
import styles from "./CodeBlock.module.css";
import type { CodeBlockProps, ConsoleOutputLine } from "./types";
import {
  detectCodeTypes,
  copyToClipboard,
  runSandboxCode,
  buildSmartPreview,
  escapeHtml,
} from "./codeBlockUtils";
import { CodeBlockPreview } from "./CodeBlockPreview";
import { CodeBlockConsole } from "./CodeBlockConsole";

export function CodeBlock({
  code,
  language,
  title,
  showLineNumbers = false,
  disablePlayground = false,
}: Readonly<CodeBlockProps>) {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<ConsoleOutputLine[]>([]);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const { isNonCode, isHtmlCss, isRunnableJS } = useMemo(
    () => detectCodeTypes(code, language),
    [code, language],
  );

  const isPlaygroundEligible =
    !disablePlayground && !isNonCode && code.trim().length > 0;

  const handleCopy = useCallback(async () => {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  // In-place JavaScript / TypeScript execution runner
  const handleRunCode = useCallback(() => {
    if (isHtmlCss) {
      setShowHtmlPreview((prev) => !prev);
      return;
    }

    setShowConsole(true);
    setIsRunning(true);
    setConsoleOutput([]);
    setExecutionTime(null);

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

    runSandboxCode(code, appendLine, (elapsed) => {
      setExecutionTime(elapsed);
      setIsRunning(false);
    });
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

  // Live HTML & CSS smart preview document generator
  const previewDoc = useMemo(() => {
    if (!isHtmlCss) return "";
    return buildSmartPreview(code, language);
  }, [code, isHtmlCss, language]);

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
              aria-label={showHtmlPreview ? "Show Code" : "Live HTML/CSS Preview"}
              title={
                showHtmlPreview
                  ? "Switch back to Code view"
                  : "Toggle Live Visual Preview"
              }
            >
              {showHtmlPreview ? "💻 Show Code" : "👁️ Live Preview"}
            </button>
          )}

          {isPlaygroundEligible && (
            <Link
              to={ROUTES.PLAYGROUND}
              onClick={() => {
                sessionStorage.setItem(SESSION_KEYS.PLAYGROUND_SNIPPET, code);
                if (isHtmlCss) {
                  sessionStorage.setItem(SESSION_KEYS.PLAYGROUND_MODE, "web");
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

      {/* In-place toggle between Live Component Preview and Source Code */}
      {showHtmlPreview ? (
        <CodeBlockPreview
          showHtmlPreview={showHtmlPreview}
          previewDoc={previewDoc}
          onClose={() => setShowHtmlPreview(false)}
        />
      ) : (
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
      )}

      {/* Interactive In-Place Execution Console for JS */}
      <CodeBlockConsole
        showConsole={showConsole}
        isRunning={isRunning}
        executionTime={executionTime}
        consoleOutput={consoleOutput}
        onClear={() => setConsoleOutput([])}
        onClose={() => setShowConsole(false)}
      />
    </div>
  );
}

export default CodeBlock;
