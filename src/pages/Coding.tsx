import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProgressContext } from '@/context/ProgressContext';
import { SearchInput } from '@/components/common/SearchInput';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { allCodingProblems } from '@/data';
import type { Difficulty } from '@/types';
import styles from './Coding.module.css';

const difficultyVariant: Record<Difficulty, 'beginner' | 'intermediate' | 'advanced' | 'senior'> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
  Senior: 'senior',
};

import { useVirtualGrid } from '@/hooks/useVirtualGrid';

type CompletionFilter = 'all' | 'complete' | 'incomplete';

export default function Coding() {
  const { completedCoding } = useProgressContext();
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>('all');

  const filtered = useMemo(() => {
    let problems = [...allCodingProblems];

    if (search) {
      const q = search.toLowerCase();
      problems = problems.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.problem.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (difficultyFilter !== 'all') {
      problems = problems.filter(p => p.difficulty === difficultyFilter);
    }

    if (completionFilter !== 'all') {
      problems = problems.filter(p => {
        const done = completedCoding.includes(p.id);
        return completionFilter === 'complete' ? done : !done;
      });
    }

    return problems;
  }, [search, difficultyFilter, completionFilter, completedCoding]);

  const {
    visibleItems: renderedProblems,
    hasMore,
    sentinelRef,
    totalCount,
    renderedCount,
  } = useVirtualGrid(filtered, { initialCount: 16, batchSize: 12 });

  const totalDone = completedCoding.length;
  const total = allCodingProblems.length;

  return (
    <div className={styles.page}>
      <div className={styles.stickyTopBar}>
        <header className={styles.header}>
          <h1 className={styles.title}>The Essential 28 & Polyfills</h1>
          <p className={styles.subtitle}>
            {totalDone}/{total} completed • 3-Tier progressive solutions
          </p>
        </header>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search coding problems and polyfills..."
        />

        <div className={styles.filters}>
          <select
            className={styles.select}
            value={difficultyFilter}
            onChange={e => setDifficultyFilter(e.target.value)}
            aria-label="Filter by difficulty"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Senior">Senior</option>
          </select>

          <select
            className={styles.select}
            value={completionFilter}
            onChange={e => setCompletionFilter(e.target.value as CompletionFilter)}
            aria-label="Filter by completion"
          >
            <option value="all">All Status</option>
            <option value="complete">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>
      </div>

      <div className={styles.scrollableContent}>
        {filtered.length === 0 ? (
          <EmptyState
            icon="💻"
            title="No coding problems found"
            description="Try adjusting your filters or search query"
            actionLabel="Clear filters"
            onAction={() => {
              setSearch('');
              setDifficultyFilter('all');
              setCompletionFilter('all');
            }}
          />
        ) : (
          <>
            <div className={styles.grid}>
              {renderedProblems.map(problem => {
                const done = completedCoding.includes(problem.id);
                return (
                  <Link key={problem.id} to={`/coding/${problem.id}`} className={styles.problemLink}>
                    <Card>
                      <div className={styles.problemCard}>
                        <div className={styles.problemHeader}>
                          <h3 className={styles.problemTitle}>{problem.title}</h3>
                          <Badge variant={difficultyVariant[problem.difficulty]} size="small">
                            {problem.difficulty}
                          </Badge>
                        </div>
                        <p className={styles.problemDesc}>{problem.problem}</p>
                        <div className={styles.problemFooter}>
                          <div className={styles.tags}>
                            {problem.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="tag" size="small">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          {done && (
                            <Badge variant="beginner" size="small">
                              ✓ Done
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {hasMore && (
              <div ref={sentinelRef} className={styles.loadingSentinel}>
                <span>Loading more challenges ({renderedCount} of {totalCount})...</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
