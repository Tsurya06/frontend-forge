import { useState } from "react";
import { useBookmarkContext } from "@/context/BookmarkContext";
import { useProgressContext } from "@/context/ProgressContext";
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

interface QuestionCardProps {
  id: string;
  question: string;
  difficulty: Difficulty;
  tags?: string[];
  shortAnswer?: string;
  explanation?: string;
  code?: string;
  codeLanguage?: string;
  commonMistakes?: string[];
  followUps?: string[];
  interviewTips?: string[];
}

export function QuestionCard({
  id,
  question,
  difficulty,
  tags = [],
  shortAnswer,
  explanation,
  code,
  codeLanguage = "javascript",
  commonMistakes,
  followUps,
  interviewTips,
}: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarkContext();
  const { isComplete, markComplete } = useProgressContext();

  const bookmarked = isBookmarked(id);
  const completed = isComplete(id, "question");

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.question}>{question}</h3>
          <div className={styles.meta}>
            <Badge variant={difficultyVariant[difficulty]} size="small">
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
          >
            {bookmarked ? "\u{1F516}" : "\u{1F517}"}
          </button>
          <button
            type="button"
            className={`${styles.iconButton} ${completed ? styles.completed : ""}`}
            onClick={() => markComplete(id, "question")}
            aria-label={completed ? "Completed" : "Mark as complete"}
            disabled={completed}
          >
            {completed ? "\u2713" : "\u25CB"}
          </button>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.revealButton}
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          {expanded ? "Hide Answer" : "Reveal Answer"}
        </button>
      </div>

      <div
        className={`${styles.expandWrapper} ${expanded ? styles.expanded : ""}`}
      >
        <div className={styles.expandInner}>
          <div className={styles.expandContent}>
            {shortAnswer && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Answer</div>
                <p className={styles.answer}>{shortAnswer}</p>
              </div>
            )}

            {explanation && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Explanation</div>
                <p className={styles.explanation}>{explanation}</p>
              </div>
            )}

            {code && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Code Example</div>
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
                <div className={styles.sectionTitle}>Common Mistakes</div>
                <ul className={styles.list}>
                  {commonMistakes.map((mistake) => (
                    <li key={mistake}>{mistake}</li>
                  ))}
                </ul>
              </div>
            )}

            {followUps && followUps.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Follow-up Questions</div>
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
