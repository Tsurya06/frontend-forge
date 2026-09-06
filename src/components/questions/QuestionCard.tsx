import { useState, useMemo } from "react";
import {
  Bookmark,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  PenTool,
  Sparkles,
  Check,
} from "lucide-react";
import { useBookmarkContext } from "@/context/BookmarkContext";
import { useProgressContext } from "@/context/ProgressContext";
import { useNotesContext } from "@/context/NotesContext";
import { Badge } from "../common/Badge";
import { CodeBlock } from "../code/CodeBlock";
import styles from "./QuestionCard.module.css";

type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Senior";

const difficultyVariant: Record<
  Difficulty,
  "beginner" | "intermediate" | "advanced" | "senior"
> = {
  Beginner: "beginner",
  Intermediate: "intermediate",
  Advanced: "advanced",
  Senior: "senior",
};

// Common high-frequency SDE2 Frontend technical keywords
const COMMON_SDE2_KEYWORDS = [
  "closure",
  "lexical scope",
  "scope chain",
  "hoisting",
  "temporal dead zone",
  "microtask",
  "macrotask",
  "event loop",
  "call stack",
  "prototype",
  "prototypal inheritance",
  "this",
  "call",
  "apply",
  "bind",
  "arrow function",
  "memory leak",
  "garbage collection",
  "weakmap",
  "weakset",
  "debounce",
  "throttle",
  "promise",
  "async/await",
  "event bubbling",
  "event capturing",
  "event delegation",
  "reflow",
  "repaint",
  "layout thrashing",
  "virtual dom",
  "reconciliation",
  "web worker",
  "service worker",
  "cors",
  "xss",
  "csrf",
  "lcp",
  "inp",
  "cls",
  "hydration",
  "ssr",
  "immutable",
  "pure function",
];

interface QuestionCardProps {
  readonly id: string;
  readonly question: string;
  readonly difficulty: Difficulty;
  readonly tags: readonly string[] | string[];
  readonly shortAnswer?: string;
  readonly explanation?: string;
  readonly code?: string;
  readonly codeLanguage?: string;
  readonly commonMistakes?: readonly string[] | string[];
  readonly followUps?: readonly string[] | string[];
  readonly interviewTips?: readonly string[] | string[];
}

