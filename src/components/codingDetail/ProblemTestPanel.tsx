import { Eye, CheckCircle2, Terminal } from "lucide-react";
import styles from "@/pages/coding/CodingDetail.module.css";
import type { ProblemTestPanelProps, ProblemTestPanelContentProps } from "./types";

export function ProblemTestPanel({
  rightTab,
  isHtmlCss,
  evaluationResult,
  onSelectTab,
}: Readonly<ProblemTestPanelProps>) {
  return (
    <div className={styles.testPanelTabs}>
      {isHtmlCss ? (
        <>
          <button
            type="button"
            className={`${styles.testPanelTab} ${rightTab === "preview" ? styles.testPanelTabActive : ""}`}
            onClick={() => onSelectTab("preview")}
          >
            <Eye size={13} />
            <span>Live Preview</span>
          </button>
          <button
            type="button"
            className={`${styles.testPanelTab} ${rightTab === "testcase" ? styles.testPanelTabActive : ""}`}
            onClick={() => onSelectTab("testcase")}
          >
            <CheckCircle2 size={13} />
            <span>Requirements</span>
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            className={`${styles.testPanelTab} ${rightTab === "testcase" ? styles.testPanelTabActive : ""}`}
            onClick={() => onSelectTab("testcase")}
          >
            <CheckCircle2 size={13} />
            <span>Testcase</span>
          </button>
          <button
            type="button"
            className={`${styles.testPanelTab} ${rightTab === "result" ? styles.testPanelTabActive : ""}`}
            onClick={() => onSelectTab("result")}
          >
            <Terminal size={13} />
            <span>Test Result</span>
            {evaluationResult && (
              <span
                className={
                  evaluationResult.status === "accepted"
                    ? styles.statusDotGreen
                    : styles.statusDotRed
                }
              />
            )}
          </button>
        </>
      )}
    </div>
  );
}

