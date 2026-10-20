import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowLeft,
  ArrowRight,
  Code2,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  PlayCircle,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { getSprintDay } from "@/data/interviewSprint";
import { useInterviewSprintProgress } from "@/hooks/useInterviewSprintProgress";
import { CodeBlock } from "@/components/code/CodeBlock";
import { SprintQuiz } from "@/components/interviewSprint/SprintQuiz";
import { EmptyState } from "@/components/common/EmptyState";
import styles from "./InterviewSprintLesson.module.css";

export default function InterviewSprintLesson() {
  const { dayNumber } = useParams<{ dayNumber: string }>();
  const navigate = useNavigate();
  const {
    getDayProgress,
    toggleDayCompletion,
    toggleDayRevision,
    recordQuizScore,
    recordExerciseAttempt,
  } = useInterviewSprintProgress();

  // Parse dayNumber (supports "1", "day-1", "day1")
  const dayIndex = useMemo(() => {
    if (!dayNumber) return 1;
    const match = dayNumber.match(/\d+/);
    return match ? parseInt(match[0], 10) : 1;
  }, [dayNumber]);

  const lesson = useMemo(() => getSprintDay(dayIndex), [dayIndex]);
  const progress = getDayProgress(dayIndex);

  // Collapsible interview questions state (all collapsed by default per requirements)
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Scroll to top when day changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [dayIndex]);

  if (!lesson) {
    return (
      <div className={styles.pageContainer}>
        <EmptyState
          icon="📚"
          title="Lesson Not Found"
          description={`Sprint day ${dayNumber} does not exist. Please select a valid day between 1 and 7.`}
          actionLabel="View Sprint Roadmap"
          onAction={() => navigate("/roadmap")}
        />
      </div>
    );
  }

  const prevDay = dayIndex > 1 ? dayIndex - 1 : null;
  const nextDay = dayIndex < 7 ? dayIndex + 1 : null;

  return (
    <div className={styles.pageContainer}>
      {/* ── Top Navigation Bar & Breadcrumb ── */}
      <nav className={styles.topNav} aria-label="Lesson Breadcrumb">
        <div className={styles.breadcrumb}>
          <Link to="/roadmap" className={styles.crumbLink}>
            Roadmap
          </Link>
          <span className={styles.crumbSep}>/</span>
          <Link to="/interview-sprint" className={styles.crumbLink}>
            7-Day Sprint
          </Link>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbActive}>Day {lesson.day}</span>
        </div>

        <div className={styles.actionButtons}>
          <button
            type="button"
            className={`${styles.revisionBtn} ${progress.needsRevision ? styles.revisionActive : ""}`}
            onClick={() => toggleDayRevision(lesson.day)}
            title="Mark this topic to review later in your weak areas queue"
          >
            <Bookmark size={16} />
            <span>{progress.needsRevision ? "Marked for Revision" : "Mark for Revision"}</span>
          </button>

          <button
            type="button"
            className={`${styles.completeBtn} ${progress.completed ? styles.completeActive : ""}`}
            onClick={() => toggleDayCompletion(lesson.day)}
          >
            <CheckCircle2 size={16} />
            <span>{progress.completed ? "Completed" : "Mark Complete"}</span>
          </button>
        </div>
      </nav>

      {/* ── Main Lesson Header ── */}
      <header className={styles.heroHeader}>
        <div className={styles.dayIndicator}>
          <span>DAY {lesson.day} OF 7</span>
          <span className={styles.timeTag}>
            <Clock size={13} /> {lesson.estimatedMinutes} mins
          </span>
        </div>
        <h1 className={styles.heroTitle}>{lesson.title}</h1>
        <p className={styles.heroTagline}>{lesson.tagline}</p>

        {/* ── Learning Objectives Box ── */}
        <div className={styles.objectivesCard}>
          <h2 className={styles.objectivesHeading}>
            <Lightbulb size={18} className={styles.objectiveIcon} />
            Key Learning Objectives
          </h2>
          <ul className={styles.objectivesList}>
            {lesson.objectives.map((obj, i) => (
              <li key={i} className={styles.objectiveItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* ── Lesson Body ── */}
      <main className={styles.lessonContent}>
        {/* Beginner Overview */}
        <section className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>
            <BookOpen size={20} className={styles.sectionIcon} />
            Conceptual Overview
          </h2>
          <div className={styles.beginnerCard}>
            <p className={styles.prose}>{lesson.beginnerOverview}</p>
          </div>
        </section>

        {/* Deep Technical Explanation */}
        <section className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>
            <Sparkles size={20} className={styles.sectionIcon} />
            Advanced Technical Architecture
          </h2>
          <div className={styles.deepDiveCard}>
            <p className={styles.prose}>{lesson.deepDiveExplanation}</p>
          </div>
        </section>

        {/* Core Sections with Code */}
        {lesson.sections.map((section) => (
          <section key={section.id} className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>{section.heading}</h2>
            <div className={styles.sectionBody}>
              <div className={styles.proseWrapper}>
                {section.content.split("\n\n").map((para, i) => (
                  <p key={i} className={styles.prose}>
                    {para}
                  </p>
                ))}
              </div>

              {section.codeExample && (
                <div className={styles.codeWrapper}>
                  {section.codeExample.caption && (
                    <div className={styles.codeCaption}>
                      {section.codeExample.caption}
                    </div>
                  )}
                  <CodeBlock
                    code={section.codeExample.code}
                    language={section.codeExample.language}
                    showLineNumbers
                  />
                </div>
              )}

              {section.expectedOutput && (
                <div className={styles.outputBox}>
                  <div className={styles.outputLabel}>Expected Behavior / Output:</div>
                  <div className={styles.outputText}>{section.expectedOutput}</div>
                </div>
              )}

              {section.keyTakeaway && (
                <div className={styles.takeawayBox}>
                  <strong>Key Takeaway:</strong> {section.keyTakeaway}
                </div>
              )}
            </div>
          </section>
        ))}

        {/* Common Misconceptions & Interview Traps */}
        {lesson.misconceptions && lesson.misconceptions.length > 0 && (
          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>
              <AlertTriangle size={20} className={styles.warningIcon} />
              Common Misconceptions & Architectural Pitfalls
            </h2>
            <div className={styles.misconceptionsGrid}>
              {lesson.misconceptions.map((item, i) => (
                <div key={i} className={styles.mythCard}>
                  <div className={styles.mythHeader}>
                    <span className={styles.mythTag}>❌ Misconception</span>
                  </div>
                  <p className={styles.mythText}>{item.myth}</p>
                  <div className={styles.realityHeader}>
                    <span className={styles.realityTag}>✅ Architectural Best Practice</span>
                  </div>
                  <p className={styles.realityText}>{item.reality}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Real-World Production Scenario */}
        {lesson.realWorldScenario && (
          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>
              <Code2 size={20} className={styles.sectionIcon} />
              Real-World Production Case Study
            </h2>
            <div className={styles.scenarioCard}>
              <h3 className={styles.scenarioTitle}>
                {lesson.realWorldScenario.title}
              </h3>
              <div className={styles.scenarioBlock}>
                <strong>The Production Problem:</strong>
                <p className={styles.scenarioText}>{lesson.realWorldScenario.problem}</p>
              </div>
              <div className={styles.scenarioBlock}>
                <strong>Architectural Solution:</strong>
                <p className={styles.scenarioText}>{lesson.realWorldScenario.solution}</p>
              </div>
            </div>
          </section>
        )}

        {/* ── 3 to 5 Collapsible Questions ── */}
        <section className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>
            <HelpCircle size={20} className={styles.sectionIcon} />
            Essential Architectural & Conceptual Questions
          </h2>
          <p className={styles.sectionSubtext}>
            Test yourself before revealing the in-depth architectural responses and key pitfalls.
          </p>

          <div className={styles.questionsAccordion}>
            {lesson.questions.map((q, idx) => {
              const isExpanded = Boolean(expandedQuestions[q.id]);
              return (
                <div key={q.id} className={styles.questionItem}>
                  <button
                    type="button"
                    className={styles.questionButton}
                    onClick={() => toggleQuestion(q.id)}
                    aria-expanded={isExpanded}
                  >
                    <div className={styles.questionTitleGroup}>
                      <span className={styles.qNum}>Q{idx + 1}.</span>
                      <span className={styles.qTitleText}>{q.question}</span>
                      <span className={`${styles.diffTag} ${styles[`diff_${q.difficulty}`]}`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <span className={styles.chevron}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className={styles.answerDrawer}>
                      <div className={styles.answerText}>
                        <strong>Strong Answer:</strong>
                        <p>{q.answer}</p>
                      </div>
                      <div className={styles.reasoningBox}>
                        <strong>Engineering Rationale:</strong> {q.explanation}
                      </div>
                      {q.interviewTrap && (
                        <div className={styles.trapBox}>
                          <strong>⚠️ Pitfall to Avoid:</strong> {q.interviewTrap}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Day Knowledge Quiz ── */}
        <section className={styles.contentSection}>
          <SprintQuiz
            day={lesson.day}
            questions={lesson.quiz}
            savedScore={progress.quizScore}
            savedAnswers={progress.quizAnswered}
            onScoreSave={(score, answers) => recordQuizScore(lesson.day, score, answers)}
          />
        </section>

        {/* ── Hands-On Coding Exercise ── */}
        <section className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>
            <PlayCircle size={20} className={styles.sectionIcon} />
            Hands-On Coding Challenge
          </h2>
          <div className={styles.exerciseCard}>
            <div className={styles.exerciseHeader}>
              <div>
                <span className={styles.exerciseTrackTag}>
                  {lesson.exercise.track.toUpperCase()} CHALLENGE
                </span>
                <h3 className={styles.exerciseTitle}>{lesson.exercise.title}</h3>
              </div>
              <Link
                to={lesson.exercise.url}
                className={styles.launchBtn}
                onClick={() => recordExerciseAttempt(lesson.day)}
              >
                <span>Open in Workspace</span>
                <ExternalLink size={15} />
              </Link>
            </div>

            <p className={styles.exerciseDesc}>{lesson.exercise.description}</p>

            <div className={styles.outcomeBox}>
              <strong>Expected Outcome:</strong> {lesson.exercise.expectedOutcome}
            </div>

            {lesson.exercise.complexityTip && (
              <div className={styles.tipBox}>
                <strong>Complexity & Boundary Tip:</strong> {lesson.exercise.complexityTip}
              </div>
            )}

            {lesson.exercise.starterSnippet && (
              <div className={styles.starterCodeSection}>
                <div className={styles.starterCodeHeader}>Starter Implementation Reference:</div>
                <CodeBlock
                  code={lesson.exercise.starterSnippet}
                  language="tsx"
                  showLineNumbers
                />
              </div>
            )}

            {lesson.exercise.hints && lesson.exercise.hints.length > 0 && (
              <div className={styles.hintsSection}>
                <details className={styles.hintsDetails}>
                  <summary className={styles.hintsSummary}>
                    💡 Need a hint? Reveal progressive hints
                  </summary>
                  <ul className={styles.hintsList}>
                    {lesson.exercise.hints.map((hint, hIdx) => (
                      <li key={hIdx}>{hint}</li>
                    ))}
                  </ul>
                </details>
              </div>
            )}
          </div>
        </section>

        {/* Day 7 Timed Assessment CTA */}
        {lesson.day === 7 && (
          <div className={styles.mockCallout}>
            <div className={styles.mockCalloutContent}>
              <h3 className={styles.mockCalloutTitle}>Ready for the Live Simulation?</h3>
              <p className={styles.mockCalloutText}>
                Launch the 45-minute timed capstone assessment covering live coding, system design scenarios, and performance troubleshooting.
              </p>
            </div>
            <Link to="/interview-sprint/mock" className={styles.mockCalloutBtn}>
              Start Timed Assessment →
            </Link>
          </div>
        )}

        {/* ── Footer Navigation (Prev / Next Day) ── */}
        <footer className={styles.lessonFooter}>
          {prevDay ? (
            <Link to={`/interview-sprint/${prevDay}`} className={styles.footerNavBtn}>
              <ArrowLeft size={16} />
              <span>Previous: Day {prevDay}</span>
            </Link>
          ) : (
            <Link to="/interview-sprint" className={styles.footerNavBtn}>
              <ArrowLeft size={16} />
              <span>Sprint Overview</span>
            </Link>
          )}

          {nextDay ? (
            <Link
              to={`/interview-sprint/${nextDay}`}
              className={`${styles.footerNavBtn} ${styles.footerNavNext}`}
            >
              <span>Next: Day {nextDay}</span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <Link
              to="/interview-sprint/mock"
              className={`${styles.footerNavBtn} ${styles.footerNavNext}`}
            >
              <span>Start Capstone Assessment</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </footer>
      </main>
    </div>
  );
}
