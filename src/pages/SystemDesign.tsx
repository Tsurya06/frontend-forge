import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SearchInput } from '@/components/common/SearchInput';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { allSystemDesignProblems } from '@/data';
import type { Difficulty } from '@/types';
import styles from './SystemDesign.module.css';

const difficultyVariant: Record<Difficulty, 'beginner' | 'intermediate' | 'advanced' | 'senior'> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
  Senior: 'senior',
};

export default function SystemDesign() {
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const filtered = useMemo(() => {
    let problems = [...allSystemDesignProblems];

    if (search) {
      const q = search.toLowerCase();
      problems = problems.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.requirements.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (difficultyFilter !== 'all') {
      problems = problems.filter(p => p.difficulty === difficultyFilter);
    }

    return problems;
  }, [search, difficultyFilter]);

  return (
    <div className={styles.page}>
      <div className={styles.stickyTopBar}>
        <header className={styles.header}>
          <h1 className={styles.title}>Frontend System Design</h1>
          <p className={styles.subtitle}>Architecture & design patterns for large-scale frontend apps</p>
        </header>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search system design problems..."
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
        </div>
      </div>

      <div className={styles.scrollableContent}>
        {filtered.length === 0 ? (
          <EmptyState
            icon="📐"
            title="No system design problems found"
            description="Try adjusting your search or filters"
            actionLabel="Clear"
            onAction={() => {
              setSearch('');
              setDifficultyFilter('all');
            }}
          />
        ) : (
          <div className={styles.grid}>
            {filtered.map(problem => (
              <Link key={problem.id} to={`/system-design/${problem.id}`} className={styles.problemLink}>
                <Card>
                  <div className={styles.problemCard}>
                    <h3 className={styles.problemTitle}>{problem.title}</h3>
                    <div className={styles.problemMeta}>
                      <Badge variant={difficultyVariant[problem.difficulty]} size="small">
                        {problem.difficulty}
                      </Badge>
                      {problem.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="tag" size="small">{tag}</Badge>
                      ))}
                    </div>
                    <p className={styles.problemDesc}>
                      {problem.requirements.slice(0, 150)}
                      {problem.requirements.length > 150 ? '...' : ''}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
