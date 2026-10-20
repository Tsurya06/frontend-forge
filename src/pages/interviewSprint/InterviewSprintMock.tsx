import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Award,
  ChevronRight,
  Code2,
  Layers,
  Activity,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useInterviewSprintProgress } from "@/hooks/useInterviewSprintProgress";
import { day7MockScenarios, allSprintDays, type MockScenario } from "@/data/interviewSprint";
import type { MockInterviewResult } from "@/data/interviewSprint/types";
import styles from "./InterviewSprintMock.module.css";

const TOTAL_TIME_SECONDS = 45 * 60; // 45 minutes

interface MockQuestionAnswer {
  scenarioId: string;
  userNotes: string;
  checkedKeyPoints: string[];
}

export default function InterviewSprintMock() {
  const { state, recordMockResult } = useInterviewSprintProgress();

  // Timer state
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [isRunning, setIsRunning] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // User input answers
  const [activeTab, setActiveTab] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, MockQuestionAnswer>>(() => {
    const initial: Record<string, MockQuestionAnswer> = {};
    day7MockScenarios.forEach((sc) => {
      initial[sc.id] = { scenarioId: sc.id, userNotes: "", checkedKeyPoints: [] };
    });
    return initial;
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(
    () => Boolean(state.mockResult)
  );
  const [showKeyPoints, setShowKeyPoints] = useState<Record<string, boolean>>({});

  // Countdown timer logic
  useEffect(() => {
    if (isSubmitted) return;

    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, isSubmitted]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  };

  const handleNotesChange = (scenarioId: string, val: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [scenarioId]: {
        ...(prev[scenarioId] || { scenarioId, checkedKeyPoints: [] }),
        userNotes: val,
      },
    }));
  };

  const handleToggleKeyPoint = (scenarioId: string, point: string) => {
    setAnswers((prev) => {
      const current = prev[scenarioId] || { scenarioId, userNotes: "", checkedKeyPoints: [] };
      const alreadyChecked = current.checkedKeyPoints.includes(point);
      const updated = alreadyChecked
        ? current.checkedKeyPoints.filter((p) => p !== point)
        : [...current.checkedKeyPoints, point];
      return {
        ...prev,
        [scenarioId]: { ...current, checkedKeyPoints: updated },
      };
    });
  };

  const handleSubmit = () => {
    setIsRunning(false);
    setIsSubmitted(true);

    let totalPoints = 0;
    let checkedPoints = 0;
    const weakTopics: string[] = [];

    day7MockScenarios.forEach((sc) => {
      const count = sc.expectedKeyPoints.length;
      totalPoints += count;
      const checked = answers[sc.id]?.checkedKeyPoints.length || 0;
      checkedPoints += checked;

      if (checked < Math.ceil(count * 0.75)) {
        weakTopics.push(sc.title);
      }
    });

    const scorePercentage = Math.round((checkedPoints / totalPoints) * 100);
    const timeSpentSeconds = TOTAL_TIME_SECONDS - timeLeft;

    const result: MockInterviewResult = {
      completedAt: new Date().toISOString(),
      scorePercentage,
      timeSpentSeconds,
      passedCount: checkedPoints,
      totalCount: totalPoints,
      weakTopics,
    };

    recordMockResult(result);
  };

  const handleRetake = () => {
    setTimeLeft(TOTAL_TIME_SECONDS);
    setIsRunning(true);
    setIsSubmitted(false);
    setShowKeyPoints({});
    const fresh: Record<string, MockQuestionAnswer> = {};
    day7MockScenarios.forEach((sc) => {
      fresh[sc.id] = { scenarioId: sc.id, userNotes: "", checkedKeyPoints: [] };
    });
    setAnswers(fresh);
  };

  const currentScenario: MockScenario = (day7MockScenarios[activeTab] ?? day7MockScenarios[0])!;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "system-design":
        return <Layers size={16} />;
      case "performance":
        return <Activity size={16} />;
      case "testing-a11y":
        return <ShieldCheck size={16} />;
      case "tradeoffs":
        return <Briefcase size={16} />;
      default:
        return <Code2 size={16} />;
    }
  };

  return (
    <div className={styles.mockPage}>
      {/* ── Top Bar with Live Timer & Controls ── */}
      <header className={styles.mockHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerBadge}>DAY 7 FINAL CONSOLIDATION</div>
          <h1 className={styles.pageTitle}>Timed Technical Capstone Assessment</h1>
        </div>

        <div className={styles.timerControlBox}>
          <div
            className={`${styles.timerDisplay} ${
              timeLeft < 300 ? styles.timerUrgent : ""
            }`}
          >
            <Timer size={18} className={styles.timerIcon} />
            <span className={styles.timerDigits}>{formatTime(timeLeft)}</span>
          </div>

          {!isSubmitted && (
            <button
              type="button"
              className={styles.playPauseBtn}
              onClick={() => setIsRunning((prev) => !prev)}
              title={isRunning ? "Pause timer" : "Resume timer"}
            >
              {isRunning ? <Pause size={15} /> : <Play size={15} />}
              <span>{isRunning ? "Pause" : "Resume"}</span>
            </button>
          )}

          {!isSubmitted ? (
            <button
              type="button"
              className={styles.submitInterviewBtn}
              onClick={handleSubmit}
            >
              Submit Assessment
            </button>
          ) : (
            <button
              type="button"
              className={styles.retakeBtn}
              onClick={handleRetake}
            >
              <RotateCcw size={15} />
              <span>Retake Assessment</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Score Banner (Shown After Submission) ── */}
      {isSubmitted && state.mockResult && (
        <section className={styles.resultsBanner}>
          <div className={styles.resultsSummary}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreNumber}>
                {state.mockResult.scorePercentage}%
              </span>
              <span className={styles.scoreLabel}>Evaluation</span>
            </div>
            <div className={styles.scoreDetails}>
              <h2 className={styles.resultsHeading}>
                Capstone Assessment Complete!
              </h2>
              <p className={styles.resultsText}>
                Time taken:{" "}
                <strong>
                  {Math.round(state.mockResult.timeSpentSeconds / 60)} minutes
                </strong>{" "}
                · Covered{" "}
                <strong>
                  {state.mockResult.passedCount} of{" "}
                  {state.mockResult.totalCount} core architectural criteria
                </strong>
                .
              </p>
              {state.mockResult.weakTopics.length > 0 ? (
                <div className={styles.weakBadgeBox}>
                  <span>Recommended Revision Areas:</span>
                  <div className={styles.weakPills}>
                    {state.mockResult.weakTopics.map((t, idx) => (
                      <span key={idx} className={styles.weakPill}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.strongPassBadge}>
                  <Award size={16} /> All core architectural pillars satisfied with Strong Hire performance!
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Tabbed Scenarios Workspace ── */}
      <div className={styles.workspaceGrid}>
        {/* Left Side: Scenario Navigator */}
        <aside className={styles.scenarioSidebar}>
          <div className={styles.sidebarTitle}>Assessment Stages</div>
          <div className={styles.stageList}>
            {day7MockScenarios.map((sc, idx) => {
              const isActive = activeTab === idx;
              const hasNotes = Boolean(answers[sc.id]?.userNotes?.trim());
              const checkedCount = answers[sc.id]?.checkedKeyPoints?.length || 0;

              return (
                <button
                  key={sc.id}
                  type="button"
                  className={`${styles.stageTab} ${isActive ? styles.stageTabActive : ""}`}
                  onClick={() => setActiveTab(idx)}
                >
                  <div className={styles.stageIcon}>
                    {getCategoryIcon(sc.category)}
                  </div>
                  <div className={styles.stageMeta}>
                    <span className={styles.stageTitleText}>
                      Stage {idx + 1}: {sc.title.split(":")[0]}
                    </span>
                    <span className={styles.stageStatus}>
                      {isSubmitted ? (
                        `${checkedCount}/${sc.expectedKeyPoints.length} criteria`
                      ) : hasNotes ? (
                        "Drafted"
                      ) : (
                        "Not Started"
                      )}
                    </span>
                  </div>
                  <ChevronRight size={14} className={styles.tabChevron} />
                </button>
              );
            })}

            {/* Quick Link to Day 7 Coding Challenge in Problemset */}
            <div className={styles.codingChallengeBox}>
              <div className={styles.codingBoxTitle}>
                <Code2 size={16} className={styles.codeIcon} />
                Hands-On Coding Challenge
              </div>
              <p className={styles.codingBoxDesc}>
                Complete the timed Debounce utility challenge with test-case runner in the coding workspace.
              </p>
              <Link
                to="/coding/coding-debounce"
                className={styles.openCodingLink}
                target="_blank"
                rel="noreferrer"
              >
                <span>Open Coding Workspace</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </aside>

        {/* Right Side: Active Scenario Detail & Response Area */}
        <main className={styles.scenarioMain}>
          <div className={styles.scenarioCard}>
            <div className={styles.cardTop}>
              <div className={styles.cardCategoryBadge}>
                {currentScenario.category.toUpperCase().replace("-", " ")}
              </div>
              <span className={styles.scenarioDiffBadge}>
                {currentScenario.difficulty.toUpperCase()}
              </span>
            </div>

            <h2 className={styles.scenarioMainTitle}>
              {currentScenario.title}
            </h2>

            <div className={styles.scenarioDescriptionBox}>
              <strong>Scenario Context:</strong>
              <p className={styles.scenarioDescText}>
                {currentScenario.scenario}
              </p>
            </div>

            <div className={styles.scenarioPromptBox}>
              <strong>Scenario Prompt:</strong>
              <p className={styles.scenarioPromptText}>
                {currentScenario.prompt}
              </p>
            </div>

            {/* User Response Note Area */}
            <div className={styles.responseArea}>
              <label htmlFor="user-response" className={styles.responseLabel}>
                Your Architectural Answer & Whiteboard Notes:
              </label>
              <textarea
                id="user-response"
                className={styles.responseTextarea}
                rows={9}
                placeholder="Structure your answer clearly: 1) Clarify constraints, 2) High-level component boundaries, 3) State ownership & data flow, 4) Edge cases & optimizations..."
                value={answers[currentScenario.id]?.userNotes || ""}
                onChange={(e) => handleNotesChange(currentScenario.id, e.target.value)}
                disabled={isSubmitted}
              />
            </div>

            {/* Self-Evaluation / Scoring Checklist */}
            <div className={styles.evaluationSection}>
              <div className={styles.evalHeader}>
                <h3 className={styles.evalTitle}>
                  {isSubmitted
                    ? "Architectural Rubric & Expected Key Points"
                    : "Key Points Checklist (Self-Evaluation)"}
                </h3>
                {!isSubmitted && (
                  <button
                    type="button"
                    className={styles.peekBtn}
                    onClick={() =>
                      setShowKeyPoints((prev) => ({
                        ...prev,
                        [currentScenario.id]: !prev[currentScenario.id],
                      }))
                    }
                  >
                    <HelpCircle size={14} />
                    <span>
                      {showKeyPoints[currentScenario.id]
                        ? "Hide Rubric"
                        : "Reveal Rubric & Criteria"}
                    </span>
                  </button>
                )}
              </div>

              {(isSubmitted || showKeyPoints[currentScenario.id]) && (
                <div className={styles.keyPointsList}>
                  <p className={styles.rubricNotice}>
                    Check off the criteria you addressed in your architectural answer:
                  </p>
                  {currentScenario.expectedKeyPoints.map((point, pIdx) => {
                    const isChecked = (
                      answers[currentScenario.id]?.checkedKeyPoints || []
                    ).includes(point);

                    return (
                      <label
                        key={pIdx}
                        className={`${styles.keyPointItem} ${
                          isChecked ? styles.keyPointChecked : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            handleToggleKeyPoint(currentScenario.id, point)
                          }
                          className={styles.keyPointCheckbox}
                        />
                        <span className={styles.keyPointText}>{point}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Sample Strong Senior Response (Only visible post-submission or on explicit reveal) */}
              {isSubmitted && (
                <div className={styles.sampleAnswerBox}>
                  <div className={styles.sampleAnswerTitle}>
                    <Sparkles size={16} /> Sample Senior-Level Defense:
                  </div>
                  <p className={styles.sampleAnswerText}>
                    {currentScenario.sampleStrongAnswer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ── Final Readiness Consolidation Checklist ── */}
      <section className={styles.checklistSection}>
        <h2 className={styles.checklistHeading}>
          <CheckCircle2 size={22} className={styles.checklistIcon} />
          Final Technical Readiness Checklist
        </h2>
        <p className={styles.checklistSubtext}>
          Review these 7 fundamental competencies to solidify your frontend architecture mastery:
        </p>
        <div className={styles.checklistGrid}>
          {allSprintDays.map((day) => (
            <div key={day.day} className={styles.checkDayCard}>
              <div className={styles.checkDayNum}>Day {day.day}</div>
              <h3 className={styles.checkDayTitle}>{day.title}</h3>
              <ul className={styles.checkObjectives}>
                {day.objectives.slice(0, 2).map((obj, oIdx) => (
                  <li key={oIdx}>{obj}</li>
                ))}
              </ul>
              <Link
                to={`/interview-sprint/${day.day}`}
                className={styles.checkLessonLink}
              >
                Review Lesson →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
