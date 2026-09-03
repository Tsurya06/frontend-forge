import { useState, useRef, useEffect, useMemo, type UIEvent } from "react";
import { Copy, Check, Sparkles, Palette } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import styles from "./CodePanel.module.css";

interface CodePanelProps {
  code: string;
  activeLine: number;
  title: string;
  onCodeChange: (newCode: string) => void;
}

export function CodePanel({
  code,
  activeLine,
  title,
  onCodeChange,
}: CodePanelProps) {
  const [copied, setCopied] = useState(false);
  const [codeTheme, setCodeTheme] = useState(() => {
    return localStorage.getItem("feeq-code-theme") || "onedark";
  });
  const gutterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const lines = code.split("\n");

  const highlightedHtml = useMemo(() => {
    try {
      const grammar = Prism.languages.javascript || Prism.languages.js;
      if (grammar) {
        return Prism.highlight(code, grammar, "javascript");
      }
      return code;
    } catch {
      return code;
    }
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleThemeChange = (newTheme: string) => {
    setCodeTheme(newTheme);
    localStorage.setItem("feeq-code-theme", newTheme);
  };

  // Synchronize vertical scroll between textarea, highlight pre, and line-number gutter
  const handleScroll = (e: UIEvent<HTMLTextAreaElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const scrollLeft = e.currentTarget.scrollLeft;
    if (gutterRef.current) {
      gutterRef.current.scrollTop = scrollTop;
    }
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
  };

  // Auto-scroll textarea so active line is always in view during execution
  useEffect(() => {
    if (activeLine > 0 && textareaRef.current) {
      const lineHeight = 24;
      const targetScrollTop = (activeLine - 1) * lineHeight - 72; // center somewhat
      if (
        targetScrollTop > textareaRef.current.scrollTop + 200 ||
        targetScrollTop < textareaRef.current.scrollTop - 20
      ) {
        const nextTop = Math.max(0, targetScrollTop);
        textareaRef.current.scrollTop = nextTop;
        if (gutterRef.current) {
          gutterRef.current.scrollTop = nextTop;
        }
        if (preRef.current) {
          preRef.current.scrollTop = nextTop;
        }
      }
    }
  }, [activeLine]);

  return (
    <div className={styles.codeContainer} data-code-theme={codeTheme}>
      <div className={styles.codeHeader}>
        <div className={styles.codeHeaderTitle}>
          <span className={styles.jsIcon}>JS</span>
          <span className={styles.codeTitleText}>{title}</span>
          <span className={styles.liveBadge} title="You can edit this code anytime!">
            <Sparkles size={11} className={styles.badgeSparkle} />
            <span>Live Editable</span>
          </span>
        </div>

        <div className={styles.headerActions}>
          {/* Theme Selector */}
          <div className={styles.themeSelectorWrap}>
            <Palette size={12} className={styles.themeIcon} />
            <select
              className={styles.themeSelect}
              value={codeTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
              title="Change Code Syntax Theme"
              aria-label="Code Syntax Theme"
            >
              <option value="onedark">One Dark Pro</option>
              <option value="vsdark">VS Code Dark+</option>
              <option value="github-dark">GitHub Dark</option>
              <option value="monokai">Monokai</option>
              <option value="dracula">Dracula</option>
              <option value="github-light">GitHub Light</option>
            </select>
          </div>

          <span className={styles.hintText}>Type code &amp; click Play</span>
          <button
            type="button"
            className={styles.copyBtn}
            onClick={handleCopy}
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <Check size={12} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className={styles.editorWrapper}>
        {/* Line Numbers Gutter with Animated Execution Arrow ▶ */}
        <div ref={gutterRef} className={styles.gutter} aria-hidden="true">
          {lines.map((_, i) => {
            const lineNum = i + 1;
            const isActive = activeLine === lineNum;
            return (
              <div
                key={lineNum}
                className={`${styles.gutterRow} ${
                  isActive ? styles.activeGutterRow : ""
                }`}
              >
                <span className={styles.lineNum}>{lineNum}</span>
                {isActive ? (
                  <span className={styles.execArrow} title="Executing this line">
                    ▶
                  </span>
                ) : (
                  <span className={styles.execArrowPlaceholder} />
                )}
              </div>
            );
          })}
        </div>

        {/* Code Area with Active Line Highlight, Syntax Highlighted Code, and Transparent Editable Textarea */}
        <div className={styles.codeArea}>
          <pre ref={preRef} className={styles.highlightPre} aria-hidden="true">
            {activeLine > 0 && activeLine <= lines.length && (
              <div
                className={styles.activeLineStrip}
                style={{
                  top: `${(activeLine - 1) * 24 + 10}px`,
                }}
              />
            )}
            <code
              className="language-javascript"
              dangerouslySetInnerHTML={{ __html: highlightedHtml + "\n" }}
            />
          </pre>

          <textarea
            ref={textareaRef}
            className={styles.codeTextarea}
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            onScroll={handleScroll}
            placeholder="// Enter JavaScript code here..."
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
