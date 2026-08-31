import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProgressContext } from '@/context/ProgressContext';
import { useBookmarkContext } from '@/context/BookmarkContext';
import { Badge } from '@/components/common/Badge';
import { Tabs } from '@/components/common/Tabs';
import { EmptyState } from '@/components/common/EmptyState';
import { CodeBlock } from '@/components/code/CodeBlock';
import { getMachineCodingProblemById } from '@/data';
import type { Difficulty } from '@/types';
import styles from './MachineCodingDetail.module.css';

const difficultyVariant: Record<Difficulty, 'beginner' | 'intermediate' | 'advanced' | 'senior'> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
  Senior: 'senior',
};

export default function MachineCodingDetail() {
  const { problemId } = useParams<{ problemId: string }>();
  const { isComplete, markComplete } = useProgressContext();
  const { isBookmarked, toggleBookmark } = useBookmarkContext();

  const problem = useMemo(() => {
    if (!problemId) return undefined;
    return getMachineCodingProblemById(problemId);
  }, [problemId]);

  if (!problem) {
    return (
      <div className={styles.page}>
        <EmptyState
          icon="📭"
          title="Problem not found"
          description="The machine coding problem you're looking for doesn't exist."
          actionLabel="Browse Problems"
          onAction={() => window.location.assign('/machine-coding')}
        />
      </div>
    );
  }

  const completed = isComplete(problem.id, 'machineCoding');
  const bookmarked = isBookmarked(problem.id);

  const tabs = [
    {
      id: 'architecture',
      label: 'Architecture',
      content: (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <h3 className={styles.subheading}>Architecture</h3>
            <p className={styles.sectionText}>{problem.architecture}</p>
          </div>
          <div className={styles.section}>
            <h3 className={styles.subheading}>Component Hierarchy</h3>
            <CodeBlock code={problem.componentHierarchy} language="text" title="Component Tree" />
          </div>
          <div className={styles.section}>
            <h3 className={styles.subheading}>State Design</h3>
            <CodeBlock code={problem.stateDesign} language="typescript" title="State" showLineNumbers />
          </div>
          {problem.propsApiDesign && (
            <div className={styles.section}>
              <h3 className={styles.subheading}>Props / API Design</h3>
              <CodeBlock code={problem.propsApiDesign} language="typescript" title="Props API" showLineNumbers />
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'implementation',
      label: 'Implementation',
      content: (
        <div className={styles.tabContent}>
          <CodeBlock
            code={problem.implementation}
            language="tsx"
            title="Implementation"
            showLineNumbers
          />
        </div>
      ),
    },
    {
      id: 'accessibility',
      label: 'Accessibility',
      content: (
        <div className={styles.tabContent}>
          <p className={styles.sectionText}>{problem.accessibility}</p>
        </div>
      ),
    },
    {
      id: 'testing',
      label: 'Testing',
      content: (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <h3 className={styles.subheading}>Testing Strategy</h3>
            <ul className={styles.infoList}>
              {problem.testingStrategy.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
          <div className={styles.section}>
            <h3 className={styles.subheading}>Performance</h3>
            <p className={styles.sectionText}>{problem.performance}</p>
          </div>
          {problem.edgeCases.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.subheading}>Edge Cases</h3>
              <ul className={styles.infoList}>
                {problem.edgeCases.map((ec, i) => (
                  <li key={i}>{ec}</li>
                ))}
              </ul>
            </div>
          )}
          {problem.improvements.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.subheading}>Improvements</h3>
              <ul className={styles.infoList}>
                {problem.improvements.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>
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
          <Link to="/machine-coding" className={styles.breadcrumbLink}>Machine Coding</Link>
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
            <button
              type="button"
              className={`${styles.actionBtn} ${completed ? styles.completedBtn : ''}`}
              onClick={() => markComplete(problem.id, 'machineCoding')}
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
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Problem Statement</h2>
          <p className={styles.sectionText}>{problem.problemStatement}</p>
        </section>

        <div className={styles.requirementsGrid}>
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Functional Requirements</h2>
            <ul className={styles.infoList}>
              {problem.functionalRequirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Non-Functional Requirements</h2>
            <ul className={styles.infoList}>
              {problem.nonFunctionalRequirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
        </div>

        <Tabs tabs={tabs} defaultTab="architecture" />

        {problem.followUpQuestions.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Follow-up Questions</h2>
            <ul className={styles.infoList}>
              {problem.followUpQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
