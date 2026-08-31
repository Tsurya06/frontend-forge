/**
 * Frontend Interview Preparation Master Content Manifest
 * Provides an authoritative inventory of curriculum topics, questions,
 * coding problems, machine coding challenges, and system design problems.
 */

export interface ManifestCategory {
  id: string;
  name: string;
  topicCount: number;
  questionCount: number;
  status: 'Complete' | 'In Progress';
}

export interface ContentManifest {
  version: string;
  lastUpdated: string;
  totalTopics: number;
  totalQuestions: number;
  totalCodingProblems: number;
  totalMachineCodingProblems: number;
  totalSystemDesignProblems: number;
  coveragePercentage: number;
  categories: ManifestCategory[];
}

export const contentManifest: ContentManifest = {
  version: '1.0.0',
  lastUpdated: '2026-09-01',
  totalTopics: 66,
  totalQuestions: 442,
  totalCodingProblems: 34,
  totalMachineCodingProblems: 35,
  totalSystemDesignProblems: 9,
  coveragePercentage: 100,
  categories: [
    {
      id: 'javascript',
      name: 'Core & Advanced JavaScript',
      topicCount: 12,
      questionCount: 118,
      status: 'Complete',
    },
    {
      id: 'html',
      name: 'HTML5 & Web Standards',
      topicCount: 12,
      questionCount: 63,
      status: 'Complete',
    },
    {
      id: 'css',
      name: 'CSS & Modern Layouts',
      topicCount: 6,
      questionCount: 15,
      status: 'Complete',
    },
    {
      id: 'browser',
      name: 'Browser Internals & Web Vitals',
      topicCount: 15,
      questionCount: 78,
      status: 'Complete',
    },
    {
      id: 'react',
      name: 'React 19 & Next-Gen Patterns',
      topicCount: 9,
      questionCount: 40,
      status: 'Complete',
    },
    {
      id: 'redux',
      name: 'Redux & State Management',
      topicCount: 1,
      questionCount: 15,
      status: 'Complete',
    },
    {
      id: 'typescript',
      name: 'TypeScript & Type Systems',
      topicCount: 4,
      questionCount: 36,
      status: 'Complete',
    },
    {
      id: 'performance',
      name: 'Web Performance Optimization',
      topicCount: 2,
      questionCount: 12,
      status: 'Complete',
    },
    {
      id: 'testing',
      name: 'Frontend Testing (Unit, RTL, E2E)',
      topicCount: 4,
      questionCount: 12,
      status: 'Complete',
    },
    {
      id: 'security',
      name: 'Web Application Security',
      topicCount: 2,
      questionCount: 10,
      status: 'Complete',
    },
    {
      id: 'accessibility',
      name: 'Accessibility & WCAG',
      topicCount: 1,
      questionCount: 8,
      status: 'Complete',
    },
    {
      id: 'git',
      name: 'Git Version Control',
      topicCount: 1,
      questionCount: 6,
      status: 'Complete',
    },
    {
      id: 'build-tools',
      name: 'Build Tools (Webpack, Babel, ESLint)',
      topicCount: 3,
      questionCount: 9,
      status: 'Complete',
    },
    {
      id: 'package-management',
      name: 'Package Management (npm, Yarn)',
      topicCount: 1,
      questionCount: 6,
      status: 'Complete',
    },
    {
      id: 'code-quality',
      name: 'Code Quality, Clean Code & SOLID',
      topicCount: 1,
      questionCount: 8,
      status: 'Complete',
    },
    {
      id: 'design-patterns',
      name: 'Frontend Design Patterns',
      topicCount: 1,
      questionCount: 9,
      status: 'Complete',
    },
    {
      id: 'senior',
      name: 'Senior Frontend Architecture',
      topicCount: 6,
      questionCount: 49,
      status: 'Complete',
    },
  ],
};
