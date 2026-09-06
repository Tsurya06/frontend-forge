import { useState, useCallback } from "react";
import { CheckCircle2, XCircle, Play, HelpCircle, Sparkles } from "lucide-react";
import { CodeBlock } from "@/components/code/CodeBlock";
import { executeSnippet } from "@/utils/codeRunner";
import styles from "./OutputPredictionDrill.module.css";

export interface OutputPredictionDrillProps {
  readonly title: string;
  readonly description?: string;
  readonly code: string;
  readonly expectedOutput: string | string[];
  readonly explanation: string;
  readonly hint?: string;
}

export function OutputPredictionDrill({
  title,
  description,
  code,
  expectedOutput,
  explanation,
  hint,
}: Readonly<OutputPredictionDrillProps>) {
  const [userGuess, setUserGuess] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [actualLogs, setActualLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const normalize = (val: string) =>
    val
      .replace(/\r\n/g, "\n")
      .split(/[\n,]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
      .join(" ");

  const expectedStr = Array.isArray(expectedOutput)
    ? expectedOutput.join("\n")
    : expectedOutput;

  const handleVerify = useCallback(async () => {
    setIsRunning(true);
    try {
      const result = await executeSnippet(code);
      const logs = result.logs.map((l) => l.text);
      setActualLogs(logs);

      const normalizedGuess = normalize(userGuess);
      const normalizedExpected = normalize(expectedStr);
      const normalizedActual = normalize(logs.join(" "));

      const correct =
        normalizedGuess === normalizedExpected ||
        (normalizedActual.length > 0 && normalizedGuess === normalizedActual);

      setIsCorrect(correct);
      setHasSubmitted(true);
    } catch {
      setHasSubmitted(true);
      setIsCorrect(false);
    } finally {
      setIsRunning(false);
    }
  }, [code, userGuess, expectedStr]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <span className={styles.badge}>
            <Sparkles size={12} /> SDE2 Output Prediction Drill
          </span>
          <h4 className={styles.title}>{title}</h4>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {hint && (
          <button
            type="button"
            className={styles.checkBtn}
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "var(--text-secondary)" }}
            onClick={() => setShowHint((prev) => !prev)}
          >
            <HelpCircle size={13} /> {showHint ? "Hide Hint" : "Hint"}
          </button>
        )}
      </div>

      {showHint && hint && (
        <div style={{ padding: "0.5rem 0.75rem", marginBottom: "0.5rem", borderRadius: "6px", background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)", fontSize: "0.8rem", color: "#facc15" }}>
          💡 {hint}
        </div>
      )}

      <div className={styles.codeArea}>
        <CodeBlock code={code} language="javascript" showLineNumbers />
      </div>

      <div className={styles.interactiveArea}>
        <label className={styles.inputLabel} htmlFor={`pred-${title.replace(/\s+/g, "-")}`}>
          What will this output in the console? (separate lines or values by commas)
        </label>
        <div className={styles.inputRow}>
          <input
            id={`pred-${title.replace(/\s+/g, "-")}`}
            className={styles.input}
            type="text"
            placeholder='e.g. 1, 4, 3, 2 or "foo"'
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && userGuess.trim() && !isRunning) {
                handleVerify();
              }
            }}
          />
          <button
            type="button"
            className={styles.checkBtn}
            onClick={handleVerify}
            disabled={!userGuess.trim() || isRunning}
          >
            <Play size={13} /> {isRunning ? "Running..." : "Verify"}
          </button>
        </div>

        {hasSubmitted && (
          <div className={`${styles.resultBox} ${isCorrect ? styles.correct : styles.incorrect}`}>
            <div className={styles.resultHeader}>
              {isCorrect ? (
                <>
                  <CheckCircle2 size={16} /> Spot on! Exact execution order match.
                </>
              ) : (
                <>
                  <XCircle size={16} /> Not quite. Check the engine execution below.
                </>
              )}
            </div>

            <div className={styles.diffTable}>
              <div className={styles.diffCol}>
                <div className={styles.diffColTitle}>Your Prediction</div>
                <div>{userGuess || "(empty)"}</div>
              </div>
              <div className={styles.diffCol}>
                <div className={styles.diffColTitle}>Live Engine Output</div>
                <div style={{ color: isCorrect ? "#10b981" : "#ef4444" }}>
                  {actualLogs.length > 0 ? actualLogs.join("\n") : expectedStr}
                </div>
              </div>
            </div>

            <div className={styles.explanation}>
              <strong>Engine Mechanics:</strong>
              <p style={{ marginTop: "0.25rem" }}>{explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
