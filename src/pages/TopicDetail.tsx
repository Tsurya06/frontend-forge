import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useProgressContext } from "@/context/ProgressContext";
import { Badge } from "@/components/common/Badge";
import { Tabs } from "@/components/common/Tabs";
import { ProgressBar } from "@/components/common/ProgressBar";
import { EmptyState } from "@/components/common/EmptyState";
import { CodeBlock } from "@/components/code/CodeBlock";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { getTopicById, allTopics, categories } from "@/data";
import type { Difficulty, Topic } from "@/types";
import styles from "./TopicDetail.module.css";

const difficultyVariant: Record<
  Difficulty,
  "beginner" | "intermediate" | "advanced" | "senior"
> = {
  Beginner: "beginner",
  Intermediate: "intermediate",
  Advanced: "advanced",
  Senior: "senior",
};

export default function TopicDetail() {
  const { topicId } = useParams<{ topicId: string }>();
  const { completedQuestions, addRecentlyViewed } = useProgressContext();

  const topic = useMemo(() => {
    if (!topicId) return undefined;
    const t = getTopicById(topicId);
    if (t) addRecentlyViewed(topicId);
    return t;
  }, [topicId, addRecentlyViewed]);

  const progress = useMemo(() => {
    if (!topic) return 0;
    const done = topic.questions.filter((q) =>
      completedQuestions.includes(q.id),
    ).length;
    return topic.questions.length > 0
      ? Math.round((done / topic.questions.length) * 100)
      : 0;
  }, [topic, completedQuestions]);

  const relatedTopics = useMemo(() => {
    if (!topic) return [];
    const map = new Map<string, Topic>();

    // 1. Add explicit related topics (resolving and deduplicating by ID)
    if (topic.relatedTopicIds && topic.relatedTopicIds.length > 0) {
      for (const id of topic.relatedTopicIds) {
        const found = getTopicById(id);
        if (found && found.id !== topic.id) {
          map.set(found.id, found);
        }
      }
    }

    // 2. Supplement with unique related topics from same category or tags
    for (const t of allTopics) {
      if (map.size >= 4) break;
      if (t.id !== topic.id && !map.has(t.id)) {
        if (
          t.category.toLowerCase() === topic.category.toLowerCase() ||
          t.tags.some((tag) => topic.tags.includes(tag))
        ) {
          map.set(t.id, t);
        }
      }
    }

    return Array.from(map.values()).slice(0, 4);
  }, [topic]);

  const codeExamples = useMemo(() => {
    if (!topic) return [];
    if (topic.codeExamples && topic.codeExamples.length > 0) {
      return topic.codeExamples;
    }
    // Extract code examples from questions
    return topic.questions
      .filter((q) => Boolean(q.code))
      .map((q) => ({
        title: q.question,
        language: q.language || "javascript",
        code: q.code!,
        explanation: q.shortAnswer || q.explanation,
      }));
  }, [topic]);

  const cat = categories.find((c) => c.id === topic?.category);

  if (!topic) {
    return (
      <div className={styles.page}>
        <EmptyState
          icon="📭"
          title="Topic not found"
          description="The topic you're looking for doesn't exist."
          actionLabel="Browse Topics"
          onAction={() => window.location.assign("/topics")}
        />
      </div>
    );
  }

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className={styles.tabContent}>
          {topic.overview && (
            <div className={styles.overviewCard}>
              <p className={styles.overviewText}>{topic.overview}</p>
            </div>
          )}
          {topic.concepts && topic.concepts.length > 0 && (
            <div className={styles.conceptsSection}>
              <div className={styles.conceptsHeader}>
                <span className={styles.conceptsIcon}>💡</span>
                <h3 className={styles.conceptsTitle}>
                  Key Concepts & Mastery Points
                </h3>
                <span className={styles.conceptsCount}>
                  {topic.concepts.length} concepts
                </span>
              </div>
              <div className={styles.conceptsGrid}>
                {topic.concepts.map((concept, i) => (
                  <div key={i} className={styles.conceptCard}>
                    <span className={styles.conceptCheck}>✓</span>
                    <span className={styles.conceptText}>{concept}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!topic.overview &&
            (!topic.concepts || topic.concepts.length === 0) && (
              <EmptyState
                icon="📝"
                title="No overview available"
                description="This topic doesn't have an overview yet."
              />
            )}
        </div>
      ),
    },
    {
      id: "questions",
      label: `Deep-Dive QA (${topic.questions.length})`,
      content: (
        <div className={styles.tabContent}>
          {topic.questions.length > 0 ? (
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
          ) : (
            <EmptyState
              icon="❓"
              title="No questions yet"
              description="Questions for this topic haven't been added."
            />
          )}
        </div>
      ),
    },
    {
      id: "code",
      label: `Code Examples (${codeExamples.length})`,
      content: (
        <div className={styles.tabContent}>
          {codeExamples.length > 0 ? (
            <div className={styles.codeExamples}>
              {codeExamples.map((example, i) => (
                <div key={i} className={styles.codeExampleCard}>
                  {example.title && (
                    <h4 className={styles.codeExampleHeading}>
                      {example.title}
                    </h4>
                  )}
                  {example.explanation && (
                    <p className={styles.codeExplanation}>
                      {example.explanation}
                    </p>
                  )}
                  <div className={styles.codeBlockWrapper}>
                    <CodeBlock
                      code={example.code}
                      language={example.language}
                      showLineNumbers
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="💻"
              title="No code examples"
              description="Code examples for this topic haven't been added."
            />
          )}
        </div>
      ),
    },
    {
      id: "related",
      label: `Related Topics (${relatedTopics.length})`,
      content: (
        <div className={styles.tabContent}>
          {relatedTopics.length > 0 ? (
            <div className={styles.relatedGrid}>
              {relatedTopics.map((rt) => (
                <Link
                  key={rt.id}
                  to={`/topics/${rt.id}`}
                  className={styles.relatedLink}
                >
                  <div className={styles.relatedCard}>
                    <div className={styles.relatedTop}>
                      <h4 className={styles.relatedTitle}>{rt.title}</h4>
                      <Badge
                        variant={
                          difficultyVariant[rt.difficulty as Difficulty] ||
                          "tag"
                        }
                        size="small"
                      >
                        {rt.difficulty}
                      </Badge>
                    </div>
                    <p className={styles.relatedDesc}>{rt.description}</p>
                    <span className={styles.relatedTag}>{rt.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🔗"
              title="No related topics"
              description="No related topics have been linked."
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.stickyTopBar}>
        <nav className={styles.breadcrumbs}>
          <Link to="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <Link to="/topics" className={styles.breadcrumbLink}>
            Topics
          </Link>
          {cat && (
            <>
              <span className={styles.breadcrumbSep}>/</span>
              <Link to={cat.route} className={styles.breadcrumbLink}>
                {cat.title}
              </Link>
            </>
          )}
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>{topic.title}</span>
        </nav>

        <header className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>{topic.title}</h1>
            <Badge variant={difficultyVariant[topic.difficulty]}>
              {topic.difficulty}
            </Badge>
          </div>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              {cat?.icon} {cat?.title ?? topic.category}
            </span>
            {topic.tags.map((tag) => (
              <Badge key={tag} variant="tag" size="small">
                {tag}
              </Badge>
            ))}
          </div>
          <div className={styles.progressRow}>
            <ProgressBar
              value={progress}
              showPercentage
              size="sm"
              label="Progress"
            />
          </div>
        </header>
      </div>

      <div className={styles.scrollableContent}>
        <p className={styles.description}>{topic.description}</p>
        <Tabs tabs={tabs} defaultTab="overview" />
      </div>
    </div>
  );
}
