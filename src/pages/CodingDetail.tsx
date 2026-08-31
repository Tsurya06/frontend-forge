import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProgressContext } from '@/context/ProgressContext';
import { useBookmarkContext } from '@/context/BookmarkContext';
import { Badge } from '@/components/common/Badge';
import { Tabs } from '@/components/common/Tabs';
import { EmptyState } from '@/components/common/EmptyState';
import { CodeBlock } from '@/components/code/CodeBlock';
import { getCodingProblemById } from '@/data';
import type { Difficulty } from '@/types';
import styles from './CodingDetail.module.css';

const difficultyVariant: Record<Difficulty, 'beginner' | 'intermediate' | 'advanced' | 'senior'> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
  Senior: 'senior',
};

export default function CodingDetail() {
  const { problemId } = useParams<{ problemId: string }>();
  const { isComplete, markComplete } = useProgressContext();
  const { isBookmarked, toggleBookmark } = useBookmarkContext();

  const problem = useMemo(() => {
    if (!problemId) return undefined;
    return getCodingProblemById(problemId);
  }, [problemId]);

  if (!problem) {
    return (
      <div className={styles.page}>
        <EmptyState
          icon="📭"
          title="Problem not found"
          description="The coding problem you're looking for doesn't exist."
          actionLabel="Browse Problems"
          onAction={() => window.location.assign('/coding')}
        />
      </div>
    );
  }

  const completed = isComplete(problem.id, 'coding');
  const bookmarked = isBookmarked(problem.id);

  const isHtmlProblem =
    problem.category === 'CSS' ||
    problem.category === 'HTML & CSS' ||
    problem.implementation.startsWith('<!--') ||
    problem.implementation.includes('<div') ||
    problem.implementation.includes('<style');
  const implLanguage = isHtmlProblem ? 'html' : 'javascript';

  const tabs = [
    {
      id: 'solution',
      label: 'Solution',
      content: (
        <div className={styles.tabContent}>
          {problem.naiveApproach && (
            <div className={styles.section}>
              <h3 className={styles.subheading}>Naive Approach</h3>
              <p className={styles.sectionText}>{problem.naiveApproach}</p>
            </div>
          )}
          <div className={styles.section}>
            <h3 className={styles.subheading}>Optimal Approach</h3>
            <p className={styles.sectionText}>{problem.optimalApproach}</p>
          </div>
          <div className={styles.section}>
            <h3 className={styles.subheading}>Implementation</h3>
            <CodeBlock
              code={problem.implementation}
              language={implLanguage}
              showLineNumbers
            />
          </div>
          {problem.implementationTS && (
            <div className={styles.section}>
              <h3 className={styles.subheading}>TypeScript Implementation</h3>
              <CodeBlock
                code={problem.implementationTS}
                language="typescript"
                title="TypeScript Solution"
                showLineNumbers
              />
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'steps',
      label: 'Step-by-Step',
      content: (
        <div className={styles.tabContent}>
          <ol className={styles.stepsList}>
            {problem.stepByStep.map((step, i) => (
              <li key={i} className={styles.stepItem}>{step}</li>
            ))}
          </ol>
        </div>
      ),
    },
    {
      id: 'complexity',
      label: 'Complexity',
      content: (
        <div className={styles.tabContent}>
          <div className={styles.complexityGrid}>
            <div className={styles.complexityCard}>
              <h4 className={styles.complexityLabel}>Time Complexity</h4>
              <code className={styles.complexityValue}>{problem.timeComplexity}</code>
            </div>
            <div className={styles.complexityCard}>
              <h4 className={styles.complexityLabel}>Space Complexity</h4>
              <code className={styles.complexityValue}>{problem.spaceComplexity}</code>
            </div>
          </div>
          {problem.alternativeSolutions && problem.alternativeSolutions.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.subheading}>Alternative Solutions</h3>
              <ul className={styles.altList}>
                {problem.alternativeSolutions.map((alt, i) => (
                  <li key={i}>{alt}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'followups',
      label: 'Follow-ups',
      content: (
        <div className={styles.tabContent}>
          {problem.commonMistakes && problem.commonMistakes.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.subheading}>Common Mistakes</h3>
              <ul className={styles.infoList}>
                {problem.commonMistakes.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}
          {problem.followUps && problem.followUps.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.subheading}>Follow-up Questions</h3>
              <ul className={styles.infoList}>
                {problem.followUps.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}
          {(!problem.commonMistakes || problem.commonMistakes.length === 0) &&
           (!problem.followUps || problem.followUps.length === 0) && (
            <EmptyState icon="📝" title="No follow-ups" description="No follow-up content available." />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.stickyTopBar}>
        <nav className={styles.breadcrumbs}>
          <Link to="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <Link to="/coding" className={styles.breadcrumbLink}>Coding</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>{problem.title}</span>
        </nav>

        <header className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>{problem.title}</h1>
            <div className={styles.meta}>
              <Badge variant={difficultyVariant[problem.difficulty]}>{problem.difficulty}</Badge>
              {problem.tags.map(tag => (
                <Badge key={tag} variant="tag" size="small">{tag}</Badge>
              ))}
            </div>
          </div>
          <div className={styles.actions}>
            <Link
              to={`/playground?problem=${problem.id}`}
              className={styles.playgroundBtn}
            >
              🛠️ Practice in Playground
            </Link>
            <button
              type="button"
              className={`${styles.actionBtn} ${completed ? styles.completedBtn : ''}`}
              onClick={() => markComplete(problem.id, 'coding')}
              disabled={completed}
            >
              {completed ? '✓ Completed' : 'Mark Complete'}
            </button>
            <button
              type="button"
              className={`${styles.actionBtn} ${bookmarked ? styles.bookmarkedBtn : ''}`}
              onClick={() => toggleBookmark(problem.id)}
            >
              {bookmarked ? '🔖 Bookmarked' : '🔗 Bookmark'}
            </button>
          </div>
        </header>
      </div>

      <div className={styles.scrollableContent}>
        <section className={styles.problemStatement}>
        <h2 className={styles.sectionHeading}>Problem</h2>
        <p className={styles.problemText}>{problem.problem}</p>
      </section>

      {problem.requirements.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Requirements</h2>
          <ul className={styles.reqList}>
            {problem.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </section>
      )}

      {problem.examples.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Examples</h2>
          <div className={styles.examplesGrid}>
            {problem.examples.map((ex, i) => (
              <div key={i} className={styles.exampleCard}>
                <div className={styles.exampleRow}>
                  <span className={styles.exampleLabel}>Input:</span>
                  <code className={styles.exampleCode}>{ex.input}</code>
                </div>
                <div className={styles.exampleRow}>
                  <span className={styles.exampleLabel}>Output:</span>
                  <code className={styles.exampleCode}>{ex.output}</code>
                </div>
                {ex.explanation && (
                  <p className={styles.exampleExplanation}>{ex.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {problem.edgeCases.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Edge Cases</h2>
          <ul className={styles.edgeList}>
            {problem.edgeCases.map((ec, i) => (
              <li key={i}>{ec}</li>
            ))}
          </ul>
        </section>
      )}

      <Tabs tabs={tabs} defaultTab="solution" />
      </div>
    </div>
  );
}