export function QuestionCard({
  id,
  question,
  difficulty,
  tags,
  shortAnswer,
  explanation,
  code,
  codeLanguage = "javascript",
  commonMistakes,
  followUps,
  interviewTips,
}: Readonly<QuestionCardProps>) {
  const [expanded, setExpanded] = useState(false);
  const [showRehearsal, setShowRehearsal] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarkContext();
  const { isComplete, markComplete } = useProgressContext();
  const { getNote, setNote } = useNotesContext();

  const userDraft = getNote(id);

  const bookmarked = isBookmarked(id);
  const completed = isComplete(id, "question");

  // Derive relevant rubric keywords for this specific question
  const rubricKeywords = useMemo(() => {
    const combinedSource = `${tags.join(" ")} ${question} ${shortAnswer || ""} ${explanation || ""}`.toLowerCase();
    const matches = new Set<string>();

    // 1. Add tags directly if they match technical terms
    for (const tag of tags) {
      if (tag.length > 2) matches.add(tag.toLowerCase());
    }

    // 2. Add matched high-frequency SDE2 keywords
    for (const kw of COMMON_SDE2_KEYWORDS) {
      if (combinedSource.includes(kw)) {
        matches.add(kw);
      }
    }

    return Array.from(matches).slice(0, 5);
  }, [tags, question, shortAnswer, explanation]);

  // Compute coverage of keywords in user's typed draft
  const coverage = useMemo(() => {
    if (!userDraft || rubricKeywords.length === 0) return { covered: 0, total: rubricKeywords.length, percent: 0 };
    const draftLower = userDraft.toLowerCase();
    const covered = rubricKeywords.filter((kw) => draftLower.includes(kw)).length;
    return {
      covered,
      total: rubricKeywords.length,
      percent: Math.round((covered / rubricKeywords.length) * 100),
    };
  }, [userDraft, rubricKeywords]);

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h3 className={styles.question}>{question}</h3>
          <div className={styles.meta}>
            <Badge
              variant={difficultyVariant[difficulty]}
              size="small"
              className={styles.difficultyBadge}
            >
              {difficulty}
            </Badge>
            {tags.map((tag) => (
              <Badge key={tag} variant="tag" size="small">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={`${styles.iconButton} ${bookmarked ? styles.bookmarked : ""}`}
            onClick={() => toggleBookmark(id)}
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            title={bookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Bookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            className={`${styles.iconButton} ${completed ? styles.completed : ""}`}
            onClick={() => markComplete(id, "question")}
            aria-label={completed ? "Completed" : "Mark as complete"}
            title={completed ? "Completed" : "Mark as complete"}
            disabled={completed}
          >
            {completed ? <CheckCircle2 size={15} /> : <Circle size={15} />}
          </button>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.rehearsalBtn} ${showRehearsal ? styles.active : ""}`}
          onClick={() => setShowRehearsal((prev) => !prev)}
        >
          <PenTool size={13} />
          <span>{userDraft ? "Your Answer / Notes" : "Write Your Answer First"}</span>
        </button>

        <button
          type="button"
          className={styles.revealButton}
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          <span>{expanded ? "Hide Answer" : "Reveal Answer"}</span>
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {showRehearsal && (
        <div className={styles.rehearsalBox}>
          <div className={styles.rehearsalHeader}>
            <div className={styles.rehearsalTitle}>
              <Sparkles size={13} /> SDE2 Answer Rehearsal
            </div>
            {rubricKeywords.length > 0 && userDraft.trim().length > 0 && (
              <div className={styles.rehearsalScore}>
                Coverage: {coverage.covered}/{coverage.total} concepts ({coverage.percent}%)
              </div>
            )}
          </div>

          <textarea
            className={styles.rehearsalTextarea}
            placeholder="Type your explanation or key talking points as you would in a live interview before checking the model answer..."
            value={userDraft}
            onChange={(e) => setNote(id, e.target.value)}
          />

          {rubricKeywords.length > 0 && (
            <div className={styles.rubricSection}>
              <div className={styles.rubricLabel}>SDE2 Key Concepts to Hit:</div>
              <div className={styles.rubricPills}>
                {rubricKeywords.map((kw) => {
                  const isHit = userDraft.toLowerCase().includes(kw);
                  return (
                    <span
                      key={kw}
                      className={`${styles.rubricPill} ${isHit ? styles.covered : styles.missing}`}
                    >
                      {isHit ? <Check size={11} /> : "○"} {kw}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div
        className={`${styles.expandWrapper} ${expanded ? styles.expanded : ""}`}
      >
        <div className={styles.expandInner}>
          <div className={styles.expandContent}>
            {shortAnswer && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Model SDE2 Answer</div>
                <p className={styles.answer}>{shortAnswer}</p>
              </div>
            )}

            {explanation && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>In-Depth Architecture & Mechanics</div>
                <p className={styles.explanation}>{explanation}</p>
              </div>
            )}

            {code && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Executable Code & Sandbox</div>
                <div className={styles.codeWrapper}>
                  <CodeBlock
                    code={code}
                    language={codeLanguage}
                    showLineNumbers
                  />
                </div>
              </div>
            )}

            {commonMistakes && commonMistakes.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Interview Pitfalls & Common Mistakes</div>
                <ul className={styles.list}>
                  {commonMistakes.map((mistake) => (
                    <li key={mistake}>{mistake}</li>
                  ))}
                </ul>
              </div>
            )}

            {followUps && followUps.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Interviewer Follow-up Questions</div>
                <ul className={styles.list}>
                  {followUps.map((followUp) => (
                    <li key={followUp}>{followUp}</li>
                  ))}
                </ul>
              </div>
            )}

            {interviewTips && interviewTips.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>
                  Engineering Insights & Best Practices
                </div>
                {interviewTips.map((tip) => (
                  <div key={tip} className={styles.tipBadge}>
                    {"\u{1F4A1}"} {tip}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
