import type { Topic, Question, CodingProblem, MachineCodingProblem, SystemDesignProblem, Category } from '../types';

import { javascriptTopics } from './javascript';
import { htmlTopics } from './html';
import { cssTopics } from './css';
import { browserTopics } from './browser';
import { reactTopics } from './react';
import { reduxTopics } from './redux';
import { typescriptTopics } from './typescript';
import { performanceTopics } from './performance';
import { testingTopics } from './testing';
import { securityTopics } from './security';
import { designPatternsTopics } from './design-patterns';
import { gitTopics } from './git';
import { buildToolsTopics } from './build-tools';
import { packageManagementTopics } from './package-management';
import { codeQualityTopics } from './code-quality';
import { accessibilityTopics } from './accessibility';
import { seniorTopics } from './senior';
import { codingProblems } from './coding';
import { machineCodingProblems } from './machine-coding';
import { systemDesignProblems } from './system-design';

export const allTopics: Topic[] = [
  ...javascriptTopics,
  ...htmlTopics,
  ...cssTopics,
  ...browserTopics,
  ...reactTopics,
  ...reduxTopics,
  ...typescriptTopics,
  ...performanceTopics,
  ...testingTopics,
  ...securityTopics,
  ...designPatternsTopics,
  ...gitTopics,
  ...buildToolsTopics,
  ...packageManagementTopics,
  ...codeQualityTopics,
  ...accessibilityTopics,
  ...seniorTopics,
];

export const allQuestions: Question[] = allTopics.flatMap(t => t.questions);
export const allCodingProblems: CodingProblem[] = codingProblems;
export const allMachineCodingProblems: MachineCodingProblem[] = machineCodingProblems;
export const allSystemDesignProblems: SystemDesignProblem[] = systemDesignProblems;

export function getTopicsByCategory(category: string): Topic[] {
  // Normalize kebab-case id ('design-patterns') to match Title Case ('Design Patterns')
  const normalize = (s: string) => s.toLowerCase().replace(/-/g, ' ');
  const norm = normalize(category);
  return allTopics.filter(t =>
    t.category === category ||
    normalize(t.category) === norm
  );
}

export function getTopicById(id: string): Topic | undefined {
  if (!id) return undefined;
  // 1. Exact match
  const exact = allTopics.find(t => t.id === id);
  if (exact) return exact;

  // 2. Case-insensitive and normalized match
  const cleanId = id.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normalized = allTopics.find(t => {
    const cleanT = t.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanTitle = t.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanT === cleanId || cleanTitle === cleanId || cleanT.includes(cleanId) || cleanId.includes(cleanT);
  });
  if (normalized) return normalized;

  // 3. Match by partial keywords
  const words = id.toLowerCase().split(/[-_ ]+/).filter(w => w.length > 2);
  if (words.length > 0) {
    const wordMatch = allTopics.find(t => {
      const target = (t.id + ' ' + t.title + ' ' + t.tags.join(' ')).toLowerCase();
      return words.some(w => target.includes(w));
    });
    if (wordMatch) return wordMatch;
  }

  return undefined;
}

export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find(q => q.id === id);
}

export function getCodingProblemById(id: string): CodingProblem | undefined {
  if (!id) return undefined;
  const exact = allCodingProblems.find(p => p.id === id);
  if (exact) return exact;
  const cleanId = id.toLowerCase().replace(/[^a-z0-9]/g, '');
  return allCodingProblems.find(p => {
    const cleanP = p.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanP === cleanId || cleanP.includes(cleanId) || cleanId.includes(cleanP);
  });
}

export function getMachineCodingProblemById(id: string): MachineCodingProblem | undefined {
  if (!id) return undefined;
  const exact = allMachineCodingProblems.find(p => p.id === id);
  if (exact) return exact;
  const cleanId = id.toLowerCase().replace(/[^a-z0-9]/g, '');
  return allMachineCodingProblems.find(p => {
    const cleanP = p.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanTitle = p.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanP === cleanId || cleanTitle === cleanId || cleanP.includes(cleanId) || cleanId.includes(cleanP);
  });
}

