import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBookmarkContext } from '@/context/BookmarkContext';
import { Badge } from '@/components/common/Badge';
import { Accordion } from '@/components/common/Accordion';
import { EmptyState } from '@/components/common/EmptyState';
import { getSystemDesignProblemById } from '@/data';
import type { Difficulty } from '@/types';
import styles from './SystemDesignDetail.module.css';

const difficultyVariant: Record<Difficulty, 'beginner' | 'intermediate' | 'advanced' | 'senior'> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
  Senior: 'senior',
};

export default function SystemDesignDetail() {
  const { problemId } = useParams<{ problemId: string }>();
  const { isBookmarked, toggleBookmark } = useBookmarkContext();

  const problem = useMemo(() => {
    if (!problemId) return undefined;
    return getSystemDesignProblemById(problemId);
  }, [problemId]);

  if (!problem) {
    return (
      <div className={styles.page}>
        <EmptyState
          icon="📭"
          title="Problem not found"
          description="The system design problem you're looking for doesn't exist."
          actionLabel="Browse Problems"
          onAction={() => window.location.assign('/system-design')}
        />
      </div>
    );
  }

  const bookmarked = isBookmarked(problem.id);

  const accordionItems = [
    { id: 'requirements', title: 'Requirements', content: <p className={styles.sectionText}>{problem.requirements}</p> },
    { id: 'constraints', title: 'Constraints', content: <p className={styles.sectionText}>{problem.constraints}</p> },
    { id: 'high-level', title: 'High-Level Architecture', content: <p className={styles.sectionText}>{problem.highLevelArchitecture}</p> },
    { id: 'component', title: 'Component Architecture', content: <p className={styles.sectionText}>{problem.componentArchitecture}</p> },
    { id: 'state', title: 'State Management', content: <p className={styles.sectionText}>{problem.stateManagement}</p> },
    { id: 'api', title: 'API Design', content: <p className={styles.sectionText}>{problem.apiDesign}</p> },
    { id: 'caching', title: 'Caching Strategy', content: <p className={styles.sectionText}>{problem.caching}</p> },
    { id: 'performance', title: 'Performance', content: <p className={styles.sectionText}>{problem.performance}</p> },
    { id: 'security', title: 'Security', content: <p className={styles.sectionText}>{problem.security}</p> },
    { id: 'accessibility', title: 'Accessibility', content: <p className={styles.sectionText}>{problem.accessibility}</p> },
    { id: 'error', title: 'Error Handling', content: <p className={styles.sectionText}>{problem.errorHandling}</p> },
    { id: 'offline', title: 'Offline Strategy', content: <p className={styles.sectionText}>{problem.offlineStrategy}</p> },
    { id: 'scalability', title: 'Scalability', content: <p className={styles.sectionText}>{problem.scalability}</p> },
    { id: 'tradeoffs', title: 'Tradeoffs', content: <p className={styles.sectionText}>{problem.tradeoffs}</p> },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.stickyTopBar}>
        <nav className={styles.breadcrumbs}>
          <Link to="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <Link to="/system-design" className={styles.breadcrumbLink}>System Design</Link>
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
              className={`${styles.actionBtn} ${bookmarked ? styles.bookmarkedBtn : ''}`}
              onClick={() => toggleBookmark(problem.id)}
            >
              {bookmarked ? '🔖 Bookmarked' : '🔗 Bookmark'}
            </button>
          </div>
        </header>
      </div>

      <div className={styles.scrollableContent}>
        <Accordion items={accordionItems} multiple />
      </div>
    </div>
  );
}
