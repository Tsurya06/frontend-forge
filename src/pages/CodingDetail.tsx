import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import Editor, { type OnMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { useProgressContext } from "@/context/ProgressContext";
import { useBookmarkContext } from "@/context/BookmarkContext";
import { Badge } from "@/components/common/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { CodeBlock } from "@/components/code/CodeBlock";
import { allCodingProblems } from "@/data";
import {
  evaluateProblem,
  type ProblemEvaluationResult,
} from "@/utils/codeRunner";
import type { Difficulty } from "@/types";
import styles from "./CodingDetail.module.css";

const difficultyVariant: Record<
  Difficulty,
  "beginner" | "intermediate" | "advanced" | "senior"
> = {
  Beginner: "beginner",
  Intermediate: "intermediate",
  Advanced: "advanced",
  Senior: "senior",
};

type LeftTab = "description" | "editorial" | "solutions" | "submissions";
type RightTab = "testcase" | "result" | "preview";

const HTML_CSS_CATEGORIES = ["CSS", "HTML & CSS", "HTML", "Accessibility"];

function isHtmlCssProblem(problem: {
  category: string;
  implementation: string;
}): boolean {
  if (
    HTML_CSS_CATEGORIES.some((c) =>
      problem.category.toLowerCase().includes(c.toLowerCase()),
    )
  )
    return true;
  if (
    problem.implementation.trimStart().startsWith("<!--") ||
    problem.implementation.trimStart().startsWith("<")
  )
    return true;
  return false;
}

interface UserSubmission {
  id: string;
  timestamp: string;
  status: "accepted" | "wrong_answer" | "runtime_error";
  passedCases: number;
  totalCases: number;
  runtimeMs: number;
  codeSnippet: string;
}

export default function CodingDetail() {
  const { problemId } = useParams<{ problemId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isComplete, markComplete } = useProgressContext();
  const { isBookmarked, toggleBookmark } = useBookmarkContext();

  const problem = useMemo(() => {
    return allCodingProblems.find((p) => p.id === problemId);
  }, [problemId]);

  const currentIndex = useMemo(() => {
    if (!problem) return -1;
    return allCodingProblems.findIndex((p) => p.id === problem.id);
  }, [problem]);

  const prevProblem =
    currentIndex > 0 ? allCodingProblems[currentIndex - 1] : null;
  const nextProblem =
    currentIndex >= 0 && currentIndex < allCodingProblems.length - 1
      ? allCodingProblems[currentIndex + 1]
      : null;

  // Detect problem type
  const isHtmlCss = useMemo(
    () => (problem ? isHtmlCssProblem(problem) : false),
    [problem],
  );

  // Starter template (clean function / prototype / class signature with empty body)
  const defaultStarterCode = useMemo(() => {
    if (!problem) return "";

    // HTML/CSS problems get an HTML starter
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
  }, [problem]);

  const [userCode, setUserCode] = useState<string>("");
  const [selectedLang, setSelectedLang] = useState<
    "javascript" | "typescript" | "html"
  >("javascript");

  const tabParam = searchParams.get("tab") as LeftTab;
  const [leftTab, setLeftTab] = useState<LeftTab>(
    tabParam && ["description", "editorial", "solutions", "submissions"].includes(tabParam)
      ? tabParam
      : "description",
  );

  useEffect(() => {
    const currentTab = searchParams.get("tab") as LeftTab;
    if (
      currentTab &&
      ["description", "editorial", "solutions", "submissions"].includes(currentTab)
    ) {
      setLeftTab(currentTab);
    }
  }, [searchParams]);

  const [rightTab, setRightTab] = useState<RightTab>("testcase");
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState(0);
  const [selectedSolutionTier, setSelectedSolutionTier] = useState<
    "beginner" | "intermediate" | "expert"
  >("expert");
  const [evaluationResult, setEvaluationResult] =
    useState<ProblemEvaluationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);

  // Draggable split pane state
  const [horizontalSplit, setHorizontalSplit] = useState(50); // left/right % for desktop
  const [verticalSplit, setVerticalSplit] = useState(60); // editor/test panel % on right pane
  const isDraggingH = useRef(false);
  const isDraggingV = useRef(false);
  const splitContainerRef = useRef<HTMLDivElement | null>(null);
  const rightPaneRef = useRef<HTMLDivElement | null>(null);

  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  // Load code and past submissions from localStorage
  useEffect(() => {
    if (problem) {
      const savedCode = localStorage.getItem(`feeq-code-${problem.id}`);
      // Heal any previously saved corrupted signature
      const isCorrupted =
        savedCode &&
        (savedCode.includes("cache = new WeakMap() {") ||
          savedCode.includes("new WeakMap() {"));
      if (isCorrupted) {
        localStorage.removeItem(`feeq-code-${problem.id}`);
      }

      setUserCode((!isCorrupted && savedCode) || defaultStarterCode);
      setEvaluationResult(null);

      // Set correct editor language for HTML/CSS problems
      if (isHtmlCss) {
        setSelectedLang("html");
      } else {
        setSelectedLang("javascript");
      }

      const storedSubs = localStorage.getItem(`feeq-subs-${problem.id}`);
      if (storedSubs) {
        try {
          setSubmissions(JSON.parse(storedSubs));
        } catch {
          setSubmissions([]);
        }
      } else {
        setSubmissions([]);
      }
    }
  }, [problem, defaultStarterCode, isHtmlCss]);

  const handleEditorChange = (val: string | undefined) => {
    const code = val || "";
    setUserCode(code);
    if (problem) {
      localStorage.setItem(`feeq-code-${problem.id}`, code);
    }
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleResetCode = () => {
    if (window.confirm("Reset code to starter template?")) {
      setUserCode(defaultStarterCode);
      if (problem) {
        localStorage.removeItem(`feeq-code-${problem.id}`);
      }
    }
  };

  // Load selected solution tier directly into editor
  const loadSolutionIntoEditor = (code: string) => {
    setUserCode(code);
    if (problem) {
      localStorage.setItem(`feeq-code-${problem.id}`, code);
    }
  };

  // Real testcase evaluation
  const runCode = useCallback(() => {
    if (!problem) return;
    setIsRunning(true);

    // HTML/CSS problems → show live preview instead of running tests
    if (isHtmlCss) {
      setRightTab("preview");
      setIsRunning(false);
      // Mark complete if user has written meaningful HTML/CSS code
      const trimmed = userCode.trim();
      const hasHtml = trimmed.includes("<") && trimmed.includes(">");
      const hasCss = trimmed.includes("{") && trimmed.includes("}");
      if (hasHtml && hasCss && trimmed.length > 100) {
        markComplete(problem.id, "coding");

        const newSub: UserSubmission = {
          id: String(Date.now()),
          timestamp: new Date().toLocaleTimeString(),
          status: "accepted",
          passedCases: 1,
          totalCases: 1,
          runtimeMs: 0,
          codeSnippet: userCode.slice(0, 120),
        };
        const updated = [newSub, ...submissions.slice(0, 9)];
        setSubmissions(updated);
        localStorage.setItem(
          `feeq-subs-${problem.id}`,
          JSON.stringify(updated),
        );
      }
      return;
    }

    setRightTab("result");

    setTimeout(() => {
      const result = evaluateProblem(userCode, problem.examples);
      setEvaluationResult(result);
      setIsRunning(false);

      // Save real submission to history
      const newSub: UserSubmission = {
        id: String(Date.now()),
        timestamp: new Date().toLocaleTimeString(),
        status:
          result.status === "accepted"
            ? "accepted"
            : result.status === "runtime_error"
              ? "runtime_error"
              : "wrong_answer",
        passedCases: result.passedCases,
        totalCases: result.totalCases,
        runtimeMs: result.totalTime,
        codeSnippet: userCode.slice(0, 120),
      };

      const updated = [newSub, ...submissions.slice(0, 9)];
      setSubmissions(updated);
      localStorage.setItem(`feeq-subs-${problem.id}`, JSON.stringify(updated));

      // Mark complete if all testcases passed
      if (result.status === "accepted") {
        markComplete(problem.id, "coding");
      }
    }, 60);
  }, [problem, userCode, submissions, markComplete, isHtmlCss]);

  // Submit Solution (always allowed, never locks)
  const handleSubmit = useCallback(() => {
    runCode();
  }, [runCode]);

  // Compute pass/fail stats from submissions
  const passCount = submissions.filter((s) => s.status === "accepted").length;
  const failCount = submissions.filter((s) => s.status !== "accepted").length;

  // ── Draggable Horizontal Splitter (Left ↔ Right) ──
  const onHDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingH.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMove = (ev: MouseEvent) => {
      if (!isDraggingH.current || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setHorizontalSplit(Math.max(20, Math.min(80, pct)));
    };
    const onUp = () => {
      isDraggingH.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  // ── Draggable Vertical Splitter (Editor ↕ Test Panel) ──
  const onVDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingV.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    const onMove = (ev: MouseEvent) => {
      if (!isDraggingV.current || !rightPaneRef.current) return;
      const rect = rightPaneRef.current.getBoundingClientRect();
      const pct = ((ev.clientY - rect.top) / rect.height) * 100;
      setVerticalSplit(Math.max(20, Math.min(85, pct)));
    };
    const onUp = () => {
      isDraggingV.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  const pickRandom = () => {
    const randomIdx = Math.floor(Math.random() * allCodingProblems.length);
    const chosen = allCodingProblems[randomIdx];
    if (chosen) navigate(`/coding/${chosen.id}`);
  };

  if (!problem) {
    return (
      <div className={styles.emptyPage}>
        <EmptyState
          icon="📭"
          title="Problem not found"
          description="The problem you are looking for doesn't exist."
          actionLabel="Return to Problem List"
          onAction={() => navigate("/coding")}
        />
      </div>
    );
  }

  const completed = isComplete(problem.id, "coding");
  const bookmarked = isBookmarked(problem.id);

  // Active solution for 3-Tier view
  let activeSolutionCode = problem.implementation;
  let activeSolutionApproach = problem.optimalApproach;

  if (selectedSolutionTier === "beginner" && problem.beginnerImplementation) {
    activeSolutionCode = problem.beginnerImplementation;
    activeSolutionApproach =
      problem.beginnerApproach ||
      problem.naiveApproach ||
      "Baseline implementation for core requirements.";
  } else if (
    selectedSolutionTier === "intermediate" &&
    problem.intermediateImplementation
  ) {
    activeSolutionCode = problem.intermediateImplementation;
    activeSolutionApproach =
      problem.intermediateApproach ||
      "Enhanced implementation with additional argument handling.";
  } else if (
    selectedSolutionTier === "expert" &&
    problem.expertImplementation
  ) {
    activeSolutionCode = problem.expertImplementation;
    activeSolutionApproach = problem.expertApproach || problem.optimalApproach;
  }

  return (
    <div className={styles.workspaceContainer}>
      {/* ── 1. Top LeetCode Workspace Navigation Bar ── */}
      <header className={styles.topToolbar}>
        <div className={styles.toolbarLeft}>
          <Link
            to="/coding"
            className={styles.problemListLink}
            title="Back to Problem List"
          >
            <span>☰ Problem List</span>
          </Link>

          <div className={styles.prevNextGroup}>
            <button
              type="button"
              className={styles.pagerBtn}
              onClick={() =>
                prevProblem && navigate(`/coding/${prevProblem.id}`)
              }
              disabled={!prevProblem}
              title={
                prevProblem ? `Previous: ${prevProblem.title}` : "First problem"
              }
              aria-label="Previous problem"
            >
              ‹
            </button>
            <button
              type="button"
              className={styles.pagerBtn}
              onClick={() =>
                nextProblem && navigate(`/coding/${nextProblem.id}`)
              }
              disabled={!nextProblem}
              title={
                nextProblem ? `Next: ${nextProblem.title}` : "Last problem"
              }
              aria-label="Next problem"
            >
              ›
            </button>
            <button
              type="button"
              className={styles.pagerBtn}
              onClick={pickRandom}
              title="Pick Random Problem"
              aria-label="Random problem"
            >
              🔀
            </button>
          </div>
        </div>

        {/* Center Primary Action Buttons */}
        <div className={styles.toolbarCenter}>
          <button
            type="button"
            className={styles.runBtn}
            onClick={runCode}
            disabled={isRunning}
            title={
              isHtmlCss
                ? "Preview HTML/CSS output"
                : "Run Code against Testcases"
            }
          >
            <span className={styles.runIcon}>{isHtmlCss ? "👁️" : "▶"}</span>
            <span>
              {isRunning ? "Running..." : isHtmlCss ? "Preview" : "Run"}
            </span>
          </button>

          <button
            type="button"
            className={`${styles.submitBtn} ${completed ? styles.submitBtnDone : ""}`}
            onClick={handleSubmit}
            disabled={isRunning}
            title={
              isHtmlCss
                ? "Submit & Preview"
                : "Submit Solution & Validate All Testcases"
            }
          >
            <span className={styles.submitIcon}>☁️</span>
            <span>Submit{completed ? " ✓" : ""}</span>
            {submissions.length > 0 && (
              <span className={styles.submitStats}>
                <span className={styles.passCount}>✓{passCount}</span>
                <span className={styles.failCount}>✕{failCount}</span>
              </span>
            )}
          </button>
        </div>

        {/* Right Tools */}
        <div className={styles.toolbarRight}>
          <button
            type="button"
            className={`${styles.toolIconBtn} ${bookmarked ? styles.bookmarked : ""}`}
            onClick={() => toggleBookmark(problem.id)}
            title={bookmarked ? "Remove Bookmark" : "Bookmark Problem"}
            aria-label="Bookmark"
          >
            {bookmarked ? "⭐" : "☆"}
          </button>
        </div>
      </header>

      {/* ── 2. Split-Pane Workspace (Left: Spec & Editorial | Right: Monaco Sandbox) ── */}
      <div className={styles.splitWorkspace} ref={splitContainerRef}>
        {/* ── LEFT PANE: Description, Editorial & Solutions ── */}
        <div
          className={styles.leftPane}
          style={{ flex: `0 0 ${horizontalSplit}%` }}
        >
          {/* LeetCode Tabs Header */}
          <div className={styles.paneTabs}>
            <button
              type="button"
              className={`${styles.paneTab} ${leftTab === "description" ? styles.paneTabActive : ""}`}
              onClick={() => setLeftTab("description")}
            >
              📄 Description
            </button>
            <button
              type="button"
              className={`${styles.paneTab} ${leftTab === "editorial" ? styles.paneTabActive : ""}`}
              onClick={() => setLeftTab("editorial")}
            >
              📰 Editorial
            </button>
            <button
              type="button"
              className={`${styles.paneTab} ${leftTab === "solutions" ? styles.paneTabActive : ""}`}
              onClick={() => setLeftTab("solutions")}
            >
              💡 Solutions
            </button>
            <button
              type="button"
              className={`${styles.paneTab} ${leftTab === "submissions" ? styles.paneTabActive : ""}`}
              onClick={() => setLeftTab("submissions")}
            >
              🕒 Submissions ({submissions.length})
            </button>
          </div>

          <div className={styles.leftPaneBody}>
            {leftTab === "description" && (
              <div className={styles.descriptionTabContent}>
                {/* Problem Header */}
                <div className={styles.problemHeaderRow}>
                  <h1 className={styles.problemTitle}>
                    {currentIndex + 1}. {problem.title}
                  </h1>
                  {completed && (
                    <span className={styles.solvedTag}>Solved ✓</span>
                  )}
                </div>

                {/* Difficulty & Badges Row */}
                <div className={styles.badgeRow}>
                  <Badge
                    variant={difficultyVariant[problem.difficulty]}
                    size="small"
                  >
                    {problem.difficulty === "Beginner"
                      ? "Easy"
                      : problem.difficulty === "Intermediate"
                        ? "Medium"
                        : "Hard"}
                  </Badge>

                  <div className={styles.tagGroup}>
                    {problem.tags.map((t) => (
                      <span key={t} className={styles.topicBadge}>
                        🏷️ {t}
                      </span>
                    ))}
                  </div>

                  <span className={styles.companyBadge}>
                    🏢 {problem.category || "JavaScript"}
                  </span>
                </div>

                {/* Problem Description Statement */}
                <div className={styles.problemBodyText}>
                  {problem.problem.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {/* Examples */}
                <div className={styles.examplesSection}>
                  {problem.examples.map((ex, idx) => (
                    <div key={idx} className={styles.exampleBox}>
                      <span className={styles.exampleTitle}>
                        Example {idx + 1}:
                      </span>
                      <div className={styles.exampleCodeBox}>
                        <div className={styles.exampleRow}>
                          <span className={styles.exampleLabel}>Input:</span>
                          <span className={styles.exampleVal}>{ex.input}</span>
                        </div>
                        <div className={styles.exampleRow}>
                          <span className={styles.exampleLabel}>Output:</span>
                          <span className={styles.exampleVal}>{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className={styles.exampleRow}>
                            <span className={styles.exampleLabel}>
                              Explanation:
                            </span>
                            <span className={styles.exampleExplanation}>
                              {ex.explanation}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                {problem.requirements && problem.requirements.length > 0 && (
                  <div className={styles.constraintsSection}>
                    <span className={styles.constraintsTitle}>
                      Constraints & Requirements:
                    </span>
                    <ul className={styles.constraintsList}>
                      {problem.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                      <li>
                        Time Complexity: <code>{problem.timeComplexity}</code>
                      </li>
                      <li>
                        Space Complexity: <code>{problem.spaceComplexity}</code>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {leftTab === "editorial" && (
              <div className={styles.editorialTabContent}>
                <h2 className={styles.editorialHeading}>
                  Editorial & Architectural Deep Dive
                </h2>
                <div className={styles.editorialBlock}>
                  <h3 className={styles.subHeading}>💡 Optimal Approach</h3>
                  <p className={styles.editorialText}>
                    {problem.optimalApproach}
                  </p>
                </div>

                {problem.naiveApproach && (
                  <div className={styles.editorialBlock}>
                    <h3 className={styles.subHeading}>
                      ⚠️ Naive Approach & Limitations
                    </h3>
                    <p className={styles.editorialText}>
                      {problem.naiveApproach}
                    </p>
                  </div>
                )}

                {problem.theoryAndConcepts && (
                  <div className={styles.editorialBlock}>
                    <h3 className={styles.subHeading}>
                      📖 Core JavaScript Internals
                    </h3>
                    <div className={styles.theoryBox}>
                      {problem.theoryAndConcepts
                        .split("\n\n")
                        .map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                    </div>
                  </div>
                )}

                {problem.interviewTraps &&
                  problem.interviewTraps.length > 0 && (
                    <div className={styles.trapsBox}>
                      <h3 className={styles.trapsHeading}>
                        ⚠️ Common Interview Traps
                      </h3>
                      <ul className={styles.trapsList}>
                        {problem.interviewTraps.map((trap, i) => (
                          <li key={i}>{trap}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            )}

            {leftTab === "solutions" && (
              <div className={styles.solutionsTabContent}>
                <div className={styles.solutionHeader}>
                  <h2 className={styles.editorialHeading}>
                    Progressive 3-Tier Solutions
                  </h2>
                  <div className={styles.tierSelector}>
                    {problem.beginnerImplementation && (
                      <button
                        type="button"
                        className={`${styles.tierBtn} ${selectedSolutionTier === "beginner" ? styles.tierBtnActiveBeginner : ""}`}
                        onClick={() => setSelectedSolutionTier("beginner")}
                      >
                        🟢 Beginner
                      </button>
                    )}
                    {problem.intermediateImplementation && (
                      <button
                        type="button"
                        className={`${styles.tierBtn} ${selectedSolutionTier === "intermediate" ? styles.tierBtnActiveIntermediate : ""}`}
                        onClick={() => setSelectedSolutionTier("intermediate")}
                      >
                        🟡 Intermediate
                      </button>
                    )}
                    {problem.expertImplementation && (
                      <button
                        type="button"
                        className={`${styles.tierBtn} ${selectedSolutionTier === "expert" ? styles.tierBtnActiveExpert : ""}`}
                        onClick={() => setSelectedSolutionTier("expert")}
                      >
                        🟣 Expert / Production
                      </button>
                    )}
                  </div>
                </div>

                <div className={styles.solutionApproachBox}>
                  <span className={styles.approachHeading}>
                    Architecture & Approach:
                  </span>
                  <p className={styles.approachText}>
                    {activeSolutionApproach}
                  </p>
                  <button
                    type="button"
                    className={styles.loadSolutionBtn}
                    onClick={() => loadSolutionIntoEditor(activeSolutionCode)}
                  >
                    📥 Load this solution into Editor
                  </button>
                </div>

                <CodeBlock
                  code={activeSolutionCode}
                  language={isHtmlCss ? "html" : "javascript"}
                  title={`${selectedSolutionTier.toUpperCase()} SOLUTION`}
                  showLineNumbers
                />
              </div>
            )}

            {leftTab === "submissions" && (
              <div className={styles.submissionsTabContent}>
                <h2 className={styles.editorialHeading}>Submission History</h2>
                {submissions.length > 0 ? (
                  <div className={styles.submissionList}>
                    {submissions.map((sub) => (
                      <div key={sub.id} className={styles.submissionRecord}>
                        <div className={styles.submissionStatus}>
                          <span
                            className={
                              sub.status === "accepted"
                                ? styles.acceptedTag
                                : styles.wrongAnswerTag
                            }
                          >
                            {sub.status === "accepted"
                              ? "Accepted ✓"
                              : sub.status === "runtime_error"
                                ? "Runtime Error ✕"
                                : "Wrong Answer ✕"}
                          </span>
                          <span className={styles.submissionDate}>
                            {sub.timestamp}
                          </span>
                        </div>
                        <div className={styles.submissionStats}>
                          <span>
                            Passed:{" "}
                            <strong>
                              {sub.passedCases}/{sub.totalCases}
                            </strong>{" "}
                            test cases
                          </span>
                          <span>
                            Runtime: <strong>{sub.runtimeMs} ms</strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noSubmissions}>
                    <p>
                      No submissions yet. Write your code and click{" "}
                      <strong>Submit</strong>!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── HORIZONTAL DRAG HANDLE ── */}
        <div
          className={styles.hDragHandle}
          onMouseDown={onHDragStart}
          title="Drag to resize panes"
        />

        {/* ── RIGHT PANE: Live Interactive Monaco Code Editor & Testbed ── */}
        <div
          className={styles.rightPane}
          ref={rightPaneRef}
          style={{ flex: `0 0 ${100 - horizontalSplit}%` }}
        >
          {/* 1. Monaco Code Editor */}
          <div
            className={styles.editorBox}
            style={{ flex: `0 0 ${verticalSplit}%` }}
          >
            <div className={styles.editorHeader}>
              <div className={styles.editorTitleGroup}>
                <span className={styles.editorCodeIcon}>&lt;/&gt;</span>
                <span className={styles.editorTitle}>Code</span>
                <select
                  className={styles.langSelect}
                  value={selectedLang}
                  onChange={(e) =>
                    setSelectedLang(
                      e.target.value as "javascript" | "typescript" | "html",
                    )
                  }
                >
                  {isHtmlCss ? (
                    <option value="html">HTML / CSS</option>
                  ) : (
                    <>
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                    </>
                  )}
                </select>
              </div>

              <div className={styles.editorActionsGroup}>
                <span className={styles.savedStatus}>Auto-saved</span>
                <button
                  type="button"
                  className={styles.editorToolBtn}
                  onClick={handleResetCode}
                  title="Reset to Starter Code"
                >
                  ↺ Reset
                </button>
              </div>
            </div>

            {/* Live Monaco Editor */}
            <div className={styles.monacoWrapper}>
              <Editor
                height="100%"
                language={selectedLang}
                theme="vs-dark"
                value={userCode}
                loading={<PageSkeleton variant="editor" />}
                onChange={handleEditorChange}
                onMount={handleEditorMount}
                options={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: "on",
                  lineNumbers: "on",
                  padding: { top: 8, bottom: 8 },
                }}
              />
            </div>
          </div>

          {/* ── VERTICAL DRAG HANDLE ── */}
          <div
            className={styles.vDragHandle}
            onMouseDown={onVDragStart}
            title="Drag to resize editor and test panel"
          />

          {/* 2. Testcase & Real Test Result / Preview Bottom Panel */}
          <div
            className={styles.testPanel}
            style={{ flex: `0 0 ${100 - verticalSplit}%` }}
          >
            <div className={styles.testPanelTabs}>
              {isHtmlCss ? (
                <>
                  <button
                    type="button"
                    className={`${styles.testPanelTab} ${rightTab === "preview" ? styles.testPanelTabActive : ""}`}
                    onClick={() => setRightTab("preview")}
                  >
                    👁️ Live Preview
                  </button>
                  <button
                    type="button"
                    className={`${styles.testPanelTab} ${rightTab === "testcase" ? styles.testPanelTabActive : ""}`}
                    onClick={() => setRightTab("testcase")}
                  >
                    ✓ Requirements
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={`${styles.testPanelTab} ${rightTab === "testcase" ? styles.testPanelTabActive : ""}`}
                    onClick={() => setRightTab("testcase")}
                  >
                    ✓ Testcase
                  </button>
                  <button
                    type="button"
                    className={`${styles.testPanelTab} ${rightTab === "result" ? styles.testPanelTabActive : ""}`}
                    onClick={() => setRightTab("result")}
                  >
                    &gt;_ Test Result{" "}
                    {evaluationResult
                      ? evaluationResult.status === "accepted"
                        ? "🟢"
                        : "🔴"
                      : ""}
                  </button>
                </>
              )}
            </div>

            <div className={styles.testPanelBody}>
              {rightTab === "preview" && isHtmlCss ? (
                <div className={styles.previewContent}>
                  <iframe
                    title="HTML/CSS Live Preview"
                    className={styles.previewIframe}
                    sandbox="allow-scripts"
                    srcDoc={
                      userCode || "<!-- Write your HTML/CSS code above -->"
                    }
                  />
                </div>
              ) : rightTab === "testcase" ? (
                <div className={styles.testcaseContent}>
                  {/* Case Switcher */}
                  <div className={styles.caseSwitcher}>
                    {problem.examples.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`${styles.caseBtn} ${activeTestCaseIdx === idx ? styles.caseBtnActive : ""}`}
                        onClick={() => setActiveTestCaseIdx(idx)}
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
                          <code>
                            {problem.examples[activeTestCaseIdx].input}
                          </code>
                        </pre>
                      </div>

                      <div className={styles.caseField}>
                        <span className={styles.caseFieldLabel}>
                          Expected Output:
                        </span>
                        <pre className={styles.caseValue}>
                          <code>
                            {problem.examples[activeTestCaseIdx].output}
                          </code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Diagnostic Results Output */
                <div className={styles.resultContent}>
                  {!evaluationResult && !isRunning && (
                    <div className={styles.idleResult}>
                      <p>
                        Click <strong>▶ Run</strong> to execute your code
                        against test cases.
                      </p>
                    </div>
                  )}

                  {isRunning && (
                    <div className={styles.runningResult}>
                      <div className={styles.spinner} />
                      <span>
                        Evaluating your code against {problem.examples.length}{" "}
                        test cases...
                      </span>
                    </div>
                  )}

                  {evaluationResult && !isRunning && (
                    <>
                      {/* Accepted State */}
                      {evaluationResult.status === "accepted" && (
                        <div className={styles.acceptedResult}>
                          <div className={styles.resultStatusBanner}>
                            <span className={styles.acceptedHeading}>
                              Accepted
                            </span>
                            <span className={styles.runtimeTag}>
                              Passed: {evaluationResult.passedCases}/
                              {evaluationResult.totalCases} • Runtime:{" "}
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
                                  <span className={styles.caseFieldLabel}>
                                    Output:
                                  </span>
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

                      {/* Wrong Answer State */}
                      {evaluationResult.status === "wrong_answer" &&
                        evaluationResult.failedCase && (
                          <div className={styles.errorResult}>
                            <div className={styles.resultStatusBannerError}>
                              <span className={styles.errorHeading}>
                                Wrong Answer
                              </span>
                              <span className={styles.runtimeTag}>
                                Passed: {evaluationResult.passedCases}/
                                {evaluationResult.totalCases} test cases
                              </span>
                            </div>

                            <div className={styles.diagnosticDetails}>
                              <div className={styles.caseField}>
                                <span className={styles.caseFieldLabel}>
                                  Failed on Input:
                                </span>
                                <pre className={styles.caseValue}>
                                  <code>
                                    {evaluationResult.failedCase.input}
                                  </code>
                                </pre>
                              </div>

                              <div className={styles.caseField}>
                                <span className={styles.caseFieldLabel}>
                                  Your Output:
                                </span>
                                <pre
                                  className={`${styles.caseValue} ${styles.wrongOutput}`}
                                >
                                  <code>
                                    {evaluationResult.failedCase.actualOutput ||
                                      "undefined"}
                                  </code>
                                </pre>
                              </div>

                              <div className={styles.caseField}>
                                <span className={styles.caseFieldLabel}>
                                  Expected Output:
                                </span>
                                <pre
                                  className={`${styles.caseValue} ${styles.expectedOutput}`}
                                >
                                  <code>
                                    {evaluationResult.failedCase.expectedOutput}
                                  </code>
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

                      {/* Runtime Error State */}
                      {evaluationResult.status === "runtime_error" && (
                        <div className={styles.errorResult}>
                          <div className={styles.resultStatusBannerError}>
                            <span className={styles.errorHeading}>
                              Runtime Error
                            </span>
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
