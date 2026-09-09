import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Editor, { type OnMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { useThemeContext } from "@/context/ThemeContext";
import { allCodingProblems, getCodingProblemById } from "@/data";
import { transpileToJS, formatValue } from "@/utils/codeRunner";
import { STORAGE_KEYS, SESSION_KEYS } from "@/constants";
import styles from "./Playground.module.css";
import {
  DEFAULT_CODE,
  DEFAULT_HTML_CODE,
  DEFAULT_REACT_CODE,
  SNIPPETS,
  THEMES,
  PlaygroundHeader,
  PlaygroundConsole,
  PlaygroundTemplatesModal,
  buildReactIframeSrc,
  buildHtmlIframeSrc,
  type ConsoleLine,
  type TemplateItem,
  type PlaygroundLanguage,
  type PlaygroundTab,
} from "@/components/playground";
import { registerMonacoThemes, configureMonacoLanguages } from "./monacoThemes";

export default function Playground() {
  const { resolvedTheme: appTheme } = useThemeContext();
  const [searchParams] = useSearchParams();

  // Helper to resolve initial code, language, and tab without cascading render
  const initialData = useMemo(() => {
    const sessionMode = sessionStorage.getItem(SESSION_KEYS.PLAYGROUND_MODE);
    const sessionSnippet = sessionStorage.getItem(
      SESSION_KEYS.PLAYGROUND_SNIPPET,
    );
    if (sessionSnippet) {
      sessionStorage.removeItem(SESSION_KEYS.PLAYGROUND_SNIPPET);
      sessionStorage.removeItem(SESSION_KEYS.PLAYGROUND_MODE);

      const isReact =
        sessionMode === "react" ||
        sessionSnippet.includes("import React") ||
        sessionSnippet.includes("from 'react'") ||
        sessionSnippet.includes("from \"react\"") ||
        /export\s+default\s+function/.test(sessionSnippet) ||
        (/function\s+[A-Z]/.test(sessionSnippet) && /<[a-zA-Z]/.test(sessionSnippet));

      const isHtml =
        !isReact &&
        (sessionMode === "web" ||
          sessionSnippet.trim().startsWith("<!DOCTYPE") ||
          sessionSnippet.trim().startsWith("<html") ||
          (sessionSnippet.includes("<style") && sessionSnippet.includes("<div")));

      const lang: PlaygroundLanguage = isReact
        ? "react"
        : isHtml
          ? "html"
          : "typescript";

      return {
        code: sessionSnippet,
        language: lang,
        activeTab: (isReact || isHtml ? "preview" : "console") as PlaygroundTab,
      };
    }
    const problemId = searchParams.get("problem");
    if (problemId) {
      const p = getCodingProblemById(problemId);
      if (p) {
        const isReact =
          p.category === "React" ||
          p.implementation.includes("import React") ||
          p.implementation.includes("from 'react'") ||
          p.implementation.includes("from \"react\"");
        const isHtml = !isReact && (p.category === "CSS" || p.category === "HTML & CSS");
        const starterCode = p.implementation.startsWith("<!--")
          ? p.implementation
          : `// 🎯 ${p.title} (${p.difficulty})\n// ${p.problem}\n\n// Solution implementation:\n${p.implementation}\n\n// Try running tests:\nconsole.log('Testing solution for ${p.title}...');\n`;
        return {
          code: starterCode,
          language: (isReact ? "react" : isHtml ? "html" : "typescript") as PlaygroundLanguage,
          activeTab: (isReact || isHtml ? "preview" : "console") as PlaygroundTab,
        };
      }
    }
    return {
      code: DEFAULT_CODE,
      language: "typescript" as const,
      activeTab: "console" as const,
    };
  }, [searchParams]);

  const [code, setCode] = useState(initialData.code);
  const [language, setLanguage] = useState(initialData.language);
  const [activeTab, setActiveTab] = useState(initialData.activeTab);
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.PLAYGROUND_THEME) || "auto";
  });
  const [output, setOutput] = useState<ConsoleLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("Ready");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  // Unified list of all 45+ snippets & challenge solutions
  const allTemplates: TemplateItem[] = useMemo(() => {
    const snippetItems: TemplateItem[] = SNIPPETS.map((s) => ({
      id: `snippet-${s.name}`,
      name: s.name,
      difficulty: s.difficulty as TemplateItem["difficulty"],
      category: s.category,
      description: s.description,
      language: s.language,
      type: "snippet",
      code: s.code,
    }));

    const codingItems: TemplateItem[] = allCodingProblems.map((p) => ({
      id: `coding-${p.id}`,
      name: p.title,
      difficulty: p.difficulty,
      category: p.category || "JavaScript",
      description: p.problem.slice(0, 110) + "…",
      language:
        p.category === "CSS" || p.category === "HTML & CSS"
          ? "html"
          : p.category === "React" || p.implementation.includes("from 'react'") || p.implementation.includes('from "react"')
            ? "react"
            : "javascript",
      type: "coding",
      code: p.implementation,
    }));

    return [...snippetItems, ...codingItems];
  }, []);

  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const activeRunIdRef = useRef<number>(0);
  const tsCacheRef = useRef<string | null>(initialData.code);

  const loadTemplateItem = useCallback(
    (item: TemplateItem) => {
      const isHtml =
        item.language === "html" ||
        item.category.includes("CSS") ||
        item.code.startsWith("<!--");
      const isReact =
        item.language === "react" ||
        item.category.toLowerCase().includes("react") ||
        item.code.includes("from 'react'") ||
        item.code.includes('from "react"');

      if (isReact) {
        setLanguage("react");
        setActiveTab("preview");
      } else if (isHtml) {
        setLanguage("html");
        setActiveTab("preview");
      } else {
        setLanguage(
          item.language === "typescript" ? "typescript" : "javascript",
        );
        setActiveTab("console");
      }
      setCode(item.code);
      tsCacheRef.current = item.code;
      if (editorRef.current) {
        editorRef.current.setValue(item.code);
      }
      setOutput([]);
      setExecutionTime(null);
      setHasError(false);
      setIsTemplatesOpen(false);
      setStatusMessage(`Loaded: ${item.name}`);
    },
    [],
  );

  // Handle URL problem change dynamically if user navigates with search params
  const problemParam = searchParams.get("problem");
  const [activeProblem, setActiveProblem] = useState(problemParam);
  if (problemParam !== activeProblem) {
    setActiveProblem(problemParam);
    if (problemParam) {
      const p = getCodingProblemById(problemParam);
      if (p) {
        const isReact =
          p.category === "React" ||
          p.implementation.includes("import React") ||
          p.implementation.includes("from 'react'") ||
          p.implementation.includes("from \"react\"");
        const isHtml = !isReact && (p.category === "CSS" || p.category === "HTML & CSS");
        const starterCode = p.implementation.startsWith("<!--")
          ? p.implementation
          : `// 🎯 ${p.title} (${p.difficulty})\n// ${p.problem}\n\n// Solution implementation:\n${p.implementation}\n\n// Try running tests:\nconsole.log('Testing solution for ${p.title}...');\n`;
        setCode(starterCode);
        setOutput([]);
        setExecutionTime(null);
        setHasError(false);
        if (isReact) {
          setLanguage("react");
          setActiveTab("preview");
        } else if (isHtml) {
          setLanguage("html");
          setActiveTab("preview");
        } else {
          setLanguage("typescript");
        }
      }
    }
  }

  useEffect(() => {
    if (!problemParam) return;
    const p = getCodingProblemById(problemParam);
    if (!p) return;
    const starterCode = p.implementation.startsWith("<!--")
      ? p.implementation
      : `// 🎯 ${p.title} (${p.difficulty})\n// ${p.problem}\n\n// Solution implementation:\n${p.implementation}\n\n// Try running tests:\nconsole.log('Testing solution for ${p.title}...');\n`;
    tsCacheRef.current = starterCode;
    if (editorRef.current && editorRef.current.getValue() !== starterCode) {
      editorRef.current.setValue(starterCode);
    }
  }, [problemParam]);

  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
    localStorage.setItem(STORAGE_KEYS.PLAYGROUND_THEME, newTheme);
  };

  // Convert TypeScript to pure JavaScript on switch, restore on switch back, or setup HTML/React template
  const handleLanguageChange = (newLang: PlaygroundLanguage) => {
    const currentCode = editorRef.current?.getValue() ?? code;
    setLanguage(newLang);
    setOutput([]);
    setExecutionTime(null);
    setHasError(false);

    const isCurrentReact =
      currentCode.includes("import React") ||
      currentCode.includes("from 'react'") ||
      currentCode.includes('from "react"') ||
      (currentCode.includes("export default") && /<[a-zA-Z]/.test(currentCode));

    const isCurrentHtml =
      !isCurrentReact &&
      (currentCode.trim().startsWith("<!DOCTYPE") ||
        currentCode.trim().startsWith("<html") ||
        (currentCode.includes("<style") && currentCode.includes("</style>")) ||
        (currentCode.includes("<!--") && currentCode.includes("-->")));

    if (newLang === "react") {
      setActiveTab("preview");
      if (!isCurrentReact) {
        setCode(DEFAULT_REACT_CODE);
        if (editorRef.current) {
          editorRef.current.setValue(DEFAULT_REACT_CODE);
        }
      }
      return;
    }

    if (newLang === "html") {
      setActiveTab("preview");
      if (!isCurrentHtml) {
        setCode(DEFAULT_HTML_CODE);
        if (editorRef.current) {
          editorRef.current.setValue(DEFAULT_HTML_CODE);
        }
      }
      return;
    }

    setActiveTab("console");

    if (newLang === "javascript") {
      if (isCurrentReact || isCurrentHtml) {
        const jsDefault = transpileToJS(DEFAULT_CODE);
        setCode(jsDefault);
        if (editorRef.current) {
          editorRef.current.setValue(jsDefault);
        }
      } else {
        tsCacheRef.current = currentCode;
        try {
          const pureJS = transpileToJS(currentCode);
          setCode(pureJS);
          if (editorRef.current) {
            editorRef.current.setValue(pureJS);
          }
        } catch (err) {
          console.error("Failed to convert TS to JS", err);
        }
      }
      return;
    }

    if (newLang === "typescript") {
      if (isCurrentReact || isCurrentHtml) {
        const tsCode =
          tsCacheRef.current &&
          !tsCacheRef.current.includes("from 'react'") &&
          !tsCacheRef.current.includes('from "react"') &&
          !tsCacheRef.current.trim().startsWith("<!DOCTYPE") &&
          !tsCacheRef.current.trim().startsWith("<html")
            ? tsCacheRef.current
            : DEFAULT_CODE;
        setCode(tsCode);
        if (editorRef.current) {
          editorRef.current.setValue(tsCode);
        }
      } else if (tsCacheRef.current) {
        setCode(tsCacheRef.current);
        if (editorRef.current) {
          editorRef.current.setValue(tsCacheRef.current);
        }
      }
      return;
    }
  };

  // Setup custom Monaco themes and compiler options on mount
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    registerMonacoThemes(monaco);
    configureMonacoLanguages(monaco);
  };

  const effectiveTheme =
    selectedTheme === "auto"
      ? appTheme === "dark"
        ? "vs-dark"
        : "light"
      : selectedTheme;

  const handleFormat = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument")?.run();
    }
  }, []);

  // Execution engine supporting JS, TS, and Live HTML/CSS Component Previews
  const runCode = useCallback(
    (codeToRun?: string) => {
      const rawSource =
        typeof codeToRun === "string"
          ? codeToRun
          : (editorRef.current?.getValue() ?? code);
      const runId = ++activeRunIdRef.current;

      setIsRunning(true);
      setHasError(false);
      setStatusMessage("Executing...");
      setExecutionTime(null);
      setOutput([]);

      const startTime = performance.now();

      const appendLine = (type: ConsoleLine["type"], ...args: unknown[]) => {
        if (activeRunIdRef.current !== runId) return;
        const text = args.map(formatValue).join(" ");
        const line: ConsoleLine = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type,
          text,
          timestamp: Date.now(),
        };
        setOutput((prev) => [...prev, line]);
      };

      // 1. Detect if code is React JSX/TSX
      const isReact =
        language === "react" ||
        ((rawSource.includes("import React") ||
          rawSource.includes("from 'react'") ||
          rawSource.includes('from "react"')) &&
          /export\s+default\s+/.test(rawSource));

      if (isReact) {
        if (language !== "react") {
          setLanguage("react");
        }
        setActiveTab("preview");
        if (iframeRef.current) {
          const { html, error } = buildReactIframeSrc(rawSource);
          iframeRef.current.srcdoc = html;
          if (error) {
            setHasError(true);
            appendLine("error", `Compilation Error: ${error}`);
            setStatusMessage("Compilation Error");
          } else {
            setHasError(false);
            setStatusMessage("React App Mounted");
          }
        }
        setExecutionTime(performance.now() - startTime);
        setIsRunning(false);
        return;
      }

      // If in HTML/CSS mode, update the live iframe preview
      const isHtml =
        !isReact &&
        (language === "html" ||
          rawSource.trim().startsWith("<!DOCTYPE") ||
          rawSource.trim().startsWith("<html") ||
          (rawSource.includes("<!--") && rawSource.includes("-->") && rawSource.includes("<style")));

      if (isHtml) {
        if (language !== "html") {
          setLanguage("html");
        }
        setActiveTab("preview");
        if (iframeRef.current) {
          iframeRef.current.srcdoc = buildHtmlIframeSrc(rawSource);
        }
        setExecutionTime(performance.now() - startTime);
        setIsRunning(false);
        setStatusMessage("Preview Updated");
        return;
      }

      // JavaScript / TypeScript console execution
      setActiveTab("console");
      setOutput([]);
      const sandboxConsole = {
        log: (...args: unknown[]) => appendLine("log", ...args),
        warn: (...args: unknown[]) => appendLine("warn", ...args),
        error: (...args: unknown[]) => appendLine("error", ...args),
        info: (...args: unknown[]) => appendLine("info", ...args),
        clear: () => setOutput([]),
        table: (...args: unknown[]) => appendLine("log", ...args),
      };

      const sandboxSetTimeout = (
        handler: TimerHandler,
        timeout?: number,
        ...args: any[]
      ) => {
        return window.setTimeout(() => {
          if (activeRunIdRef.current === runId) {
            if (typeof handler === "function") {
              try {
                handler(...args);
              } catch (err: any) {
                appendLine(
                  "error",
                  `Async Error: ${err?.message || String(err)}`,
                );
              }
            }
          }
        }, timeout);
      };

      const sandboxSetInterval = (
        handler: TimerHandler,
        timeout?: number,
        ...args: any[]
      ) => {
        return window.setInterval(() => {
          if (activeRunIdRef.current === runId) {
            if (typeof handler === "function") {
              try {
                handler(...args);
              } catch (err: any) {
                appendLine(
                  "error",
                  `Interval Error: ${err?.message || String(err)}`,
                );
              }
            }
          }
        }, timeout);
      };

      const jsExecutable = transpileToJS(rawSource);

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
          ${jsExecutable}
        })();
        `,
        );

        const promiseResult = runner(
          sandboxConsole,
          sandboxSetTimeout,
          sandboxSetInterval,
          window.clearTimeout.bind(window),
          window.clearInterval.bind(window),
          Promise,
        );

        if (promiseResult && typeof promiseResult.then === "function") {
          promiseResult
            .then((res: unknown) => {
              if (activeRunIdRef.current === runId) {
                setExecutionTime(performance.now() - startTime);
                setIsRunning(false);
                setStatusMessage("Success");
                if (res !== undefined) appendLine("result", res);
              }
            })
            .catch((err: unknown) => {
              if (activeRunIdRef.current === runId) {
                appendLine(
                  "error",
                  `Runtime Error: ${err instanceof Error ? err.message : String(err)}`,
                );
                setHasError(true);
                setIsRunning(false);
                setStatusMessage("Error");
                setExecutionTime(performance.now() - startTime);
              }
            });
        } else {
          setExecutionTime(performance.now() - startTime);
          setIsRunning(false);
          setStatusMessage("Success");
        }
      } catch (err: unknown) {
        appendLine(
          "error",
          `Syntax / Execution Error: ${err instanceof Error ? err.message : String(err)}`,
        );
        setHasError(true);
        setIsRunning(false);
        setStatusMessage("Error");
        setExecutionTime(performance.now() - startTime);
      }
    },
    [code, language],
  );

  // Listen to messages from live iframe
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === "object" && event.data.type === "feeq-log") {
        const { logType, args } = event.data;
        const safeArgs = Array.isArray(args) ? args : [args];
        const text = safeArgs.map((a: unknown) => formatValue(a)).join(" ");
        const validTypes = ["log", "warn", "error", "info", "result"] as const;
        const resolvedType =
          typeof logType === "string" && (validTypes as readonly string[]).includes(logType)
            ? (logType as (typeof validTypes)[number])
            : "log";
        setOutput((prev) => [
          ...prev.slice(-199),
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            type: resolvedType,
            text,
            timestamp: Date.now(),
          },
        ]);
      }
    };
    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
      if (e.altKey && e.shiftKey && (e.key === "F" || e.key === "f")) {
        e.preventDefault();
        handleFormat();
      }
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [runCode, handleFormat, isFullscreen]);

  const clearOutput = useCallback(() => {
    setOutput([]);
    setExecutionTime(null);
    setHasError(false);
    setStatusMessage("Cleared");
  }, []);

  const resetCode = useCallback(() => {
    const defaultVal =
      language === "react"
        ? DEFAULT_REACT_CODE
        : language === "html"
          ? DEFAULT_HTML_CODE
          : DEFAULT_CODE;
    setCode(defaultVal);
    if (editorRef.current) {
      editorRef.current.setValue(defaultVal);
    }
    setOutput([]);
    setExecutionTime(null);
    setHasError(false);
    setStatusMessage("Reset");
  }, [language]);

  const copyConsoleOutput = useCallback(() => {
    const text = output
      .map((l) => `${l.type.toUpperCase()}: ${l.text}`)
      .join("\n");
    navigator.clipboard.writeText(text);
  }, [output]);

  return (
    <div className={styles.page}>
      <div
        className={`${styles.playgroundContainer} ${
          isFullscreen ? styles.fullscreenContainer : ""
        }`}
      >
        <PlaygroundHeader
          language={language}
          onLanguageChange={handleLanguageChange}
          selectedTheme={selectedTheme}
          onThemeChange={handleThemeChange}
          themes={THEMES}
          templatesCount={allTemplates.length}
          onOpenTemplates={() => setIsTemplatesOpen(true)}
          isRunning={isRunning}
          onRun={() => runCode()}
          onFormat={handleFormat}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
          onClear={clearOutput}
          onReset={resetCode}
        />

        {/* Editor + Output Area */}
        <div className={styles.editorArea}>
          <div className={styles.editorPane}>
            <div className={styles.paneHeader}>
              <div className={styles.paneTitle}>
                <span>📝 Editor</span>
                <span className={styles.langBadge}>
                  {language === "react"
                    ? "REACT (JSX/TSX)"
                    : language.toUpperCase()}
                </span>
              </div>
              <span className={styles.editorHint}>Ctrl/⌘+Enter to Run</span>
            </div>

            <div className={styles.editorWrapper}>
              <Editor
                height="100%"
                language={
                  language === "react"
                    ? "typescript"
                    : language === "html"
                      ? "html"
                      : language
                }
                path={
                  language === "react"
                    ? "App.tsx"
                    : language === "typescript"
                      ? "index.tsx"
                      : language === "javascript"
                        ? "index.jsx"
                        : "index.html"
                }
                theme={effectiveTheme}
                value={code}
                onChange={(val) => setCode(val || "")}
                beforeMount={(monaco) => {
                  registerMonacoThemes(monaco);
                  configureMonacoLanguages(monaco);
                }}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: 14,
                  fontFamily:
                    "'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace",
                  fontLigatures: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  wordWrap: "on",
                  tabSize: 2,
                  automaticLayout: true,
                  padding: { top: 14, bottom: 14 },
                }}
              />
            </div>
          </div>

          <div className={styles.outputPane}>
            <div className={styles.paneHeader}>
              <div className={styles.tabButtons}>
                {(language === "html" || language === "react") && (
                  <button
                    type="button"
                    className={`${styles.tabBtn} ${
                      activeTab === "preview" ? styles.activeTabBtn : ""
                    }`}
                    onClick={() => setActiveTab("preview")}
                  >
                    {language === "react"
                      ? "⚛️ React Live Preview"
                      : "🌐 Live Web Preview"}
                  </button>
                )}
                <button
                  type="button"
                  className={`${styles.tabBtn} ${
                    activeTab === "console" ? styles.activeTabBtn : ""
                  }`}
                  onClick={() => setActiveTab("console")}
                >
                  📟 Console ({output.length})
                </button>
              </div>

              {activeTab === "console" && output.length > 0 && (
                <div className={styles.outputActions}>
                  <button
                    type="button"
                    className={styles.miniActionBtn}
                    onClick={copyConsoleOutput}
                    title="Copy Output"
                  >
                    📋 Copy
                  </button>
                  <button
                    type="button"
                    className={styles.miniActionBtn}
                    onClick={clearOutput}
                    title="Clear Console"
                  >
                    ✕ Clear
                  </button>
                </div>
              )}
            </div>

            {/* Live Web Component Iframe View */}
            {(language === "html" || language === "react") && activeTab === "preview" ? (
              <div className={styles.previewPane}>
                <iframe
                  ref={iframeRef}
                  title="Live Web Preview"
                  className={styles.liveIframe}
                  sandbox="allow-scripts allow-modals allow-forms allow-popups"
                />
              </div>
            ) : (
              <PlaygroundConsole output={output} />
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className={styles.statusBar}>
          <div className={styles.statusLeft}>
            <span
              className={
                hasError
                  ? styles.statusDotError
                  : isRunning
                    ? styles.statusDotRunning
                    : styles.statusDot
              }
            />
            <span className={styles.statusText}>{statusMessage}</span>
          </div>

          <div className={styles.statusRight}>
            {executionTime !== null && (
              <span className={styles.executionTime}>
                ⏱ {executionTime.toFixed(2)}ms
              </span>
            )}
            <span className={styles.themeIndicator}>
              Theme: {THEMES.find((t) => t.id === selectedTheme)?.name}
            </span>
          </div>
        </div>
      </div>

      <PlaygroundTemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        allTemplates={allTemplates}
        onSelectTemplate={loadTemplateItem}
      />
    </div>
  );
}
