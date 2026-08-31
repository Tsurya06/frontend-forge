import { useSearchParams, Link } from 'react-router-dom';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { useSearch } from '@/hooks/useSearch';
import type { SearchResultItem } from '@/hooks/useSearch';
import {
  allTopics,
  allQuestions,
  allCodingProblems,
  allMachineCodingProblems,
} from '@/data';
import type { Difficulty } from '@/types';
import styles from './Search.module.css';

const difficultyVariant: Record<Difficulty, 'beginner' | 'intermediate' | 'advanced' | 'senior'> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
  Senior: 'senior',
};

function getResultLink(item: SearchResultItem): string {
  switch (item.type) {
    case 'topic':
      return `/topics/${item.id}`;
    case 'question':
      return `/topics/${item.id.split('-q')[0]}`;
    case 'coding':
      return `/coding/${item.id}`;
    case 'machineCoding':
      return `/machine-coding/${item.id}`;
  }
}

function getTypeLabel(type: SearchResultItem['type']): string {
  switch (type) {
    case 'topic': return 'Topics';
    case 'question': return 'Concepts & QA';
    case 'coding': return 'Coding Problems';
    case 'machineCoding': return 'Machine Coding';
  }
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className={styles.highlight}>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = useSearch(query, {
    topics: allTopics,
    questions: allQuestions,
    codingProblems: allCodingProblems,
    machineCodingProblems: allMachineCodingProblems,
  });

  const sections: { type: 'topic' | 'question' | 'coding' | 'machineCoding'; items: SearchResultItem[] }[] = [
    { type: 'topic', items: results.topics },
    { type: 'question', items: results.questions },
    { type: 'coding', items: results.codingProblems },
    { type: 'machineCoding', items: results.machineCodingProblems },
  ].filter((s): s is { type: 'topic' | 'question' | 'coding' | 'machineCoding'; items: SearchResultItem[] } => s.items.length > 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {query ? `Search results for "${query}"` : 'Global Search'}
        </h1>
        <p className={styles.subtitle}>
          Search across 85 topics, 500+ interview questions, coding challenges, and machine coding problems.
        </p>
      </header>

      {!query && (
        <EmptyState
          icon="🔍"
          title="Start searching"
          description="Use the search bar at the top or press '/' anywhere to search topics, questions, and algorithms."
        />
      )}

      {query && results.total === 0 && (
        <EmptyState
          icon="😕"
          title="No results found"
          description={`No matches found for "${query}". Try searching for JavaScript, React, Promises, or Machine Coding.`}
          actionLabel="Clear Search"
          onAction={() => setSearchParams({})}
        />
      )}

      {results.total > 0 && (
        <div className={styles.results}>
          <p className={styles.resultCount}>
            {results.total} result{results.total !== 1 ? 's' : ''} found
          </p>
          {sections.map(section => (
            <section key={section.type} className={styles.resultSection}>
              <h2 className={styles.sectionTitle}>{getTypeLabel(section.type)} ({section.items.length})</h2>
              <div className={styles.resultList}>
                {section.items.map(item => (
                  <Link key={item.id} to={getResultLink(item)} className={styles.resultItem}>
                    <div className={styles.resultHeader}>
                      <span className={styles.resultTitle}>
                        {highlightMatch(item.title, query)}
                      </span>
                      <Badge variant={difficultyVariant[item.difficulty as Difficulty] || 'tag'} size="small">
                        {item.difficulty}
                      </Badge>
                    </div>
                    <p className={styles.resultDesc}>
                      {highlightMatch(
                        item.description.length > 150
                          ? item.description.slice(0, 150) + '...'
                          : item.description,
                        query
                      )}
                    </p>
                    <span className={styles.resultCategory}>{item.category}</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
