import { useMemo, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Editor, { type OnMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { useProgressContext } from "@/context/ProgressContext";
import { useBookmarkContext } from "@/context/BookmarkContext";
import { EmptyState } from "@/components/common/EmptyState";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { codingApi } from "@/services/api";
import { useApiQuery } from "@/services/api/hooks/useApi";
import type { CodingProblem } from "@/types";
import {
  evaluateProblem,
  type ProblemEvaluationResult,
} from "@/utils/codeRunner";
import {
  FileText,
  BookOpen,
  Lightbulb,
  History,
} from "lucide-react";
import { STORAGE_KEYS, ROUTES, DEFAULT_EDITOR_THEME } from "@/constants";
import styles from "./CodingDetail.module.css";
import {
  difficultyVariant,
  isHtmlCssProblem,
  generateStarterCode,
  registerMonacoThemes,
  getStorageCode,
  saveStorageCode,
  removeStorageCode,
  getStorageSubmissions,
  saveStorageSubmissions,
  CodingDetailHeader,
  ProblemDescriptionTab,
  ProblemEditorialTab,
  ProblemSolutionsTab,
  ProblemSubmissionsTab,
  ProblemEditorHeader,
  ProblemTestPanel,
  ProblemTestPanelContent,
  type LeftTab,
  type RightTab,
  type SolutionTier,
  type UserSubmission,
} from "@/components/codingDetail";

export default function CodingDetail() {
  const { problemId } = useParams<{ problemId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isComplete, markComplete } = useProgressContext();
  const { isBookmarked, toggleBookmark } = useBookmarkContext();

  const { data: allProblemsData } = useApiQuery<CodingProblem[]>(() => codingApi.getAll());
  const allProblems: CodingProblem[] = useMemo(() => allProblemsData ?? [], [allProblemsData]);

  const {
    data: fetchedProblem,
    loading: problemLoading,
  } = useApiQuery<CodingProblem | undefined>(
    () => codingApi.getById(problemId || ""),
    [problemId]
  );
  const problem: CodingProblem | undefined = fetchedProblem ?? undefined;

  const currentIndex = useMemo(() => {
    if (!problem) return -1;
    return allProblems.findIndex((p) => p.id === problem.id);
  }, [problem, allProblems]);

  const prevProblem =
    currentIndex > 0 ? (allProblems[currentIndex - 1] ?? null) : null;
  const nextProblem =
    currentIndex >= 0 && currentIndex < allProblems.length - 1
      ? (allProblems[currentIndex + 1] ?? null)
      : null;

  const isHtmlCss = useMemo(
    () => (problem ? isHtmlCssProblem(problem) : false),
    [problem],
  );

  const defaultStarterCode = useMemo(() => {
    if (!problem) return "";
    return generateStarterCode(problem);
  }, [problem]);

  const tabParam = searchParams.get("tab") as LeftTab | null;
  const [localLeftTab, setLocalLeftTab] = useState<LeftTab>("description");
  const leftTab =
    tabParam && ["description", "editorial", "solutions", "submissions"].includes(tabParam)
      ? tabParam
      : localLeftTab;

  const setLeftTab = (tab: LeftTab) => {
    setLocalLeftTab(tab);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", tab);
        return next;
      },
      { replace: true },
    );
  };

  const [prevProblemId, setPrevProblemId] = useState(problem?.id);
  const [userCode, setUserCode] = useState<string>(() => {
    if (!problem) return "";
    return getStorageCode(problem.id, defaultStarterCode);
  });

  const [selectedLang, setSelectedLang] = useState<
    "javascript" | "typescript" | "html"
  >(() => (isHtmlCss ? "html" : "javascript"));

  const [submissions, setSubmissions] = useState<UserSubmission[]>(() => {
    if (!problem) return [];
    return getStorageSubmissions(problem.id);
  });

  if (problem?.id !== prevProblemId) {
    setPrevProblemId(problem?.id);
    if (problem) {
      setUserCode(getStorageCode(problem.id, defaultStarterCode));
      setSelectedLang(isHtmlCss ? "html" : "javascript");
      setSubmissions(getStorageSubmissions(problem.id));
    }
  }

  const [editorTheme, setEditorTheme] = useState<string>(() => {
    return (
      localStorage.getItem(STORAGE_KEYS.EDITOR_THEME) || DEFAULT_EDITOR_THEME
    );
  });

  const [rightTab, setRightTab] = useState<RightTab>("testcase");
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState(0);
  const [selectedSolutionTier, setSelectedSolutionTier] =
    useState<SolutionTier>("expert");
  const [evaluationResult, setEvaluationResult] =
    useState<ProblemEvaluationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const [horizontalSplit, setHorizontalSplit] = useState(50);
  const [verticalSplit, setVerticalSplit] = useState(60);
  const isDraggingH = useRef(false);
  const isDraggingV = useRef(false);
  const splitContainerRef = useRef<HTMLDivElement | null>(null);
  const rightPaneRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorChange = (val: string | undefined) => {
    const code = val || "";
    setUserCode(code);
    if (problem) {
      saveStorageCode(problem.id, code);
    }
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    registerMonacoThemes(monaco);
  };

  const handleResetCode = () => {
    if (window.confirm("Reset code to starter template?")) {
      setUserCode(defaultStarterCode);
      if (problem) {
        removeStorageCode(problem.id);
      }
    }
  };

  const loadSolutionIntoEditor = (code: string) => {
    setUserCode(code);
    if (problem) {
      saveStorageCode(problem.id, code);
    }
  };

  const runCode = useCallback(() => {
    if (!problem) return;
    setIsRunning(true);

    if (isHtmlCss) {
      setRightTab("preview");
      setIsRunning(false);
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
        saveStorageSubmissions(problem.id, updated);
      }
      return;
    }

    setRightTab("result");

    setTimeout(() => {
      const result = evaluateProblem(userCode, problem.examples);
      setEvaluationResult(result);
      setIsRunning(false);

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
      saveStorageSubmissions(problem.id, updated);

      if (result.status === "accepted") {
        markComplete(problem.id, "coding");
      }
    }, 60);
  }, [problem, userCode, submissions, markComplete, isHtmlCss]);

  const handleSubmit = useCallback(() => {
    runCode();
  }, [runCode]);

  const passCount = submissions.filter((s) => s.status === "accepted").length;
  const failCount = submissions.filter((s) => s.status !== "accepted").length;

  const onHDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingH.current = true;
    document.body.style.userSelect = "none";
    const isRow = window.innerWidth >= 900;
    document.body.style.cursor = isRow ? "col-resize" : "row-resize";

    const onMove = (x: number, y: number) => {
      if (!isDraggingH.current || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const currentIsRow = window.innerWidth >= 900;
      const pct = currentIsRow
        ? ((x - rect.left) / rect.width) * 100
        : ((y - rect.top) / rect.height) * 100;
      setHorizontalSplit(Math.max(15, Math.min(85, pct)));
    };

    const handleMouseMove = (ev: MouseEvent) => {
      ev.preventDefault();
      onMove(ev.clientX, ev.clientY);
    };

    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (touch) onMove(touch.clientX, touch.clientY);
    };

    const onUp = () => {
      isDraggingH.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", onUp);
  }, []);

  const onHTouchStart = useCallback(() => {
    isDraggingH.current = true;
    document.body.style.userSelect = "none";

    const onMove = (x: number, y: number) => {
      if (!isDraggingH.current || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const currentIsRow = window.innerWidth >= 900;
      const pct = currentIsRow
        ? ((x - rect.left) / rect.width) * 100
        : ((y - rect.top) / rect.height) * 100;
      setHorizontalSplit(Math.max(15, Math.min(85, pct)));
    };

    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (touch) onMove(touch.clientX, touch.clientY);
    };

    const onUp = () => {
      isDraggingH.current = false;
      document.body.style.userSelect = "";
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", onUp);
  }, []);

  const onVDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingV.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    const onMove = (y: number) => {
      if (!isDraggingV.current || !rightPaneRef.current) return;
      const rect = rightPaneRef.current.getBoundingClientRect();
      const pct = ((y - rect.top) / rect.height) * 100;
      setVerticalSplit(Math.max(15, Math.min(85, pct)));
    };

    const handleMouseMove = (ev: MouseEvent) => {
      ev.preventDefault();
      onMove(ev.clientY);
    };

    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (touch) onMove(touch.clientY);
    };

    const onUp = () => {
      isDraggingV.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", onUp);
  }, []);

  const onVTouchStart = useCallback(() => {
    isDraggingV.current = true;
    document.body.style.userSelect = "none";

    const onMove = (y: number) => {
      if (!isDraggingV.current || !rightPaneRef.current) return;
      const rect = rightPaneRef.current.getBoundingClientRect();
      const pct = ((y - rect.top) / rect.height) * 100;
      setVerticalSplit(Math.max(15, Math.min(85, pct)));
    };

    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (touch) onMove(touch.clientY);
    };

    const onUp = () => {
      isDraggingV.current = false;
      document.body.style.userSelect = "";
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", onUp);
  }, []);

  const pickRandom = () => {
    if (allProblems.length === 0) return;
    const randomIdx = Math.floor(Math.random() * allProblems.length);
    const chosen = allProblems[randomIdx];
    if (chosen) navigate(ROUTES.CODING_DETAIL(chosen.id));
  };

  if (problemLoading) {
    return <PageSkeleton variant="problem" />;
  }

  if (!problem) {
    return (
      <div className={styles.emptyPage}>
        <EmptyState
          icon="📭"
          title="Problem not found"
          description="The problem you are looking for doesn't exist."
          actionLabel="Return to Problem List"
          onAction={() => navigate(ROUTES.CODING)}
        />
      </div>
    );
  }

  const completed = isComplete(problem.id, "coding");
  const bookmarked = isBookmarked(problem.id);

  return (
    <div className={styles.workspaceContainer}>
      {/* 1. Top Coding Workspace Navigation Bar */}
      <CodingDetailHeader
        problem={problem}
        prevProblem={prevProblem}
        nextProblem={nextProblem}
        isRunning={isRunning}
        isHtmlCss={isHtmlCss}
        completed={completed}
        bookmarked={bookmarked}
        passCount={passCount}
        failCount={failCount}
        hasSubmissions={submissions.length > 0}
        onRun={runCode}
        onSubmit={handleSubmit}
        onPrev={() =>
          prevProblem && navigate(ROUTES.CODING_DETAIL(prevProblem.id))
        }
        onNext={() =>
          nextProblem && navigate(ROUTES.CODING_DETAIL(nextProblem.id))
        }
        onRandom={pickRandom}
        onToggleBookmark={() => toggleBookmark(problem.id)}
      />

      {/* 2. Split-Pane Workspace */}
      <div className={styles.splitWorkspace} ref={splitContainerRef}>
        {/* LEFT PANE */}
        <div
          className={styles.leftPane}
          style={{ flex: `0 0 ${horizontalSplit}%` }}
        >
          <div className={styles.paneTabs}>
            <button
              type="button"
              className={`${styles.paneTab} ${leftTab === "description" ? styles.paneTabActive : ""}`}
              onClick={() => setLeftTab("description")}
            >
              <FileText size={13} />
              <span>Description</span>
            </button>
            <button
              type="button"
              className={`${styles.paneTab} ${leftTab === "editorial" ? styles.paneTabActive : ""}`}
              onClick={() => setLeftTab("editorial")}
            >
              <BookOpen size={13} />
              <span>Editorial</span>
            </button>
            <button
              type="button"
              className={`${styles.paneTab} ${leftTab === "solutions" ? styles.paneTabActive : ""}`}
              onClick={() => setLeftTab("solutions")}
            >
              <Lightbulb size={13} />
              <span>Solutions</span>
            </button>
            <button
              type="button"
              className={`${styles.paneTab} ${leftTab === "submissions" ? styles.paneTabActive : ""}`}
              onClick={() => setLeftTab("submissions")}
            >
              <History size={13} />
              <span>Submissions ({submissions.length})</span>
            </button>
          </div>

          <div className={styles.leftPaneBody}>
            {leftTab === "description" && (
              <ProblemDescriptionTab
                problem={problem}
                currentIndex={currentIndex}
                completed={completed}
                difficultyVariant={difficultyVariant}
              />
            )}

            {leftTab === "editorial" && (
              <ProblemEditorialTab problem={problem} />
            )}

            {leftTab === "solutions" && (
              <ProblemSolutionsTab
                problem={problem}
                selectedTier={selectedSolutionTier}
                isHtmlCss={isHtmlCss}
                onSelectTier={setSelectedSolutionTier}
                onLoadSolution={loadSolutionIntoEditor}
              />
            )}

            {leftTab === "submissions" && (
              <ProblemSubmissionsTab submissions={submissions} />
            )}
          </div>
        </div>

        {/* Draggable Splitter 1 */}
        <div
          className={styles.hDragHandle}
          onMouseDown={onHDragStart}
          onTouchStart={onHTouchStart}
          title="Drag to resize panes"
          role="separator"
        />

        {/* RIGHT PANE */}
        <div
          className={styles.rightPane}
          ref={rightPaneRef}
          style={{ flex: `0 0 ${100 - horizontalSplit}%` }}
        >
          {/* Monaco Code Editor */}
          <div
            className={styles.editorBox}
            style={{ flex: `0 0 ${verticalSplit}%` }}
          >
            <ProblemEditorHeader
              isHtmlCss={isHtmlCss}
              selectedLang={selectedLang}
              editorTheme={editorTheme}
              onSelectLang={setSelectedLang}
              onSelectTheme={(theme) => {
                setEditorTheme(theme);
                localStorage.setItem(STORAGE_KEYS.EDITOR_THEME, theme);
              }}
              onResetCode={handleResetCode}
            />

            <div className={styles.monacoWrapper}>
              <Editor
                height="100%"
                language={selectedLang}
                theme={editorTheme}
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

          {/* Vertical Drag Handle */}
          <div
            className={styles.vDragHandle}
            onMouseDown={onVDragStart}
            onTouchStart={onVTouchStart}
            title="Drag to resize editor and test panel"
            role="separator"
          />

          {/* Testcase & Test Result / Preview Bottom Panel */}
          <div
            className={styles.testPanel}
            style={{ flex: `0 0 ${100 - verticalSplit}%` }}
          >
            <ProblemTestPanel
              rightTab={rightTab}
              isHtmlCss={isHtmlCss}
              evaluationResult={evaluationResult}
              onSelectTab={setRightTab}
            />

            <div className={styles.testPanelBody}>
              <ProblemTestPanelContent
                problem={problem}
                rightTab={rightTab}
                isHtmlCss={isHtmlCss}
                userCode={userCode}
                activeTestCaseIdx={activeTestCaseIdx}
                isRunning={isRunning}
                evaluationResult={evaluationResult}
                onSelectTestCase={setActiveTestCaseIdx}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
