import { useState, useMemo } from "react";
import { useProgressContext } from "@/context/ProgressContext";
import { SearchInput } from "@/components/common/SearchInput";
import { EmptyState } from "@/components/common/EmptyState";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { getTopicsByCategory } from "@/data";
import styles from "./Senior.module.css";

export default function Senior() {
  const { completedQuestions } = useProgressContext();
  const [search, setSearch] = useState("");

  const seniorTopics = useMemo(() => getTopicsByCategory("senior"), []);

  const allSeniorQuestions = useMemo(() => {
    return seniorTopics.flatMap((t) => t.questions);
  }, [seniorTopics]);

  const filtered = useMemo(() => {
    if (!search) return seniorTopics;
    const q = search.toLowerCase();
    return seniorTopics
      .map((topic) => ({
        ...topic,
        questions: topic.questions.filter(
          (question) =>
            question.question.toLowerCase().includes(q) ||
            question.tags.some((tag) => tag.toLowerCase().includes(q)),
        ),
      }))
      .filter((topic) => topic.questions.length > 0);
  }, [seniorTopics, search]);

  const totalDone = allSeniorQuestions.filter((q) =>
    completedQuestions.includes(q.id),
  ).length;

  return (
    <div className={styles.page}>
      <div className={styles.stickyTopBar}>
        <header className={styles.header}>
          <h1 className={styles.title}>Senior & Staff Architecture</h1>
          <p className={styles.subtitle}>
            Architecture, scalability, performance, security, and technical
            leadership
          </p>
        </header>

        <div className={styles.statsBar}>
          <span className={styles.statItem}>
            {seniorTopics.length} topic areas
          </span>
          <span className={styles.statDivider}>•</span>
          <span className={styles.statItem}>
            {allSeniorQuestions.length} deep-dive questions
          </span>
          <span className={styles.statDivider}>•</span>
          <span className={styles.statItem}>{totalDone} completed</span>
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search senior architecture topics & questions..."
          className={styles.search}
        />
      </div>

      <div className={styles.scrollableContent}>
        {filtered.length === 0 ? (
          <EmptyState
            icon="🎯"
            title="No senior questions found"
            description={
              search
                ? "Try adjusting your search"
                : "Senior questions haven't been added yet."
            }
            actionLabel={search ? "Clear search" : undefined}
            onAction={search ? () => setSearch("") : undefined}
          />
        ) : (
          <div className={styles.topicGroups}>
            {filtered.map((topic) => (
              <section key={topic.id} className={styles.topicGroup}>
                <h2 className={styles.topicTitle}>{topic.title}</h2>
                <p className={styles.topicDesc}>{topic.description}</p>
                <div className={styles.questionsList}>
                  {topic.questions.map((q) => (
                    <QuestionCard
                      key={q.id}
                      id={q.id}
                      question={q.question}
                      difficulty={q.difficulty}
                      tags={q.tags}
                      shortAnswer={q.shortAnswer}
                      explanation={q.explanation}
                      code={q.code}
                      codeLanguage={q.language}
                      commonMistakes={q.commonMistakes}
                      followUps={q.followUps}
                      interviewTips={q.interviewTips}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