export function getSystemDesignProblemById(id: string): SystemDesignProblem | undefined {
  if (!id) return undefined;
  const exact = allSystemDesignProblems.find(p => p.id === id);
  if (exact) return exact;
  const cleanId = id.toLowerCase().replace(/[^a-z0-9]/g, '');
  return allSystemDesignProblems.find(p => {
    const cleanP = p.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanTitle = p.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanP === cleanId || cleanTitle === cleanId || cleanP.includes(cleanId) || cleanId.includes(cleanP);
  });
}

export const categories: Category[] = [
  { id: 'javascript', title: 'JavaScript', description: 'Core and advanced JavaScript concepts', icon: '\u26A1', color: '#f7df1e', route: '/javascript', topicCount: 0, questionCount: 0 },
  { id: 'html', title: 'HTML', description: 'HTML5, semantic elements, forms, accessibility', icon: '\uD83C\uDF10', color: '#e34c26', route: '/html', topicCount: 0, questionCount: 0 },
  { id: 'css', title: 'CSS', description: 'Styling, layout, animations, preprocessors', icon: '\uD83C\uDFA8', color: '#264de4', route: '/css', topicCount: 0, questionCount: 0 },
  { id: 'browser', title: 'Browser & Web', description: 'Browser internals, HTTP, performance, DevTools', icon: '\uD83D\uDD0D', color: '#4285f4', route: '/browser', topicCount: 0, questionCount: 0 },
  { id: 'react', title: 'React', description: 'Components, hooks, state, rendering, SSR', icon: '\u269B\uFE0F', color: '#61dafb', route: '/react', topicCount: 0, questionCount: 0 },
  { id: 'redux', title: 'Redux', description: 'State management, middleware, Redux Toolkit', icon: '\uD83D\uDD04', color: '#764abc', route: '/redux', topicCount: 0, questionCount: 0 },
  { id: 'typescript', title: 'TypeScript', description: 'Types, generics, utility types, React + TS', icon: '\uD83D\uDCD8', color: '#3178c6', route: '/typescript', topicCount: 0, questionCount: 0 },
  { id: 'performance', title: 'Performance', description: 'Optimization, caching, lazy loading, Web Vitals', icon: '\uD83D\uDE80', color: '#ff6b35', route: '/performance', topicCount: 0, questionCount: 0 },
  { id: 'testing', title: 'Testing', description: 'Unit, integration, E2E testing', icon: '\uD83E\uDDEA', color: '#15803d', route: '/testing', topicCount: 0, questionCount: 0 },
  { id: 'security', title: 'Security', description: 'XSS, CSRF, CSP, secure coding', icon: '\uD83D\uDD12', color: '#dc2626', route: '/security', topicCount: 0, questionCount: 0 },
  { id: 'design-patterns', title: 'Design Patterns', description: 'Singleton, Factory, Observer, HOC', icon: '\uD83C\uDFD7\uFE0F', color: '#8b5cf6', route: '/design-patterns', topicCount: 0, questionCount: 0 },
  { id: 'git', title: 'Git', description: 'Version control, branching, merging', icon: '\uD83D\uDCE6', color: '#f05032', route: '/git', topicCount: 0, questionCount: 0 },
  { id: 'build-tools', title: 'Build Tools', description: 'Webpack, Babel, ESLint', icon: '\uD83D\uDD27', color: '#8dd6f9', route: '/build-tools', topicCount: 0, questionCount: 0 },
  { id: 'package-management', title: 'Package Management', description: 'npm, Yarn, semver', icon: '\uD83D\uDCE6', color: '#cb3837', route: '/package-management', topicCount: 0, questionCount: 0 },
  { id: 'code-quality', title: 'Code Quality', description: 'SOLID, DRY, KISS, clean code', icon: '\u2728', color: '#22c55e', route: '/code-quality', topicCount: 0, questionCount: 0 },
  { id: 'accessibility', title: 'Accessibility', description: 'ARIA, keyboard nav, WCAG', icon: '\u267F', color: '#0ea5e9', route: '/accessibility', topicCount: 0, questionCount: 0 },
  { id: 'senior', title: 'Senior Interview', description: 'Architecture, scalability, system design thinking', icon: '\uD83C\uDF1F', color: '#f59e0b', route: '/senior', topicCount: 0, questionCount: 0 },
];

categories.forEach(cat => {
  const topics = getTopicsByCategory(cat.id);
  cat.topicCount = topics.length;
  cat.questionCount = topics.reduce((sum, t) => sum + t.questions.length, 0);
});