export function ProblemTestPanelContent({
  problem,
  rightTab,
  isHtmlCss,
  userCode,
  activeTestCaseIdx,
  isRunning,
  evaluationResult,
  onSelectTestCase,
}: Readonly<ProblemTestPanelContentProps>) {
  if (rightTab === "preview" && isHtmlCss) {
    return (
      <div className={styles.previewContent}>
        <iframe
          title="HTML/CSS Live Preview"
          className={styles.previewIframe}
          sandbox="allow-scripts"
          srcDoc={userCode || "<!-- Write your HTML/CSS code above -->"}
        />
      </div>
    );
  }

  if (rightTab === "testcase") {
    return (
      <div className={styles.testcaseContent}>
        <div className={styles.caseSwitcher}>
          {problem.examples.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.caseBtn} ${activeTestCaseIdx === idx ? styles.caseBtnActive : ""}`}
              onClick={() => onSelectTestCase(idx)}
            >
              Case {idx + 1}
            </button>
          ))}
        </div>

        {problem.examples[activeTestCaseIdx] && (
          <div className={styles.caseDetails}>
            <div className={styles.caseField}>
              <span className={styles.caseFieldLabel}>Input:</span>
              <pre className={styles.caseValue}>
                <code>{problem.examples[activeTestCaseIdx].input}</code>
              </pre>
            </div>

            <div className={styles.caseField}>
              <span className={styles.caseFieldLabel}>Expected Output:</span>
              <pre className={styles.caseValue}>
                <code>{problem.examples[activeTestCaseIdx].output}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.resultContent}>
      {!evaluationResult && !isRunning && (
        <div className={styles.idleResult}>
          <p>
            Click <strong>▶ Run</strong> to execute your code against test cases.
          </p>
        </div>
      )}

      {isRunning && (
        <div className={styles.runningResult}>
          <div className={styles.spinner} />
          <span>
            Evaluating your code against {problem.examples.length} test cases...
          </span>
        </div>
      )}

      {evaluationResult && !isRunning && (
        <>
          {evaluationResult.status === "accepted" && (
            <div className={styles.acceptedResult}>
              <div className={styles.resultStatusBanner}>
                <span className={styles.acceptedHeading}>Accepted</span>
                <span className={styles.runtimeTag}>
                  Passed: {evaluationResult.passedCases}/{evaluationResult.totalCases} • Runtime:{" "}
                  {evaluationResult.totalTime} ms
                </span>
              </div>

              <div className={styles.caseResultsList}>
                {evaluationResult.cases.map((c, i) => (
                  <div key={i} className={styles.casePassedCard}>
                    <div className={styles.casePassedHeader}>
                      <span className={styles.casePassedTitle}>
                        Case {i + 1} Passed ✓
                      </span>
                      <span className={styles.caseTime}>
                        {c.executionTime} ms
                      </span>
                    </div>
                    <div className={styles.caseRowSmall}>
                      <span className={styles.caseFieldLabel}>Output:</span>
                      <code>{c.actualOutput}</code>
                    </div>
                  </div>
                ))}
              </div>

              {evaluationResult.logs.length > 0 && (
                <div className={styles.logsBox}>
                  <span className={styles.outputLabel}>
                    Console Output (stdout):
                  </span>
                  <pre className={styles.logsPre}>
                    {evaluationResult.logs.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))}
                  </pre>
                </div>
              )}
            </div>
          )}

          {evaluationResult.status === "wrong_answer" &&
            evaluationResult.failedCase && (
              <div className={styles.errorResult}>
                <div className={styles.resultStatusBannerError}>
                  <span className={styles.errorHeading}>Wrong Answer</span>
                  <span className={styles.runtimeTag}>
                    Passed: {evaluationResult.passedCases}/{evaluationResult.totalCases} test cases
                  </span>
                </div>

                <div className={styles.diagnosticDetails}>
                  <div className={styles.caseField}>
                    <span className={styles.caseFieldLabel}>
                      Failed on Input:
                    </span>
                    <pre className={styles.caseValue}>
                      <code>{evaluationResult.failedCase.input}</code>
                    </pre>
                  </div>

                  <div className={styles.caseField}>
                    <span className={styles.caseFieldLabel}>Your Output:</span>
                    <pre className={`${styles.caseValue} ${styles.wrongOutput}`}>
                      <code>
                        {evaluationResult.failedCase.actualOutput || "undefined"}
                      </code>
                    </pre>
                  </div>

                  <div className={styles.caseField}>
                    <span className={styles.caseFieldLabel}>
                      Expected Output:
                    </span>
                    <pre className={`${styles.caseValue} ${styles.expectedOutput}`}>
                      <code>{evaluationResult.failedCase.expectedOutput}</code>
                    </pre>
                  </div>
                </div>

                {evaluationResult.logs.length > 0 && (
                  <div className={styles.logsBox}>
                    <span className={styles.outputLabel}>
                      Console Output (stdout):
                    </span>
                    <pre className={styles.logsPre}>
                      {evaluationResult.logs.map((log, i) => (
                        <div key={i}>{log}</div>
                      ))}
                    </pre>
                  </div>
                )}
              </div>
            )}

          {evaluationResult.status === "runtime_error" && (
            <div className={styles.errorResult}>
              <div className={styles.resultStatusBannerError}>
                <span className={styles.errorHeading}>Runtime Error</span>
                <span className={styles.runtimeTag}>
                  Time: {evaluationResult.totalTime} ms
                </span>
              </div>

              <div className={styles.errorBox}>
                <code>{evaluationResult.errorMessage}</code>
              </div>

              {evaluationResult.failedCase && (
                <div className={styles.caseField}>
                  <span className={styles.caseFieldLabel}>
                    Failed on Case:
                  </span>
                  <pre className={styles.caseValue}>
                    <code>{evaluationResult.failedCase.input}</code>
                  </pre>
                </div>
              )}

              {evaluationResult.logs.length > 0 && (
                <div className={styles.logsBox}>
                  <span className={styles.outputLabel}>
                    Console Output:
                  </span>
                  <pre className={styles.logsPre}>
                    {evaluationResult.logs.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))}
                  </pre>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
