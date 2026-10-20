import { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, RotateCcw, Award } from "lucide-react";
import type { QuizQuestionItem } from "@/data/interviewSprint/types";
import styles from "./SprintQuiz.module.css";

interface SprintQuizProps {
  day: number;
  questions: QuizQuestionItem[];
  savedScore?: number;
  savedAnswers?: Record<string, string>;
  onScoreSave: (score: number, answersRecord: Record<string, string>) => void;
}

export function SprintQuiz({
  day,
  questions,
  savedScore,
  savedAnswers,
  onScoreSave,
}: SprintQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(
    () => savedAnswers || {}
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => typeof savedScore === "number");
  const [currentScore, setCurrentScore] = useState<number>(() => savedScore || 0);

  const [prevDay, setPrevDay] = useState(day);
  if (prevDay !== day) {
    setPrevDay(day);
    setSelectedAnswers(savedAnswers || {});
    setIsSubmitted(typeof savedScore === "number");
    setCurrentScore(savedScore || 0);
  }

  const handleSelect = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      const correctOption = q.options.find((o) => o.isCorrect);
      if (selected && correctOption && selected === correctOption.id) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    setCurrentScore(score);
    setIsSubmitted(true);
    onScoreSave(score, selectedAnswers);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentScore(0);
  };

  const allAnswered = questions.every((q) => Boolean(selectedAnswers[q.id]));

  return (
    <div className={styles.quizCard}>
      <div className={styles.quizHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.quizBadge}>Day {day} Knowledge Check</div>
          <h3 className={styles.quizTitle}>Interactive Concept Quiz</h3>
        </div>
        {isSubmitted && (
          <div className={styles.scorePill}>
            <Award size={16} className={styles.awardIcon} />
            <span className={styles.scoreText}>
              Score: <strong>{currentScore}%</strong>
            </span>
          </div>
        )}
      </div>

      <div className={styles.questionsList}>
        {questions.map((q, idx) => {
          const selectedOptionId = selectedAnswers[q.id];
          const correctOption = q.options.find((o) => o.isCorrect);
          const isQuestionCorrect = isSubmitted && selectedOptionId === correctOption?.id;

          return (
            <div key={q.id} className={styles.questionBlock}>
              <div className={styles.questionPrompt}>
                <span className={styles.qNumber}>Q{idx + 1}.</span>
                <span className={styles.qText}>{q.question}</span>
              </div>

              <div className={styles.optionsGrid} role="radiogroup" aria-label={`Question ${idx + 1}`}>
                {q.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let optionClass = styles.optionItem;

                  if (isSubmitted) {
                    if (opt.isCorrect) {
                      optionClass = `${styles.optionItem} ${styles.optionCorrect}`;
                    } else if (isSelected && !opt.isCorrect) {
                      optionClass = `${styles.optionItem} ${styles.optionIncorrect}`;
                    }
                  } else if (isSelected) {
                    optionClass = `${styles.optionItem} ${styles.optionSelected}`;
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={isSubmitted}
                      className={optionClass}
                      onClick={() => handleSelect(q.id, opt.id)}
                    >
                      <span className={styles.radioIndicator}>
                        {isSubmitted && opt.isCorrect ? (
                          <CheckCircle2 size={16} className={styles.iconCorrect} />
                        ) : isSubmitted && isSelected && !opt.isCorrect ? (
                          <XCircle size={16} className={styles.iconIncorrect} />
                        ) : (
                          <span className={`${styles.customRadio} ${isSelected ? styles.radioActive : ""}`} />
                        )}
                      </span>
                      <span className={styles.optionText}>{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div
                  className={`${styles.explanationBanner} ${
                    isQuestionCorrect ? styles.bannerCorrect : styles.bannerIncorrect
                  }`}
                >
                  <AlertCircle size={16} className={styles.explanationIcon} />
                  <div>
                    <strong>{isQuestionCorrect ? "Correct!" : "Explanation:"}</strong>{" "}
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.quizFooter}>
        {!isSubmitted ? (
          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            {allAnswered ? "Submit & Check Answers" : `Answer all ${questions.length} questions to submit`}
          </button>
        ) : (
          <button type="button" className={styles.retakeBtn} onClick={handleReset}>
            <RotateCcw size={15} />
            <span>Retake Quiz</span>
          </button>
        )}
      </div>
    </div>
  );
}
