import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgressContext } from '@/context/ProgressContext';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { EmptyState } from '@/components/common/EmptyState';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { allQuestions, allCodingProblems, allMachineCodingProblems } from '@/data';
import type { Question, CodingProblem, MachineCodingProblem, Difficulty } from '@/types';
import styles from './Daily.module.css';

const difficultyVariant: Record<Difficulty, 'beginner' | 'intermediate' | 'advanced' | 'senior'> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
  Senior: 'senior',
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pickFromArray<T>(arr: T[], random: () => number, count: number): T[] {
  if (arr.length === 0) return [];
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = shuffled[i] as T;
    shuffled[i] = shuffled[j] as T;
    shuffled[j] = temp;
  }
  return shuffled.slice(0, count);
}

function dateSeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

interface DailyItem {
  type: 'question' | 'coding' | 'machineCoding';
  question?: Question;
  coding?: CodingProblem;
  machineCoding?: MachineCodingProblem;
  id: string;
}

export default function Daily() {
  const { completedQuestions, completedCoding, completedMachineCoding } = useProgressContext();
  const [expandedCoding, setExpandedCoding] = useState<Set<string>>(new Set());

  const dailyItems = useMemo((): DailyItem[] => {
    const random = seededRandom(dateSeed());

    const jsCat = allQuestions.filter(q => q.category === 'JavaScript');
    const reactCat = allQuestions.filter(q => q.category === 'React');
    const cssCat = allQuestions.filter(q => q.category === 'CSS');
    const browserCat = allQuestions.filter(q => q.category === 'Browser');
    const tsCat = allQuestions.filter(q => q.category === 'TypeScript');

    const items: DailyItem[] = [];

    const jsQ = pickFromArray(jsCat, random, 1)[0];
    if (jsQ) items.push({ type: 'question', question: jsQ, id: jsQ.id });

    const reactQ = pickFromArray(reactCat, random, 1)[0];
    if (reactQ) items.push({ type: 'question', question: reactQ, id: reactQ.id });

    const cssQ = pickFromArray(cssCat, random, 1)[0];
    if (cssQ) items.push({ type: 'question', question: cssQ, id: cssQ.id });

    const browserQ = pickFromArray(browserCat, random, 1)[0];
    if (browserQ) items.push({ type: 'question', question: browserQ, id: browserQ.id });

    const tsQ = pickFromArray(tsCat, random, 1)[0];
    if (tsQ) items.push({ type: 'question', question: tsQ, id: tsQ.id });

    const codingQ = pickFromArray(allCodingProblems, random, 1)[0];
    if (codingQ) items.push({ type: 'coding', coding: codingQ, id: codingQ.id });

    const mcQ = pickFromArray(allMachineCodingProblems, random, 1)[0];
    if (mcQ) items.push({ type: 'machineCoding', machineCoding: mcQ, id: mcQ.id });

    return items;
  }, []);

  const completedCount = dailyItems.filter(item => {
    if (item.type === 'question') return completedQuestions.includes(item.id);
    if (item.type === 'coding') return completedCoding.includes(item.id);
    if (item.type === 'machineCoding') return completedMachineCoding.includes(item.id);
    return false;
  }).length;

  const progressPct = dailyItems.length > 0
    ? Math.round((completedCount / dailyItems.length) * 100)
    : 0;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const toggleCodingExpand = (id: string) => {
    setExpandedCoding(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (dailyItems.length === 0) {
    return (
      <div className={styles.page}>
        <EmptyState
          icon="📅"
          title="No daily practice available"
          description="Add more questions to generate daily practice."
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Daily Practice</h1>
        <p className={styles.subtitle}>{today}</p>
      </header>

      <Card>
        <div className={styles.progressSection}>
          <span className={styles.progressText}>
            {completedCount} of {dailyItems.length} completed today
          </span>
          <ProgressBar
            value={progressPct}
            showPercentage
            size="md"
            color={progressPct === 100 ? 'success' : 'primary'}
          />
        </div>
      </Card>

      <div className={styles.itemList}>
        {dailyItems.map((item, i) => {
          if (item.type === 'question' && item.question) {
            const q = item.question;
            return (
              <div key={item.id} className={styles.dailyItem}>
                <span className={styles.itemNumber}>{i + 1}</span>
                <QuestionCard
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
              </div>
            );
          }

          if (item.type === 'coding' && item.coding) {
            const p = item.coding;
            const done = completedCoding.includes(p.id);
            return (
              <div key={item.id} className={styles.dailyItem}>
                <span className={styles.itemNumber}>{i + 1}</span>
                <Card>
                  <div className={styles.codingCard}>
                    <div className={styles.codingHeader}>
                      <h3 className={styles.codingTitle}>
                        {"💻"} {p.title}
                        {done && <span className={styles.doneCheck}>{" ✓"}</span>}
                      </h3>
                      <Badge variant={difficultyVariant[p.difficulty]} size="small">
                        {p.difficulty}
                      </Badge>
                    </div>
                    <p className={styles.codingDesc}>
                      {expandedCoding.has(p.id)
                        ? p.problem
                        : p.problem.slice(0, 150) + (p.problem.length > 150 ? '...' : '')}
                    </p>
                    <div className={styles.codingActions}>
                      <button
                        type="button"
                        className={styles.toggleBtn}
                        onClick={() => toggleCodingExpand(p.id)}
                      >
                        {expandedCoding.has(p.id) ? 'Show Less' : 'Show More'}
                      </button>
                      <Link to={`/coding/${p.id}`} className={styles.viewLink}>
                        View Problem
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            );
          }

          if (item.type === 'machineCoding' && item.machineCoding) {
            const p = item.machineCoding;
            const done = completedMachineCoding.includes(p.id);
            return (
              <div key={item.id} className={styles.dailyItem}>
                <span className={styles.itemNumber}>{i + 1}</span>
                <Card>
                  <div className={styles.codingCard}>
                    <div className={styles.codingHeader}>
                      <h3 className={styles.codingTitle}>
                        {"🏗️"} {p.title}
                        {done && <span className={styles.doneCheck}>{" ✓"}</span>}
                      </h3>
                      <Badge variant={difficultyVariant[p.difficulty]} size="small">
                        {p.difficulty}
                      </Badge>
                    </div>
                    <p className={styles.codingDesc}>
                      {p.problemStatement.slice(0, 150)}
                      {p.problemStatement.length > 150 ? '...' : ''}
                    </p>
                    <Link to={`/machine-coding/${p.id}`} className={styles.viewLink}>
                      View Problem
                    </Link>
                  </div>
                </Card>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
