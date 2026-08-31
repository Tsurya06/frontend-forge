import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProgressContext } from '@/context/ProgressContext';
import { SearchInput } from '@/components/common/SearchInput';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { EmptyState } from '@/components/common/EmptyState';
import { getTopicsByCategory, categories } from '@/data';
import type { Difficulty } from '@/types';
import styles from './CategoryPage.module.css';

const difficultyVariant: Record<Difficulty, 'beginner' | 'intermediate' | 'advanced' | 'senior'> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
  Senior: 'senior',
};

interface CategoryPageProps {
  category: string;
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const { completedQuestions } = useProgressContext();
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const cat = categories.find(c => c.id === category);
  const topics = useMemo(() => getTopicsByCategory(category), [category]);

  const filtered = useMemo(() => {
    let result = [...topics];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    if (difficultyFilter !== 'all') {
      result = result.filter(t => t.difficulty === difficultyFilter);
    }

    return result.sort((a, b) => a.title.localeCompare(b.title));
  }, [topics, search, difficultyFilter]);

  const totalQuestions = topics.reduce((sum, t) => sum + t.questions.length, 0);
  const completedCount = topics
    .flatMap(t => t.questions)
    .filter(q => completedQuestions.includes(q.id)).length;
  const overallPercent = totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0;

  return (
    <div className={styles.page}>
      <div className={styles.stickyTopBar}>
        <nav className={styles.breadcrumbs}>
          <Link to="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>{cat?.title ?? category}</span>
        </nav>

        <header className={styles.header}>
          <div className={styles.headerTop}>
            <span className={styles.headerIcon}>{cat?.icon}</span>
            <div>
              <h1 className={styles.title}>{cat?.title ?? category}</h1>
              <p className={styles.description}>{cat?.description}</p>
            </div>
          </div>
          <div className={styles.headerStats}>
            <span className={styles.statText}>{topics.length} topics, {totalQuestions} questions</span>
            <div className={styles.headerProgress}>
              <ProgressBar value={overallPercent} showPercentage size="sm" />
            </div>
          </div>
        </header>

        <div className={styles.controls}>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={`Search ${cat?.title ?? category} topics...`}
            className={styles.search}
          />
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
          icon="🔍"
          title="No topics found"
          description="Try adjusting your search or filters"
          actionLabel="Clear"
          onAction={() => {
            setSearch('');
            setDifficultyFilter('all');
          }}
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map(topic => {
            const done = topic.questions.filter(q => completedQuestions.includes(q.id)).length;
            const pct = topic.questions.length > 0
              ? Math.round((done / topic.questions.length) * 100)
              : 0;

            return (
              <Link key={topic.id} to={`/topics/${topic.id}`} className={styles.topicLink}>
                <Card>
                  <div className={styles.topicCard}>
                    <div className={styles.topicHeader}>
                      <h3 className={styles.topicTitle}>{topic.title}</h3>
                      <Badge variant={difficultyVariant[topic.difficulty]} size="small">
                        {topic.difficulty}
                      </Badge>
                    </div>
                    <p className={styles.topicDesc}>{topic.description}</p>
                    <div className={styles.topicFooter}>
                      <span className={styles.questionCount}>
                        {topic.questions.length} questions
                      </span>
                      <ProgressBar value={pct} size="sm" showPercentage />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
