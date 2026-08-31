import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProgressContext } from '@/context/ProgressContext';
import { SearchInput } from '@/components/common/SearchInput';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { EmptyState } from '@/components/common/EmptyState';
import { allTopics, categories } from '@/data';
import type { Difficulty } from '@/types';
import styles from './Topics.module.css';

type SortOption = 'alphabetical' | 'difficulty' | 'progress';
type CompletionFilter = 'all' | 'complete' | 'incomplete';
type ViewMode = 'grid' | 'list';

const difficultyOrder: Record<Difficulty, number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
  Senior: 3,
};

const difficultyVariant: Record<Difficulty, 'beginner' | 'intermediate' | 'advanced' | 'senior'> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
  Senior: 'senior',
};

export default function Topics() {
  const { completedQuestions } = useProgressContext();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filtered = useMemo(() => {
    let topics = [...allTopics];

    if (search) {
      const q = search.toLowerCase();
      topics = topics.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    if (categoryFilter !== 'all') {
      topics = topics.filter(t => t.category === categoryFilter);
    }

    if (difficultyFilter !== 'all') {
      topics = topics.filter(t => t.difficulty === difficultyFilter);
    }

    if (completionFilter !== 'all') {
      topics = topics.filter(t => {
        const done = t.questions.filter(q => completedQuestions.includes(q.id)).length;
        const isComplete = done === t.questions.length && t.questions.length > 0;
        return completionFilter === 'complete' ? isComplete : !isComplete;
      });
    }

    topics.sort((a, b) => {
      switch (sortBy) {
        case 'difficulty':
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'progress': {
          const pctA = a.questions.length > 0
            ? a.questions.filter(q => completedQuestions.includes(q.id)).length / a.questions.length
            : 0;
          const pctB = b.questions.length > 0
            ? b.questions.filter(q => completedQuestions.includes(q.id)).length / b.questions.length
            : 0;
          return pctB - pctA;
        }
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return topics;
  }, [search, categoryFilter, difficultyFilter, completionFilter, sortBy, completedQuestions]);

  return (
    <div className={styles.page}>
      <div className={styles.stickyTopBar}>
        <header className={styles.header}>
          <h1 className={styles.title}>Topics</h1>
          <p className={styles.subtitle}>Explore all interview topics</p>
        </header>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search topics..."
          className={styles.search}
        />

        <div className={styles.filters}>
          <select
            className={styles.select}
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>

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
            <option value="all">All</option>
            <option value="complete">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>

          <select
            className={styles.select}
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            aria-label="Sort by"
          >
            <option value="alphabetical">A-Z</option>
            <option value="difficulty">Difficulty</option>
            <option value="progress">Progress</option>
          </select>

          <div className={styles.viewToggle}>
            <button
              type="button"
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.activeView : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              {"▦"}
            </button>
            <button
              type="button"
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.activeView : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              {"☰"}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.scrollableContent}>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No topics found"
          description="Try adjusting your filters or search query"
          actionLabel="Clear filters"
          onAction={() => {
            setSearch('');
            setCategoryFilter('all');
            setDifficultyFilter('all');
            setCompletionFilter('all');
          }}
        />
      ) : (
        <div className={viewMode === 'grid' ? styles.grid : styles.list}>
          {filtered.map(topic => {
            const done = topic.questions.filter(q => completedQuestions.includes(q.id)).length;
            const pct = topic.questions.length > 0
              ? Math.round((done / topic.questions.length) * 100)
              : 0;
            const cat = categories.find(c => c.id === topic.category);

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
                    <p className={styles.topicCategory}>
                      {cat?.icon} {cat?.title ?? topic.category}
                      {topic.subcategory ? ` / ${topic.subcategory}` : ''}
                    </p>
                    <p className={styles.topicDescription}>{topic.description}</p>
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
