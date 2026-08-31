import { useMemo } from 'react';
import { useProgressContext } from '@/context/ProgressContext';
import { Card } from '@/components/common/Card';
import { ProgressBar } from '@/components/common/ProgressBar';
import {
  allQuestions,
  allCodingProblems,
  allMachineCodingProblems,
  categories,
  getTopicsByCategory,
  getTopicById,
} from '@/data';
import styles from './Progress.module.css';

export default function Progress() {
  const {
    completedQuestions,
    completedCoding,
    completedMachineCoding,
    recentlyViewed,
  } = useProgressContext();

  const totalQuestions = allQuestions.length;
  const questionsPercent = totalQuestions > 0
    ? Math.round((completedQuestions.length / totalQuestions) * 100)
    : 0;

  const codingPercent = allCodingProblems.length > 0
    ? Math.round((completedCoding.length / allCodingProblems.length) * 100)
    : 0;

  const mcPercent = allMachineCodingProblems.length > 0
    ? Math.round((completedMachineCoding.length / allMachineCodingProblems.length) * 100)
    : 0;

  const categoryStats = useMemo(() => {
    return categories.map(cat => {
      const topics = getTopicsByCategory(cat.id);
      const questions = topics.flatMap(t => t.questions);
      const done = questions.filter(q => completedQuestions.includes(q.id)).length;
      const pct = questions.length > 0 ? Math.round((done / questions.length) * 100) : 0;
      return { ...cat, done, total: questions.length, pct };
    });
  }, [completedQuestions]);

  const recentItems = useMemo(() => {
    return recentlyViewed.slice(0, 10).map(id => {
      const topic = getTopicById(id);
      return topic ? { id, title: topic.title } : null;
    }).filter((t): t is NonNullable<typeof t> => t !== null);
  }, [recentlyViewed]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Progress</h1>
        <p className={styles.subtitle}>Your interview preparation progress at a glance</p>
      </header>

      <section className={styles.overallStats}>
        <Card>
          <div className={styles.statRow}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{completedQuestions.length}</span>
              <span className={styles.statLabel}>Questions Done</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{completedCoding.length}</span>
              <span className={styles.statLabel}>Coding Done</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{completedMachineCoding.length}</span>
              <span className={styles.statLabel}>Machine Coding</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>
                {completedQuestions.length + completedCoding.length + completedMachineCoding.length}
              </span>
              <span className={styles.statLabel}>Total Items</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Overall Progress</h2>
        <div className={styles.progressCards}>
          <Card>
            <div className={styles.progressItem}>
              <span className={styles.progressLabel}>Concepts & QA</span>
              <ProgressBar
                value={questionsPercent}
                showPercentage
                size="md"
                color={questionsPercent >= 75 ? 'success' : 'primary'}
              />
              <span className={styles.progressCount}>
                {completedQuestions.length} / {totalQuestions}
              </span>
            </div>
          </Card>
          <Card>
            <div className={styles.progressItem}>
              <span className={styles.progressLabel}>Coding Problems</span>
              <ProgressBar
                value={codingPercent}
                showPercentage
                size="md"
                color={codingPercent >= 75 ? 'success' : 'primary'}
              />
              <span className={styles.progressCount}>
                {completedCoding.length} / {allCodingProblems.length}
              </span>
            </div>
          </Card>
          <Card>
            <div className={styles.progressItem}>
              <span className={styles.progressLabel}>Machine Coding</span>
              <ProgressBar
                value={mcPercent}
                showPercentage
                size="md"
                color={mcPercent >= 75 ? 'success' : 'primary'}
              />
              <span className={styles.progressCount}>
                {completedMachineCoding.length} / {allMachineCodingProblems.length}
              </span>
            </div>
          </Card>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Category Breakdown</h2>
        <div className={styles.categoryList}>
          {categoryStats.map(cat => (
            <div key={cat.id} className={styles.categoryRow}>
              <div className={styles.categoryInfo}>
                <span className={styles.categoryIcon}>{cat.icon}</span>
                <span className={styles.categoryName}>{cat.title}</span>
                <span className={styles.categoryCount}>{cat.done}/{cat.total}</span>
              </div>
              <div className={styles.categoryBar}>
                <ProgressBar
                  value={cat.pct}
                  showPercentage
                  size="sm"
                  color={cat.pct >= 75 ? 'success' : cat.pct >= 40 ? 'warning' : 'primary'}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {recentItems.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recently Viewed</h2>
          <div className={styles.recentList}>
            {recentItems.map(item => (
              <div key={item.id} className={styles.recentItem}>
                <span className={styles.recentTitle}>{item.title}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
